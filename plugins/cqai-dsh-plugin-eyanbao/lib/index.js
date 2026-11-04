import { API, isScholarProject, parseAssistRequest, parseRunRequest, projectSummary, safeFileStem } from "./protocol.js";
import { AlignmentType, Document, Footer, HeadingLevel, Packer, PageBreak, PageNumber, Paragraph, TextRun } from "docx";
import { createUserMessage } from "@deepseek-ai/dsh-llm";
import { mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { resolveDshHome } from "@deepseek-ai/dsh-home-paths";
//#region src/top-journals.ts
const TOP_JOURNAL_GROUPS = {
	general: [
		"Nature",
		"Science",
		"Cell",
		"Proceedings of the National Academy of Sciences",
		"Nature Communications",
		"Science Advances",
		"Nature Human Behaviour",
		"Nature Sustainability",
		"Nature Climate Change",
		"National Science Review"
	],
	medicine: [
		"The Lancet",
		"New England Journal of Medicine",
		"JAMA",
		"BMJ",
		"Annals of Internal Medicine",
		"PLOS Medicine",
		"The Lancet Public Health",
		"The Lancet Digital Health",
		"Nature Medicine",
		"Health Affairs"
	],
	business: [
		"Academy of Management Journal",
		"Academy of Management Review",
		"Administrative Science Quarterly",
		"Organization Science",
		"Strategic Management Journal",
		"Journal of Management",
		"Journal of International Business Studies",
		"MIS Quarterly",
		"Information Systems Research",
		"Management Science",
		"Journal of Marketing",
		"Journal of Consumer Research",
		"Marketing Science",
		"Journal of Operations Management"
	],
	economicsSocial: [
		"American Economic Review",
		"Econometrica",
		"Journal of Political Economy",
		"Quarterly Journal of Economics",
		"Review of Economic Studies",
		"Journal of Finance",
		"Journal of Financial Economics",
		"Review of Financial Studies",
		"American Sociological Review",
		"American Journal of Sociology",
		"American Political Science Review",
		"Psychological Science",
		"Journal of Personality and Social Psychology"
	],
	education: [
		"Review of Educational Research",
		"Educational Researcher",
		"American Educational Research Journal",
		"Journal of Educational Psychology",
		"Educational Psychologist",
		"Computers & Education",
		"The Internet and Higher Education",
		"British Journal of Educational Technology",
		"Studies in Higher Education",
		"Higher Education",
		"Research Policy",
		"The Journal of Higher Education"
	],
	computingEngineering: [
		"IEEE Transactions on Pattern Analysis and Machine Intelligence",
		"IEEE Transactions on Neural Networks and Learning Systems",
		"Journal of Machine Learning Research",
		"Artificial Intelligence",
		"ACM Computing Surveys",
		"IEEE Transactions on Knowledge and Data Engineering",
		"IEEE Transactions on Software Engineering",
		"Nature Machine Intelligence",
		"IEEE Transactions on Power Delivery",
		"IEEE Transactions on Power Systems",
		"IEEE Transactions on Smart Grid",
		"Automatica",
		"Applied Energy",
		"Journal of Power Sources"
	]
};
function normalizeJournalName(value) {
	return value.toLocaleLowerCase().replace(/&/gu, " and ").replace(/^the\s+/u, "").replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/gu, " ").trim();
}
const TOP_JOURNAL_SET = new Set(Object.values(TOP_JOURNAL_GROUPS).flat().map(normalizeJournalName));
function isTopForeignJournal(venue) {
	return venue !== void 0 && TOP_JOURNAL_SET.has(normalizeJournalName(venue));
}
//#endregion
//#region src/database-connectors.ts
const LABELS = {
	openalex: "OpenAlex",
	crossref: "Crossref",
	pubmed: "PubMed",
	"semantic-scholar": "Semantic Scholar",
	"web-of-science": "Web of Science",
	scopus: "Scopus",
	"google-scholar": "Google Scholar",
	cnki: "CNKI 中国知网",
	wanfang: "万方数据"
};
function configured(env, key) {
	return typeof env[key] === "string" && env[key].trim() !== "";
}
function databaseStatuses(env = process.env) {
	return [
		{
			id: "openalex",
			label: LABELS.openalex,
			available: true,
			requiresConfiguration: false
		},
		{
			id: "crossref",
			label: LABELS.crossref,
			available: true,
			requiresConfiguration: false
		},
		{
			id: "pubmed",
			label: LABELS.pubmed,
			available: true,
			requiresConfiguration: false
		},
		{
			id: "semantic-scholar",
			label: LABELS["semantic-scholar"],
			available: true,
			requiresConfiguration: false
		},
		{
			id: "web-of-science",
			label: LABELS["web-of-science"],
			available: configured(env, "WOS_API_KEY"),
			requiresConfiguration: true,
			...configured(env, "WOS_API_KEY") ? {} : { reason: "需要 Clarivate WOS_API_KEY" }
		},
		{
			id: "scopus",
			label: LABELS.scopus,
			available: configured(env, "SCOPUS_API_KEY"),
			requiresConfiguration: true,
			...configured(env, "SCOPUS_API_KEY") ? {} : { reason: "需要 Elsevier SCOPUS_API_KEY" }
		},
		{
			id: "google-scholar",
			label: LABELS["google-scholar"],
			available: configured(env, "SERPAPI_API_KEY"),
			requiresConfiguration: true,
			...configured(env, "SERPAPI_API_KEY") ? {} : { reason: "需要 SerpAPI Google Scholar 密钥" }
		},
		{
			id: "cnki",
			label: LABELS.cnki,
			available: configured(env, "EYANBAO_CNKI_API_URL"),
			requiresConfiguration: true,
			...configured(env, "EYANBAO_CNKI_API_URL") ? {} : { reason: "需要 CNKI 企业 API 网关地址" }
		},
		{
			id: "wanfang",
			label: LABELS.wanfang,
			available: configured(env, "EYANBAO_WANFANG_API_URL"),
			requiresConfiguration: true,
			...configured(env, "EYANBAO_WANFANG_API_URL") ? {} : { reason: "需要万方数据 API 网关地址" }
		}
	];
}
function databaseLabel(id) {
	return LABELS[id];
}
function normalizeDoi$1(value) {
	if (typeof value !== "string") return void 0;
	const doi = value.replace(/^https?:\/\/doi\.org\//iu, "").trim();
	return doi === "" ? void 0 : doi;
}
function record(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function text(value) {
	return typeof value === "string" && value.trim() !== "" ? value.trim() : void 0;
}
function numberValue(value) {
	if (value === void 0 || value === null || value === "") return void 0;
	const number = Number(value);
	return Number.isFinite(number) ? number : void 0;
}
async function fetchJson$1(url, fetcher, signal, init = {}) {
	const response = await fetcher(url, {
		...init,
		signal,
		headers: {
			accept: "application/json",
			"user-agent": "eYanBao/0.6 (DeepSeek Harness academic workspace)",
			...init.headers
		}
	});
	if (!response.ok) throw new Error(`数据库返回 HTTP ${response.status}`);
	return await response.json();
}
async function searchPubMed(query, options) {
	const env = options.env ?? process.env;
	const fetcher = options.fetcher ?? fetch;
	const signal = options.signal ?? new AbortController().signal;
	const apiKey = env.NCBI_API_KEY?.trim();
	const common = apiKey === void 0 || apiKey === "" ? {} : { api_key: apiKey };
	const search = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi");
	search.searchParams.set("db", "pubmed");
	search.searchParams.set("term", query);
	search.searchParams.set("retmax", String(Math.min(30, Math.max(options.limit * 2, 10))));
	search.searchParams.set("retmode", "json");
	search.searchParams.set("sort", "relevance");
	for (const [key, value] of Object.entries(common)) search.searchParams.set(key, value);
	const result = record(record(await fetchJson$1(search.toString(), fetcher, signal))?.esearchresult);
	const ids = Array.isArray(result?.idlist) ? result.idlist.filter((id) => typeof id === "string") : [];
	if (ids.length === 0) return [];
	const summary = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi");
	summary.searchParams.set("db", "pubmed");
	summary.searchParams.set("id", ids.join(","));
	summary.searchParams.set("retmode", "json");
	for (const [key, value] of Object.entries(common)) summary.searchParams.set(key, value);
	const summaryResult = record(record(await fetchJson$1(summary.toString(), fetcher, signal))?.result);
	return (Array.isArray(summaryResult?.uids) ? summaryResult.uids.filter((id) => typeof id === "string") : ids).map((id) => ({
		id,
		item: record(summaryResult?.[id])
	})).filter((entry) => entry.item !== void 0).map(({ id, item }) => {
		const doi = normalizeDoi$1((Array.isArray(item.articleids) ? item.articleids : []).map(record).find((entry) => entry?.idtype === "doi")?.value);
		const authors = (Array.isArray(item.authors) ? item.authors : []).map(record).map((author) => text(author?.name)).filter((name) => name !== void 0);
		const yearMatch = text(item.pubdate)?.match(/\b(19|20)\d{2}\b/u);
		return {
			id: `pubmed-${id}`,
			title: text(item.title) ?? `PubMed ${id}`,
			authors,
			language: "en",
			...yearMatch == null ? {} : { year: Number(yearMatch[0]) },
			...text(item.source) === void 0 ? {} : { venue: text(item.source) },
			...doi === void 0 ? {} : {
				doi,
				url: `https://doi.org/${doi}`
			},
			source: "pubmed"
		};
	}).slice(0, options.limit);
}
async function searchWebOfScience(query, options) {
	const apiKey = (options.env ?? process.env).WOS_API_KEY?.trim();
	if (apiKey === void 0 || apiKey === "") throw new Error("Web of Science 未配置 WOS_API_KEY");
	const url = new URL("https://api.clarivate.com/apis/wos-starter/v1/documents");
	url.searchParams.set("q", `TS=(${query.replace(/[()]/gu, " ")})`);
	url.searchParams.set("db", "WOS");
	url.searchParams.set("limit", String(Math.min(50, Math.max(options.limit, 10))));
	url.searchParams.set("page", "1");
	const payload = record(await fetchJson$1(url.toString(), options.fetcher ?? fetch, options.signal ?? new AbortController().signal, { headers: { "X-ApiKey": apiKey } }));
	return (Array.isArray(payload?.hits) ? payload.hits : []).map(record).filter((item) => item !== void 0).map((item, index) => {
		const names = record(item.names);
		const info = record(item.publicationInfo);
		const identifiers = record(item.identifiers);
		const links = record(item.links);
		const authors = (Array.isArray(names?.authors) ? names.authors : []).map(record).map((author) => text(author?.displayName) ?? text(author?.wosStandard)).filter((name) => name !== void 0);
		const doi = normalizeDoi$1(identifiers?.doi);
		return {
			id: text(item.uid) ?? `wos-${index}`,
			title: text(item.title) ?? `Web of Science ${index + 1}`,
			authors,
			...numberValue(info?.year) === void 0 ? {} : { year: numberValue(info?.year) },
			...text(info?.sourceTitle) === void 0 ? {} : { venue: text(info?.sourceTitle) },
			...doi === void 0 ? {} : {
				doi,
				url: `https://doi.org/${doi}`
			},
			...text(links?.record) === void 0 ? {} : { url: text(links?.record) },
			topJournal: isTopForeignJournal(text(info?.sourceTitle)),
			source: "web-of-science"
		};
	}).slice(0, options.limit);
}
async function searchScopus(query, options) {
	const env = options.env ?? process.env;
	const apiKey = env.SCOPUS_API_KEY?.trim();
	if (apiKey === void 0 || apiKey === "") throw new Error("Scopus 未配置 SCOPUS_API_KEY");
	const url = new URL("https://api.elsevier.com/content/search/scopus");
	url.searchParams.set("query", `TITLE-ABS-KEY(${query.replace(/[()]/gu, " ")})`);
	url.searchParams.set("count", String(Math.min(25, Math.max(options.limit, 10))));
	url.searchParams.set("sort", "-relevance");
	const headers = { "X-ELS-APIKey": apiKey };
	const instToken = env.SCOPUS_INST_TOKEN?.trim();
	if (instToken !== void 0 && instToken !== "") headers["X-ELS-Insttoken"] = instToken;
	const results = record(record(await fetchJson$1(url.toString(), options.fetcher ?? fetch, options.signal ?? new AbortController().signal, { headers }))?.["search-results"]);
	return (Array.isArray(results?.entry) ? results.entry : []).map(record).filter((item) => item !== void 0).map((item, index) => {
		const doi = normalizeDoi$1(item["prism:doi"]);
		const yearMatch = text(item["prism:coverDate"])?.match(/\b(19|20)\d{2}\b/u);
		return {
			id: text(item.eid) ?? text(item["dc:identifier"]) ?? `scopus-${index}`,
			title: text(item["dc:title"]) ?? `Scopus ${index + 1}`,
			authors: text(item["dc:creator"]) === void 0 ? [] : text(item["dc:creator"]).split(/[;,]/u).map((name) => name.trim()).filter(Boolean),
			...yearMatch == null ? {} : { year: Number(yearMatch[0]) },
			...text(item["prism:publicationName"]) === void 0 ? {} : { venue: text(item["prism:publicationName"]) },
			...doi === void 0 ? {} : {
				doi,
				url: `https://doi.org/${doi}`
			},
			...numberValue(item["citedby-count"]) === void 0 ? {} : { citedBy: numberValue(item["citedby-count"]) },
			topJournal: isTopForeignJournal(text(item["prism:publicationName"])),
			source: "scopus"
		};
	}).slice(0, options.limit);
}
async function searchGoogleScholar(query, options) {
	const apiKey = (options.env ?? process.env).SERPAPI_API_KEY?.trim();
	if (apiKey === void 0 || apiKey === "") throw new Error("Google Scholar 未配置 SERPAPI_API_KEY");
	const url = new URL("https://serpapi.com/search.json");
	url.searchParams.set("engine", "google_scholar");
	url.searchParams.set("q", query);
	url.searchParams.set("num", String(Math.min(20, Math.max(options.limit, 10))));
	url.searchParams.set("api_key", apiKey);
	const payload = record(await fetchJson$1(url.toString(), options.fetcher ?? fetch, options.signal ?? new AbortController().signal));
	return (Array.isArray(payload?.organic_results) ? payload.organic_results : []).map(record).filter((item) => item !== void 0).map((item, index) => {
		const summary = text(record(item.publication_info)?.summary) ?? "";
		const yearMatch = summary.match(/\b(19|20)\d{2}\b/u);
		const authors = summary.includes(" - ") ? summary.split(" - ")[0].split(",").map((name) => name.trim()).filter(Boolean) : [];
		const cited = record(record(item.inline_links)?.cited_by);
		return {
			id: text(item.result_id) ?? text(item.link) ?? `google-scholar-${index}`,
			title: text(item.title) ?? `Google Scholar ${index + 1}`,
			authors,
			...yearMatch == null ? {} : { year: Number(yearMatch[0]) },
			...summary === "" ? {} : { venue: summary },
			...text(item.link) === void 0 ? {} : { url: text(item.link) },
			...text(item.snippet) === void 0 ? {} : { abstract: text(item.snippet) },
			...numberValue(cited?.total) === void 0 ? {} : { citedBy: numberValue(cited?.total) },
			source: "google-scholar"
		};
	}).slice(0, options.limit);
}
async function searchSemanticScholar(query, options) {
	const env = options.env ?? process.env;
	const url = new URL("https://api.semanticscholar.org/graph/v1/paper/search");
	url.searchParams.set("query", query);
	url.searchParams.set("limit", String(Math.min(20, Math.max(options.limit, 10))));
	url.searchParams.set("fields", "paperId,title,authors,year,venue,externalIds,abstract,citationCount,url,journal");
	const apiKey = env.S2_API_KEY?.trim();
	const headers = {};
	if (apiKey !== void 0 && apiKey !== "") headers["x-api-key"] = apiKey;
	const payload = record(await fetchJson$1(url.toString(), options.fetcher ?? fetch, options.signal ?? new AbortController().signal, Object.keys(headers).length === 0 ? {} : { headers }));
	return (Array.isArray(payload?.data) ? payload.data : []).map(record).filter((item) => item !== void 0).map((item, index) => {
		const externalIds = record(item.externalIds);
		const journal = record(item.journal);
		const doi = normalizeDoi$1(externalIds?.DOI);
		const authors = (Array.isArray(item.authors) ? item.authors : []).map(record).map((author) => text(author?.name)).filter((name) => name !== void 0);
		const venue = text(journal?.name) ?? text(item.venue);
		const urlValue = text(item.url);
		return {
			id: text(item.paperId) ?? doi ?? `semantic-scholar-${index}`,
			title: text(item.title) ?? `Semantic Scholar ${index + 1}`,
			authors,
			...numberValue(item.year) === void 0 ? {} : { year: numberValue(item.year) },
			...venue === void 0 ? {} : { venue },
			...doi === void 0 ? {} : {
				doi,
				url: `https://doi.org/${doi}`
			},
			...doi !== void 0 || urlValue === void 0 ? {} : { url: urlValue },
			...text(item.abstract) === void 0 ? {} : { abstract: text(item.abstract) },
			...numberValue(item.citationCount) === void 0 ? {} : { citedBy: numberValue(item.citationCount) },
			topJournal: isTopForeignJournal(venue),
			source: "semantic-scholar"
		};
	}).slice(0, options.limit);
}
function gatewayEndpoint(envValue) {
	return /\/search(?:\?|$)/u.test(envValue) ? envValue : `${envValue.replace(/\/$/u, "")}/search`;
}
async function searchSubscriptionGateway(database, query, options) {
	const env = options.env ?? process.env;
	const prefix = database === "cnki" ? "EYANBAO_CNKI" : "EYANBAO_WANFANG";
	const endpoint = env[`${prefix}_API_URL`]?.trim();
	if (endpoint === void 0 || endpoint === "") throw new Error(`${database === "cnki" ? "CNKI" : "万方"} API 网关未配置`);
	const apiKey = env[`${prefix}_API_KEY`]?.trim();
	const headers = { "content-type": "application/json" };
	if (apiKey !== void 0 && apiKey !== "") headers.authorization = `Bearer ${apiKey}`;
	const payload = await fetchJson$1(gatewayEndpoint(endpoint), options.fetcher ?? fetch, options.signal ?? new AbortController().signal, {
		method: "POST",
		headers,
		body: JSON.stringify({
			query,
			limit: options.limit,
			database
		})
	});
	const root = record(payload);
	return (Array.isArray(payload) ? payload : Array.isArray(root?.items) ? root.items : []).map(record).filter((item) => item !== void 0).map((item, index) => {
		const doi = normalizeDoi$1(item.doi);
		const authors = Array.isArray(item.authors) ? item.authors.map((author) => typeof author === "string" ? author : text(record(author)?.name)).filter((name) => name !== void 0) : [];
		return {
			id: text(item.id) ?? `${database}-${index}`,
			title: text(item.title) ?? `${database.toLocaleUpperCase()} ${index + 1}`,
			authors,
			language: text(item.language) ?? "zh",
			...numberValue(item.year) === void 0 ? {} : { year: numberValue(item.year) },
			...text(item.venue) === void 0 ? {} : { venue: text(item.venue) },
			...doi === void 0 ? {} : {
				doi,
				url: `https://doi.org/${doi}`
			},
			...text(item.url) === void 0 ? {} : { url: text(item.url) },
			...text(item.abstract) === void 0 ? {} : { abstract: text(item.abstract) },
			...numberValue(item.citedBy) === void 0 ? {} : { citedBy: numberValue(item.citedBy) },
			source: database
		};
	}).slice(0, options.limit);
}
async function searchExternalDatabase(database, query, options) {
	switch (database) {
		case "pubmed": return await searchPubMed(query, options);
		case "web-of-science": return await searchWebOfScience(query, options);
		case "scopus": return await searchScopus(query, options);
		case "google-scholar": return await searchGoogleScholar(query, options);
		case "semantic-scholar": return await searchSemanticScholar(query, options);
		case "cnki": return await searchSubscriptionGateway("cnki", query, options);
		case "wanfang": return await searchSubscriptionGateway("wanfang", query, options);
	}
}
//#endregion
//#region src/literature.ts
function normalizeDoi(value) {
	if (value === void 0) return void 0;
	const doi = value.replace(/^https?:\/\/doi\.org\//iu, "").trim();
	return doi === "" ? void 0 : doi;
}
function reconstructAbstract(index) {
	if (index === void 0) return void 0;
	const words = [];
	for (const [word, positions] of Object.entries(index)) for (const position of positions) words.push([position, word]);
	words.sort((left, right) => left[0] - right[0]);
	const text = words.map(([, word]) => word).join(" ").replace(/\s+/gu, " ").trim();
	return text === "" ? void 0 : text;
}
function cleanAbstract(value) {
	if (value === void 0) return void 0;
	const text = value.replace(/<[^>]+>/gu, " ").replace(/&amp;/gu, "&").replace(/&lt;/gu, "<").replace(/&gt;/gu, ">").replace(/\s+/gu, " ").trim();
	return text === "" ? void 0 : text;
}
function uniqueSources(sources, limit, quality = "any") {
	const seen = /* @__PURE__ */ new Set();
	const unique = [];
	for (const source of sources) {
		const key = (source.doi ?? source.title).toLocaleLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		unique.push(source);
	}
	if (quality !== "any") unique.sort((left, right) => Number(right.topJournal === true) - Number(left.topJournal === true) || (right.citedBy ?? 0) - (left.citedBy ?? 0));
	return unique.slice(0, limit);
}
function normalizedLanguage(value) {
	const language = value?.trim().toLocaleLowerCase();
	return language === void 0 || language === "" ? void 0 : language;
}
function hasHanText(value) {
	return /\p{Script=Han}/u.test(value);
}
function isChineseSource(source) {
	const language = normalizedLanguage(source.language);
	if (language !== void 0 && language !== "und") return language.startsWith("zh");
	return hasHanText(source.title);
}
function matchesScope(source, scope) {
	if (scope === "mixed") return true;
	return scope === "zh" ? isChineseSource(source) : !isChineseSource(source);
}
function matchesJournalQuality(source, quality) {
	return quality !== "top-only" || source.topJournal === true;
}
async function fetchJson(url, fetcher, signal) {
	const response = await fetcher(url, {
		headers: {
			accept: "application/json",
			"user-agent": "eYanBao/0.6 (DeepSeek Harness academic workspace)"
		},
		signal
	});
	if (!response.ok) throw new Error(`文献服务返回 HTTP ${response.status}`);
	return await response.json();
}
async function searchOpenAlex(query, options) {
	const fetcher = options.fetcher ?? fetch;
	const env = options.env ?? process.env;
	const url = new URL("https://api.openalex.org/works");
	url.searchParams.set("search", query);
	url.searchParams.set("per-page", String(Math.min(30, Math.max(options.limit * 2, 10))));
	url.searchParams.set("sort", "relevance_score:desc");
	url.searchParams.set("select", "id,doi,title,display_name,publication_year,language,cited_by_count,abstract_inverted_index,authorships,primary_location");
	const apiKey = env.OPENALEX_API_KEY?.trim();
	if (apiKey !== void 0 && apiKey !== "") url.searchParams.set("api_key", apiKey);
	const politeEmail = env.OPENALEX_POLITE_EMAIL?.trim();
	if (politeEmail !== void 0 && politeEmail !== "") url.searchParams.set("mailto", politeEmail);
	const filters = ["is_retracted:false"];
	if (options.yearFrom !== void 0) filters.push(`from_publication_date:${options.yearFrom}-01-01`);
	url.searchParams.set("filter", filters.join(","));
	return ((await fetchJson(url.toString(), fetcher, options.signal ?? new AbortController().signal)).results ?? []).filter((work) => typeof work.title === "string" || typeof work.display_name === "string").map((work, index) => {
		const doi = normalizeDoi(work.doi);
		const title = (work.title ?? work.display_name ?? "").replace(/\s+/gu, " ").trim();
		const authors = (work.authorships ?? []).map((authorship) => authorship.author?.display_name?.trim() ?? "").filter(Boolean);
		return {
			id: work.id ?? doi ?? `openalex-${index}`,
			title,
			authors,
			...normalizedLanguage(work.language) === void 0 ? {} : { language: normalizedLanguage(work.language) },
			...work.publication_year === void 0 ? {} : { year: work.publication_year },
			...work.primary_location?.source?.display_name === void 0 ? {} : { venue: work.primary_location.source.display_name },
			...doi === void 0 ? {} : { doi },
			...work.primary_location?.landing_page_url === void 0 ? doi === void 0 ? {} : { url: `https://doi.org/${doi}` } : { url: work.primary_location.landing_page_url },
			...reconstructAbstract(work.abstract_inverted_index) === void 0 ? {} : { abstract: reconstructAbstract(work.abstract_inverted_index) },
			topJournal: isTopForeignJournal(work.primary_location?.source?.display_name),
			...work.cited_by_count === void 0 ? {} : { citedBy: work.cited_by_count },
			source: "openalex"
		};
	}).filter((source) => matchesScope(source, options.scope)).filter((source) => matchesJournalQuality(source, options.journalQuality));
}
async function searchCrossref(query, options) {
	const fetcher = options.fetcher ?? fetch;
	const url = new URL("https://api.crossref.org/works");
	url.searchParams.set("query.bibliographic", query);
	url.searchParams.set("rows", String(Math.min(30, Math.max(options.limit * 2, 10))));
	if (options.yearFrom !== void 0) url.searchParams.set("filter", `from-pub-date:${options.yearFrom}-01-01,type:journal-article`);
	return ((await fetchJson(url.toString(), fetcher, options.signal ?? new AbortController().signal)).message?.items ?? []).filter((item) => Array.isArray(item.title) && item.title[0] !== void 0).map((item, index) => {
		const doi = normalizeDoi(item.DOI);
		const authors = (item.author ?? []).map((author) => {
			if (author.name !== void 0) return author.name;
			return [author.given, author.family].filter(Boolean).join(" ");
		}).filter(Boolean);
		const year = item.issued?.["date-parts"]?.[0]?.[0];
		return {
			id: doi ?? `crossref-${index}`,
			title: item.title?.[0]?.replace(/\s+/gu, " ").trim() ?? "",
			authors,
			...normalizedLanguage(item.language) === void 0 ? {} : { language: normalizedLanguage(item.language) },
			...year === void 0 ? {} : { year },
			...item["container-title"]?.[0] === void 0 ? {} : { venue: item["container-title"][0] },
			...doi === void 0 ? {} : { doi },
			...item.URL === void 0 ? {} : { url: item.URL },
			...cleanAbstract(item.abstract) === void 0 ? {} : { abstract: cleanAbstract(item.abstract) },
			topJournal: isTopForeignJournal(item["container-title"]?.[0]),
			...item["is-referenced-by-count"] === void 0 ? {} : { citedBy: item["is-referenced-by-count"] },
			source: "crossref"
		};
	}).filter((source) => matchesScope(source, options.scope)).filter((source) => matchesJournalQuality(source, options.journalQuality));
}
async function searchLiterature(query, options) {
	const queries = [...new Set((Array.isArray(query) ? query : [query]).map((item) => item.trim()).filter(Boolean))];
	if (queries.length === 0) throw new Error("文献检索主题不能为空");
	const statuses = databaseStatuses(options.env ?? process.env);
	const requested = options.databases ?? [
		"openalex",
		"crossref",
		"semantic-scholar"
	];
	const available = requested.filter((id) => statuses.find((status) => status.id === id)?.available === true);
	const unavailable = requested.filter((id) => !available.includes(id));
	if (available.length === 0) throw new Error("所选文献数据库均未配置或不可用");
	const collected = [];
	const failed = [];
	await Promise.all(available.map(async (database) => {
		for (const normalized of queries) try {
			const sources = database === "openalex" ? await searchOpenAlex(normalized, options) : database === "crossref" ? await searchCrossref(normalized, options) : await searchExternalDatabase(database, normalized, {
				limit: options.limit,
				scope: options.scope,
				journalQuality: options.journalQuality,
				signal: options.signal,
				fetcher: options.fetcher,
				env: options.env
			});
			collected.push(...sources.filter((source) => matchesScope(source, options.scope)).filter((source) => matchesJournalQuality(source, options.journalQuality)));
		} catch {
			failed.push(database);
		}
	}));
	const sources = uniqueSources(collected, options.limit, options.journalQuality);
	if (sources.length > 0) {
		const successfulLabels = [...new Set(available.filter((database) => !failed.includes(database)))].map((database) => statuses.find((status) => status.id === database)?.label ?? database);
		const warnings = [
			...successfulLabels.length === 0 ? [] : [`已使用 ${successfulLabels.join("、")} 结果`],
			...failed.length === 0 ? [] : [`${[...new Set(failed)].map((database) => statuses.find((status) => status.id === database)?.label ?? database).join("、")} 检索失败`],
			...unavailable.length === 0 ? [] : [`${unavailable.map((database) => statuses.find((status) => status.id === database)?.label ?? database).join("、")} 尚未配置`]
		];
		return {
			sources,
			...warnings.length === 0 ? {} : { warning: `${warnings.join("；")}，结果可能不完整。` }
		};
	}
	if (failed.length > 0) throw new Error(`${[...new Set(failed)].map((database) => statuses.find((status) => status.id === database)?.label ?? database).join("、")} 检索失败，请检查网络或数据库凭据`);
	return {
		sources: [],
		warning: options.scope === "foreign" ? options.journalQuality === "top-only" ? "没有检索到匹配的顶级外文期刊，请改用更宽泛的英文关键词或切换为“顶刊优先”。" : "没有检索到外文文献，请改用更明确的英文关键词或扩大年份范围。" : options.scope === "zh" ? "没有检索到中文文献，请尝试更具体的中文研究主题。" : "两个文献服务都没有返回匹配结果，请尝试更具体的研究主题。"
	};
}
function formatAuthorsForCitation(authors, language) {
	if (authors.length === 0) return language === "zh" ? "佚名" : "Anon.";
	if (authors.length > 3) return `${authors.slice(0, 3).join(language === "zh" ? "、" : ", ")}${language === "zh" ? "等" : " et al."}`;
	return authors.join(language === "zh" ? "、" : ", ");
}
//#endregion
//#region src/docx.ts
const MM = 56.6929;
const METRICS = {
	journal: {
		marginTop: 25 * MM,
		marginBottom: 25 * MM,
		marginLeft: 24 * MM,
		marginRight: 24 * MM,
		titleSize: 36,
		headingSizes: [
			28,
			24,
			22
		],
		bodySize: 21,
		line: 300,
		firstLine: 420,
		titlePage: false
	},
	undergraduate: {
		marginTop: 25 * MM,
		marginBottom: 25 * MM,
		marginLeft: 30 * MM,
		marginRight: 25 * MM,
		titleSize: 42,
		headingSizes: [
			32,
			28,
			24
		],
		bodySize: 24,
		line: 360,
		firstLine: 480,
		titlePage: true
	},
	master: {
		marginTop: 30 * MM,
		marginBottom: 25 * MM,
		marginLeft: 32 * MM,
		marginRight: 26 * MM,
		titleSize: 48,
		headingSizes: [
			34,
			28,
			24
		],
		bodySize: 24,
		line: 360,
		firstLine: 480,
		titlePage: true
	},
	doctoral: {
		marginTop: 35 * MM,
		marginBottom: 28 * MM,
		marginLeft: 34 * MM,
		marginRight: 28 * MM,
		titleSize: 52,
		headingSizes: [
			36,
			30,
			26
		],
		bodySize: 24,
		line: 384,
		firstLine: 480,
		titlePage: true
	}
};
function run(text, size, options = {}) {
	return new TextRun({
		text,
		size,
		...options,
		font: {
			ascii: "Times New Roman",
			hAnsi: "Times New Roman",
			eastAsia: "宋体",
			cs: "Times New Roman"
		}
	});
}
function cleanInlineMarkdown(text) {
	return text.replace(/!\[([^\]]*)\]\([^)]*\)/gu, "$1").replace(/\[([^\]]+)\]\([^)]*\)/gu, "$1").replace(/[*_~`]/gu, "").replace(/<[^>]+>/gu, "").trim();
}
function stripFirstTitle(markdown, title) {
	const normalized = markdown.replace(/\r\n/gu, "\n").trim();
	const firstBreak = normalized.indexOf("\n");
	const first = firstBreak < 0 ? normalized : normalized.slice(0, firstBreak);
	if (/^#\s+/u.test(first) && cleanInlineMarkdown(first.slice(2)).toLocaleLowerCase() === title.toLocaleLowerCase()) return firstBreak < 0 ? "" : normalized.slice(firstBreak + 1).trim();
	return normalized;
}
function markdownParagraphs(markdown, metrics) {
	const lines = markdown.replace(/\r\n/gu, "\n").split("\n");
	const paragraphs = [];
	let paragraphBuffer = [];
	let inCode = false;
	const flush = () => {
		const text = cleanInlineMarkdown(paragraphBuffer.join(" "));
		paragraphBuffer = [];
		if (text === "") return;
		paragraphs.push(new Paragraph({
			alignment: AlignmentType.JUSTIFIED,
			spacing: {
				line: metrics.line,
				after: 0
			},
			indent: { firstLine: metrics.firstLine },
			children: [run(text, metrics.bodySize)]
		}));
	};
	for (const rawLine of lines) {
		const line = rawLine.trimEnd();
		if (line.trim() === "```") {
			flush();
			inCode = !inCode;
			continue;
		}
		if (inCode) {
			if (line.trim() !== "") paragraphs.push(new Paragraph({
				spacing: {
					line: 280,
					after: 0
				},
				indent: { left: 360 },
				children: [new TextRun({
					text: line,
					size: 18,
					font: {
						ascii: "Consolas",
						hAnsi: "Consolas",
						eastAsia: "等线",
						cs: "Consolas"
					}
				})]
			}));
			continue;
		}
		const heading = /^(#{1,6})\s+(.+)$/u.exec(line);
		if (heading !== null) {
			flush();
			const level = Math.min(3, heading[1].length);
			const size = level === 1 ? metrics.headingSizes[0] : level === 2 ? metrics.headingSizes[1] : metrics.headingSizes[2];
			paragraphs.push(new Paragraph({
				heading: level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
				spacing: {
					before: level === 1 ? 360 : 240,
					after: level === 1 ? 180 : 120,
					line: metrics.line
				},
				alignment: level === 1 ? AlignmentType.CENTER : AlignmentType.LEFT,
				children: [run(cleanInlineMarkdown(heading[2]), size, { bold: true })]
			}));
			continue;
		}
		const quote = /^>\s?(.*)$/u.exec(line);
		if (quote !== null) {
			flush();
			const text = cleanInlineMarkdown(quote[1]);
			if (text !== "") paragraphs.push(new Paragraph({
				spacing: {
					line: metrics.line,
					after: 0
				},
				indent: {
					left: 480,
					right: 360,
					firstLine: 0
				},
				children: [run(text, metrics.bodySize, { italics: true })]
			}));
			continue;
		}
		const bullet = /^[-*+]\s+(.+)$/u.exec(line);
		if (bullet !== null) {
			flush();
			paragraphs.push(new Paragraph({
				bullet: { level: 0 },
				spacing: {
					line: metrics.line,
					after: 0
				},
				children: [run(cleanInlineMarkdown(bullet[1]), metrics.bodySize)]
			}));
			continue;
		}
		const numbered = /^\d+[.)]\s+(.+)$/u.exec(line);
		if (numbered !== null) {
			flush();
			paragraphs.push(new Paragraph({
				numbering: {
					reference: "research-numbering",
					level: 0
				},
				spacing: {
					line: metrics.line,
					after: 0
				},
				children: [run(cleanInlineMarkdown(numbered[1]), metrics.bodySize)]
			}));
			continue;
		}
		if (/^\s*---+\s*$/u.test(line)) {
			flush();
			paragraphs.push(new Paragraph({ children: [new PageBreak()] }));
			continue;
		}
		if (line.trim() === "") flush();
		else paragraphBuffer.push(line.trim());
	}
	flush();
	return paragraphs;
}
function titlePage(project, metrics) {
	const degreeLabel = project.layout.degree === "undergraduate" ? "本科毕业论文" : project.layout.degree === "doctoral" ? "博士学位论文" : "硕士学位论文";
	return [
		new Paragraph({
			spacing: {
				before: 900,
				after: 0
			},
			children: []
		}),
		new Paragraph({
			alignment: AlignmentType.CENTER,
			spacing: { after: 900 },
			children: [run(degreeLabel, 32, { bold: true })]
		}),
		new Paragraph({
			alignment: AlignmentType.CENTER,
			spacing: { after: 720 },
			children: [run(project.title, metrics.titleSize, { bold: true })]
		}),
		new Paragraph({
			alignment: AlignmentType.CENTER,
			spacing: { after: 240 },
			children: [run(`作者：${project.layout.author || "________"}`, 24)]
		}),
		new Paragraph({
			alignment: AlignmentType.CENTER,
			spacing: { after: 240 },
			children: [run(`单位：${project.layout.affiliation || "________"}`, 24)]
		}),
		new Paragraph({
			alignment: AlignmentType.CENTER,
			spacing: { before: 600 },
			children: [run(new Date(project.updatedAt).toLocaleDateString("zh-CN"), 24)]
		}),
		new Paragraph({ children: [new PageBreak()] })
	];
}
function referenceParagraphs(project) {
	if (project.sources.length === 0) return [];
	if (/^#{1,3}\s*(参考文献|references)\s*$/imu.test(project.content)) return [];
	return [new Paragraph({
		heading: HeadingLevel.HEADING_1,
		spacing: {
			before: 360,
			after: 180,
			line: 360
		},
		alignment: AlignmentType.CENTER,
		children: [run(project.language === "zh" ? "参考文献" : "References", 30, { bold: true })]
	}), ...project.sources.map((source, index) => new Paragraph({
		spacing: {
			line: 320,
			after: 0
		},
		indent: { hanging: 360 },
		children: [run(`[${index + 1}] ${formatAuthorsForCitation(source.authors, project.language)}. ${source.title}${source.venue === void 0 ? "" : `. ${source.venue}`}${source.year === void 0 ? "" : `, ${source.year}`}.${source.doi === void 0 ? "" : ` https://doi.org/${source.doi}`}`, 21)]
	}))];
}
function exportTemplateKey(project) {
	return project.layout.template === "journal" ? "journal" : project.layout.degree;
}
async function createDocxBuffer(project) {
	const key = exportTemplateKey(project);
	const metrics = METRICS[key];
	const content = markdownParagraphs(stripFirstTitle(project.content, project.title), metrics);
	const references = referenceParagraphs(project);
	const title = new Paragraph({
		alignment: AlignmentType.CENTER,
		spacing: {
			after: 360,
			line: metrics.line
		},
		children: [run(project.title, metrics.titleSize, { bold: true })]
	});
	const summary = project.abstract.trim() === "" ? [] : [new Paragraph({
		spacing: {
			after: 120,
			line: metrics.line
		},
		indent: { firstLine: metrics.firstLine },
		children: [run(project.language === "zh" ? "摘要：" : "Abstract: ", metrics.bodySize, { bold: true }), run(project.abstract, metrics.bodySize)]
	}), ...project.keywords.length === 0 ? [] : [new Paragraph({
		spacing: {
			after: 240,
			line: metrics.line
		},
		children: [run(project.language === "zh" ? "关键词：" : "Keywords: ", metrics.bodySize, { bold: true }), run(project.keywords.join(project.language === "zh" ? "；" : "; "), metrics.bodySize)]
	})]];
	const document = new Document({
		creator: "e研宝",
		title: project.title,
		description: project.prompt,
		numbering: { config: [{
			reference: "research-numbering",
			levels: [{
				level: 0,
				format: "decimal",
				text: "%1.",
				alignment: AlignmentType.LEFT,
				style: { paragraph: { indent: {
					left: 480,
					hanging: 240
				} } }
			}]
		}] },
		styles: { default: { document: {
			run: {
				size: metrics.bodySize,
				font: {
					ascii: "Times New Roman",
					hAnsi: "Times New Roman",
					eastAsia: "宋体",
					cs: "Times New Roman"
				}
			},
			paragraph: { spacing: {
				line: metrics.line,
				after: 0
			} }
		} } },
		sections: [{
			properties: { page: {
				size: {
					width: 11906,
					height: 16838
				},
				margin: {
					top: metrics.marginTop,
					right: metrics.marginRight,
					bottom: metrics.marginBottom,
					left: metrics.marginLeft,
					header: 720,
					footer: 720
				}
			} },
			footers: { default: new Footer({ children: [new Paragraph({
				alignment: AlignmentType.CENTER,
				children: [new TextRun({
					children: [PageNumber.CURRENT],
					size: 20,
					font: {
						ascii: "Times New Roman",
						hAnsi: "Times New Roman",
						eastAsia: "宋体",
						cs: "Times New Roman"
					}
				})]
			})] }) },
			children: [
				...metrics.titlePage ? titlePage(project, metrics) : [],
				title,
				...summary,
				...content,
				...references
			]
		}]
	});
	return await Packer.toBuffer(document);
}
function docxFileName(project) {
	const suffix = project.layout.template === "journal" ? "期刊排版" : project.layout.degree === "undergraduate" ? "本科论文排版" : project.layout.degree === "doctoral" ? "博士论文排版" : "硕士论文排版";
	return `${safeFileStem(project.title)}-${suffix}.docx`;
}
//#endregion
//#region src/store.ts
const PROJECT_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;
function researchRoot(env = process.env) {
	return join(resolveDshHome(void 0, env), "eyanbao", "projects");
}
function newProjectId() {
	return randomUUID();
}
function validProjectId(value) {
	return PROJECT_ID.test(value);
}
function projectDirectory(root, id) {
	if (!validProjectId(id)) throw new Error("研究项目 ID 无效");
	return join(root, id);
}
async function ensureRoot(root) {
	await mkdir(root, { recursive: true });
}
async function readProject(id, options = {}) {
	const root = options.root ?? researchRoot(options.env);
	try {
		const raw = await readFile(join(projectDirectory(root, id), "project.json"), "utf8");
		const parsed = JSON.parse(raw);
		return isScholarProject(parsed) ? parsed : void 0;
	} catch (error) {
		if (error.code === "ENOENT") return void 0;
		throw error;
	}
}
async function saveProject(project, options = {}) {
	const root = options.root ?? researchRoot(options.env);
	await ensureRoot(root);
	const directory = projectDirectory(root, project.id);
	await mkdir(directory, { recursive: true });
	const saved = {
		...project,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	const target = join(directory, "project.json");
	const temporary = join(directory, `project-${randomUUID()}.tmp`);
	await writeFile(temporary, JSON.stringify(saved, null, 2), "utf8");
	await rename(temporary, target);
	return saved;
}
async function listProjects(options = {}) {
	const root = options.root ?? researchRoot(options.env);
	await ensureRoot(root);
	const entries = await readdir(root, { withFileTypes: true });
	const projects = [];
	for (const entry of entries) {
		if (!entry.isDirectory() || !validProjectId(entry.name)) continue;
		try {
			const project = await readProject(entry.name, { root });
			if (project !== void 0) projects.push(project);
		} catch {}
	}
	return projects.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)).slice(0, options.limit ?? 100).map(projectSummary);
}
async function removeProject(id, options = {}) {
	await rm(projectDirectory(options.root ?? researchRoot(options.env), id), {
		recursive: true,
		force: true
	});
}
async function replaceProject(id, change, options = {}) {
	const current = await readProject(id, options);
	if (current === void 0) throw new Error("找不到研究项目");
	return await saveProject(change(current), options);
}
//#endregion
//#region src/generation.ts
var ResearchGenerationError = class extends Error {
	code;
	constructor(message, code) {
		super(message);
		this.code = code;
		this.name = "ResearchGenerationError";
	}
};
const TASK_LABELS = {
	search: "文献检索",
	review: "文献综述",
	journal: "期刊论文",
	research: "研究论文",
	thesis: "毕业论文",
	"journal-layout": "期刊排版",
	"thesis-layout": "毕业论文排版"
};
const DEGREE_LABELS = {
	undergraduate: "本科",
	master: "硕士",
	doctoral: "博士"
};
const CITATION_LABELS = {
	gb7714: "GB/T 7714—2015",
	apa7: "APA 7",
	mla9: "MLA 9",
	chicago17: "Chicago 17"
};
const SCOPE_LABELS = {
	mixed: "中外文混合",
	zh: "仅中文文献",
	foreign: "外文文献"
};
const JOURNAL_QUALITY_LABELS = {
	any: "全部期刊",
	"top-preferred": "顶刊优先",
	"top-only": "仅顶级期刊"
};
const ASSIST_INSTRUCTIONS = {
	refine: "把研究需求改写成一句更清晰、可执行的研究问题。明确研究对象、核心问题、范围或时间、可能的证据类型。只输出改写后的这一句，不要标题、解释或列表。",
	keywords: "生成检索策略。分为“中文关键词”“英文关键词”“布尔检索式”三部分，每部分使用短列表或单行内容。不要生成不存在的文献或 DOI。",
	method: "推荐可执行的研究设计。包括研究问题拆解、数据或材料来源、方法选择、分析步骤、效度或可信度、伦理风险与局限。使用简洁 Markdown。",
	outline: "生成论文或研究稿提纲。至少包含摘要、引言、文献综述或理论框架、研究设计、分析、讨论、结论与参考文献占位；结合当前论文类型和学位层次。使用 Markdown 标题与短说明。"
};
function initialProject(request) {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const title = `${request.prompt.slice(0, 42)}${request.prompt.length > 42 ? "…" : ""}`;
	return {
		id: newProjectId(),
		title,
		prompt: request.prompt,
		kind: request.kind,
		discipline: request.discipline,
		...request.englishQuery === void 0 || request.englishQuery.trim() === "" ? {} : { englishQuery: request.englishQuery.trim() },
		language: request.language,
		literatureScope: request.literatureScope,
		journalQuality: request.journalQuality,
		databases: request.databases,
		citationStyle: request.citationStyle,
		...request.yearFrom === void 0 ? {} : { yearFrom: request.yearFrom },
		sourceCount: request.sourceCount,
		status: "draft",
		content: "",
		abstract: "",
		keywords: [],
		sources: [],
		layout: {
			degree: request.degree,
			journalName: request.journalName,
			author: request.author,
			affiliation: request.affiliation,
			template: request.kind === "journal" || request.kind === "research" || request.kind === "journal-layout" ? "journal" : request.kind === "thesis" || request.kind === "thesis-layout" ? "thesis" : "journal"
		},
		createdAt: now,
		updatedAt: now
	};
}
function sourceContext(sources) {
	return sources.map((source, index) => {
		const abstract = source.abstract === void 0 ? "" : source.abstract.slice(0, 900);
		return [
			`[${index + 1}]`,
			`数据库：${databaseLabel(source.source)}`,
			`题名：${source.title}`,
			`作者：${source.authors.join("、") || "未知"}`,
			source.language === void 0 ? "" : `语言：${source.language}`,
			source.topJournal === true ? "期刊层级：顶级期刊" : "",
			source.year === void 0 ? "" : `年份：${source.year}`,
			source.venue === void 0 ? "" : `来源：${source.venue}`,
			source.doi === void 0 ? "" : `DOI：${source.doi}`,
			abstract === "" ? "" : `摘要：${abstract}`
		].filter(Boolean).join("\n");
	}).join("\n\n");
}
function systemFor(project) {
	const language = project.language === "zh" ? "中文" : "英文";
	const task = TASK_LABELS[project.kind];
	const degree = DEGREE_LABELS[project.layout.degree];
	return `你是 e研宝的学术研究与写作助手，服务在职研究生、硕士生和博士生。当前任务：${task}。使用${language}写作，引用格式：${CITATION_LABELS[project.citationStyle]}。文献范围：${SCOPE_LABELS[project.literatureScope]}。期刊层级：${project.literatureScope === "foreign" ? JOURNAL_QUALITY_LABELS[project.journalQuality] : "全部期刊"}。${project.layout.template === "journal" ? `期刊排版：${project.layout.journalName || "通用中文学术期刊"}。` : `${degree}学位论文排版。`}

必须遵守：
1. 只使用用户消息中来源清单提供的事实与文献；不得虚构作者、题名、DOI、数据、实验或引用。
2. 若证据不足以支撑某项判断，直接写明“现有来源不足以支持该判断”，并说明还缺什么证据。
3. 正文中的引用使用与来源清单序号对应的 [1]、[2] 形式；文末给出参考文献，逐条对应来源清单。
4. 区分文献结论、作者观点与你的分析。不得把推测写成既有研究结论。
5. 输出完整 Markdown 正文：第一行是一级标题；随后是摘要和关键词；再按任务组织正文与参考文献。
6. 不输出思考过程、写作说明、免责声明或代码围栏，直接输出可编辑稿件。
7. 外文文献可保留原文题名和作者，但正文论述使用要求的写作语言；不得自行翻译 DOI 或期刊名。

${project.kind === "review" ? "文献综述应综合主题脉络、方法差异、争议、证据缺口与未来方向，避免逐篇摘要拼接。" : ""}
${project.kind === "journal" || project.kind === "journal-layout" ? "期刊论文应包含标题、摘要、关键词、引言、方法、结果或分析、讨论、结论与参考文献。" : ""}
${project.kind === "research" ? "研究论文应给出清晰的研究问题、分析框架、方法、证据、讨论和局限。" : ""}
${project.kind === "thesis" || project.kind === "thesis-layout" ? "毕业论文应具备章节结构、研究设计、论证链、结论与参考文献；学位层次应与用户选择一致。" : ""}
${project.kind === "journal-layout" || project.kind === "thesis-layout" ? "本次重点是形成可直接进入排版的完整终稿，段落层级清晰，避免表格用复杂 Markdown。" : ""}`;
}
function userPrompt(project, sources) {
	const degree = DEGREE_LABELS[project.layout.degree];
	return [
		`研究需求：${project.prompt}`,
		`任务：${TASK_LABELS[project.kind]}`,
		project.discipline === "" ? "" : `学科领域：${project.discipline}`,
		`学位层次：${degree}`,
		`文献范围：${SCOPE_LABELS[project.literatureScope]}`,
		`期刊层级：${project.literatureScope === "foreign" ? JOURNAL_QUALITY_LABELS[project.journalQuality] : "全部期刊"}`,
		`数据库：${(project.databases ?? [
			"openalex",
			"crossref",
			"semantic-scholar"
		]).map(databaseLabel).join("、")}`,
		`起始年份：${project.yearFrom ?? "不限"}`,
		project.layout.author === "" ? "" : `作者：${project.layout.author}`,
		project.layout.affiliation === "" ? "" : `单位：${project.layout.affiliation}`,
		project.layout.journalName === "" ? "" : `目标期刊：${project.layout.journalName}`,
		"",
		"来源清单：",
		sourceContext(sources) || "（本次没有检索到可用来源）",
		"",
		`请根据以上来源完成${TASK_LABELS[project.kind]}。正文需要足够完整以便继续编辑和排版。`
	].filter((line) => line !== "").join("\n");
}
async function generateEnglishSearchQuery(query, services, signal) {
	if (!/\p{Script=Han}/u.test(query) || services.defaultModel === void 0 || services.llm === void 0) return;
	try {
		const selected = services.defaultModel.currentSelection();
		if (typeof selected?.provider !== "string" || selected.provider.trim() === "" || typeof selected.model !== "string" || selected.model.trim() === "") return;
		let output = "";
		let finished = false;
		for await (const chunk of services.llm.stream({
			...selected,
			system: "You translate Chinese academic research topics into concise English bibliographic search keywords. Preserve named entities, dates, methods, and scope qualifiers. Return only one search query, no quotes, labels, explanation, or Markdown.",
			messages: [createUserMessage({
				content: [{
					type: "text",
					text: query.slice(0, 1e3)
				}],
				source: { kind: "user" }
			})],
			temperature: .1,
			maxTokens: 300,
			signal
		})) {
			signal.throwIfAborted();
			if (chunk.type === "tool-call-delta" || chunk.type === "block-start" && chunk.blockType === "tool-call" || chunk.type === "block-end" && chunk.block.type === "tool-call") return;
			if (chunk.type === "text-delta") output += chunk.text;
			if (chunk.type === "finish") {
				if (chunk.reason.kind !== "stop") return void 0;
				finished = true;
			}
		}
		if (!finished) return void 0;
		const normalized = output.replace(/^```[a-z]*\s*/iu, "").replace(/```$/u, "").replace(/^["'“”]+|["'“”]+$/gu, "").replace(/\s+/gu, " ").trim().slice(0, 300);
		return normalized !== "" && /[A-Za-z]/u.test(normalized) && !/\p{Script=Han}/u.test(normalized) ? normalized : void 0;
	} catch {
		return;
	}
}
async function streamResearchAssist(request, services, onDelta, signal) {
	if (services.defaultModel === void 0 || services.llm === void 0) throw new ResearchGenerationError("默认文字模型尚未就绪，请先配置文字模型。", "model-missing");
	const selected = services.defaultModel.currentSelection();
	if (typeof selected?.provider !== "string" || selected.provider.trim() === "" || typeof selected.model !== "string" || selected.model.trim() === "") throw new ResearchGenerationError("请先配置默认文字模型。", "model-missing");
	const task = TASK_LABELS[request.kind];
	const degree = DEGREE_LABELS[request.degree];
	const scope = SCOPE_LABELS[request.literatureScope];
	const quality = request.literatureScope === "foreign" ? JOURNAL_QUALITY_LABELS[request.journalQuality] : "全部期刊";
	const databases = request.databases.map(databaseLabel).join("、");
	signal.throwIfAborted();
	let output = "";
	let finished = false;
	for await (const chunk of services.llm.stream({
		...selected,
		system: `你是 e研宝的 AI 研究教练，服务在职研究生、硕士生和博士生。当前任务类型：${task}。学位层次：${degree}。文献范围：${scope}。期刊层级：${quality}。数据库：${databases}。写作语言：${request.language === "zh" ? "中文" : "英文"}。你只提供研究规划和方法建议，不虚构文献、数据、实验结果或引用。${ASSIST_INSTRUCTIONS[request.action]}`,
		messages: [createUserMessage({
			content: [{
				type: "text",
				text: `研究需求：${request.prompt}${request.discipline === "" ? "" : `\n学科领域：${request.discipline}`}`
			}],
			source: { kind: "user" }
		})],
		temperature: .3,
		maxTokens: 2200,
		signal
	})) {
		signal.throwIfAborted();
		if (finished && chunk.type !== "usage") throw new ResearchGenerationError("AI 辅助响应格式异常，请重试。", "assist-incomplete");
		if (chunk.type === "tool-call-delta" || chunk.type === "block-start" && chunk.blockType === "tool-call" || chunk.type === "block-end" && chunk.block.type === "tool-call") throw new ResearchGenerationError("AI 辅助返回了工具调用，请重试。", "assist-tool-call");
		if (chunk.type === "text-delta") {
			output += chunk.text;
			await onDelta(chunk.text);
			if (output.length > 4e4) throw new ResearchGenerationError("AI 辅助结果过长，已停止生成。", "assist-output-too-long");
		}
		if (chunk.type === "finish") {
			if (chunk.reason.kind !== "stop") throw new ResearchGenerationError(chunk.reason.kind === "aborted" ? "AI 辅助已取消。" : "AI 辅助未完整结束，请重试。", chunk.reason.kind === "aborted" ? "cancelled" : "assist-incomplete");
			finished = true;
		}
	}
	signal.throwIfAborted();
	if (!finished) throw new ResearchGenerationError("AI 辅助响应中断，请重试。", "assist-incomplete");
	const text = output.trim();
	if (text === "") throw new ResearchGenerationError("AI 辅助没有返回内容，请重试。", "assist-empty");
	return text;
}
async function streamProjectDraft(project, sources, services, onDelta, signal) {
	if (services.defaultModel === void 0 || services.llm === void 0) throw new ResearchGenerationError("默认文字模型尚未就绪，请先在模型设置中配置文字模型。", "model-missing");
	const selected = services.defaultModel.currentSelection();
	if (typeof selected?.provider !== "string" || selected.provider.trim() === "" || typeof selected.model !== "string" || selected.model.trim() === "") throw new ResearchGenerationError("请先在模型设置中配置默认文字模型。", "model-missing");
	signal.throwIfAborted();
	if (services.llm.resolveModelInfo !== void 0) {
		const info = await services.llm.resolveModelInfo(selected.provider, selected.model, signal);
		if (info.inputModalities !== void 0 && !info.inputModalities.includes("text")) throw new ResearchGenerationError("当前默认模型不支持文字输入，请更换文字模型。", "model-not-text");
	}
	const maxTokens = project.kind === "thesis" || project.kind === "thesis-layout" ? 16e3 : project.kind === "journal" || project.kind === "research" || project.kind === "journal-layout" ? 12e3 : 8e3;
	let output = "";
	let finished = false;
	for await (const chunk of services.llm.stream({
		...selected,
		system: systemFor(project),
		messages: [createUserMessage({
			content: [{
				type: "text",
				text: userPrompt(project, sources)
			}],
			source: { kind: "user" }
		})],
		maxTokens,
		signal
	})) {
		signal.throwIfAborted();
		if (finished && chunk.type !== "usage") throw new ResearchGenerationError("模型响应在结束后仍有内容，未保存结果。", "model-incomplete");
		if (chunk.type === "tool-call-delta" || chunk.type === "block-start" && chunk.blockType === "tool-call" || chunk.type === "block-end" && chunk.block.type === "tool-call") throw new ResearchGenerationError("模型返回了工具调用，稿件生成已停止。", "model-tool-call");
		if (chunk.type === "text-delta") {
			output += chunk.text;
			await onDelta(chunk.text);
			if (output.length > 25e4) throw new ResearchGenerationError("模型输出过长，稿件生成已停止。", "model-output-too-long");
		}
		if (chunk.type === "finish") {
			if (chunk.reason.kind !== "stop") throw new ResearchGenerationError(chunk.reason.kind === "aborted" ? "稿件生成已取消。" : chunk.reason.kind === "error" ? chunk.reason.failure.message : "模型响应未完整结束，请重试。", chunk.reason.kind === "aborted" ? "cancelled" : "model-incomplete");
			finished = true;
		}
	}
	signal.throwIfAborted();
	if (!finished) throw new ResearchGenerationError("模型响应中断，请重试。", "model-incomplete");
	const text = output.trim();
	if (text === "") throw new ResearchGenerationError("模型没有返回正文，请重试。", "model-empty");
	return text;
}
function metadataFromMarkdown(markdown, fallbackTitle) {
	const title = /^#\s+(.+)$/mu.exec(markdown)?.[1]?.replace(/[*_`]/gu, "").trim() || fallbackTitle;
	const abstractMatch = /(?:^|\n)(?:>\s*)?(?:\*\*)?摘要(?:\*\*)?[：:]\s*(?:\*\*)?\s*([^\n]+)/u.exec(markdown) ?? /(?:^|\n)##\s*摘要\s*\n+([^\n]+)/u.exec(markdown);
	const keywordsMatch = /(?:^|\n)(?:>\s*)?(?:\*\*)?关键词(?:\*\*)?[：:]\s*([^\n]+)/u.exec(markdown) ?? /(?:^|\n)##\s*关键词\s*\n+([^\n]+)/u.exec(markdown);
	return {
		title,
		abstract: (abstractMatch?.[1] ?? "").replace(/[*_`>]/gu, "").replace(/\s+/gu, " ").trim().slice(0, 3e3),
		keywords: (keywordsMatch?.[1] ?? "").split(/[；;，,、]/u).map((keyword) => keyword.replace(/[*_`>]/gu, "").trim()).filter(Boolean).slice(0, 12)
	};
}
function finalizeProject(project, content, sources) {
	const metadata = metadataFromMarkdown(content, project.title);
	return {
		...project,
		...metadata,
		content,
		sources,
		status: "complete",
		error: void 0,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
//#endregion
//#region src/routes.ts
const MAX_JSON_BODY = 96 * 1024;
const MAX_PROJECT_BODY = 512 * 1024;
const LONG_JOB_TIMEOUT_MS = 720 * 1e3;
var RouteError = class extends Error {
	status;
	code;
	constructor(message, status, code) {
		super(message);
		this.status = status;
		this.code = code;
		this.name = "RouteError";
	}
};
function isLoopback(address) {
	return address === "127.0.0.1" || address === "::1" || address === "::ffff:127.0.0.1";
}
function sameOrigin(req) {
	const origin = req.headers.origin;
	if (origin === void 0) return true;
	try {
		return new URL(origin).host === req.headers.host;
	} catch {
		return false;
	}
}
function permitted(req, mutation) {
	if (!isLoopback(req.socket.remoteAddress)) return false;
	if (!sameOrigin(req)) return false;
	if (req.headers["sec-fetch-site"] === "cross-site") return false;
	if (mutation && req.headers["x-eyanbao"] !== "1") return false;
	return true;
}
function json(res, status, value, extraHeaders = {}) {
	const body = JSON.stringify(value);
	res.writeHead(status, {
		"content-type": "application/json; charset=utf-8",
		"content-length": Buffer.byteLength(body),
		"cache-control": "no-store",
		"x-content-type-options": "nosniff",
		...extraHeaders
	});
	res.end(body);
}
async function readJson(req, maxBytes) {
	let size = 0;
	const chunks = [];
	for await (const chunk of req) {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		size += buffer.byteLength;
		if (size > maxBytes) throw new RouteError("请求内容过大", 413, "body-too-large");
		chunks.push(buffer);
	}
	if (chunks.length === 0) throw new RouteError("请求体不能为空", 400, "body-required");
	try {
		return JSON.parse(Buffer.concat(chunks).toString("utf8"));
	} catch {
		throw new RouteError("请求体不是有效 JSON", 400, "invalid-json");
	}
}
function messageOf(error) {
	return error instanceof Error ? error.message : String(error);
}
function modelHealth(services) {
	const selected = services.defaultModel?.currentSelection();
	const provider = typeof selected?.provider === "string" ? selected.provider : void 0;
	const model = typeof selected?.model === "string" ? selected.model : void 0;
	const ready = services.llm !== void 0 && provider !== void 0 && model !== void 0 && provider.trim() !== "" && model.trim() !== "";
	return {
		ok: ready,
		modelReady: ready,
		...provider === void 0 ? {} : { provider },
		...model === void 0 ? {} : { model },
		...ready ? {} : { message: "请先在模型设置中配置默认文字模型。" }
	};
}
function searchText(project) {
	return [project.prompt, project.discipline].filter(Boolean).join(" ");
}
async function writeEvent(res, event) {
	if (res.destroyed || res.writableEnded) return;
	if (!res.write(`${JSON.stringify(event)}\n`)) await new Promise((resolve) => {
		const done = () => {
			res.off("drain", done);
			res.off("close", done);
			resolve();
		};
		res.once("drain", done);
		res.once("close", done);
	});
}
async function runAssist(req, res, options) {
	const request = parseAssistRequest(await readJson(req, MAX_JSON_BODY));
	res.writeHead(200, {
		"content-type": "application/x-ndjson; charset=utf-8",
		"cache-control": "no-store",
		"x-content-type-options": "nosniff",
		"x-accel-buffering": "no"
	});
	res.flushHeaders();
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(/* @__PURE__ */ new Error("AI 辅助超时，请重试。")), 180 * 1e3);
	timer.unref?.();
	const closed = () => {
		if (!res.writableEnded) controller.abort(/* @__PURE__ */ new Error("AI 辅助已取消。"));
	};
	res.once("close", closed);
	try {
		await writeEvent(res, {
			type: "status",
			message: "正在分析当前研究需求"
		});
		await writeEvent(res, {
			type: "result",
			text: await streamResearchAssist(request, options.services(), async (text) => writeEvent(res, {
				type: "delta",
				text
			}), controller.signal)
		});
	} catch (error) {
		await writeEvent(res, {
			type: "error",
			message: messageOf(error)
		});
	} finally {
		clearTimeout(timer);
		res.off("close", closed);
		if (!res.writableEnded) res.end();
	}
}
async function searchSources(project, options, signal) {
	const scope = project.literatureScope ?? "mixed";
	const chinese = searchText(project);
	let queries = [chinese];
	if (scope !== "zh") {
		const supplied = project.englishQuery?.trim();
		const english = supplied !== void 0 && supplied !== "" ? supplied : await generateEnglishSearchQuery(chinese, options.services(), signal);
		if (english !== void 0 && english !== "") queries = scope === "foreign" ? [english, ...queries] : [...queries, english];
	}
	return await searchLiterature(queries, {
		limit: project.sourceCount,
		...project.yearFrom === void 0 ? {} : { yearFrom: project.yearFrom },
		scope,
		journalQuality: scope === "foreign" ? project.journalQuality : "any",
		databases: project.databases ?? [
			"openalex",
			"crossref",
			"semantic-scholar"
		],
		env: options.env,
		signal,
		...options.fetcher === void 0 ? {} : { fetcher: options.fetcher }
	});
}
function searchStatus(project, verify = false) {
	const scope = project.literatureScope === "foreign" ? project.englishQuery?.trim() ? "外文文献，使用自定义英文检索词" : "外文文献，必要时生成英文检索词" : project.literatureScope === "zh" ? "中文文献" : project.englishQuery?.trim() ? "中外文文献，使用自定义英文检索词" : "中外文文献，必要时生成英文检索词";
	const quality = project.literatureScope === "foreign" && project.journalQuality !== "any" ? `，${project.journalQuality === "top-only" ? "仅限顶级期刊" : "顶刊优先"}` : "";
	const databases = (project.databases ?? [
		"openalex",
		"crossref",
		"semantic-scholar"
	]).map(databaseLabel).join("、");
	return `正在检索${scope}${quality}${verify ? "，并核对来源" : ""}（${databases}）`;
}
async function runProject(req, res, options) {
	const request = parseRunRequest(await readJson(req, MAX_JSON_BODY));
	let project = initialProject(request);
	project.status = "running";
	project = await saveProject(project, {
		root: options.projectRoot,
		env: options.env
	});
	res.writeHead(200, {
		"content-type": "application/x-ndjson; charset=utf-8",
		"cache-control": "no-store",
		"x-content-type-options": "nosniff",
		"x-accel-buffering": "no"
	});
	res.flushHeaders();
	await writeEvent(res, {
		type: "project",
		project
	});
	const controller = new AbortController();
	const timer = setTimeout(() => {
		controller.abort(new ResearchGenerationError("生成超时，已保留当前草稿。", "timeout"));
	}, LONG_JOB_TIMEOUT_MS);
	timer.unref?.();
	const closed = () => {
		if (!res.writableEnded) controller.abort(new ResearchGenerationError("生成已取消。", "cancelled"));
	};
	res.once("close", closed);
	let content = "";
	try {
		if (request.kind === "search") {
			await writeEvent(res, {
				type: "status",
				stage: "search",
				message: searchStatus(project)
			});
			const result = await searchSources(project, options, controller.signal);
			project = {
				...project,
				title: `${request.prompt.slice(0, 42)}${request.prompt.length > 42 ? "…" : ""} · 文献清单`,
				sources: result.sources,
				status: "complete",
				content: result.sources.map((source, index) => {
					const authors = source.authors.join("、") || "佚名";
					return `### [${index + 1}] ${source.title}\n\n${authors}${source.language === void 0 ? "" : ` · ${source.language}`}${source.topJournal === true ? " · 顶级期刊" : ""}${source.year === void 0 ? "" : ` · ${source.year}`}${source.venue === void 0 ? "" : ` · ${source.venue}`}${source.citedBy === void 0 ? "" : ` · 被引 ${source.citedBy}`}\n\n${source.abstract === void 0 ? "暂无摘要。" : source.abstract}${source.doi === void 0 ? "" : `\n\n[查看原文](https://doi.org/${source.doi})`}`;
				}).join("\n\n---\n\n"),
				warning: result.warning
			};
			project = await saveProject(project, {
				root: options.projectRoot,
				env: options.env
			});
			await writeEvent(res, {
				type: "sources",
				sources: result.sources,
				...result.warning === void 0 ? {} : { warning: result.warning }
			});
			await writeEvent(res, {
				type: "result",
				project
			});
			return;
		}
		await writeEvent(res, {
			type: "status",
			stage: "search",
			message: searchStatus(project, true)
		});
		const result = await searchSources(project, options, controller.signal);
		project = {
			...project,
			sources: result.sources,
			warning: result.warning
		};
		project = await saveProject(project, {
			root: options.projectRoot,
			env: options.env
		});
		await writeEvent(res, {
			type: "sources",
			sources: result.sources,
			...result.warning === void 0 ? {} : { warning: result.warning }
		});
		await writeEvent(res, {
			type: "status",
			stage: "evidence",
			message: "来源已就绪，正在整理证据链"
		});
		await writeEvent(res, {
			type: "status",
			stage: "write",
			message: "正在生成可编辑正文"
		});
		content = await streamProjectDraft(project, result.sources, options.services(), async (text) => {
			content += text;
			await writeEvent(res, {
				type: "delta",
				text
			});
		}, controller.signal);
		await writeEvent(res, {
			type: "status",
			stage: "polish",
			message: "正在校对结构与引用"
		});
		project = finalizeProject(project, content, result.sources);
		project = await saveProject(project, {
			root: options.projectRoot,
			env: options.env
		});
		await writeEvent(res, {
			type: "result",
			project
		});
	} catch (error) {
		const message = controller.signal.aborted ? messageOf(controller.signal.reason) : messageOf(error);
		project = {
			...project,
			content,
			status: content.trim() === "" ? "error" : "draft",
			error: message,
			warning: project.warning
		};
		try {
			project = await saveProject(project, {
				root: options.projectRoot,
				env: options.env
			});
		} catch {}
		await writeEvent(res, {
			type: "error",
			message,
			project
		});
	} finally {
		clearTimeout(timer);
		res.off("close", closed);
		if (!res.writableEnded) res.end();
	}
}
function patchProject(current, body) {
	if (body === null || typeof body !== "object" || Array.isArray(body)) throw new RouteError("项目修改格式无效", 400, "invalid-project");
	const value = body;
	const next = { ...current };
	if (value.title !== void 0) {
		if (typeof value.title !== "string" || value.title.trim() === "" || value.title.length > 240) throw new RouteError("项目标题无效", 400, "invalid-title");
		next.title = value.title.trim();
	}
	if (value.content !== void 0) {
		if (typeof value.content !== "string" || value.content.length > 25e4) throw new RouteError("正文内容无效或过长", 400, "invalid-content");
		next.content = value.content;
	}
	if (value.abstract !== void 0) {
		if (typeof value.abstract !== "string" || value.abstract.length > 8e3) throw new RouteError("摘要内容无效或过长", 400, "invalid-abstract");
		next.abstract = value.abstract;
	}
	if (value.keywords !== void 0) {
		if (!Array.isArray(value.keywords) || value.keywords.length > 30 || value.keywords.some((keyword) => typeof keyword !== "string" || keyword.length > 80)) throw new RouteError("关键词格式无效", 400, "invalid-keywords");
		next.keywords = value.keywords.map((keyword) => String(keyword).trim()).filter(Boolean);
	}
	if (value.layout !== void 0) {
		if (value.layout === null || typeof value.layout !== "object" || Array.isArray(value.layout)) throw new RouteError("排版设置格式无效", 400, "invalid-layout");
		const layout = value.layout;
		const allowedTemplates = /* @__PURE__ */ new Set(["journal", "thesis"]);
		const allowedDegrees = /* @__PURE__ */ new Set([
			"undergraduate",
			"master",
			"doctoral"
		]);
		const text = (key, max) => {
			const raw = layout[key];
			if (raw === void 0) return void 0;
			if (typeof raw !== "string" || raw.length > max) throw new RouteError(`排版字段 ${key} 无效`, 400, "invalid-layout");
			return raw.trim();
		};
		const journalName = text("journalName", 120);
		const author = text("author", 80);
		const affiliation = text("affiliation", 160);
		if (layout.template !== void 0 && (typeof layout.template !== "string" || !allowedTemplates.has(layout.template))) throw new RouteError("排版模板无效", 400, "invalid-layout");
		if (layout.degree !== void 0 && (typeof layout.degree !== "string" || !allowedDegrees.has(layout.degree))) throw new RouteError("学位层次无效", 400, "invalid-layout");
		next.layout = {
			...next.layout,
			...journalName === void 0 ? {} : { journalName },
			...author === void 0 ? {} : { author },
			...affiliation === void 0 ? {} : { affiliation },
			...layout.template === void 0 ? {} : { template: layout.template },
			...layout.degree === void 0 ? {} : { degree: layout.degree }
		};
	}
	return next;
}
function createRouteHandler(options) {
	return async (req, res) => {
		if (!permitted(req, req.method === "POST" || req.method === "PATCH" || req.method === "DELETE")) {
			json(res, 403, { error: "仅允许 e研宝本机页面访问" });
			return;
		}
		let url;
		try {
			url = new URL(req.url ?? "/", "http://localhost");
		} catch {
			json(res, 400, { error: "请求地址无效" });
			return;
		}
		if (url.pathname === "/api/cqai-eyanbao" || url.pathname === `/api/cqai-eyanbao/`) {
			json(res, 404, { error: "接口不存在" });
			return;
		}
		if (!url.pathname.startsWith(`/api/cqai-eyanbao/`)) {
			json(res, 404, { error: "接口不存在" });
			return;
		}
		const action = url.pathname.slice(API.length + 1);
		try {
			if (req.method === "GET" && action === "health") {
				json(res, 200, modelHealth(options.services()));
				return;
			}
			if (req.method === "GET" && action === "databases") {
				json(res, 200, { databases: databaseStatuses(options.env ?? process.env) });
				return;
			}
			if (req.method === "GET" && action === "projects") {
				json(res, 200, { projects: await listProjects({
					root: options.projectRoot,
					env: options.env
				}) });
				return;
			}
			if (req.method === "POST" && action === "run") {
				await runProject(req, res, options);
				return;
			}
			if (req.method === "POST" && action === "assist") {
				await runAssist(req, res, options);
				return;
			}
			const match = /^projects\/([^/]+)(?:\/(export\.docx|export\.md))?$/u.exec(action);
			if (match !== null) {
				const id = decodeURIComponent(match[1]);
				if (!validProjectId(id)) throw new RouteError("项目 ID 无效", 400, "invalid-id");
				if (req.method === "GET" && match[2] === void 0) {
					const project = await readProject(id, {
						root: options.projectRoot,
						env: options.env
					});
					if (project === void 0) throw new RouteError("找不到研究项目", 404, "not-found");
					json(res, 200, { project });
					return;
				}
				if (req.method === "GET" && match[2] === "export.md") {
					const project = await readProject(id, {
						root: options.projectRoot,
						env: options.env
					});
					if (project === void 0) throw new RouteError("找不到研究项目", 404, "not-found");
					const body = `# ${project.title}\n\n${project.abstract === "" ? "" : `> 摘要：${project.abstract}\n\n`}${project.keywords.length === 0 ? "" : `> 关键词：${project.keywords.join("；")}\n\n`}${project.content}\n`;
					const encoded = encodeURIComponent(`${safeFileStem(project.title)}.md`);
					res.writeHead(200, {
						"content-type": "text/markdown; charset=utf-8",
						"content-disposition": `attachment; filename*=UTF-8''${encoded}`,
						"cache-control": "no-store"
					});
					res.end(body);
					return;
				}
				if (req.method === "GET" && match[2] === "export.docx") {
					const project = await readProject(id, {
						root: options.projectRoot,
						env: options.env
					});
					if (project === void 0) throw new RouteError("找不到研究项目", 404, "not-found");
					const buffer = await createDocxBuffer(project);
					const encoded = encodeURIComponent(docxFileName(project));
					res.writeHead(200, {
						"content-type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
						"content-length": buffer.byteLength,
						"content-disposition": `attachment; filename*=UTF-8''${encoded}`,
						"cache-control": "no-store"
					});
					res.end(buffer);
					return;
				}
				if (req.method === "PATCH" || req.method === "POST") {
					const body = await readJson(req, MAX_PROJECT_BODY);
					json(res, 200, { project: await replaceProject(id, (current) => patchProject(current, body), {
						root: options.projectRoot,
						env: options.env
					}) });
					return;
				}
				if (req.method === "DELETE") {
					await removeProject(id, {
						root: options.projectRoot,
						env: options.env
					});
					json(res, 200, { ok: true });
					return;
				}
			}
			json(res, 404, { error: "接口不存在" });
		} catch (error) {
			json(res, error instanceof RouteError ? error.status : 400, { error: messageOf(error) });
		}
	};
}
//#endregion
//#region src/index.ts
const name = "cqai-eyanbao";
const inject = ["webServer"];
function apply(ctx) {
	let services = {};
	ctx.inject(["llm", "agentDefaultModel"], (modelCtx) => {
		services = {
			llm: modelCtx.get("llm"),
			defaultModel: modelCtx.get("agentDefaultModel")
		};
		return () => {
			services = {};
		};
	});
	const handler = createRouteHandler({ services: () => services });
	ctx.effect(() => ctx.webServer.register({
		kind: "prefix",
		path: API,
		handler
	}), "e研宝 research routes");
}
//#endregion
export { apply, inject, name };
