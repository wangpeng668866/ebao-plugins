import { resolveDshHome } from "@deepseek-ai/dsh-home-paths";
import { createMediaSettings, createMediaSettingsHandler, mediaSettingsPermitted } from "cqai-dsh-media-settings";
import { SetupManager, commonToolHealth, commonToolSteps } from "cqai-dsh-plugin-media-runtime";
//#region src/index.ts
const name = "cqai-ejianbao";
const inject = ["webServer", "credentials"];
const API = "/api/cqai-ejianbao";
function json(res, code, data) {
	res.writeHead(code, {
		"content-type": "application/json; charset=utf-8",
		"cache-control": "no-store",
		"x-content-type-options": "nosniff"
	});
	res.end(JSON.stringify(data));
}
function apply(ctx) {
	const home = resolveDshHome();
	const settings = createMediaSettingsHandler(createMediaSettings({
		home,
		credentials: ctx.credentials
	}), { path: `${API}/media-settings` });
	const setup = new SetupManager(() => commonToolSteps(home));
	ctx.effect(() => ctx.webServer.register({
		kind: "prefix",
		path: API,
		handler: async (req, res) => {
			if (await settings(req, res)) return;
			const action = new URL(req.url ?? "/", "http://localhost").pathname.slice(19);
			if (action === "tools" || action === "tools/setup") {
				if (!mediaSettingsPermitted(req)) return json(res, 403, { error: "仅允许本机应用访问" });
				try {
					if (req.method === "GET" && action === "tools") return json(res, 200, {
						...await commonToolHealth(home),
						setup: setup.snapshot()
					});
					if (req.method === "GET" && action === "tools/setup") return json(res, 200, setup.snapshot());
					if (req.method === "POST" && action === "tools/setup") return json(res, 202, setup.start());
					return json(res, 405, { error: "请求方法不支持" });
				} catch (error) {
					return json(res, 500, { error: error instanceof Error ? error.message : "公共工具检测失败" });
				}
			}
			json(res, 404, { error: "接口不存在" });
		}
	}));
}
//#endregion
export { API, apply, inject, name };
