window.__ModuleLoader__.load({
	id: "cqai-dsh-plugin-knowledge-base",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region assets/plugin-icon.svg
		var plugin_icon_default = "data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><rect x=\"8\" y=\"8\" width=\"48\" height=\"48\" rx=\"10\" fill=\"%232563eb\"/><path d=\"M20 18h24a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V22a4 4 0 0 1 4-4Z\" fill=\"none\" stroke=\"white\" stroke-width=\"4\"/><path d=\"M23 28h18M23 36h14\" stroke=\"white\" stroke-width=\"4\" stroke-linecap=\"round\"/></svg>%0A";
		//#endregion
		//#region src/client/index.tsx
		const PANEL = "cqai-knowledge-base";
		const API = "/api/cqai-knowledge-base";
		const buttonStyle = {
			border: "1px solid #d9e0ea",
			borderRadius: 8,
			padding: "7px 10px",
			background: "#fff",
			cursor: "pointer"
		};
		async function request(url, init) {
			const response = await fetch(url, {
				...init,
				headers: {
					"content-type": "application/json",
					...init?.headers ?? {}
				}
			});
			const data = await response.json();
			if (!response.ok) throw new Error(data.error ?? `HTTP ${response.status}`);
			return data;
		}
		function PanelIcon({ size }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
				src: plugin_icon_default,
				width: size,
				height: size,
				alt: "",
				draggable: false
			});
		}
		function Workspace() {
			const [docs, setDocs] = (0, react.useState)([]);
			const [selected, setSelected] = (0, react.useState)();
			const [query, setQuery] = (0, react.useState)("");
			const [title, setTitle] = (0, react.useState)("");
			const [content, setContent] = (0, react.useState)("");
			const [tags, setTags] = (0, react.useState)("");
			const [status, setStatus] = (0, react.useState)("");
			const reload = async () => {
				const result = await request(`${API}/docs`);
				setDocs(result.documents);
				if (selected !== void 0) {
					const current = result.documents.find((doc) => doc.id === selected.id);
					if (current) {
						setSelected(current);
						setTitle(current.title);
						setContent(current.content);
						setTags(current.tags.join(", "));
					}
				}
			};
			(0, react.useEffect)(() => {
				reload().catch((error) => setStatus(error.message));
			}, []);
			const filtered = (0, react.useMemo)(() => {
				const q = query.trim().toLowerCase();
				return q ? docs.filter((doc) => `${doc.title} ${doc.tags.join(" ")}`.toLowerCase().includes(q)) : docs;
			}, [docs, query]);
			const open = (doc) => {
				setSelected(doc);
				setTitle(doc.title);
				setContent(doc.content);
				setTags(doc.tags.join(", "));
				setStatus("");
			};
			const save = async () => {
				setStatus("保存中…");
				try {
					const doc = await request(`${API}/docs`, {
						method: "POST",
						body: JSON.stringify({
							id: selected?.id,
							title,
							content,
							tags: tags.split(",").map((item) => item.trim()).filter(Boolean)
						})
					});
					setSelected(doc);
					setTitle(doc.title);
					setContent(doc.content);
					await reload();
					setStatus("已保存");
				} catch (error) {
					setStatus(error instanceof Error ? error.message : "保存失败");
				}
			};
			const remove = async () => {
				if (!selected) return;
				await request(`${API}/docs/${selected.id}`, { method: "DELETE" });
				setSelected(void 0);
				setTitle("");
				setContent("");
				setTags("");
				await reload();
				setStatus("已删除");
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					height: "100%",
					minHeight: 560,
					color: "#172033",
					fontFamily: "system-ui, sans-serif"
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("aside", {
					style: {
						width: 260,
						borderRight: "1px solid #e6eaf0",
						padding: 16,
						overflow: "auto"
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								gap: 8,
								marginBottom: 12
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								value: query,
								onChange: (event) => setQuery(event.target.value),
								placeholder: "搜索知识库",
								style: {
									flex: 1,
									padding: 8,
									border: "1px solid #d9e0ea",
									borderRadius: 8
								}
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								style: buttonStyle,
								onClick: () => {
									setSelected(void 0);
									setTitle("");
									setContent("");
									setTags("");
								},
								children: "新建"
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								fontSize: 12,
								color: "#77839a",
								marginBottom: 8
							},
							children: [filtered.length, " 篇文档"]
						}),
						filtered.map((doc) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							onClick: () => open(doc),
							style: {
								display: "block",
								textAlign: "left",
								width: "100%",
								padding: 10,
								border: 0,
								borderRadius: 8,
								background: selected?.id === doc.id ? "#eaf2ff" : "transparent",
								cursor: "pointer",
								marginBottom: 4
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", {
								style: {
									display: "block",
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap"
								},
								children: doc.title
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", {
								style: { color: "#7b879a" },
								children: doc.tags.join(" · ") || "无标签"
							})]
						}, doc.id))
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("main", {
					style: {
						flex: 1,
						padding: 24,
						display: "flex",
						flexDirection: "column",
						gap: 12
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center"
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
								style: { margin: 0 },
								children: "知识库"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								style: {
									margin: "6px 0 0",
									color: "#728096"
								},
								children: "保存可被检索和提取的项目资料。"
							})] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									gap: 8
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									style: buttonStyle,
									onClick: () => void save(),
									children: "保存"
								}), selected && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									style: {
										...buttonStyle,
										color: "#b42318"
									},
									onClick: () => void remove(),
									children: "删除"
								})]
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							value: title,
							onChange: (event) => setTitle(event.target.value),
							placeholder: "文档标题",
							style: {
								fontSize: 20,
								padding: 10,
								border: "1px solid #d9e0ea",
								borderRadius: 8
							}
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							value: tags,
							onChange: (event) => setTags(event.target.value),
							placeholder: "标签，用逗号分隔",
							style: {
								padding: 9,
								border: "1px solid #d9e0ea",
								borderRadius: 8
							}
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
							value: content,
							onChange: (event) => setContent(event.target.value),
							placeholder: "输入知识内容、会议记录或项目资料…",
							style: {
								flex: 1,
								minHeight: 360,
								padding: 14,
								resize: "vertical",
								border: "1px solid #d9e0ea",
								borderRadius: 8,
								lineHeight: 1.6,
								fontFamily: "inherit"
							}
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: {
								color: "#728096",
								fontSize: 13
							},
							children: status
						})
					]
				})]
			});
		}
		const inject = ["slots"];
		function apply(ctx) {
			ctx.slots.inject("main", () => ctx.slots.register({
				name: "main",
				key: PANEL
			}, () => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Workspace, {})));
			ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
				name: "sidebar.panellist",
				id: PANEL,
				order: 41,
				label: "知识库"
			}, PanelIcon));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
