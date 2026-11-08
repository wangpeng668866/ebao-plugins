window.__ModuleLoader__.load({
	id: "cqai-dsh-plugin-shared-whiteboard",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region assets/plugin-icon.svg
		var plugin_icon_default = "data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><rect x=\"7\" y=\"9\" width=\"50\" height=\"46\" rx=\"8\" fill=\"%237c3aed\"/><path d=\"M17 19h30v22H17z\" fill=\"none\" stroke=\"white\" stroke-width=\"4\"/><path d=\"m22 48 8-7m8 7-8-7m-5-15h12m-12 7h18\" stroke=\"white\" stroke-width=\"4\" stroke-linecap=\"round\"/></svg>%0A";
		//#endregion
		//#region src/client/index.tsx
		const PANEL = "cqai-shared-whiteboard";
		const API = "/api/cqai-shared-whiteboard";
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
			const [boards, setBoards] = (0, react.useState)([]);
			const [board, setBoard] = (0, react.useState)();
			const [title, setTitle] = (0, react.useState)("");
			const [status, setStatus] = (0, react.useState)("");
			const drag = (0, react.useRef)();
			const reload = async () => {
				const result = await request(`${API}/boards`);
				setBoards(result.boards);
				if (board) {
					const next = result.boards.find((item) => item.id === board.id);
					if (next) setBoard(next);
				}
			};
			(0, react.useEffect)(() => {
				reload().catch((error) => setStatus(error.message));
			}, []);
			const open = (next) => {
				setBoard(next);
				setTitle(next.title);
				setStatus("");
			};
			const create = async () => {
				const next = await request(`${API}/boards`, {
					method: "POST",
					body: JSON.stringify({
						title: "新白板",
						elements: []
					})
				});
				setBoard(next);
				setTitle(next.title);
				await reload();
			};
			const save = async () => {
				if (!board) return;
				setStatus("保存中…");
				try {
					const next = await request(`${API}/boards`, {
						method: "POST",
						body: JSON.stringify({
							id: board.id,
							title,
							elements: board.elements
						})
					});
					setBoard(next);
					await reload();
					setStatus("已保存");
				} catch (error) {
					setStatus(error instanceof Error ? error.message : "保存失败");
				}
			};
			const addText = () => {
				if (!board) return;
				setBoard({
					...board,
					elements: [...board.elements, {
						id: crypto.randomUUID(),
						type: "text",
						x: 80 + board.elements.length * 12,
						y: 80 + board.elements.length * 12,
						text: "双击编辑便签",
						color: "#fff7b2"
					}]
				});
			};
			const share = async () => {
				if (!board) return;
				const result = await request(`${API}/boards/${board.id}/share`, { method: "POST" });
				const link = `${location.origin}${API}/share/${result.token}`;
				try {
					await navigator.clipboard.writeText(link);
				} catch {}
				setStatus(`共享链接已复制：${link}`);
			};
			const onPointerMove = (event) => {
				if (!drag.current || !board) return;
				const rect = event.currentTarget.getBoundingClientRect();
				const x = event.clientX - rect.left - drag.current.dx;
				const y = event.clientY - rect.top - drag.current.dy;
				setBoard({
					...board,
					elements: board.elements.map((item) => item.id === drag.current?.id ? {
						...item,
						x,
						y
					} : item)
				});
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
						width: 230,
						borderRight: "1px solid #e6eaf0",
						padding: 16,
						overflow: "auto"
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						style: {
							...buttonStyle,
							width: "100%",
							marginBottom: 12
						},
						onClick: () => void create(),
						children: "＋ 新建白板"
					}), boards.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						onClick: () => open(item),
						style: {
							display: "block",
							width: "100%",
							textAlign: "left",
							border: 0,
							borderRadius: 8,
							padding: 10,
							background: board?.id === item.id ? "#f0eaff" : "transparent",
							cursor: "pointer",
							marginBottom: 4
						},
						children: item.title
					}, item.id))]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("main", {
					style: {
						flex: 1,
						padding: 18,
						display: "flex",
						flexDirection: "column",
						gap: 10
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: 8
							},
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									value: title,
									onChange: (event) => setTitle(event.target.value),
									placeholder: "白板名称",
									style: {
										flex: 1,
										fontSize: 20,
										padding: 8,
										border: "1px solid #d9e0ea",
										borderRadius: 8
									}
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									style: buttonStyle,
									onClick: addText,
									disabled: !board,
									children: "＋便签"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									style: buttonStyle,
									onClick: () => void save(),
									disabled: !board,
									children: "保存"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									style: buttonStyle,
									onClick: () => void share(),
									disabled: !board,
									children: "共享"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							onPointerMove,
							onPointerUp: () => {
								drag.current = void 0;
							},
							style: {
								position: "relative",
								flex: 1,
								minHeight: 430,
								overflow: "hidden",
								border: "1px solid #d9e0ea",
								borderRadius: 12,
								background: "linear-gradient(#f8fafc 1px, transparent 1px), linear-gradient(90deg, #f8fafc 1px, transparent 1px)",
								backgroundSize: "24px 24px"
							},
							children: board?.elements.map((item) => item.type === "line" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
								style: {
									position: "absolute",
									inset: 0,
									width: "100%",
									height: "100%",
									pointerEvents: "none"
								},
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("line", {
									x1: item.x,
									y1: item.y,
									x2: item.x2 ?? item.x + 100,
									y2: item.y2 ?? item.y + 50,
									stroke: "#7c3aed",
									strokeWidth: "3"
								})
							}, item.id) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								onPointerDown: (event) => {
									const rect = event.currentTarget.parentElement?.getBoundingClientRect();
									if (rect) drag.current = {
										id: item.id,
										dx: event.clientX - rect.left - item.x,
										dy: event.clientY - rect.top - item.y
									};
									event.currentTarget.setPointerCapture(event.pointerId);
								},
								contentEditable: true,
								suppressContentEditableWarning: true,
								onBlur: (event) => {
									const text = event.currentTarget.textContent ?? "";
									setBoard((current) => current ? {
										...current,
										elements: current.elements.map((row) => row.id === item.id ? {
											...row,
											text
										} : row)
									} : current);
								},
								style: {
									position: "absolute",
									left: item.x,
									top: item.y,
									minWidth: 150,
									minHeight: 80,
									padding: 14,
									borderRadius: 10,
									background: item.color ?? "#fff7b2",
									boxShadow: "0 3px 12px #1d24331f",
									cursor: "grab",
									outline: "none"
								},
								children: item.text
							}, item.id))
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: {
								color: "#728096",
								fontSize: 13
							},
							children: status || "提示：便签可拖动，双击或直接编辑文字；共享令牌适合在同一可访问的 DSH Host/LAN 中使用。"
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
				order: 40,
				label: "共享白板"
			}, PanelIcon));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
