window.__ModuleLoader__.load({
	id: "cqai-dsh-plugin-ejianbao",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region packages/cqai-dsh-media-settings/lib/client.js
		function createClientState(initial) {
			let value = initial;
			const listeners = /* @__PURE__ */ new Set();
			return {
				getSnapshot: () => value,
				subscribe: (listener) => {
					listeners.add(listener);
					return () => {
						listeners.delete(listener);
					};
				},
				set: (next) => {
					if (next === value) return;
					value = next;
					for (const listener of listeners) listener();
				}
			};
		}
		function mediaMutationHeaders(api) {
			return {
				"content-type": "application/json",
				[api.includes("short-video") ? "x-short-video" : api.includes("talkcraft") ? "x-talkcraft" : "x-ejianbao"]: "1"
			};
		}
		async function mediaRequest(api, action, data) {
			const response = await fetch(`${api}/${action}`, {
				credentials: "same-origin",
				cache: "no-store",
				...data === void 0 ? {} : {
					method: "POST",
					headers: action === "media-settings" ? {
						"content-type": "application/json",
						"x-ejianbao": "1"
					} : mediaMutationHeaders(api),
					body: JSON.stringify(data)
				}
			});
			if (!response.headers.get("content-type")?.includes("application/json")) throw new Error("制作服务尚未就绪，请重新检查");
			const result = await response.json();
			if (!response.ok) throw new Error(result.error || "请求失败，请重试");
			return result;
		}
		const engineLabels$1 = {
			shortVideo: "短视频制作",
			talkcraft: "口播视频制作"
		};
		const links = {
			pexels: "https://www.pexels.com/api/key/",
			pixabay: "https://pixabay.com/api/docs/",
			coverr: "https://coverr.co/developers"
		};
		const editorStyles = `
.ejb-settings-editor{display:grid;gap:20px}
.ejb-settings-editor h3{margin:0 0 12px}
.ejb-settings-box{padding:20px;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-1)}
.ejb-settings-fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}
.ejb-settings-field{display:grid;gap:8px}
.ejb-settings-field select{width:100%;min-height:40px;box-sizing:border-box;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:8px}
.ejb-settings-input-control{display:flex;width:100%;height:40px;box-sizing:border-box;padding:0 12px;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;background:var(--dsw-alias-bg-layer-1)}
.ejb-settings-input-control:focus-within{border-color:var(--dsw-alias-state-business-primary);outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}
.ejb-settings-input-control > input{flex:1;min-width:0;min-height:0;width:100%;padding:0;border:0;border-radius:0;background:transparent;outline:none}
.ejb-settings-actions{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:12px}
.ejb-settings-editor p{line-height:1.6}
.ejb-settings-editor button:focus-visible,.ejb-settings-field select:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}
.ejb-settings-input-control > input:focus-visible{outline:none}
.ejb-settings-editor a{color:var(--dsw-alias-brand-primary)}
.ejb-settings-error{color:var(--dsw-alias-danger-primary,var(--dsw-alias-label-primary))}
.ejb-settings-note{color:var(--dsw-alias-label-secondary);font-size:13px}`;
		/** This editor never receives saved plaintext credentials; inputs are only replacement drafts. */
		function MediaSettingsEditor({ api, engine, includeCoverr = engine === "shortVideo", onChange }) {
			const id = (0, react.useId)();
			const [settings, setSettings] = (0, react.useState)();
			const [defaults, setDefaults] = (0, react.useState)({
				aspect: "9:16",
				edgeVoiceId: "zh-CN-XiaoxiaoNeural"
			});
			const [values, setValues] = (0, react.useState)({});
			const [editing, setEditing] = (0, react.useState)();
			const [target, setTarget] = (0, react.useState)(engine);
			const [error, setError] = (0, react.useState)("");
			const [notice, setNotice] = (0, react.useState)("");
			const [busy, setBusy] = (0, react.useState)(false);
			const [loading, setLoading] = (0, react.useState)(true);
			const [loaded, setLoaded] = (0, react.useState)(false);
			const unavailable = busy || loading || !loaded;
			const refresh = async () => {
				setLoading(true);
				setLoaded(false);
				try {
					const next = await mediaRequest(api, "media-settings");
					setSettings(next);
					setDefaults({
						...next.defaults,
						...target ? next.overrides[target] : {}
					});
					setLoaded(true);
					return next;
				} finally {
					setLoading(false);
				}
			};
			(0, react.useEffect)(() => {
				let live = true;
				setLoading(true);
				setLoaded(false);
				mediaRequest(api, "media-settings").then((next) => {
					if (!live) return;
					setSettings(next);
					setDefaults({
						...next.defaults,
						...target ? next.overrides[target] : {}
					});
					setLoaded(true);
				}).catch((cause) => {
					if (live) setError(String(cause.message));
				}).finally(() => {
					if (live) setLoading(false);
				});
				return () => {
					live = false;
				};
			}, [api, target]);
			const selectTarget = (next) => {
				if (busy || loading) return;
				setTarget(next);
				if (settings) setDefaults({
					...settings.defaults,
					...next ? settings.overrides[next] : {}
				});
				setValues({});
				setEditing(void 0);
				setError("");
				setNotice("");
				setLoading(true);
				setLoaded(false);
			};
			const mutate = async (mutation) => {
				if (unavailable) return;
				setBusy(true);
				setError("");
				setNotice("");
				try {
					const next = await mediaRequest(api, "media-settings", mutation);
					setSettings(next);
					if (mutation.operation === "defaults" || mutation.operation === "clearOverride" && (mutation.field === "aspect" || mutation.field === "edgeVoiceId")) setDefaults({
						...next.defaults,
						...target ? next.overrides[target] : {}
					});
					onChange?.(next);
					setValues({});
					setEditing(void 0);
					setNotice("设置已保存。新任务使用更新后的默认值。");
				} catch (cause) {
					setError(cause instanceof Error ? cause.message : "保存失败");
					await refresh().catch(() => {});
				} finally {
					setBusy(false);
				}
			};
			const baseline = settings ? {
				...settings.defaults,
				...target ? settings.overrides[target] : {}
			} : void 0;
			const changedDefaults = baseline ? {
				...baseline.aspect !== defaults.aspect ? { aspect: defaults.aspect } : {},
				...baseline.edgeVoiceId !== defaults.edgeVoiceId ? { edgeVoiceId: defaults.edgeVoiceId } : {}
			} : {};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "ejb-settings-editor",
				"aria-busy": busy || loading,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("style", { children: editorStyles }),
					error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "ejb-settings-error",
						role: "alert",
						children: error
					}),
					notice && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						role: "status",
						children: notice
					}),
					settings && loading && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						role: "status",
						children: "正在读取公共设置…"
					}),
					settings && !loaded && !loading && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						onClick: () => void refresh().catch((cause) => setError(cause.message)),
						children: "重新读取"
					}),
					!settings ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "ejb-settings-actions",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							role: "status",
							children: "正在读取公共设置…"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							disabled: loading || busy,
							onClick: () => void refresh().catch((cause) => setError(cause.message)),
							children: "重新读取"
						})]
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "ejb-settings-box",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "制作默认值" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "ejb-settings-note",
								children: "只影响新建短视频与口播任务；已有草稿、历史任务和数字人视频制作的横版输出保留原参数。"
							}),
							!engine && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: "ejb-settings-field",
								htmlFor: `${id}-target`,
								children: ["应用到", /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
									id: `${id}-target`,
									value: target || "",
									disabled: unavailable || loading,
									onChange: (event) => selectTarget(event.target.value || void 0),
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: "",
											children: "所有功能的公共默认"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: "shortVideo",
											children: "短视频制作覆盖值"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: "talkcraft",
											children: "口播视频制作覆盖值"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "ejb-settings-fields",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: "ejb-settings-field",
									htmlFor: `${id}-aspect`,
									children: ["默认画幅", /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
										id: `${id}-aspect`,
										value: defaults.aspect,
										disabled: unavailable,
										onChange: (event) => setDefaults({
											...defaults,
											aspect: event.target.value
										}),
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: "9:16",
											children: "竖屏 · 9:16"
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: "16:9",
											children: "横屏 · 16:9"
										})]
									})]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: "ejb-settings-field",
									htmlFor: `${id}-voice`,
									children: ["Edge 默认音色", /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
										id: `${id}-voice`,
										className: "ejb-settings-input-control",
										value: defaults.edgeVoiceId,
										disabled: unavailable,
										onChange: (event) => setDefaults({
											...defaults,
											edgeVoiceId: event.target.value
										})
									})]
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "ejb-settings-actions",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "primary",
									disabled: unavailable || !defaults.edgeVoiceId.trim() || !Object.keys(changedDefaults).length,
									onClick: () => void mutate({
										operation: "defaults",
										expectedRevision: settings.revision,
										set: changedDefaults,
										...target ? { engine: target } : {}
									}),
									children: "保存默认值"
								}), target && ["aspect", "edgeVoiceId"].filter((field) => settings.overrides[target]?.[field] !== void 0).map((field) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									disabled: unavailable,
									onClick: () => void mutate({
										operation: "clearOverride",
										expectedRevision: settings.revision,
										engine: target,
										field
									}),
									children: [field === "aspect" ? "画幅" : "音色", "恢复公共默认"]
								}, field))]
							})
						]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "ejb-settings-box",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "素材平台连接" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "ejb-settings-note",
								children: "Pexels 与 Pixabay 公共连接供短视频和口播视频使用；有旧配置差异时保留对应功能覆盖。密钥保存在 Credentials 中。"
							}),
							[
								"pexels",
								"pixabay",
								...includeCoverr ? ["coverr"] : []
							].map((provider) => {
								const entry = provider === "coverr" ? void 0 : settings.providers[provider];
								const configured = provider === "coverr" ? settings.coverrConfigured : target && entry?.overrides[target] !== void 0 ? entry.overrides[target] : entry?.configured;
								const revision = provider === "coverr" ? settings.coverrRevision : settings.credentialRevision;
								return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "ejb-settings-field",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "ejb-settings-actions",
											children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: provider === "pexels" ? "Pexels" : provider === "pixabay" ? "Pixabay" : "Coverr（短视频）" }),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
													tone: configured ? "success" : "neutral",
													children: configured ? "已配置" : "未配置"
												}),
												entry?.conflict && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
													tone: "warning",
													children: "存在功能覆盖"
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
													href: links[provider],
													target: "_blank",
													rel: "noopener noreferrer",
													children: "获取 API Key ↗"
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
													disabled: unavailable,
													onClick: () => {
														setEditing(editing === provider ? void 0 : provider);
														setValues({
															...values,
															[provider]: ""
														});
													},
													children: editing === provider ? "取消" : configured ? "更换连接" : "配置连接"
												})
											]
										}),
										editing === provider && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
												htmlFor: `${id}-${provider}`,
												children: [target ? `${engineLabels$1[target]}专用` : "公共", " API Key"]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
												id: `${id}-${provider}`,
												className: "ejb-settings-input-control",
												type: "password",
												autoComplete: "new-password",
												value: values[provider] || "",
												disabled: unavailable,
												onChange: (event) => setValues({
													...values,
													[provider]: event.target.value
												})
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												className: "ejb-settings-actions",
												children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
													variant: "primary",
													disabled: unavailable || !values[provider]?.trim(),
													onClick: () => void mutate({
														operation: "credential",
														expectedRevision: revision,
														provider,
														value: values[provider].trim(),
														...target && provider !== "coverr" ? { engine: target } : {}
													}),
													children: "保存连接"
												}), configured && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
													disabled: unavailable,
													onClick: () => void mutate({
														operation: "credential",
														expectedRevision: revision,
														provider,
														value: null,
														...target && provider !== "coverr" ? { engine: target } : {}
													}),
													children: "清除连接"
												})]
											})
										] }),
										entry && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
											className: "ejb-settings-actions",
											children: Object.entries(entry.overrides).map(([overrideEngine, enabled]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
												engineLabels$1[overrideEngine],
												"：",
												enabled ? "专用连接" : "专用停用",
												" ",
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
													disabled: unavailable,
													onClick: () => void mutate({
														operation: "clearOverride",
														expectedRevision: settings.credentialRevision,
														engine: overrideEngine,
														field: provider
													}),
													children: "使用公共连接"
												})
											] }, overrideEngine))
										})
									]
								}, provider);
							})
						]
					})] })
				]
			});
		}
		//#endregion
		//#region packages/cqai-dsh-media-settings/lib/contracts.js
		const EJIANBAO_PANEL = "cqai-ejianbao";
		const EJIANBAO_WORKSPACES = [
			{
				id: "video",
				panelId: "cqai-video",
				label: "数字人视频制作",
				api: "/api/cqai-video"
			},
			{
				id: "short-video",
				panelId: "cqai-short-video",
				label: "短视频制作",
				api: "/cqai-short-video"
			},
			{
				id: "talkcraft",
				panelId: "cqai-talkcraft",
				label: "口播视频制作",
				api: "/api/cqai-talkcraft"
			}
		];
		//#endregion
		//#region assets/plugin-icon.svg
		var plugin_icon_default = "data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><rect x=\"3\" y=\"7\" width=\"58\" height=\"50\" rx=\"13\" fill=\"%239B6DF7\"/><path d=\"m27 22 18 10-18 10Z\" fill=\"%23fff\"/><path d=\"M14 16h7M14 48h7M45 16h7M45 48h7\" stroke=\"%23fff\" stroke-width=\"4\" stroke-linecap=\"round\"/></svg>%0A";
		//#endregion
		//#region src/client/Settings.tsx
		const targets = [{
			id: "tools",
			label: "公共制作工具",
			api: "/api/cqai-ejianbao",
			read: "tools",
			setup: "tools/setup"
		}, ...EJIANBAO_WORKSPACES.map((item) => ({
			...item,
			read: "health?refresh=1",
			setup: "setup"
		}))];
		const toolLabels = {
			python: "Python 3.11",
			uv: "内置 uv",
			node: "宿主 Node.js",
			ffmpeg: "FFmpeg",
			ffprobe: "ffprobe"
		};
		const engineLabels = {
			numpy: "NumPy",
			render: "渲染引擎",
			renderer: "渲染引擎",
			remotion: "Remotion 渲染",
			compositor: "视频合成",
			browser: "渲染浏览器",
			edgeTts: "Edge 配音",
			asrModel: "语音识别模型",
			semantic: "语义字幕模型"
		};
		const statusLabels = {
			idle: "待准备",
			pending: "待准备",
			ready: "就绪",
			running: "正在准备",
			completed: "完成",
			failed: "失败",
			skipped: "已跳过"
		};
		const errorText = (error) => error instanceof Error ? error.message : "请求失败，请重试";
		function SetupProgress({ setup }) {
			if (!setup) return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				setup.status === "running" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					role: "status",
					children: "正在准备依赖，请保持应用运行。"
				}),
				setup.status === "completed" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					role: "status",
					children: "准备完成，环境状态已重新检查。"
				}),
				setup.items?.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
					className: "ejianbao-muted",
					children: [
						item.label,
						" · ",
						statusLabels[item.status] || item.status,
						item.detail ? ` · ${item.detail}` : ""
					]
				}, item.id)),
				setup.status === "failed" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					role: "alert",
					children: "准备失败，请查看日志后重试。"
				}),
				!!setup.logs?.length && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
					className: "ejianbao-muted",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("summary", { children: [
						"查看运行日志（",
						setup.logs.length,
						" 行）"
					] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
						className: "ejianbao-log",
						children: setup.logs.join("\n")
					})]
				})
			] });
		}
		function packageReady(health, id) {
			if (typeof health.pythonPackages === "boolean") return health.pythonPackages;
			if (id === "video") return typeof health.python === "boolean" && typeof health.numpy === "boolean" ? health.python && health.numpy : void 0;
			return typeof health.python === "boolean" ? health.python : void 0;
		}
		/** One setup completion refreshes public tools and every engine's health. */
		function Environments() {
			const [states, setStates] = (0, react.useState)({});
			const mounted = (0, react.useRef)(false);
			const versions = (0, react.useRef)({});
			const update = (0, react.useCallback)((id, patch) => {
				if (mounted.current) setStates((previous) => ({
					...previous,
					[id]: {
						...previous[id],
						...patch
					}
				}));
			}, []);
			const load = (0, react.useCallback)(async (target) => {
				if (!mounted.current) return;
				const version = (versions.current[target.id] || 0) + 1;
				versions.current[target.id] = version;
				update(target.id, {
					checking: true,
					error: ""
				});
				const results = await Promise.allSettled([mediaRequest(target.api, target.read), ...target.id === "tools" ? [] : [mediaRequest(target.api, target.setup)]]);
				if (!mounted.current || versions.current[target.id] !== version) return;
				const health = results[0], setup = results[1];
				const errors = results.filter((result) => result.status === "rejected").map((result) => errorText(result.reason));
				update(target.id, {
					checking: false,
					error: [...new Set(errors)].join("；"),
					...health.status === "fulfilled" ? {
						health: health.value,
						...target.id === "tools" ? { setup: health.value.setup } : {}
					} : {},
					...setup?.status === "fulfilled" ? { setup: setup.value } : {}
				});
			}, [update]);
			const refreshAll = (0, react.useCallback)(async () => {
				await Promise.all(targets.map(load));
			}, [load]);
			(0, react.useEffect)(() => {
				mounted.current = true;
				refreshAll();
				return () => {
					mounted.current = false;
				};
			}, [refreshAll]);
			const running = targets.filter((target) => states[target.id]?.setup?.status === "running").map((target) => target.id).join(",");
			(0, react.useEffect)(() => {
				if (!running) return;
				let live = true, polling = false;
				const timer = setInterval(async () => {
					if (polling) return;
					polling = true;
					try {
						const results = await Promise.all(targets.filter((target) => running.split(",").includes(target.id)).map(async (target) => {
							const version = versions.current[target.id];
							try {
								return {
									target,
									version,
									setup: await mediaRequest(target.api, target.setup)
								};
							} catch (error) {
								return {
									target,
									version,
									error: errorText(error)
								};
							}
						}));
						if (!live || !mounted.current) return;
						let completed = false;
						for (const result of results) {
							if (versions.current[result.target.id] !== result.version) continue;
							if ("setup" in result && result.setup) {
								update(result.target.id, {
									setup: result.setup,
									error: ""
								});
								if (result.setup.status !== "running") completed = true;
							} else update(result.target.id, { error: result.error });
						}
						if (completed) await refreshAll();
					} finally {
						polling = false;
					}
				}, 2e3);
				return () => {
					live = false;
					clearInterval(timer);
				};
			}, [
				running,
				refreshAll,
				update
			]);
			const install = async (target) => {
				update(target.id, {
					installing: true,
					error: ""
				});
				try {
					const setup = await mediaRequest(target.api, target.setup, {});
					update(target.id, { setup });
					if (setup.status !== "running") await refreshAll();
				} catch (error) {
					update(target.id, { error: errorText(error) });
				} finally {
					update(target.id, { installing: false });
				}
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				"data-ejianbao-environments": "",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "制作环境" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "ejianbao-muted",
						children: "公共工具统一准备，各功能保留独立的引擎包环境。任何安装完成后会重新检查全部状态。"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							display: "grid",
							gap: 16
						},
						children: [targets.slice(0, 1), targets.slice(1)].map((group, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "ejianbao-environments",
							children: group.map((target) => {
								const state = states[target.id] || {}, { health, setup, error } = state;
								const isTools = target.id === "tools", ready = health && !isTools ? packageReady(health, target.id) : void 0;
								const busy = state.installing || setup?.status === "running", labels = isTools ? toolLabels : engineLabels;
								return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
									className: "ejianbao-setting-card",
									...isTools ? { "data-ejianbao-tools": "" } : { "data-ejianbao-engine": target.id },
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("h3", { children: [target.label, !isTools && " · 专属依赖"] }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
											className: "ejianbao-muted",
											children: isTools ? "共享 Python 3.11、FFmpeg 和 ffprobe，复用内置 uv 与宿主 Node.js。" : target.id === "video" ? "复用公共工具，安装本功能的 Python 包；渲染依赖按下方说明单独准备。" : "复用公共工具，安装本功能的引擎包与制作所需依赖。"
										}),
										!isTools && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
											className: "ejianbao-muted",
											children: "缺少的公共工具会先自动准备，已就绪的工具会跳过。"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
											className: "ejianbao-actions",
											"data-environment-badges": "",
											children: health ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [!isTools && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
												tone: ready === void 0 ? "neutral" : ready ? "success" : "warning",
												children: ["Python 包环境 · ", ready === void 0 ? "待检测" : ready ? "就绪" : "待准备"]
											}), Object.entries(labels).filter(([key]) => isTools || typeof health[key] === "boolean").map(([key, title]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
												tone: typeof health[key] !== "boolean" ? "neutral" : health[key] ? "success" : "warning",
												children: [
													title,
													" · ",
													typeof health[key] !== "boolean" ? "待检测" : health[key] ? "就绪" : "待准备"
												]
											}, key))] }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												role: "status",
												children: state.checking ? "正在检测…" : "环境状态未读取"
											})
										}),
										isTools && health && (typeof health.pythonVersion === "string" || typeof health.ffmpegVersion === "string") && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
											className: "ejianbao-muted",
											children: [
												typeof health.pythonVersion === "string" && `Python ${health.pythonVersion}`,
												typeof health.pythonVersion === "string" && typeof health.ffmpegVersion === "string" && " · ",
												typeof health.ffmpegVersion === "string" && `FFmpeg ${health.ffmpegVersion}`
											]
										}),
										typeof health?.error === "string" && health.error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
											role: "alert",
											children: health.error
										}),
										error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
											role: "alert",
											children: error
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "ejianbao-actions",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												disabled: !!state.checking || !!state.installing,
												onClick: () => void refreshAll(),
												children: state.checking ? "正在检查…" : error ? "重试检查" : "重新检查"
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: "primary",
												disabled: !!state.checking || !!busy,
												onClick: () => void install(target),
												children: busy ? "正在准备…" : isTools ? setup?.status === "failed" ? "重试安装 / 修复公共工具" : "安装 / 修复公共工具" : setup?.status === "failed" ? "重试安装 / 修复专属依赖" : "安装 / 修复专属依赖"
											})]
										}),
										target.id === "video" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
											className: "ejianbao-muted",
											children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: "准备数字人视频渲染环境" }),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "在数字人视频制作插件的 runtime/render-studio 目录运行 npm ci，准备现有 Remotion 渲染引擎。" }),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "需要使用指定工具时，可通过 EJIANBAO_PYTHON、FFMPEG_PATH 和 EJIANBAO_BROWSER_EXECUTABLE 配置 Python、FFmpeg 和渲染浏览器；配置完成后重新启动应用并检查。" })
											]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SetupProgress, { setup })
									]
								}, target.id);
							})
						}, index))
					})
				]
			});
		}
		function ShortVideoSettings() {
			const api = "/cqai-short-video";
			const [settings, setSettings] = (0, react.useState)();
			const [error, setError] = (0, react.useState)("");
			const [notice, setNotice] = (0, react.useState)("");
			const [busy, setBusy] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				let live = true;
				mediaRequest(api, "settings").then((next) => {
					if (live) setSettings(next);
				}).catch((cause) => {
					if (live) setError(cause.message);
				});
				return () => {
					live = false;
				};
			}, []);
			const save = async () => {
				if (!settings) return;
				setBusy(true);
				setError("");
				setNotice("");
				try {
					setSettings(await mediaRequest(api, "settings", {
						subtitle_provider: settings.subtitle_provider,
						video_codec: settings.video_codec
					}));
					setNotice("短视频专属设置已保存");
				} catch (cause) {
					setError(cause instanceof Error ? cause.message : "保存失败");
				} finally {
					setBusy(false);
				}
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "ejianbao-setting-card",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "短视频专属设置" }),
					error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						role: "alert",
						children: error
					}),
					notice && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						role: "status",
						children: notice
					}),
					settings && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "ejb-settings-fields",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: "ejb-settings-field",
							children: ["字幕引擎", /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
								value: settings.subtitle_provider,
								onChange: (event) => setSettings({
									...settings,
									subtitle_provider: event.target.value
								}),
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "edge",
									children: "Edge 时间戳"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "whisper",
									children: "Whisper 语音识别"
								})]
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: "ejb-settings-field",
							children: ["编码器", /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
								value: settings.video_codec,
								onChange: (event) => setSettings({
									...settings,
									video_codec: event.target.value
								}),
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "libx264",
										children: "CPU · H.264"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "h264_nvenc",
										children: "NVIDIA NVENC"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "h264_qsv",
										children: "Intel QSV"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "h264_amf",
										children: "AMD AMF"
									})
								]
							})]
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "ejianbao-actions",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "primary",
							disabled: busy,
							onClick: () => void save(),
							children: "保存短视频设置"
						})
					})] })
				]
			});
		}
		function FishSettings() {
			const api = "/api/cqai-talkcraft";
			const [configured, setConfigured] = (0, react.useState)(false);
			const [value, setValue] = (0, react.useState)("");
			const [editing, setEditing] = (0, react.useState)(false);
			const [error, setError] = (0, react.useState)("");
			const [notice, setNotice] = (0, react.useState)("");
			const [busy, setBusy] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				let live = true;
				mediaRequest(api, "settings").then((next) => {
					if (live) setConfigured(next.fish);
				}).catch((cause) => {
					if (live) setError(cause.message);
				});
				return () => {
					live = false;
				};
			}, []);
			const save = async (key) => {
				setBusy(true);
				setError("");
				try {
					const result = await mediaRequest(api, "settings", {
						name: "fish",
						value: key
					});
					setConfigured(result.fish);
					setValue("");
					setEditing(false);
					setNotice(key ? "Fish Audio 已连接" : "Fish Audio 连接已清除");
				} catch (cause) {
					setError(cause instanceof Error ? cause.message : "保存失败");
				} finally {
					setBusy(false);
				}
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "ejianbao-setting-card",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "口播专属 · Fish Audio 配音" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "ejianbao-actions",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
							tone: configured ? "success" : "neutral",
							children: configured ? "已配置" : "未配置"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							disabled: busy,
							onClick: () => {
								setEditing(!editing);
								setValue("");
							},
							children: editing ? "取消" : configured ? "更换连接" : "配置连接"
						})]
					}),
					error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						role: "alert",
						children: error
					}),
					notice && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						role: "status",
						children: notice
					}),
					editing && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: "ejb-settings-field",
						htmlFor: "ejianbao-fish",
						children: ["Fish Audio API Key", /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
							id: "ejianbao-fish",
							className: "ejb-settings-input-control",
							type: "password",
							autoComplete: "new-password",
							value,
							onChange: (event) => setValue(event.target.value)
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "ejianbao-actions",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "primary",
							disabled: busy || !value.trim(),
							onClick: () => void save(value.trim()),
							children: "保存连接"
						}), configured && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							disabled: busy,
							onClick: () => void save(""),
							children: "清除连接"
						})]
					})] })
				]
			});
		}
		function Settings() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "ejianbao-settings",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "e剪宝设置" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(MediaSettingsEditor, {
						api: "/api/cqai-ejianbao",
						includeCoverr: true
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Environments, {}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ShortVideoSettings, {}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(FishSettings, {})
				]
			});
		}
		//#endregion
		//#region src/client/index.tsx
		const inject = ["slots", "layout"];
		function createWorkspaceNavigation(select) {
			const state = createClientState({
				workspace: "video",
				settings: false
			});
			let returnFocus = null;
			let enabled = true;
			return {
				state,
				service: {
					open(workspace) {
						if (!enabled) return;
						state.set({
							workspace,
							settings: false
						});
						select();
					},
					openSettings(from) {
						if (!enabled) return;
						returnFocus = typeof document === "undefined" ? null : document.activeElement;
						state.set({
							workspace: from,
							settings: true
						});
						select();
					}
				},
				returnFocus: () => returnFocus,
				activate: () => {
					enabled = true;
				},
				deactivate: () => {
					enabled = false;
				}
			};
		}
		const styles = `.ejianbao{height:100%;min-height:0;display:flex;flex-direction:column;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1);font-family:inherit}.ejianbao-header{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;padding:16px 24px;border-bottom:1px solid var(--dsw-alias-border-l1);flex:none}.ejianbao-header h1{font-size:20px;line-height:1.4;margin:0}.ejianbao-tabs{display:flex;flex-wrap:wrap;gap:8px}.ejianbao-tabs button{min-height:40px;padding:8px 14px;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;cursor:pointer}.ejianbao-tabs button[aria-selected=true]{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-border-l1)}.ejianbao button:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}.ejianbao-content{min-height:0;flex:1;position:relative;overflow:hidden}.ejianbao-workspace{height:100%;min-height:0}.ejianbao-workspace[hidden]{display:none!important}.ejianbao-empty{padding:32px;line-height:1.7}.ejianbao-settings{height:100%;overflow:auto;box-sizing:border-box;padding:24px;display:grid;align-content:start;gap:24px}.ejianbao-settings h2{font-size:19px;margin:0 0 12px}.ejianbao-setting-card{padding:20px;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-1);min-width:0}.ejianbao-setting-card h3{margin:0 0 12px;font-size:16px}.ejianbao-actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:12px}.ejianbao-muted{color:var(--dsw-alias-label-secondary);font-size:13px;line-height:1.6}.ejianbao-log{max-height:220px;overflow:auto;font:12px/1.6 ui-monospace,monospace;white-space:pre-wrap;overflow-wrap:anywhere}.ejianbao-environments{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:16px}@media(max-width:700px){.ejianbao-header{padding:12px 16px}.ejianbao-tabs{order:3;width:100%}.ejianbao-tabs button{flex:1;padding:8px;font-size:13px}.ejianbao-settings{padding:16px}}`;
		function Workspace({ renderSlot, navigation, ctx }) {
			const view = (0, react.useSyncExternalStore)(navigation.state.subscribe, navigation.state.getSnapshot, navigation.state.getSnapshot);
			const [visited, setVisited] = (0, react.useState)([view.workspace]);
			const [revision, setRevision] = (0, react.useState)(0);
			const tabs = (0, react.useRef)({});
			const settingsReturn = (0, react.useRef)(null);
			const contentRef = (0, react.useRef)(null);
			const previousSettings = (0, react.useRef)(view.settings);
			(0, react.useEffect)(() => {
				setVisited((previous) => previous.includes(view.workspace) ? previous : [...previous, view.workspace]);
			}, [view.workspace]);
			(0, react.useEffect)(() => ctx.slots.subscribe("ejianbao.workspace", () => setRevision((value) => value + 1)), [ctx]);
			(0, react.useEffect)(() => {
				if (view.settings && !previousSettings.current) settingsReturn.current = navigation.returnFocus();
				if (!view.settings && previousSettings.current) {
					const target = settingsReturn.current;
					if (target?.isConnected && !target.closest("[hidden]")) target.focus();
					else tabs.current[view.workspace]?.focus();
				}
				previousSettings.current = view.settings;
			}, [view.settings, view.workspace]);
			(0, react.useEffect)(() => {
				for (const media of contentRef.current?.querySelectorAll("[hidden] audio,[hidden] video") || []) media.pause();
			}, [view.workspace, view.settings]);
			const available = new Set(ctx.slots.entriesOfSlot("ejianbao.workspace").map((entry) => entry.options.key));
			(0, react.useEffect)(() => {
				if (available.has(view.workspace)) return;
				const first = EJIANBAO_WORKSPACES.find((item) => available.has(item.id));
				if (first) navigation.service.open(first.id);
			}, [
				EJIANBAO_WORKSPACES.filter((item) => available.has(item.id)).map((item) => item.id).join(","),
				view.workspace,
				navigation
			]);
			const selectTab = (id) => {
				if (available.has(id)) navigation.service.open(id);
			};
			const onKey = (event, index) => {
				const enabled = EJIANBAO_WORKSPACES.filter((item) => available.has(item.id));
				if (!enabled.length) return;
				const current = enabled.findIndex((item) => item.id === EJIANBAO_WORKSPACES[index].id);
				let next;
				if (event.key === "ArrowRight") next = (current + 1) % enabled.length;
				else if (event.key === "ArrowLeft") next = (current + enabled.length - 1) % enabled.length;
				else if (event.key === "Home") next = 0;
				else if (event.key === "End") next = enabled.length - 1;
				else return;
				event.preventDefault();
				const id = enabled[next].id;
				selectTab(id);
				tabs.current[id]?.focus();
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "ejianbao",
				"data-ejianbao-main": "",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("style", { children: styles }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: "ejianbao-header",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h1", { children: "e剪宝" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "ejianbao-tabs",
								role: "tablist",
								"aria-label": "视频制作功能",
								children: EJIANBAO_WORKSPACES.map((item, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									ref: (element) => {
										if (element) tabs.current[item.id] = element;
									},
									type: "button",
									id: `ejianbao-tab-${item.id}`,
									role: "tab",
									disabled: !available.has(item.id),
									"aria-selected": view.workspace === item.id && !view.settings,
									"aria-controls": `ejianbao-workspace-${item.id}`,
									tabIndex: view.workspace === item.id ? 0 : -1,
									onKeyDown: (event) => onKey(event, index),
									onClick: () => selectTab(item.id),
									children: [item.label, !available.has(item.id) && " · 未启用"]
								}, item.id))
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								onClick: () => view.settings ? navigation.service.open(view.workspace) : navigation.service.openSettings(view.workspace),
								children: view.settings ? "返回制作" : "设置"
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "ejianbao-content",
						ref: contentRef,
						children: [EJIANBAO_WORKSPACES.filter((item) => visited.includes(item.id) || item.id === view.workspace).map((item) => {
							const active = item.id === view.workspace && !view.settings;
							return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								id: `ejianbao-workspace-${item.id}`,
								className: "ejianbao-workspace",
								role: "tabpanel",
								"aria-labelledby": `ejianbao-tab-${item.id}`,
								hidden: !active,
								...!active ? { inert: "" } : {},
								children: available.has(item.id) ? renderSlot("ejianbao.workspace", {
									active,
									containerPanelId: EJIANBAO_PANEL,
									onOpenSettings: () => navigation.service.openSettings(item.id)
								}, { entryKey: item.id }) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "ejianbao-empty",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("h2", { children: [item.label, "尚未启用"] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "请在插件管理中启用对应制作功能，然后返回此页。其他视频功能仍可使用。" })]
								})
							}, item.id);
						}), view.settings && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Settings, {})]
					})
				]
			});
		}
		function apply(ctx) {
			const navigation = createWorkspaceNavigation(() => ctx.layout.selectPanel(EJIANBAO_PANEL));
			ctx.slots.inject("main", function* () {
				navigation.activate();
				yield ctx.slots.register({
					name: "main",
					key: EJIANBAO_PANEL,
					children: { "ejianbao.workspace": {
						kind: "keyed",
						scope: "root"
					} }
				}, (props) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Workspace, {
					...props,
					navigation,
					ctx
				}));
				yield ctx.reflect.provide("ejianbaoUi", navigation.service);
				yield () => {
					navigation.deactivate();
					if (ctx.layout.panelInfo.getSnapshot().activePanelId !== "cqai-ejianbao") return;
					const main = new Set(ctx.slots.entriesOfSlot("main").map((entry) => entry.options.key));
					const destination = EJIANBAO_WORKSPACES.find((item) => item.id === navigation.state.getSnapshot().workspace && main.has(item.panelId)) || EJIANBAO_WORKSPACES.find((item) => main.has(item.panelId));
					ctx.layout.selectPanel(destination ? destination.panelId : null);
				};
			});
			ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
				name: "sidebar.panellist",
				id: EJIANBAO_PANEL,
				order: 41,
				label: "e剪宝"
			}, ({ size }) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
				className: "cqai-plugin-panel-icon",
				src: plugin_icon_default,
				width: size,
				height: size,
				alt: "",
				draggable: false
			})));
		}
		//#endregion
		exports.Workspace = Workspace;
		exports.apply = apply;
		exports.createWorkspaceNavigation = createWorkspaceNavigation;
		exports.inject = inject;
		return module.exports;
	}
});
