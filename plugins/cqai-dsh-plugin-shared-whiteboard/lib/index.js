import { resolveDshHome } from "@deepseek-ai/dsh-home-paths";
import { promises } from "node:fs";
import path from "node:path";
import { randomBytes, randomUUID } from "node:crypto";
//#region src/index.ts
const name = "cqai-shared-whiteboard";
const inject = ["webServer"];
const API = "/api/cqai-shared-whiteboard";
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
async function body(req) {
	const chunks = [];
	let size = 0;
	for await (const chunk of req) {
		const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		size += bytes.length;
		if (size > 4 * 1024 * 1024) throw new Error("请求过大");
		chunks.push(bytes);
	}
	const value = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
	if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error("请求格式无效");
	return value;
}
var BoardStore = class {
	file;
	boards = [];
	loaded = false;
	constructor(home) {
		this.file = path.join(home, "cqai-shared-whiteboard", "boards.json");
	}
	async load() {
		if (this.loaded) return;
		this.loaded = true;
		try {
			const parsed = JSON.parse(await promises.readFile(this.file, "utf8"));
			if (Array.isArray(parsed)) this.boards = parsed;
		} catch {
			this.boards = [];
		}
	}
	async save() {
		await promises.mkdir(path.dirname(this.file), { recursive: true });
		const temp = `${this.file}.${process.pid}.tmp`;
		await promises.writeFile(temp, JSON.stringify(this.boards, null, 2));
		await promises.rename(temp, this.file);
	}
	async list() {
		await this.load();
		return [...this.boards].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
	}
	async get(id) {
		await this.load();
		return this.boards.find((board) => board.id === id);
	}
	async saveBoard(input) {
		await this.load();
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const id = typeof input.id === "string" && input.id.length < 100 ? input.id : randomUUID();
		const old = this.boards.find((board) => board.id === id);
		const elements = Array.isArray(input.elements) ? input.elements.slice(0, 1e3).filter((item) => item && typeof item === "object").map((item) => {
			const row = item;
			return {
				id: typeof row.id === "string" ? row.id : randomUUID(),
				type: row.type === "line" ? "line" : "text",
				x: Number.isFinite(row.x) ? Number(row.x) : 40,
				y: Number.isFinite(row.y) ? Number(row.y) : 40,
				...Number.isFinite(row.x2) ? { x2: Number(row.x2) } : {},
				...Number.isFinite(row.y2) ? { y2: Number(row.y2) } : {},
				...typeof row.text === "string" ? { text: row.text.slice(0, 5e3) } : {},
				...typeof row.color === "string" ? { color: row.color.slice(0, 30) } : {}
			};
		}) : old?.elements ?? [];
		const board = {
			id,
			title: typeof input.title === "string" && input.title.trim() ? input.title.trim().slice(0, 200) : "未命名白板",
			elements,
			createdAt: old?.createdAt ?? now,
			updatedAt: now,
			...old?.shareToken ? { shareToken: old.shareToken } : {}
		};
		this.boards = [board, ...this.boards.filter((item) => item.id !== id)];
		await this.save();
		return board;
	}
	async remove(id) {
		await this.load();
		const size = this.boards.length;
		this.boards = this.boards.filter((board) => board.id !== id);
		if (size !== this.boards.length) await this.save();
		return size !== this.boards.length;
	}
	async share(id) {
		await this.load();
		const board = this.boards.find((item) => item.id === id);
		if (!board) return void 0;
		board.shareToken ??= randomBytes(18).toString("base64url");
		board.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
		await this.save();
		return board;
	}
	async shared(token) {
		await this.load();
		return this.boards.find((board) => board.shareToken === token);
	}
};
function apply(ctx) {
	const store = new BoardStore(resolveDshHome());
	ctx.effect(() => ctx.webServer.register({
		kind: "prefix",
		path: API,
		handler: async (req, res) => {
			const pathName = new URL(req.url ?? "/", "http://localhost").pathname.slice(27);
			try {
				if (req.method === "GET" && pathName === "/boards") {
					if (!local(req, false)) return json(res, 403, { error: "仅允许本机访问" });
					return json(res, 200, { boards: await store.list() });
				}
				const boardMatch = /^\/boards\/([^/]+)$/.exec(pathName);
				if (boardMatch && req.method === "GET") {
					if (!local(req, false)) return json(res, 403, { error: "仅允许本机访问" });
					const board = await store.get(boardMatch[1]);
					return board ? json(res, 200, board) : json(res, 404, { error: "白板不存在" });
				}
				if (req.method === "POST" && pathName === "/boards") {
					if (!local(req, true)) return json(res, 403, { error: "仅允许本机访问" });
					return json(res, 200, await store.saveBoard(await body(req)));
				}
				if (boardMatch && req.method === "DELETE") {
					if (!local(req, true)) return json(res, 403, { error: "仅允许本机访问" });
					return json(res, 200, { removed: await store.remove(boardMatch[1]) });
				}
				const shareMatch = /^\/boards\/([^/]+)\/share$/.exec(pathName);
				if (shareMatch && req.method === "POST") {
					if (!local(req, true)) return json(res, 403, { error: "仅允许本机访问" });
					const board = await store.share(shareMatch[1]);
					return board ? json(res, 200, {
						token: board.shareToken,
						board
					}) : json(res, 404, { error: "白板不存在" });
				}
				const sharedMatch = /^\/share\/([^/]+)$/.exec(pathName);
				if (sharedMatch && req.method === "GET") {
					const board = await store.shared(sharedMatch[1]);
					return board ? json(res, 200, board) : json(res, 404, { error: "共享白板不存在或已失效" });
				}
				return json(res, 404, { error: "接口不存在" });
			} catch (error) {
				return json(res, 400, { error: error instanceof Error ? error.message : "请求失败" });
			}
		}
	}), "shared whiteboard routes");
}
//#endregion
export { API, apply, inject, name };
