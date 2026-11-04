//#region src/protocol.ts
const API = "/api/cqai-eyanbao";
const TASK_KINDS = [
	"search",
	"review",
	"journal",
	"research",
	"thesis",
	"journal-layout",
	"thesis-layout"
];
const DEGREES = [
	"undergraduate",
	"master",
	"doctoral"
];
const CITATION_STYLES = [
	"gb7714",
	"apa7",
	"mla9",
	"chicago17"
];
const LANGUAGES = ["zh", "en"];
const LITERATURE_SCOPES = [
	"mixed",
	"zh",
	"foreign"
];
const JOURNAL_QUALITIES = [
	"any",
	"top-preferred",
	"top-only"
];
const ASSIST_ACTIONS = [
	"refine",
	"keywords",
	"method",
	"outline"
];
const DATABASE_IDS = [
	"openalex",
	"crossref",
	"pubmed",
	"semantic-scholar",
	"web-of-science",
	"scopus",
	"google-scholar",
	"cnki",
	"wanfang"
];
const PROJECT_STATUSES = [
	"draft",
	"running",
	"complete",
	"error"
];
const TASK_KIND_SET = new Set(TASK_KINDS);
const DEGREE_SET = new Set(DEGREES);
const CITATION_STYLE_SET = new Set(CITATION_STYLES);
const LANGUAGE_SET = new Set(LANGUAGES);
const LITERATURE_SCOPE_SET = new Set(LITERATURE_SCOPES);
const JOURNAL_QUALITY_SET = new Set(JOURNAL_QUALITIES);
const ASSIST_ACTION_SET = new Set(ASSIST_ACTIONS);
const DATABASE_ID_SET = new Set(DATABASE_IDS);
function taskKind(value) {
	if (typeof value !== "string" || !TASK_KIND_SET.has(value)) throw new Error("研究任务类型无效");
	return value;
}
function isTaskKind(value) {
	return typeof value === "string" && TASK_KIND_SET.has(value);
}
function degree(value) {
	if (typeof value !== "string" || !DEGREE_SET.has(value)) throw new Error("学位层次无效");
	return value;
}
function citationStyle(value) {
	if (typeof value !== "string" || !CITATION_STYLE_SET.has(value)) throw new Error("引用格式无效");
	return value;
}
function language(value) {
	if (typeof value !== "string" || !LANGUAGE_SET.has(value)) throw new Error("写作语言无效");
	return value;
}
function literatureScope(value) {
	if (typeof value !== "string" || !LITERATURE_SCOPE_SET.has(value)) throw new Error("文献范围无效");
	return value;
}
function journalQuality(value) {
	if (typeof value !== "string" || !JOURNAL_QUALITY_SET.has(value)) throw new Error("期刊层级无效");
	return value;
}
function assistAction(value) {
	if (typeof value !== "string" || !ASSIST_ACTION_SET.has(value)) throw new Error("AI 辅助类型无效");
	return value;
}
function databaseId(value) {
	if (typeof value !== "string" || !DATABASE_ID_SET.has(value)) throw new Error("文献数据库无效");
	return value;
}
function databaseIds(value) {
	if (!Array.isArray(value) || value.length === 0) throw new Error("请至少选择一个文献数据库");
	const ids = [...new Set(value.map(databaseId))];
	if (ids.length > DATABASE_IDS.length) throw new Error("文献数据库数量无效");
	return ids;
}
function parseRunRequest(value) {
	if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error("研究请求格式无效");
	const body = value;
	const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
	if (prompt.length < 4) throw new Error("请至少输入四个字的研究需求");
	if (prompt.length > 4e3) throw new Error("研究需求不能超过 4000 个字符");
	const sourceCount = Number(body.sourceCount ?? 12);
	if (!Number.isInteger(sourceCount) || sourceCount < 3 || sourceCount > 30) throw new Error("文献数量需在 3 到 30 之间");
	const year = body.yearFrom === void 0 || body.yearFrom === null || body.yearFrom === "" ? void 0 : Number(body.yearFrom);
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	if (year !== void 0 && (!Number.isInteger(year) || year < 1900 || year > currentYear)) throw new Error(`起始年份需在 1900 到 ${currentYear} 之间`);
	const clean = (key, max) => {
		const raw = body[key];
		if (raw === void 0 || raw === null) return "";
		if (typeof raw !== "string") throw new Error(`${key} 必须是文本`);
		return raw.trim().slice(0, max);
	};
	const englishQuery = clean("englishQuery", 300);
	return {
		prompt,
		kind: taskKind(body.kind),
		degree: degree(body.degree ?? "master"),
		discipline: clean("discipline", 80),
		...englishQuery === "" ? {} : { englishQuery },
		language: language(body.language ?? "zh"),
		literatureScope: literatureScope(body.literatureScope ?? "mixed"),
		journalQuality: journalQuality(body.journalQuality ?? "any"),
		databases: databaseIds(body.databases ?? [
			"openalex",
			"crossref",
			"semantic-scholar"
		]),
		citationStyle: citationStyle(body.citationStyle ?? "gb7714"),
		...year === void 0 ? {} : { yearFrom: year },
		sourceCount,
		author: clean("author", 80),
		affiliation: clean("affiliation", 160),
		journalName: clean("journalName", 120)
	};
}
function parseAssistRequest(value) {
	if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error("AI 辅助请求格式无效");
	const body = value;
	const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
	if (prompt.length < 4) throw new Error("请先输入至少四个字的研究需求");
	if (prompt.length > 4e3) throw new Error("研究需求不能超过 4000 个字符");
	const discipline = typeof body.discipline === "string" ? body.discipline.trim().slice(0, 80) : "";
	return {
		action: assistAction(body.action),
		prompt,
		kind: taskKind(body.kind),
		degree: degree(body.degree ?? "master"),
		discipline,
		language: language(body.language ?? "zh"),
		literatureScope: literatureScope(body.literatureScope ?? "mixed"),
		journalQuality: journalQuality(body.journalQuality ?? "any"),
		databases: databaseIds(body.databases ?? [
			"openalex",
			"crossref",
			"semantic-scholar"
		])
	};
}
function projectSummary(project) {
	return {
		id: project.id,
		title: project.title,
		prompt: project.prompt,
		kind: project.kind,
		status: project.status,
		sourceCount: project.sources.length,
		updatedAt: project.updatedAt
	};
}
function isScholarProject(value) {
	if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
	const project = value;
	return typeof project.id === "string" && typeof project.title === "string" && typeof project.content === "string" && isTaskKind(project.kind) && PROJECT_STATUSES.includes(project.status) && Array.isArray(project.sources);
}
function sourceLabel(source, index) {
	const authors = source.authors.length === 0 ? "佚名" : source.authors.length > 3 ? `${source.authors.slice(0, 3).join("、")}等` : source.authors.join("、");
	return `[${index + 1}] ${authors}. ${source.title}${source.venue === void 0 ? "" : `. ${source.venue}`}${source.year === void 0 ? "" : `, ${source.year}`}.${source.doi === void 0 ? "" : ` https://doi.org/${source.doi}`}`;
}
function safeFileStem(value) {
	return value.replace(/[<>:"/\\|?*\u0000-\u001F]/gu, "-").replace(/\s+/gu, " ").trim().slice(0, 80) || "e研宝文档";
}
//#endregion
export { API, ASSIST_ACTIONS, CITATION_STYLES, DATABASE_IDS, DEGREES, JOURNAL_QUALITIES, LANGUAGES, LITERATURE_SCOPES, PROJECT_STATUSES, TASK_KINDS, assistAction, citationStyle, databaseId, databaseIds, degree, isScholarProject, isTaskKind, journalQuality, language, literatureScope, parseAssistRequest, parseRunRequest, projectSummary, safeFileStem, sourceLabel, taskKind };
