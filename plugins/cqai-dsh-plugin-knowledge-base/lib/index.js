import { resolveDshHome } from "@deepseek-ai/dsh-home-paths";
import { promises } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/index.ts
const name = "cqai-knowledge-base";
const inject = ["webServer"];
const API = "/api/cqai-knowledge-base";
const MAX_BODY = 2 * 1024 * 1024;
function json(res, code, value) {
	res.statusCode = code;
	res.setHeader("content-type", "application/json; charset=utf-8");
	res.setHeader("cache-control", "no-store");
	res.end(JSON.stringify(value));
}
function local(req, mutation) {
	const remote = req.socket.remoteAddress ?? "";
	if (!remote.startsWith("127.") && remote !== "::1" && !remote.startsWith("::ffff:127.")) return false;
	if (req.headers["sec-fetch-site"] === "cross-site") return false;
	if (!mutation) return true;
	const origin = req.headers.origin;
	return origin === void 0 || origin === `http://${req.headers.host}` || origin === `https://${req.headers.host}`;
}
async function readBody(req) {
	const chunks = [];
	let size = 0;
	for await (const chunk of req) {
		const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		size += bytes.length;
		if (size > MAX_BODY) throw new Error("请求过大");
		chunks.push(bytes);
	}
	const value = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
	if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error("请求格式无效");
	return value;
}
function cleanText(value, fallback, max) {
	const text = typeof value === "string" ? value.trim() : "";
	return text === "" ? fallback : text.slice(0, max);
}
function cleanTags(value) {
	return Array.isArray(value) ? value.filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 20) : [];
}
var KnowledgeStore = class {
	file;
	docs = [];
	loaded = false;
	constructor(home) {
		this.file = path.join(home, "cqai-knowledge-base", "documents.json");
	}
	async load() {
		if (this.loaded) return;
		this.loaded = true;
		try {
			const raw = await promises.readFile(this.file, "utf8");
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed)) this.docs = parsed;
		} catch {
			this.docs = [];
		}
	}
	async save() {
		await promises.mkdir(path.dirname(this.file), { recursive: true });
		const temp = `${this.file}.${process.pid}.tmp`;
		await promises.writeFile(temp, JSON.stringify(this.docs, null, 2), "utf8");
		await promises.rename(temp, this.file);
	}
	async list() {
		await this.load();
		return [...this.docs].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
	}
	async get(id) {
		await this.load();
		return this.docs.find((doc) => doc.id === id);
	}
	async saveDoc(input) {
		await this.load();
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const id = typeof input.id === "string" && input.id.length < 100 ? input.id : randomUUID();
		const existing = this.docs.find((doc) => doc.id === id);
		const doc = {
			id,
			title: cleanText(input.title, "未命名文档", 200),
			content: typeof input.content === "string" ? input.content.slice(0, 5e5) : "",
			tags: cleanTags(input.tags),
			createdAt: existing?.createdAt ?? now,
			updatedAt: now
		};
		this.docs = [doc, ...this.docs.filter((item) => item.id !== id)];
		await this.save();
		return doc;
	}
	async remove(id) {
		await this.load();
		const size = this.docs.length;
		this.docs = this.docs.filter((doc) => doc.id !== id);
		if (size !== this.docs.length) await this.save();
		return size !== this.docs.length;
	}
	async search(query) {
		await this.load();
		const q = query.trim().toLocaleLowerCase();
		if (!q) return [];
		return this.docs.map((doc) => {
			const index = `${doc.title}\n${doc.tags.join(" ")}\n${doc.content}`.toLocaleLowerCase().indexOf(q);
			if (index < 0) return void 0;
			const score = (doc.title.toLocaleLowerCase().includes(q) ? 5 : 0) + (doc.tags.some((tag) => tag.toLocaleLowerCase().includes(q)) ? 3 : 0) + 1;
			const start = Math.max(0, index - 80);
			return {
				...doc,
				score,
				excerpt: doc.content.slice(start, start + 240).replace(/\s+/gu, " ")
			};
		}).filter((doc) => doc !== void 0).sort((a, b) => b.score - a.score || b.updatedAt.localeCompare(a.updatedAt)).slice(0, 20);
	}
};
function apply(ctx) {
	const store = new KnowledgeStore(resolveDshHome());
	ctx.effect(() => ctx.webServer.register({
		kind: "prefix",
		path: API,
		handler: async (req, res) => {
			const pathName = new URL(req.url ?? "/", "http://localhost").pathname.slice(24);
			try {
				if (req.method === "GET" && pathName === "/docs") {
					if (!local(req, false)) return json(res, 403, { error: "仅允许本机访问" });
					return json(res, 200, { documents: await store.list() });
				}
				if (req.method === "GET" && pathName === "/search") {
					if (!local(req, false)) return json(res, 403, { error: "仅允许本机访问" });
					return json(res, 200, { results: await store.search(new URL(req.url ?? "/", "http://localhost").searchParams.get("q") ?? "") });
				}
				const match = /^\/docs\/([^/]+)$/.exec(pathName);
				if (match && req.method === "GET") {
					if (!local(req, false)) return json(res, 403, { error: "仅允许本机访问" });
					const doc = await store.get(match[1]);
					return doc ? json(res, 200, doc) : json(res, 404, { error: "文档不存在" });
				}
				if (req.method === "POST" && pathName === "/docs") {
					if (!local(req, true)) return json(res, 403, { error: "仅允许本机访问" });
					return json(res, 200, await store.saveDoc(await readBody(req)));
				}
				if (match && req.method === "DELETE") {
					if (!local(req, true)) return json(res, 403, { error: "仅允许本机访问" });
					return json(res, 200, { removed: await store.remove(match[1]) });
				}
				if (req.method === "GET" && pathName === "/context") {
					if (!local(req, false)) return json(res, 403, { error: "仅允许本机访问" });
					const results = await store.search(new URL(req.url ?? "/", "http://localhost").searchParams.get("q") ?? "");
					return json(res, 200, {
						context: results.map((item) => `## ${item.title}\n${item.excerpt}`).join("\n\n"),
						results
					});
				}
				return json(res, 404, { error: "接口不存在" });
			} catch (error) {
				return json(res, 400, { error: error instanceof Error ? error.message : "请求失败" });
			}
		}
	}), "knowledge base routes");
}
//#endregion
export { API, apply, inject, name };
