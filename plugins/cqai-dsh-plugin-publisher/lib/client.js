window.__ModuleLoader__.load({
	id: "cqai-dsh-plugin-publisher",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0rolldown/runtime.js
		var __create = Object.create;
		var __defProp = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
		var __exportAll = (all, no_symbols) => {
			let target = {};
			for (var name in all) __defProp(target, name, {
				get: all[name],
				enumerable: true
			});
			if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
			return target;
		};
		var __copyProps = (to, from, except, desc) => {
			if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
			return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
			value: mod,
			enumerable: true
		}) : target, mod));
		//#endregion
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region assets/plugin-icon.svg
		var plugin_icon_default = "data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"48\" height=\"48\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"url(%23paint)\" stroke-width=\"2.1\" stroke-linecap=\"round\" stroke-linejoin=\"round\">%0A  <defs><linearGradient id=\"paint\" x1=\"2\" y1=\"2\" x2=\"22\" y2=\"22\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"%23347DDD\"/><stop offset=\"1\" stop-color=\"%23264BAF\"/></linearGradient></defs>%0A  <path d=\"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z\" fill=\"%23E7F2FF\"/>%0A  <path d=\"m21.854 2.147-10.94 10.939\"/>%0A</svg>%0A";
		//#endregion
		//#region src/protocol.ts
		/** Loopback HTTP surface shared by the DSH Host and the React publisher panel. */
		const API = "/api/cqai-publisher";
		/** Video platforms supported by the embedded MatrixMedia Worker. */
		const VIDEO_PLATFORMS = [
			"dy",
			"sph",
			"xhs",
			"blbl",
			"ks",
			"tt",
			"bjh",
			"fqsp"
		];
		const PLATFORMS = [
			...VIDEO_PLATFORMS,
			"juejin",
			"wxmp"
		];
		const PLATFORM_LABELS = {
			dy: "抖音",
			sph: "视频号",
			xhs: "小红书",
			blbl: "哔哩哔哩",
			ks: "快手",
			tt: "头条",
			bjh: "百家号",
			fqsp: "番茄视频",
			juejin: "掘金",
			wxmp: "微信公众号"
		};
		const DESCRIPTION_MAX = 2e3;
		const CREATIVE_STATEMENTS = [
			"none",
			"ai_generated",
			"fiction",
			"marketing",
			"personal_opinion",
			"repost",
			"self_made_no_repost"
		];
		/** Article layout selection; old manifests without a selection use the classic layout. */
		const ARTICLE_THEMES = [
			"classic",
			"editorial",
			"orangeheart",
			"lapis",
			"purple"
		];
		const ARTICLE_THEME_LABELS = {
			classic: "基础排版",
			editorial: "清新杂志",
			orangeheart: "文颜灵感 · 橙心",
			lapis: "文颜灵感 · 青金石",
			purple: "文颜灵感 · 紫韵"
		};
		function resolveArticleTheme(content) {
			return content.articleTheme ?? "classic";
		}
		/** Return the content that a selected platform will receive without changing the stored draft. */
		function projectContentForPlatform(content, platform) {
			const variant = content.platformVariants?.[platform];
			const byId = new Map(content.assets.map((asset) => [asset.id, asset]));
			return {
				...content,
				title: variant?.title ?? content.title,
				body: variant?.body ?? content.body,
				summary: variant?.summary ?? content.summary,
				tags: [...variant?.tags ?? content.tags],
				coverAssetId: variant?.coverAssetId === null ? void 0 : variant?.coverAssetId ?? content.coverAssetId,
				assets: variant?.assetOrder ? variant.assetOrder.map((assetId) => byId.get(assetId)).filter(Boolean) : [...content.assets]
			};
		}
		//#endregion
		//#region src/client/image-note-carousel.tsx
		function carouselIndex(scrollLeft, viewportWidth, count) {
			if (count < 1 || viewportWidth <= 0) return 0;
			return Math.max(0, Math.min(count - 1, Math.round(scrollLeft / viewportWidth)));
		}
		/** Shared image-note preview for the conversation sidebar and Publisher review page. */
		function ImageNoteCarousel({ contentId, assets, renderImage }) {
			const viewportRef = (0, react.useRef)(null);
			const [activeIndex, setActiveIndex] = (0, react.useState)(0);
			const boundedIndex = Math.min(activeIndex, Math.max(0, assets.length - 1));
			const activeIndexRef = (0, react.useRef)(boundedIndex);
			activeIndexRef.current = boundedIndex;
			(0, react.useEffect)(() => {
				setActiveIndex(0);
				if (viewportRef.current) viewportRef.current.scrollLeft = 0;
			}, [`${contentId}:${assets.map((asset) => asset.id).join(",")}`]);
			(0, react.useEffect)(() => {
				const viewport = viewportRef.current;
				if (!viewport || typeof ResizeObserver === "undefined") return void 0;
				const observer = new ResizeObserver(() => {
					viewport.scrollLeft = activeIndexRef.current * viewport.clientWidth;
				});
				observer.observe(viewport);
				return () => observer.disconnect();
			}, []);
			if (assets.length === 0) return null;
			const goTo = (index) => {
				const next = Math.max(0, Math.min(assets.length - 1, index));
				const viewport = viewportRef.current;
				if (viewport) viewport.scrollLeft = next * viewport.clientWidth;
				setActiveIndex(next);
			};
			const onScroll = (event) => {
				const viewport = event.currentTarget;
				setActiveIndex(carouselIndex(viewport.scrollLeft, viewport.clientWidth, assets.length));
			};
			const onKeyDown = (event) => {
				if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
				event.preventDefault();
				goTo(boundedIndex + (event.key === "ArrowRight" ? 1 : -1));
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "pub-image-note-carousel",
				role: "region",
				"aria-label": "图文图片轮播",
				tabIndex: 0,
				onKeyDown,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pub-image-note-viewport",
					ref: viewportRef,
					onScroll,
					children: assets.map((asset, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pub-image-note-slide",
						role: "group",
						"aria-label": `第 ${index + 1} 张，共 ${assets.length} 张`,
						"aria-hidden": index !== boundedIndex,
						children: renderImage(asset)
					}, asset.id))
				}), assets.length > 1 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						className: "pub-image-note-nav pub-image-note-prev",
						type: "button",
						"aria-label": "上一张图片",
						disabled: boundedIndex === 0,
						onClick: () => goTo(boundedIndex - 1),
						children: "‹"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						className: "pub-image-note-nav pub-image-note-next",
						type: "button",
						"aria-label": "下一张图片",
						disabled: boundedIndex === assets.length - 1,
						onClick: () => goTo(boundedIndex + 1),
						children: "›"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "pub-image-note-counter",
						"aria-live": "polite",
						children: [
							boundedIndex + 1,
							" / ",
							assets.length
						]
					})
				] })]
			});
		}
		const imageNoteCarouselCss = `
.pub-image-note-carousel { position: relative; width: 100%; max-width: 420px; min-width: 0; margin: 0 auto 18px; border-radius: 10px; overflow: hidden; background: var(--dsw-alias-bg-module-platform, #f3f4f6); }
.pub-image-note-carousel:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary, #4176e6); outline-offset: 2px; }
.pub-image-note-viewport { display: flex; width: 100%; min-width: 0; overflow-x: auto; overflow-y: hidden; scroll-snap-type: x mandatory; overscroll-behavior-inline: contain; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
.pub-image-note-viewport::-webkit-scrollbar { display: none; }
.pub-image-note-slide { display: flex; align-items: center; justify-content: center; flex: 0 0 100%; min-width: 0; aspect-ratio: 3 / 4; scroll-snap-align: start; overflow: hidden; }
.pub-image-note-slide > img, .pub-image-note-slide > [role=img] { display: block; width: 100%; height: 100%; max-width: 100%; object-fit: contain; }
.pub-image-note-carousel .pub-image-note-nav { position: absolute; top: 50%; z-index: 1; display: grid; place-items: center; width: 34px; height: 34px; padding: 0; transform: translateY(-50%); border: 0; border-radius: 50%; background: #0009; color: #fff; font-size: 26px; line-height: 1; cursor: pointer; }
.pub-image-note-carousel .pub-image-note-nav:disabled { opacity: .35; cursor: default; }
.pub-image-note-carousel .pub-image-note-prev { left: 8px; }
.pub-image-note-carousel .pub-image-note-next { right: 8px; }
.pub-image-note-counter { position: absolute; right: 10px; bottom: 10px; padding: 2px 9px; border-radius: 999px; background: #0009; color: #fff; font-size: 12px; line-height: 1.5; pointer-events: none; }
`;
		//#endregion
		//#region src/client/article-preview-style.ts
		/** Local preview styles mirror the conservative inline styles sent to WeChat. */
		const articlePreviewCss = `
.ebao-article-reader { --article-accent: #2c78e4; --article-tint: #f5f8fc; --article-rule: #dce3eb; --article-ink: #252b32; color: var(--article-ink); background: #fff; font-size: 16px; line-height: 1.8; word-break: break-word; }
.ebao-article-reader[data-theme=editorial] { --article-accent: #2b7468; --article-tint: #edf5f0; --article-rule: #c8ded4; --article-ink: #273b35; background: #fffdf8; line-height: 1.9; letter-spacing: .2px; }
.ebao-article-reader[data-theme=native] { --article-accent: #273e5b; --article-tint: #f1f4f8; --article-rule: #d8e0e9; --article-ink: #26313f; line-height: 1.85; }
.ebao-article-reader .pub-wechat-markdown { min-height: 0; padding: 0; border: 0; border-radius: 0; background: transparent; color: inherit; font: inherit; white-space: normal; }
.ebao-article-reader .pub-wechat-markdown > :first-child { margin-top: 0; }
.ebao-article-reader .pub-wechat-markdown p { margin: 0 0 16px; white-space: normal; }
.ebao-article-reader[data-theme=editorial] .pub-wechat-markdown p { margin-bottom: 18px; }
.ebao-article-reader[data-theme=editorial] .pub-wechat-markdown > p:first-child { margin: 0 0 24px; padding: 14px 16px; border-left: 4px solid var(--article-accent); background: var(--article-tint); color: var(--article-ink); font-size: 17px; line-height: 1.85; }
.ebao-article-reader .pub-wechat-markdown h1 { margin: 24px 0 14px; color: #1f2937; font-size: 24px; line-height: 1.4; font-weight: 700; }
.ebao-article-reader .pub-wechat-markdown h2 { margin: 22px 0 12px; color: #1f2937; font-size: 20px; line-height: 1.4; font-weight: 700; }
.ebao-article-reader .pub-wechat-markdown :is(h3, h4, h5, h6) { margin: 20px 0 10px; color: #1f2937; font-size: 18px; line-height: 1.4; font-weight: 700; }
.ebao-article-reader[data-theme=editorial] .pub-wechat-markdown h1 { margin: 30px 0 20px; color: var(--article-ink); font-size: 26px; border-bottom: 3px solid var(--article-accent); padding-bottom: 12px; }
.ebao-article-reader[data-theme=editorial] .pub-wechat-markdown h2 { margin: 28px 0 16px; color: var(--article-ink); line-height: 1.5; border-left: 4px solid var(--article-accent); background: var(--article-tint); padding: 10px 12px; }
.ebao-article-reader[data-theme=native] .pub-wechat-markdown h2 { color: #273e5b; padding-bottom: 8px; border-bottom: 1px solid var(--article-rule); }
.ebao-article-reader[data-theme=editorial] .pub-wechat-markdown :is(h3, h4, h5, h6) { color: var(--article-accent); }
.ebao-article-reader .pub-wechat-markdown blockquote { margin: 16px 0; padding: 8px 12px; border-left: 3px solid var(--article-accent); background: var(--article-tint); color: #5b6472; }
.ebao-article-reader[data-theme=editorial] .pub-wechat-markdown blockquote { margin: 22px 0; padding: 12px 16px; border-left-width: 4px; color: #3d6259; }
.ebao-article-reader .pub-wechat-markdown :is(ul, ol) { margin: 0 0 16px; padding-left: 24px; }
.ebao-article-reader .pub-wechat-markdown li { margin: 0 0 6px; }
.ebao-article-reader .pub-wechat-markdown a { color: var(--article-accent); text-decoration: underline; }
.ebao-article-reader[data-theme=editorial] .pub-wechat-markdown strong { color: var(--article-accent); }
.ebao-article-reader .pub-wechat-markdown table { width: 100%; margin: 16px 0; border-collapse: collapse; }
.ebao-article-reader .pub-wechat-markdown :is(th, td) { padding: 8px; border: 1px solid var(--article-rule); }
.ebao-article-reader .pub-wechat-markdown th { background: var(--article-tint); text-align: left; }
.ebao-article-reader .pub-wechat-markdown hr { margin: 20px 0; border: 0; border-top: 1px solid var(--article-rule); }
.ebao-article-reader .pub-wechat-markdown img { display: block; width: 100%; max-width: 100%; height: auto; margin: 16px auto; }
.ebao-article-reader[data-theme=editorial] .pub-wechat-markdown img { border-radius: 10px; margin: 24px auto; }
.ebao-article-reader .pub-wechat-markdown pre { margin: 16px 0; padding: 12px; background: var(--article-tint); white-space: pre-wrap; word-break: break-word; }
.ebao-article-reader .pub-wechat-markdown code { padding: 2px 4px; background: var(--article-tint); color: #344054; font-family: monospace; font-size: 14px; }
.ebao-article-reader .pub-wechat-markdown pre code { padding: 0; }
.ebao-article-reader .pub-wechat-markdown .pub-wechat-preview-image-error { margin: 16px 0; padding: 9px 12px; border-left: 3px solid #d92d20; background: #fff5f4; color: #9b2219; font-size: 13px; }

/* Independently written previews inspired by Wenyan's Orange Heart, Lapis and Purple themes.
   The Worker renders separate conservative inline styles for WeChat HTML. */
.ebao-article-reader[data-theme=orangeheart] { --article-accent: #ee705f; --article-tint: #fff3ee; --article-rule: #f2c7bc; --article-ink: #543d38; background: #fffdfa; line-height: 1.9; }
.ebao-article-reader[data-theme=orangeheart] .pub-wechat-markdown p { margin-bottom: 19px; }
.ebao-article-reader[data-theme=orangeheart] .pub-wechat-markdown > p:first-of-type { padding: 14px 16px; border-left: 4px solid var(--article-accent); background: var(--article-tint); color: #69453c; }
.ebao-article-reader[data-theme=orangeheart] .pub-wechat-markdown h1 { margin: 30px 0 20px; padding-bottom: 12px; color: #ad493a; border-bottom: 2px solid var(--article-rule); }
.ebao-article-reader[data-theme=orangeheart] .pub-wechat-markdown h2 { margin: 29px 0 17px; padding: 10px 14px; color: #a84434; border-left: 5px solid var(--article-accent); background: var(--article-tint); }
.ebao-article-reader[data-theme=orangeheart] .pub-wechat-markdown :is(h3, h4, h5, h6) { color: #b84e3e; }
.ebao-article-reader[data-theme=orangeheart] .pub-wechat-markdown blockquote { margin: 22px 0; padding: 12px 16px; border-left: 4px solid var(--article-accent); color: #754f46; }
.ebao-article-reader[data-theme=orangeheart] .pub-wechat-markdown strong { color: #b84e3e; }
.ebao-article-reader[data-theme=orangeheart] .pub-wechat-markdown img { margin: 23px auto; border-radius: 12px; }
.ebao-article-reader[data-theme=orangeheart] .pub-wechat-markdown pre { border-left: 3px solid var(--article-accent); }

.ebao-article-reader[data-theme=lapis] { --article-accent: #4870ac; --article-tint: #edf3fb; --article-rule: #b8c9e0; --article-ink: #354455; background: #fbfdff; line-height: 1.85; }
.ebao-article-reader[data-theme=lapis] .pub-wechat-markdown p { margin-bottom: 18px; }
.ebao-article-reader[data-theme=lapis] .pub-wechat-markdown > p:first-of-type { margin-bottom: 25px; padding: 13px 16px; border-top: 1px solid var(--article-rule); border-bottom: 1px solid var(--article-rule); background: var(--article-tint); }
.ebao-article-reader[data-theme=lapis] .pub-wechat-markdown h1 { margin: 30px 0 20px; padding-bottom: 12px; color: #34598f; border-bottom: 3px solid var(--article-accent); }
.ebao-article-reader[data-theme=lapis] .pub-wechat-markdown h2 { margin: 29px 0 18px; padding: 10px 15px; color: #fff; background: var(--article-accent); border-radius: 4px; }
.ebao-article-reader[data-theme=lapis] .pub-wechat-markdown h2 :is(a, strong, code) { color: #fff; background: transparent; }
.ebao-article-reader[data-theme=lapis] .pub-wechat-markdown :is(h3, h4, h5, h6) { color: #34598f; }
.ebao-article-reader[data-theme=lapis] .pub-wechat-markdown blockquote { margin: 22px 0; padding: 12px 16px; border-left: 4px solid var(--article-accent); color: #45617e; }
.ebao-article-reader[data-theme=lapis] .pub-wechat-markdown strong { color: #34598f; }
.ebao-article-reader[data-theme=lapis] .pub-wechat-markdown img { margin: 23px auto; padding: 3px; border: 1px solid var(--article-rule); border-radius: 5px; }
.ebao-article-reader[data-theme=lapis] .pub-wechat-markdown pre { border: 1px solid var(--article-rule); }

.ebao-article-reader[data-theme=purple] { --article-accent: #7656a6; --article-tint: #f5f0fa; --article-rule: #d8c9e9; --article-ink: #43384e; background: #fffdff; line-height: 1.9; }
.ebao-article-reader[data-theme=purple] .pub-wechat-markdown p { margin-bottom: 19px; }
.ebao-article-reader[data-theme=purple] .pub-wechat-markdown > p:first-of-type { margin-bottom: 25px; padding: 15px 17px; border: 1px solid var(--article-rule); border-radius: 9px; background: var(--article-tint); }
.ebao-article-reader[data-theme=purple] .pub-wechat-markdown h1 { margin: 32px 0 20px; padding-bottom: 14px; color: #6b4c96; text-align: center; border-bottom: 2px solid var(--article-rule); }
.ebao-article-reader[data-theme=purple] .pub-wechat-markdown h2 { margin: 30px 0 18px; padding: 8px 3px 11px; color: #6b4c96; border-bottom: 3px solid var(--article-accent); }
.ebao-article-reader[data-theme=purple] .pub-wechat-markdown :is(h3, h4, h5, h6) { color: #7656a6; }
.ebao-article-reader[data-theme=purple] .pub-wechat-markdown blockquote { margin: 24px 0; padding: 15px 17px; border-left: 4px solid var(--article-accent); border-radius: 0 9px 9px 0; color: #5e4c70; }
.ebao-article-reader[data-theme=purple] .pub-wechat-markdown strong { color: #6b4c96; }
.ebao-article-reader[data-theme=purple] .pub-wechat-markdown img { margin: 24px auto; border-radius: 14px; }
.ebao-article-reader[data-theme=purple] .pub-wechat-markdown pre { border: 1px solid var(--article-rule); border-radius: 8px; }

.pub-wechat-preview-body.ebao-article-reader:is([data-theme=orangeheart], [data-theme=lapis], [data-theme=purple]) { padding: 18px 16px; }
.pub-content-preview-shell.ebao-article-reader[data-theme=orangeheart] { border-color: #f2c7bc; background: #fffdfa; }
.pub-content-preview-shell.ebao-article-reader[data-theme=lapis] { border-color: #b8c9e0; background: #fbfdff; }
.pub-content-preview-shell.ebao-article-reader[data-theme=purple] { border-color: #d8c9e9; background: #fffdff; }
.pub-content-preview-shell.ebao-article-reader[data-theme=orangeheart] .pub-content-preview-title, .pub-conv-page.ebao-article-reader[data-theme=orangeheart] > h1 { color: #a84434; padding-bottom: 15px; border-bottom: 2px solid #f2c7bc; }
.pub-content-preview-shell.ebao-article-reader[data-theme=lapis] .pub-content-preview-title, .pub-conv-page.ebao-article-reader[data-theme=lapis] > h1 { color: #34598f; padding-bottom: 15px; border-bottom: 3px solid #4870ac; }
.pub-content-preview-shell.ebao-article-reader[data-theme=purple] .pub-content-preview-title, .pub-conv-page.ebao-article-reader[data-theme=purple] > h1 { color: #6b4c96; padding-bottom: 15px; border-bottom: 2px solid #d8c9e9; }
.pub-content-preview-wechat[data-theme=orangeheart] .pub-wechat-preview-title { color: #a84434; }
.pub-content-preview-wechat[data-theme=lapis] .pub-wechat-preview-title { color: #34598f; }
.pub-content-preview-wechat[data-theme=purple] .pub-wechat-preview-title { color: #6b4c96; }
`;
		//#endregion
		//#region src/client/content-preview-style.ts
		/** Shared article, image-note and video preview styles for both client mounts. */
		const contentPreviewCss = `
.pub-content-preview-shell { --pub-border: var(--dsw-alias-border-l2, #e4e6e9); --pub-surface: var(--dsw-alias-bg-layer-1, #fff); --pub-soft: var(--dsw-alias-bg-module-platform, #f5f6f7); --pub-text: var(--dsw-alias-label-primary, #111318); --pub-secondary-text: var(--dsw-alias-label-secondary, #535961); box-sizing: border-box; }
.pub-content-preview-shell * { box-sizing: border-box; }
.pub-content-preview-shell[data-device=mobile] { max-width: 390px; }
.pub-content-preview-shell[data-device=pc] { width: 720px; max-width: none; border-radius: 8px; }
.pub-content-preview-image-error { padding: 8px; border: 1px solid #f2c7bc; border-radius: 8px; background: #fff5f4; color: #9b2219; font-size: 13px; text-align: center; overflow-wrap: anywhere; }
.pub-content-preview-shell { width: 100%; max-width: 460px; min-height: 500px; margin: 0 auto; padding: 26px 22px; border: 1px solid var(--pub-border); border-radius: 20px; background: var(--pub-surface); box-shadow: 0 12px 34px #0000000d; overflow-wrap: anywhere; }
.pub-content-preview-title { margin: 0 0 18px; color: var(--pub-text); font-size: 22px; line-height: 1.4; font-weight: 700; }
.pub-content-preview-kicker { margin: 0 0 14px; color: #64748b; font-size: 11px; font-weight: 700; letter-spacing: .08em; }
.pub-content-preview-cover { display: block; width: 100%; max-height: 320px; margin-bottom: 18px; border-radius: 12px; object-fit: cover; }
.pub-content-preview-unused { margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--pub-border); color: var(--pub-secondary-text); font-size: 13px; }
.pub-content-preview-unused summary { cursor: pointer; }
.pub-content-preview-note-images { display: grid; gap: 12px; margin: 12px 0 20px; }
.pub-content-preview-image { display: block; width: 100%; max-height: 560px; border-radius: 12px; object-fit: contain; background: var(--pub-soft); }
.pub-content-preview-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; color: var(--dsw-alias-state-business-primary, #4176e6); font-size: 13px; }
.pub-content-preview-text { white-space: pre-wrap; line-height: 1.7; }
.pub-preview-summary { margin: 15px auto 0; max-width: 460px; padding: 12px; border-radius: 8px; background: var(--pub-soft); color: var(--pub-secondary-text); font-size: 13px; line-height: 1.6; overflow-wrap: anywhere; }
.pub-preview-summary strong { color: var(--pub-text); }
.pub-content-preview-wechat { padding: 0; border-radius: 16px; background: #f3f5f7; color: #252b32; overflow: hidden; }
.pub-wechat-preview-bar { display: flex; align-items: center; gap: 9px; min-height: 50px; padding: 0 22px; border-bottom: 1px solid #e5e8eb; background: #fff; color: #57606a; font-size: 13px; font-weight: 600; }
.pub-wechat-preview-mark { width: 9px; height: 9px; border-radius: 50%; background: #07c160; }
.pub-wechat-preview-article { min-height: 380px; padding: 28px 22px 34px; background: #fff; }
.pub-wechat-preview-title { margin: 0 0 25px; color: #191919; font-size: 24px; line-height: 1.45; font-weight: 700; letter-spacing: .01em; }
.pub-wechat-preview-body { color: #252b32; font-size: 16px; line-height: 1.8; word-break: break-word; overflow-x: auto; }
.pub-wechat-preview-body .pub-wechat-markdown { background: transparent; white-space: normal; line-height: 1.8; }
.pub-wechat-preview-body .pub-wechat-markdown > :first-child { margin-top: 0; }
.pub-wechat-preview-body .pub-wechat-markdown p { margin: 0 0 16px; }
.pub-wechat-preview-body .pub-wechat-markdown h1 { margin: 24px 0 14px; color: #1f2937; font-size: 24px; line-height: 1.4; font-weight: 700; }
.pub-wechat-preview-body .pub-wechat-markdown h2 { margin: 22px 0 12px; color: #1f2937; font-size: 20px; line-height: 1.4; font-weight: 700; }
.pub-wechat-preview-body .pub-wechat-markdown :is(h3, h4, h5, h6) { margin: 20px 0 10px; color: #1f2937; font-size: 18px; line-height: 1.4; font-weight: 700; }
.pub-wechat-preview-body .pub-wechat-markdown blockquote { margin: 16px 0; padding: 8px 12px; border-left: 3px solid #2c78e4; background: #f5f8fc; color: #5b6472; }
.pub-wechat-preview-body .pub-wechat-markdown :is(ul, ol) { margin: 0 0 16px; padding-left: 24px; }
.pub-wechat-preview-body .pub-wechat-markdown li { margin: 0 0 6px; }
.pub-wechat-preview-body .pub-wechat-markdown a { color: #2c78e4; text-decoration: underline; }
.pub-wechat-preview-body .pub-wechat-markdown table { width: 100%; margin: 16px 0; border-collapse: collapse; }
.pub-wechat-preview-body .pub-wechat-markdown :is(th, td) { padding: 8px; border: 1px solid #dce3eb; }
.pub-wechat-preview-body .pub-wechat-markdown th { background: #f5f8fc; text-align: left; }
.pub-wechat-preview-body .pub-wechat-markdown hr { margin: 20px 0; border: 0; border-top: 1px solid #dce3eb; }
.pub-wechat-preview-body .pub-wechat-markdown img { display: block; width: 100%; max-width: 100%; height: auto; margin: 16px auto; }
.pub-wechat-preview-body .pub-wechat-markdown pre { margin: 16px 0; padding: 12px; background: #f5f8fc; white-space: pre-wrap; word-break: break-word; }
.pub-wechat-preview-body .pub-wechat-markdown code { padding: 2px 4px; background: #f5f8fc; color: #344054; font-family: monospace; font-size: 14px; }
.pub-wechat-preview-body .pub-wechat-markdown pre code { padding: 0; }
.pub-wechat-preview-body .pub-wechat-markdown .pub-wechat-preview-image-error { margin: 16px 0; padding: 9px 12px; border-left: 3px solid #d92d20; background: #fff5f4; color: #9b2219; font-size: 13px; }
.pub-wechat-preview-metadata { padding: 20px 22px 24px; border-top: 1px solid #e5e8eb; background: #f3f5f7; color: #57606a; font-size: 13px; line-height: 1.6; }
.pub-wechat-preview-metadata h3 { margin: 0 0 14px; color: #353b42; font-size: 14px; }
.pub-wechat-preview-cover-row { display: grid; grid-template-columns: 76px minmax(0, 1fr); align-items: center; gap: 13px; }
.pub-wechat-preview-cover { width: 76px; height: 76px; border-radius: 6px; object-fit: cover; }
.pub-wechat-preview-no-cover { display: grid; place-items: center; width: 76px; height: 76px; border: 1px dashed #cbd2da; border-radius: 6px; text-align: center; }
.pub-wechat-preview-cover-row strong, .pub-wechat-preview-summary strong { display: block; color: #353b42; }
.pub-wechat-preview-cover-row p { margin: 3px 0 0; }
.pub-wechat-preview-summary { margin: 16px 0 0; }
.pub-wechat-preview-unused { margin-top: 16px; }
.pub-wechat-preview-unused summary { cursor: pointer; }
.pub-wechat-preview-unused-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(76px, 1fr)); gap: 8px; margin-top: 10px; }
.pub-wechat-preview-unused-grid img { width: 100%; aspect-ratio: 1; border-radius: 6px; object-fit: cover; }
.pub-content-preview-shell .pub-preview { min-height: 0; padding: 0; border: 0; border-radius: 0; }
${imageNoteCarouselCss}
.pub-preview { min-height: 340px; padding: 14px; border: 1px solid var(--pub-border); border-radius: 9px; background: var(--pub-surface); line-height: 1.65; white-space: pre-wrap; overflow-wrap: anywhere; }
.pub-preview h1, .pub-preview h2, .pub-preview h3 { margin: 14px 0 8px; }
.pub-preview p { margin: 0 0 12px; }
.pub-preview code { padding: 1px 4px; border-radius: 4px; background: var(--dsw-alias-markdown-inline-code, #f4f4f5); }
.pub-preview pre { padding: 12px; overflow: auto; border-radius: 8px; background: var(--dsw-alias-markdown-code-block, #f9fafb); }
.pub-preview pre code { padding: 0; background: none; }
.pub-preview blockquote { margin: 8px 0; padding: 2px 12px; border-left: 3px solid var(--pub-border); color: var(--pub-secondary-text); }
.pub-preview hr { margin: 18px 0; border: 0; border-top: 1px solid var(--pub-border); }
.pub-wechat-preview-body.ebao-article-reader[data-theme=editorial] { padding: 18px 16px; }
.pub-content-preview-shell.ebao-article-reader[data-theme=editorial] { border-color: #c9ddd2; background: #fffdf8; }
.pub-content-preview-shell.ebao-article-reader[data-theme=editorial] .pub-content-preview-title { color: #214d42; padding-bottom: 16px; border-bottom: 1px solid #c9ddd2; }
${articlePreviewCss}

.pub-content-preview-video { min-height: 0; }
.pub-content-preview-video-source { margin: 0 0 14px; color: var(--pub-secondary-text); font-size: 13px; overflow-wrap: anywhere; }
.pub-content-preview-video-player { display: block; width: 100%; max-height: 420px; border-radius: 12px; background: #111; }
.pub-content-preview-video-error { margin: 0 0 16px; padding: 12px; border: 1px solid #f2c7bc; border-radius: 8px; background: #fff5f4; color: #9b2219; }
`;
		//#endregion
		//#region src/client/draft-gallery-style.ts
		/** Draft library cards share the publisher's color tokens and scroll container. */
		const draftGalleryCss = `
.pub-gallery { min-width: 0; }
.pub-gallery-toolbar { display: flex; align-items: center; gap: 12px; margin: 4px 0 22px; }
.pub-gallery-search { flex: 1 1 auto; max-width: 440px; min-width: 0; min-height: 36px; padding: 7px 11px; }
.pub-gallery-create { flex: none; min-height: 36px; padding: 7px 14px; border: 1px solid transparent; border-radius: 8px; background: var(--dsw-alias-button-primary-fill, #0f1115); color: var(--dsw-alias-label-primary-foreground, #fff); font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer; }
.pub-gallery-create:hover:not(:disabled) { background: var(--dsw-alias-button-primary-hover, #353638); }
.pub-gallery-create:disabled { opacity: .45; cursor: not-allowed; }
.pub-gallery-articles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.pub-gallery-masonry { display: grid; gap: 16px; align-items: start; }
.pub-gallery-cols-1 { grid-template-columns: minmax(0, 1fr); }
.pub-gallery-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.pub-gallery-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.pub-gallery-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.pub-gallery-column { display: flex; flex-direction: column; min-width: 0; gap: 16px; }
.pub-gallery-card { position: relative; min-width: 0; overflow: hidden; border: 1px solid var(--pub-border); border-radius: 13px; background: var(--pub-surface); box-shadow: 0 2px 9px #0000000a; transition: box-shadow .15s ease, transform .15s ease; }
.pub-gallery-card:hover, .pub-gallery-card:focus-within { box-shadow: 0 8px 24px #0000001a; }
.pub-gallery-card-social { width: 100%; }
.pub-gallery-open { display: block; width: 100%; padding: 0; border: 0; background: transparent; color: var(--pub-text); font: inherit; text-align: left; cursor: pointer; }
.pub-gallery-open:disabled { cursor: wait; }
.pub-gallery-media { position: relative; width: 100%; overflow: hidden; background: var(--pub-soft); }
.pub-gallery-card-article .pub-gallery-media { aspect-ratio: 2.18 / 1; }
.pub-gallery-card-social .pub-gallery-media { aspect-ratio: 3 / 4; }
.pub-gallery-card .pub-gallery-media > img, .pub-gallery-video-frame > video { width: 100%; height: 100%; object-fit: cover; }
.pub-gallery-card .pub-gallery-media > img { display: block; }
.pub-gallery-media-placeholder { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; min-height: 100%; background: linear-gradient(145deg, var(--pub-soft), color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 12%, var(--pub-soft))); color: var(--pub-secondary-text); font-size: 20px; font-weight: 600; letter-spacing: .1em; }
.pub-gallery-article-overlay { position: absolute; right: 0; bottom: 0; left: 0; padding: 40px 18px 16px; background: linear-gradient(transparent, #000a); color: #fff; font-size: 20px; font-weight: 600; line-height: 1.35; overflow-wrap: anywhere; }
.pub-gallery-card-article .pub-gallery-media:has(.pub-gallery-media-placeholder) .pub-gallery-article-overlay { background: linear-gradient(transparent, #0007); }
.pub-gallery-video-frame { position: absolute; inset: 0; }
.pub-gallery-video-frame > video { display: block; opacity: 0; }
.pub-gallery-video-frame > video.pub-gallery-video-ready { opacity: 1; }
.pub-gallery-video-frame > .pub-gallery-media-placeholder { position: absolute; inset: 0; }
.pub-gallery-play { position: absolute; top: 50%; left: 50%; display: grid; place-items: center; width: 48px; height: 48px; padding-left: 3px; border-radius: 50%; background: #0009; color: #fff; font-size: 18px; transform: translate(-50%, -50%); }
.pub-gallery-copy { min-width: 0; padding: 12px 15px 16px; }
.pub-gallery-copy .pub-gallery-title { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2; font-size: 15px; line-height: 1.45; overflow-wrap: anywhere; }
.pub-gallery-copy p { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2; margin: 4px 0 8px; color: var(--pub-secondary-text); font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; }
.pub-gallery-copy small { display: block; margin-top: 7px; color: var(--pub-tertiary-text); font-size: 12px; }
.pub-gallery-actions { position: absolute; z-index: 2; top: 10px; right: 10px; display: flex; gap: 4px; padding: 4px; border: 1px solid var(--pub-border); border-radius: 9px; background: var(--pub-surface); box-shadow: 0 4px 18px #0002; opacity: 0; transform: translateY(-4px); pointer-events: none; transition: opacity .15s ease, transform .15s ease; }
.pub-gallery-card:hover .pub-gallery-actions, .pub-gallery-card:focus-within .pub-gallery-actions, .pub-gallery-actions-open { opacity: 1; transform: none; pointer-events: auto; }
.pub-gallery-actions button { min-height: 30px; padding: 4px 9px; border: 0; border-radius: 6px; background: transparent; color: var(--pub-text); font: inherit; font-size: 12px; cursor: pointer; }
.pub-gallery-actions button:hover:not(:disabled) { background: var(--pub-soft); }
.pub-gallery-actions button:disabled { opacity: .45; cursor: not-allowed; }
.pub-gallery-actions .pub-gallery-delete { color: var(--dsw-alias-state-error-primary, #dc2626); }
.pub-gallery-more { position: absolute; z-index: 1; top: 10px; right: 10px; display: none; min-width: 36px; min-height: 34px; border: 1px solid var(--pub-border); border-radius: 8px; background: var(--pub-surface); color: var(--pub-text); font: inherit; font-size: 19px; line-height: 1; cursor: pointer; }
.pub-gallery-status { margin: 20px 0; color: var(--pub-tertiary-text); font-size: 13px; text-align: center; }
.pub-gallery-load-error { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px; color: var(--dsw-alias-state-error-primary, #dc2626); }
.pub-gallery-load-error button { padding: 5px 12px; border: 1px solid var(--pub-border); border-radius: 7px; background: var(--pub-surface); color: var(--pub-text); font: inherit; cursor: pointer; }
.pub-gallery-sentinel { height: 1px; }
@container (max-width: 700px) { .pub-gallery-articles { grid-template-columns: 1fr; } }
@container (max-width: 460px) { .pub-gallery-toolbar { align-items: stretch; gap: 8px; } .pub-gallery-create { padding-inline: 11px; white-space: nowrap; } .pub-gallery-article-overlay { font-size: 17px; } }
@media (hover: none) { .pub-gallery-more { display: block; } .pub-gallery-actions { top: 50px; } .pub-gallery-card:hover .pub-gallery-actions { opacity: 0; pointer-events: none; } .pub-gallery-card:focus-within .pub-gallery-actions, .pub-gallery-actions-open { opacity: 1; pointer-events: auto; } }
`;
		//#endregion
		//#region src/client/editor-layout.tsx
		/** Keep fields mounted when folded so unsaved values, uploads and focus targets survive. */
		function EditorSection({ title, hint, children, className = "", defaultOpen = false }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
				className: `pub-card pub-editor-section ${className}`,
				open: defaultOpen || void 0,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("summary", { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "pub-editor-section-title",
						children: title
					}),
					hint && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "pub-editor-section-hint",
						children: hint
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
						width: "16",
						height: "16",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "1.7",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m6 9 6 6 6-6" })
					})
				] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pub-editor-section-body",
					children
				})]
			});
		}
		/** A small native disclosure with ordinary tab stops, rather than a custom ARIA menu. */
		function EditorMoreMenu({ children }) {
			const ref = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				const outside = (event) => {
					if (ref.current?.open && event.target instanceof Node && !ref.current.contains(event.target)) ref.current.open = false;
				};
				const escape = (event) => {
					if (event.key !== "Escape" || !ref.current?.open) return;
					event.preventDefault();
					ref.current.open = false;
					ref.current.querySelector("summary")?.focus();
				};
				document.addEventListener("pointerdown", outside);
				document.addEventListener("keydown", escape);
				return () => {
					document.removeEventListener("pointerdown", outside);
					document.removeEventListener("keydown", escape);
				};
			}, []);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
				ref,
				className: "pub-editor-more",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("summary", {
					"aria-label": "更多操作",
					className: "pub-editor-more-trigger",
					children: ["更多", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "1.7",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m6 9 6 6 6-6" })
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pub-editor-more-panel",
					role: "group",
					"aria-label": "草稿操作",
					onClick: (event) => {
						const button = event.target instanceof Element ? event.target.closest("button") : null;
						if (!button || button.disabled || !ref.current) return;
						ref.current.open = false;
						ref.current.querySelector("summary")?.focus();
					},
					children
				})]
			});
		}
		const editorLayoutCss = `
.pub-grid.pub-editor-grid { grid-template-columns: minmax(0, 1fr) minmax(240px, 292px); align-items: start; gap: 20px; }
.pub-editor-main, .pub-editor-sidebar { min-width: 0; }
.pub-editor-main > .pub-card { padding: 22px 24px; }
.pub-editor-main > .pub-editor-preview { border: 0; border-radius: 0; background: transparent; box-shadow: none; }
.pub textarea.pub-input.pub-editor { min-height: clamp(360px, calc(100dvh - 310px), 720px) !important; }
.pub-editor-heading { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 18px; }
.pub-editor-heading h2 { margin: 0; }
.pub-editor-version-picker { display: flex; align-items: center; gap: 8px; color: var(--pub-secondary-text); font-size: 12px; }
.pub-editor-version-picker select { max-width: 210px; padding: 5px 8px; border: 1px solid var(--pub-border); border-radius: 7px; background: var(--pub-surface); color: var(--pub-text); font: inherit; }
.pub-editor-sidebar .pub-article-theme-control { grid-template-columns: minmax(0, 1fr); }
.pub-editor-sidebar .pub-version-tabs { flex-wrap: wrap; overflow: visible; }
.pub-grid.pub-video-editor-main { width: 100%; max-width: none; }
.pub-card .pub-video-source-picker { margin: 12px 0 0; border-radius: 8px; }
.pub-video-source-picker .pub-editor-section-body > h3:first-child { margin-top: 0; }
.pub-editor-sidebar .pub-source-card { border-radius: 12px; margin-bottom: 12px; }
.pub-card.pub-editor-section { padding: 0; margin-bottom: 12px; border-radius: 12px; }
.pub-editor-section > summary { display: flex; align-items: center; gap: 10px; min-height: 56px; padding: 14px 16px; list-style: none; cursor: pointer; border-radius: inherit; }
.pub-editor-section > summary::-webkit-details-marker, .pub-editor-more > summary::-webkit-details-marker { display: none; }
.pub-editor-section > summary:hover { background: var(--pub-soft); }
.pub-editor-section-title { flex: 0 0 auto; font-size: 13px; font-weight: 600; }
.pub-editor-section-hint { flex: 1; min-width: 0; color: var(--pub-tertiary-text); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: right; }
.pub-editor-section > summary > svg { flex: none; margin-left: auto; color: var(--pub-tertiary-text); transition: transform .15s; }
.pub-editor-section[open] > summary > svg { transform: rotate(180deg); }
.pub-editor-section[open] > summary { border-bottom: 1px solid var(--pub-border); border-radius: 12px 12px 0 0; }
.pub-editor-section-body { padding: 16px; min-width: 0; }
.pub-editor-section-body > .pub-card { padding: 0; margin: 0; border: 0; border-radius: 0; }
.pub-editor-section-body > .pub-card > h2 { display: none; }
.pub-editor-section-body .pub-field:last-child { margin-bottom: 0; }
.pub-editor-section-body .pub-actions:first-child { margin-top: 0; }
.pub-editor-section-body .pub-version-tabs { gap: 6px; }
.pub-editor-help { margin-top: 12px; color: var(--pub-secondary-text); font-size: 12px; }
.pub-editor-help > summary { cursor: pointer; }
.pub-editor-help > p { margin-bottom: 0; }
.pub-editor-more { position: relative; }
.pub-editor-more-trigger { display: flex; align-items: center; justify-content: center; gap: 6px; min-height: 32px; padding: 5px 11px; border: 1px solid var(--pub-border); border-radius: 8px; background: var(--pub-surface); font: inherit; font-size: 12px; list-style: none; cursor: pointer; }
.pub-editor-more-trigger:hover, .pub-editor-more[open] > summary { background: var(--pub-soft); }
.pub-editor-more-panel { position: absolute; z-index: 15; top: calc(100% + 6px); right: 0; display: flex; flex-direction: column; gap: 4px; width: max-content; min-width: 170px; max-width: min(280px, calc(100vw - 48px)); padding: 6px; border: 1px solid var(--pub-border); border-radius: 10px; background: var(--pub-surface); box-shadow: 0 8px 24px #00000012; }
.pub-editor-more-panel > button { justify-content: flex-start; text-align: left; width: 100%; border-color: transparent; }
.pub-editor-section > summary:focus-visible, .pub-editor-more > summary:focus-visible, .pub-editor-help > summary:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary, #4176e6); outline-offset: 2px; }
@container (max-width: 980px) {
  .pub-grid.pub-editor-grid { grid-template-columns: minmax(0, 1fr); }
  .pub-editor-main > .pub-card { padding: 18px; }
  .pub textarea.pub-input.pub-editor { min-height: clamp(300px, calc(100dvh - 540px), 440px) !important; }
  .pub-editor-sidebar { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .pub-editor-sidebar > .pub-card { margin-bottom: 0; }
  .pub-editor-sidebar > details[open] { grid-column: 1 / -1; }
}
@container (max-width: 560px) { .pub-editor-sidebar { grid-template-columns: minmax(0, 1fr); } }
@media (prefers-reduced-motion: reduce) { .pub-editor-section > summary > svg { transition: none; } }
`;
		//#endregion
		//#region src/submission-display.ts
		const TOUTIAO_INFORMATION = /* @__PURE__ */ new Set([
			"独立摘要不会写入头条文章",
			"独立摘要未写入平台文章",
			"文章标签暂不写入该平台",
			"头条文章适配器暂不写入摘要；摘要仍保留在本地草稿",
			"该平台文章适配器暂不写入标签；标签仍保留在本地草稿"
		]);
		const STATE_LABELS = {
			queued: "等待执行",
			running: "执行中",
			unknown: "结果待确认",
			completed: "已完成",
			failed: "执行失败"
		};
		function isToutiaoOnly(platforms) {
			return platforms.length > 0 && platforms.every((platform) => platform === "tt");
		}
		function isOperationTimeout(message) {
			return typeof message === "string" && /(?:waiting failed|timed?\s*out|timeout|超时)/iu.test(message);
		}
		function displayAdjustmentMessage(platform, message) {
			if (platform !== "tt") return message;
			if (TOUTIAO_INFORMATION.has(message)) return void 0;
			if (message === "正文图片会在原位置保留占位，请在头条草稿中手动上传") return "正文图片会在原位置保留占位，请从发布历史打开头条草稿手动补图";
			if (message === "封面需在头条草稿中手动设置") return "封面需手动设置，请从发布历史打开头条草稿";
			const imageCount = /^头条正文已保留 (\d+) 处(?:无法自动上传的)?图片占位，请在草稿窗口手动上传$/u.exec(message)?.[1];
			if (imageCount) return `头条正文已保留 ${imageCount} 处图片占位，请从发布历史打开草稿手动补图`;
			if (message === "头条封面不会自动上传，请在草稿窗口手动设置") return "头条封面需手动设置，请从发布历史打开草稿";
			if (message === "已以首张图片作为头条封面参考") return "已以首张图片作为头条封面参考，请从发布历史打开草稿手动设置";
			return message;
		}
		function displayArticleWarnings(warnings) {
			return warnings.flatMap((warning) => {
				if (!warning.startsWith("头条：")) return [warning];
				const message = displayAdjustmentMessage("tt", warning.slice(3));
				return message ? [`头条：${message}`] : [];
			});
		}
		function submissionStateLabel(submission) {
			if (!submission.state) return "";
			if (submission.state === "unknown" && isToutiaoOnly(submission.targets.map((target) => target.platform))) return "未完成";
			return STATE_LABELS[submission.state];
		}
		function projectSubmissionForDisplay(submission) {
			const onlyToutiao = isToutiaoOnly(submission.targets.map((target) => target.platform));
			let message = submission.message;
			if (onlyToutiao) {
				if (submission.state === "unknown" || submission.state === "failed") {
					if (isOperationTimeout(message)) message = "操作超时，任务未完成";
					else if (submission.state === "unknown") message = "任务未完成，请从发布历史打开平台稿件核对";
				}
				if (message) message = message.split(/[；;。\n]/u).filter((part) => !/(?:保留.*窗口|窗口.*保留|账号.*锁定|关闭前.*账号.*不能.*提交|account.*lock|(?:摘要|标签).*(?:跳过|不写入|未写入|不会写入)|(?:跳过|不写入|未写入).*(?:摘要|标签))/iu.test(part)).join("；") || void 0;
			}
			const adjustments = submission.adjustments?.flatMap((adjustment) => {
				const platform = submission.targets.find((target) => target.accountId === adjustment.accountId)?.platform;
				const messages = adjustment.messages.flatMap((text) => {
					const display = displayAdjustmentMessage(platform, text);
					return display ? [display] : [];
				});
				return messages.length ? [{
					...adjustment,
					messages
				}] : [];
			});
			return {
				...submission,
				message,
				adjustments
			};
		}
		//#endregion
		//#region src/client/shared.tsx
		const STATEMENT_LABELS = {
			none: "不声明",
			ai_generated: "内容由 AI 生成",
			fiction: "虚构演绎，仅供娱乐",
			marketing: "营销推广",
			personal_opinion: "个人观点，仅供参考",
			repost: "转载",
			self_made_no_repost: "自制，禁止转载（仅哔哩哔哩）"
		};
		const CONTENT_LABELS = {
			article: "文章",
			"image-note": "图文",
			video: "视频"
		};
		async function api(action, data, signal) {
			const response = await fetch(`${API}/${action}`, data === void 0 ? { signal } : {
				method: "POST",
				headers: {
					"content-type": "application/json",
					"x-ejianbao": "1"
				},
				body: JSON.stringify(data),
				signal
			});
			if (!response.headers.get("content-type")?.includes("application/json")) throw new Error("多平台发布服务暂未就绪，请稍候或重启应用");
			const result = await response.json();
			if (!response.ok) throw new Error(result.error || "请求失败");
			return result;
		}
		async function uploadAsset(contentId, file) {
			if (file.size > 20 * 1024 * 1024) throw new Error("单张图片不能超过 20MB");
			const response = await fetch(`${API}/content-asset-upload/${contentId}`, {
				method: "POST",
				headers: {
					"x-ejianbao": "1",
					"x-publisher-file-name": encodeURIComponent(file.name),
					"content-type": "application/octet-stream"
				},
				body: file
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.error || "上传素材失败");
			return result;
		}
		function capabilityMessage(capability) {
			if (capability === void 0) return "正在检查发布能力…";
			if (capability.supported) return "";
			return capability.message || "当前设备不支持多平台发布";
		}
		function errorMessage(cause) {
			return cause instanceof Error ? cause.message : "操作失败";
		}
		function ConfirmDialog({ contentType, title, sourceName, mode, accounts, targetTitles, targetSummaries, warnings, onCancel, onConfirm, busy }) {
			const submitting = (0, react.useRef)(false);
			const visibleWarnings = displayArticleWarnings(warnings ?? []);
			(0, react.useEffect)(() => {
				if (!busy) submitting.current = false;
			}, [busy]);
			const close = () => {
				if (!busy && !submitting.current) onCancel();
			};
			const submit = () => {
				if (busy || submitting.current || accounts.length === 0) return;
				submitting.current = true;
				onConfirm();
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(PublisherModal, {
				open: true,
				title: mode === "publish" ? "确认发布" : "确认转存草稿",
				closeLabel: "关闭",
				onClose: close,
				className: "pub-modal",
				contentClassName: "pub-modal-content",
				footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					variant: "outline",
					size: "sm",
					"data-pub-initial-focus": true,
					disabled: busy,
					onClick: close,
					children: "返回修改"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					variant: "primary",
					size: "sm",
					disabled: busy || accounts.length === 0,
					onClick: submit,
					children: busy ? "正在校验并提交…" : `确认${mode === "publish" ? "发布" : "转存草稿"} · ${accounts.length} 个账号`
				})] }),
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("dl", {
						className: "pub-modal-summary",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: "内容类型" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: CONTENT_LABELS[contentType] })] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: "标题" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: title })] }),
							sourceName && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: "视频来源" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: sourceName })] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: "提交方式" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: mode === "publish" ? "立即发布" : "转存草稿" })] })
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-modal-target-title",
						children: [
							"目标账号 · ",
							accounts.length,
							" 个"
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
						className: "pub-modal-accounts",
						children: accounts.map((account) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
							tone: "neutral",
							children: PLATFORM_LABELS[account.platform]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [account.displayName, targetTitles?.[account.id] && targetTitles[account.id] !== title ? ` · ${targetTitles[account.id]}` : ""] })] }, account.id))
					}),
					accounts.some((account) => targetSummaries?.[account.id]) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dl", {
						className: "pub-modal-summary",
						style: { marginTop: 16 },
						children: accounts.filter((account) => targetSummaries?.[account.id]).map((account) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("dt", { children: [PLATFORM_LABELS[account.platform], "摘要"] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: targetSummaries[account.id] })] }, account.id))
					}),
					!!visibleWarnings.length && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
						className: "pub-modal-copy",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("summary", { children: [
								"平台调整说明 · ",
								visibleWarnings.length,
								" 项"
							] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "平台稿件将按以下说明调整，转存草稿后请核对：" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
								className: "pub-modal-accounts",
								children: visibleWarnings.map((warning) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: warning }, warning))
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-modal-copy",
						children: "提交后请自行前往各平台后台确认结果。"
					})
				]
			});
		}
		const PublisherModalParent = (0, react.createContext)(null);
		const publisherModalLayers = /* @__PURE__ */ new WeakMap();
		function modalDescendsFrom(layer, ancestor) {
			for (let parent = layer.parent; parent; parent = parent.parent) if (parent === ancestor) return true;
			return false;
		}
		/** The upstream Modal supplies the shell; only the foreground Publisher modal owns focus. */
		function PublisherModal(props) {
			const marker = `pub-focus-${(0, react.useId)().replace(/[^a-z0-9_-]/giu, "")}`;
			const parent = (0, react.useContext)(PublisherModalParent);
			const layer = (0, react.useRef)({ parent }).current;
			const composition = (0, react.useRef)();
			const beforeOpen = typeof document !== "undefined" && document.activeElement instanceof HTMLElement ? document.activeElement : null;
			(0, react.useLayoutEffect)(() => {
				if (!props.open) return;
				const dialog = document.getElementsByClassName(marker)[0];
				if (!dialog) return;
				const owner = dialog.ownerDocument;
				const keyboardComposition = (0, _deepseek_ai_dsh_client_ui_primitives.observeComposition)(owner);
				composition.current = keyboardComposition;
				const stack = publisherModalLayers.get(owner) ?? [];
				publisherModalLayers.set(owner, stack);
				layer.parent = parent;
				layer.dialog = dialog;
				layer.previous = beforeOpen;
				const descendant = stack.findIndex((other) => modalDescendsFrom(other, layer));
				if (descendant < 0) stack.push(layer);
				else stack.splice(descendant, 0, layer);
				const isTop = () => stack.at(-1) === layer;
				const focusable = () => Array.from(dialog.querySelectorAll("button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex=\"-1\"])")).filter((element) => !element.closest("[hidden], [inert], [aria-hidden=\"true\"]") && element.getClientRects().length > 0);
				const enter = () => {
					const items = focusable();
					(items.find((element) => element.hasAttribute("data-pub-initial-focus")) ?? items[0] ?? dialog).focus();
				};
				const onFocusIn = (event) => {
					if (!isTop()) return;
					if (dialog.contains(event.target)) layer.lastFocused = event.target;
					else if (layer.lastFocused && focusable().includes(layer.lastFocused)) layer.lastFocused.focus();
					else enter();
				};
				owner.addEventListener("focusin", onFocusIn);
				if (isTop()) enter();
				const onKeyDown = (event) => {
					if (!isTop() || event.defaultPrevented || event.key !== "Tab" || event.target instanceof Element && event.target.closest("[role=\"menu\"]")) return;
					const elements = focusable();
					if (elements.length === 0) {
						event.preventDefault();
						dialog.focus();
						return;
					}
					const first = elements[0];
					const last = elements[elements.length - 1];
					if (event.shiftKey && (owner.activeElement === first || !dialog.contains(owner.activeElement))) {
						event.preventDefault();
						last.focus();
					} else if (!event.shiftKey && (owner.activeElement === last || !dialog.contains(owner.activeElement))) {
						event.preventDefault();
						first.focus();
					}
				};
				owner.addEventListener("keydown", onKeyDown, true);
				return () => {
					keyboardComposition.dispose();
					if (composition.current === keyboardComposition) composition.current = void 0;
					owner.removeEventListener("keydown", onKeyDown, true);
					owner.removeEventListener("focusin", onFocusIn);
					const wasTop = isTop();
					stack.splice(stack.indexOf(layer), 1);
					if (!stack.length) publisherModalLayers.delete(owner);
					if (!wasTop) return;
					const upper = stack.at(-1);
					if (upper) ([layer.previous, upper.lastFocused].find((item) => item?.isConnected && upper.dialog?.contains(item) && !item.matches(":disabled") && !item.closest("[hidden], [inert], [aria-hidden=\"true\"]") && item.getClientRects().length > 0) ?? upper.dialog)?.focus();
					else {
						let outer = layer;
						while (outer.parent && !stack.includes(outer.parent)) outer = outer.parent;
						if (outer.previous?.isConnected) outer.previous.focus();
					}
				};
			}, [props.open, marker]);
			const isTop = () => !!layer.dialog && publisherModalLayers.get(layer.dialog.ownerDocument)?.at(-1) === layer;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherModalParent.Provider, {
				value: layer,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
					...props,
					onClose: () => {
						if (isTop()) props.onClose();
					},
					onKeyDownCapture: (event) => {
						if (!isTop()) return;
						const composing = composition.current?.guards(event.nativeEvent) ?? event.nativeEvent.isComposing;
						props.onKeyDownCapture?.(event);
						if (!isTop() || event.defaultPrevented || composing || event.key !== "Escape" || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return;
						event.preventDefault();
						event.stopPropagation();
						if (!event.repeat) props.onClose();
					},
					className: `${props.className ?? ""} ${marker}`
				})
			});
		}
		function PlatformAccountSelect({ idPrefix, platform, accounts, value, onChange, initialFocus }) {
			const id = `pub-target-${idPrefix}-${platform}`;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "pub-platform",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
					htmlFor: id,
					children: PLATFORM_LABELS[platform]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
					className: "pub-input",
					id,
					"data-pub-initial-focus": initialFocus ? "" : void 0,
					value,
					onChange: (event) => onChange(event.target.value),
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
						value: "",
						children: "不发布"
					}), accounts.filter((account) => account.platform === platform).map((account) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
						value: account.id,
						children: [account.displayName, account.loginState === "logged-in" ? "" : "（需检查登录）"]
					}, account.id))]
				})]
			});
		}
		const css = `
.pub-surface { display: flex; height: 100%; min-height: 0; min-width: 0; overflow: hidden; container: publisher-surface / inline-size; }
.pub-surface > .pub { flex: 1; min-width: 0; }
.pub-agent-panel { display: flex; flex-direction: column; flex: 0 0 var(--pub-agent-width, clamp(320px, 34%, 440px)); min-height: 0; min-width: 0; overflow: hidden; background: var(--dsw-alias-bg-base, #fff); color: var(--dsw-alias-label-primary, #111318); }
.pub-agent-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 16px; border-bottom: 1px solid var(--dsw-alias-border-l2, #e4e6e9); font-family: var(--dsw-font-family, inherit); font-size: 13px; }
.pub-agent-header button { display: grid; place-items: center; width: 30px; height: 30px; padding: 0; border: 0; border-radius: 6px; background: transparent; color: inherit; font: inherit; font-size: 20px; cursor: pointer; }
.pub-agent-header button:hover { background: var(--dsw-alias-bg-module-platform, #f5f6f7); }
.pub-agent-header button:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary, #4176e6); outline-offset: 2px; }
.pub-agent-conversation { display: flex; flex: 1; min-height: 0; min-width: 0; overflow: hidden; }
.pub-agent-history { display: flex; flex-direction: column; flex: 1 0 auto; min-height: 0; }
.pub-agent-shortcuts { display: flex; flex-direction: column; gap: 10px; width: min(100%, 380px); box-sizing: border-box; margin: auto; padding: 24px 20px; font-family: var(--dsw-font-family, inherit); }
.pub-agent-shortcuts-hint { margin: 0 0 6px; color: var(--dsw-alias-label-tertiary, #777d85); font-size: 12px; line-height: 1.5; }
.pub-agent-shortcut { display: flex; align-items: center; gap: 12px; min-height: 64px; padding: 12px 14px; border: 1px solid var(--dsw-alias-border-l2, #e4e6e9); border-radius: 12px; background: var(--dsw-alias-bg-base, #fff); color: inherit; font: inherit; text-align: left; cursor: pointer; }
.pub-agent-shortcut:hover { background: var(--dsw-alias-bg-module-platform, #f5f6f7); }
.pub-agent-shortcut:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary, #4176e6); outline-offset: 2px; }
.pub-agent-shortcut-icon { display: flex; flex: 0 0 auto; color: var(--dsw-alias-label-secondary, #535961); }
.pub-agent-shortcut-copy { display: flex; flex: 1; flex-direction: column; gap: 4px; min-width: 0; font-size: 13px; line-height: 1.4; }
.pub-agent-shortcut-copy small { color: var(--dsw-alias-label-tertiary, #777d85); font-size: 11px; }
.pub-agent-shortcut-arrow { color: var(--dsw-alias-label-tertiary, #777d85); font-size: 15px; }
.pub-agent-shortcuts-error { margin: 4px 20px 12px; color: var(--dsw-alias-state-error-primary, #dc2626); font-size: 12px; }
.pub-agent-conversation [data-conversation-content] { flex: 1; min-height: 0; min-width: 0; }
@container publisher-surface (max-width: 760px) {
  .pub-agent-panel { flex-basis: var(--pub-agent-width, 280px); }
}
@container publisher-surface (max-width: 620px) {
  .pub-agent-panel { position: absolute; inset: 0; z-index: 5; border-right: 0; }
}
.pub-surface { position: relative; }
.pub {
  --pub-bg: var(--dsw-alias-bg-base, #fff);
  --pub-surface: var(--dsw-alias-bg-layer-1, #fff);
  --pub-soft: var(--dsw-alias-bg-module-platform, #f5f6f7);
  --pub-text: var(--dsw-alias-label-primary, #111318);
  --pub-secondary-text: var(--dsw-alias-label-secondary, #535961);
  --pub-tertiary-text: var(--dsw-alias-label-tertiary, #777d85);
  --pub-border: var(--dsw-alias-border-l2, #e4e6e9);
  height: 100%; overflow: auto; container-type: inline-size; box-sizing: border-box;
  background: var(--pub-bg); color: var(--pub-text); font-family: var(--dsw-font-family, inherit);
  font-size: 14px; line-height: 1.55;
}
.pub * { box-sizing: border-box; }
.pub :is(.pub-page-link, .pub-type, .pub-work) { font-family: inherit; }
.pub .pub-input { font: inherit; }
.pub :is(.pub-page-link, .pub-type, .pub-work) { cursor: pointer; }
.pub :is(.pub-page-link, .pub-type, .pub-work):disabled { opacity: .4; cursor: not-allowed; }
.pub :is(button, input, textarea, select):focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary, #4176e6); outline-offset: 2px; }
.pub-wrap { max-width: 1200px; margin: auto; padding: 32px 36px 56px; }
.pub [hidden] { display: none !important; }
.pub[data-editor-open=true] .pub-wrap { max-width: none; padding: 22px 24px 40px; }
.pub-gallery-restore { margin: 0 16px 16px; padding: 8px 14px; border: 1px solid var(--pub-border); border-radius: 8px; background: var(--pub-surface); color: var(--pub-text); cursor: pointer; }
.pub-gallery-restore:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
.pub-gallery-quick-actions { display: flex; gap: 8px; margin: 0 16px 12px; }
.pub-gallery-quick-actions button { min-height: 30px; padding: 4px 12px; border: 1px solid var(--pub-border); border-radius: 8px; background: var(--pub-surface); color: var(--pub-secondary-text); cursor: pointer; }
.pub-gallery-quick-actions button:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
.pub-gallery-publication { display: inline-block; margin-top: 6px; padding: 3px 7px; border-radius: 5px; background: var(--pub-soft); color: var(--pub-secondary-text); font-size: 12px; line-height: 1.4; }
.pub-gallery-pending { display: block; margin-top: 6px; color: var(--dsw-alias-state-error-primary, #dc2626); font-size: 12px; line-height: 1.5; }
.pub-gallery-restore:disabled, .pub-gallery-quick-actions button:disabled { opacity: .45; cursor: not-allowed; }
.pub-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 24px; }
.pub-head h1 { margin: 0 0 7px; font-size: 24px; line-height: 1.35; font-weight: 600; letter-spacing: -.02em; }
.pub-head h2 { margin: 0 0 6px; font-size: 18px; line-height: 1.4; font-weight: 600; }
.pub-head > .pub-actions { margin-top: 0; }
.pub-head > .pub-actions > select.pub-input { width: auto; min-width: 160px; }
.pub-history-head { display: block; }
.pub-history-head > .pub-history-tools { justify-content: flex-start; margin-top: 14px; }
.pub-history-search { flex: 0 1 320px; min-width: 180px; }
.pub-muted { color: var(--pub-tertiary-text); font-size: 13px; line-height: 1.65; }
.pub-page-nav { display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: 4px; margin-left: auto; }
.pub-page-link { flex: 0 0 auto; min-height: 32px; padding: 5px 10px; border: 0; border-radius: 16px; background: transparent; color: var(--pub-secondary-text); font-size: 13px; font-weight: 500; white-space: nowrap; }
.pub-page-link:hover { background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); color: var(--pub-text); }
.pub-page-link[aria-current=page] { background: var(--dsw-specific-sidebar-nav-item-active, #edf0f3); color: var(--pub-text); font-weight: 600; }
.pub-layout { display: block; min-width: 0; }
.pub-content-panels { min-width: 0; }
.pub-type-nav { display: flex; align-items: stretch; gap: 28px; width: 100%; margin-bottom: 18px; border-bottom: 1px solid var(--pub-border); }
.pub-type { flex: 0 0 auto; min-height: 34px; padding: 0 0 6px; text-align: center; white-space: nowrap; border: 0; border-bottom: 2px solid transparent; border-radius: 0; background: transparent; color: var(--pub-secondary-text); font-size: 13px; font-weight: 500; }
.pub-type:hover { color: var(--pub-text); }
.pub-type[aria-selected=true] { border-bottom-color: var(--dsw-alias-state-business-primary, #4176e6); color: var(--dsw-alias-state-business-primary, #4176e6); font-weight: 600; }
.pub-grid { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(280px, .85fr); gap: 18px; }
.pub-grid > div { min-width: 0; }
.pub-video-editor-main { width: 100%; max-width: 840px; }
.pub-card { min-width: 0; padding: 20px; margin-bottom: 18px; border: 1px solid var(--pub-border); border-radius: 16px; background: var(--pub-surface); }
.pub-card h2 { margin: 0 0 16px; font-size: 15px; line-height: 22px; font-weight: 600; }
.pub-card h3 { margin: 18px 0 10px; color: var(--pub-secondary-text); font-size: 13px; font-weight: 600; }
.pub-card h2 + h3 { margin-top: 0; }
.pub-field { margin-bottom: 16px; }
.pub-field label { display: block; margin-bottom: 7px; color: var(--pub-secondary-text); font-size: 13px; font-weight: 500; }
.pub-input { width: 100%; min-height: 36px; padding: 8px 11px; border: 1px solid var(--pub-border); border-radius: 8px; outline: none; background: var(--pub-surface); color: var(--pub-text); }
.pub-input-wrap, .pub-text-input { width: 100%; min-width: 0; }
.pub-input::placeholder { color: var(--pub-tertiary-text); }
.pub-input:focus { border-color: var(--dsw-alias-state-business-primary, #4176e6); }
.pub textarea.pub-input { min-height: 110px; resize: vertical; line-height: 1.65; }
.pub-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
.pub-error { padding: 12px 14px; margin-bottom: 16px; border: 1px solid var(--pub-border); border-radius: 10px; background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #dc2626) 8%, var(--pub-surface)); color: var(--dsw-alias-state-error-primary, #dc2626); font-size: 13px; line-height: 1.6; }
.pub-tip { position: fixed; z-index: 1100; top: 24px; left: 50%; transform: translateX(-50%); width: max-content; max-width: min(480px, calc(100vw - 32px)); padding: 12px 16px; border: 1px solid var(--pub-border); border-radius: 12px; background: var(--dsw-alias-bg-layer-2, var(--pub-surface)); box-shadow: var(--dsw-elevation-prominent, 0 14px 36px #0003); color: var(--pub-text); font-size: 13px; line-height: 1.6; text-align: center; overflow-wrap: anywhere; pointer-events: none; }
.pub-tip-success { border-color: var(--dsw-alias-state-success-primary, #16a34a); }
.pub-tip-error { border-color: var(--dsw-alias-state-error-primary, #dc2626); }
.pub-empty { padding: 30px 16px; border: 1px dashed var(--pub-border); border-radius: 10px; background: var(--pub-soft); color: var(--pub-tertiary-text); font-size: 13px; line-height: 1.8; text-align: center; }
.pub-submission strong, .pub-work strong { overflow-wrap: anywhere; }
.pub-status { white-space: nowrap; }
.pub-account-layout { grid-template-columns: minmax(0, 1.4fr) minmax(320px, .85fr); }
.pub-account-list-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 0 0 14px; }
.pub-account-list-head h2 { margin: 0; font-size: 18px; font-weight: 600; }
.pub-account-list-head p { margin: 2px 0 0; }
.pub-account-cards { display: grid; gap: 12px; }
.pub-account-card { min-width: 0; padding: 17px 18px 14px; border: 1px solid var(--pub-border); border-radius: 14px; background: var(--pub-surface); }
.pub-account-card-head { display: grid; grid-template-columns: 44px minmax(0, 1fr) auto; align-items: center; gap: 12px; min-width: 0; }
.pub-account-icon { width: 44px; height: 44px; }
.pub-account-identity { display: grid; gap: 3px; min-width: 0; }
.pub-account-identity strong { color: var(--pub-text); font-size: 15px; font-weight: 600; line-height: 1.35; overflow-wrap: anywhere; }
.pub-account-identity span { color: var(--pub-tertiary-text); font-size: 12px; line-height: 1.5; overflow-wrap: anywhere; }
.pub-account-card .pub-status { align-self: start; }
.pub-account-error { margin: 12px 0 0 56px; color: var(--dsw-alias-state-error-primary, #dc2626); font-size: 12px; line-height: 1.5; overflow-wrap: anywhere; }
.pub-account-card-actions { display: flex; flex-wrap: wrap; gap: 8px; min-width: 0; margin-top: 15px; padding-top: 12px; border-top: 1px solid var(--pub-border); }
.pub-account-card-actions > :last-child { margin-left: auto; }
.pub-warn { color: var(--dsw-alias-state-warn-label, #b7790a); }
.pub-platform { display: grid; grid-template-columns: 95px minmax(0, 1fr); align-items: center; gap: 12px; margin-bottom: 12px; }
.pub-platform label { color: var(--pub-secondary-text); font-size: 13px; }
.pub-work { display: block; width: 100%; padding: 10px; margin-bottom: 9px; border: 1px solid var(--pub-border); border-radius: 10px; background: var(--pub-surface); color: var(--pub-text); font-size: 13px; text-align: left; }
.pub-work:hover { background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); }
.pub-work[aria-pressed=true] { border-color: var(--dsw-alias-state-business-primary, #4176e6); background: var(--dsw-alias-state-business-tertiary, #edf3fe); }
.pub-work strong, .pub-work small { display: block; }
.pub-work small { margin-top: 5px; color: var(--pub-tertiary-text); }
.pub-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
.pub-mode { display: flex; gap: 10px; }
.pub-mode label { flex: 1; padding: 12px; border: 1px solid var(--pub-border); border-radius: 10px; font-size: 13px; cursor: pointer; }
.pub-mode label:has(input:checked) { border-color: var(--dsw-alias-state-business-primary, #4176e6); background: var(--dsw-alias-state-business-tertiary, #edf3fe); }
.pub-mode input { margin-right: 7px; accent-color: var(--dsw-alias-state-business-primary, #4176e6); }
.pub-submit { width: 100%; min-height: 36px; }
.pub-submission { padding: 14px 0; border-bottom: 1px solid var(--pub-border); }
.pub-submission:last-child { border-bottom: 0; }
.pub-submission-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; min-width: 0; }
.pub-submission-head > div { min-width: 0; }
.pub-submission-head strong { display: block; }
.pub-submission-head small { display: block; margin-top: 4px; }
.pub-history-result { margin: 6px 0 0; overflow-wrap: anywhere; }
.pub-history-pagination { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.pub-history-page-actions { display: flex; gap: 8px; }
.pub-history-acknowledge { display: flex; align-items: flex-start; gap: 8px; margin-top: 14px; color: var(--dsw-alias-label-primary); font-size: 13px; line-height: 1.5; cursor: pointer; }
.pub-history-acknowledge input { flex: none; margin: 3px 0 0; accent-color: var(--dsw-alias-state-business-primary, #4176e6); }
.pub-targets { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 9px; }
.pub-target-group { display: inline-flex; flex-wrap: wrap; gap: 6px; padding: 4px; border: 1px solid var(--pub-border); border-radius: 8px; }
.pub-import { margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--pub-border); }
.pub-count { margin-right: 8px; color: var(--dsw-alias-state-business-primary, #4176e6); font: 12px var(--ds-font-family-code, monospace); letter-spacing: .04em; }
.pub-modal, .pub-modal-account { width: min(480px, 100%); max-height: min(90vh, 640px); color: var(--dsw-alias-label-primary); }
.pub-publish-modal { width: min(560px, 100%); max-height: min(90vh, 720px); }
.pub-publish-fields { min-width: 0; margin: 0; padding: 0; border: 0; }
.pub-publish-fields h3 { margin: 0 0 12px; font-size: 14px; font-weight: 600; }
.pub-publish-fields h3:not(:first-child) { margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--pub-border); }
.pub-modal-content { min-height: 0; overflow-y: auto; }
.pub-modal-summary { display: grid; gap: 10px; margin: 0 0 18px; }
.pub-modal-summary > div { display: grid; grid-template-columns: 78px minmax(0, 1fr); gap: 10px; }
.pub-modal-summary dt, .pub-modal-target-title, .pub-modal-label { color: var(--dsw-alias-label-secondary); font-size: 13px; }
.pub-modal-summary dd { min-width: 0; margin: 0; overflow-wrap: anywhere; }
.pub-modal-target-title { margin-bottom: 8px; }
.pub-modal-accounts { display: grid; gap: 8px; max-height: 180px; margin: 0; padding: 0; overflow-y: auto; list-style: none; }
.pub-modal-accounts li { display: flex; align-items: center; gap: 8px; min-width: 0; }
.pub-modal-accounts li span:last-child { overflow-wrap: anywhere; }
.pub-modal-copy { margin: 16px 0 0; color: var(--dsw-alias-label-secondary); font-size: 13px; line-height: 1.6; }
.pub-modal-field { display: grid; gap: 8px; min-width: 0; }
.pub-modal-field > :last-child { width: 100%; }
.pub-danger-action { color: var(--dsw-alias-state-error-primary) !important; }
.pub-danger-action:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover-danger) !important; }
.pub-modal :is(button, input):focus-visible, .pub-modal-account :is(button, input):focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
.pub-editor-bar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 18px; }
.pub-editor-status { color: var(--pub-tertiary-text); font-size: 12px; }
.pub-editor-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-left: auto; }
.pub-editor-view-switch { display: inline-flex; align-items: center; padding: 2px; border: 1px solid var(--pub-border); border-radius: 9px; background: var(--pub-soft); }
.pub-editor-view-switch button { min-height: 28px; padding: 4px 11px; border: 0; border-radius: 6px; background: transparent; color: var(--pub-secondary-text); font: inherit; font-size: 12px; line-height: 18px; cursor: pointer; }
.pub-editor-view-switch button[aria-pressed=true] { background: var(--pub-surface); color: var(--pub-text); box-shadow: 0 1px 3px #0002; font-weight: 600; }
.pub-editor-view-switch button:disabled { opacity: .4; cursor: not-allowed; }
.pub-editor { min-height: 340px !important; font-family: var(--ds-font-family-code, monospace) !important; }
.pub-version-card { padding-bottom: 14px; }
.pub-version-card .pub-muted { margin: 10px 0 0; }
.pub-version-card > button { margin-top: 10px; }
.pub-article-theme-control { display: grid; grid-template-columns: auto minmax(160px, 220px); align-items: center; gap: 8px 12px; margin-top: 14px; }
.pub-article-theme-control label { color: var(--pub-secondary-text); font-size: 13px; font-weight: 600; }
.pub-article-theme-control .pub-muted { grid-column: 1 / -1; margin: 0; }
.pub-version-tabs { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 3px; }
.pub-version-tab { flex: 0 0 auto; padding: 6px 10px; border: 1px solid var(--pub-border); border-radius: 8px; background: var(--pub-surface); color: var(--pub-secondary-text); font-size: 12px; cursor: pointer; }
.pub-version-tab[aria-pressed=true] { border-color: var(--dsw-alias-state-business-primary, #4176e6); background: var(--dsw-alias-state-business-tertiary, #edf3fe); color: var(--pub-text); font-weight: 600; }
.pub-version-tab:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary, #4176e6); outline-offset: 2px; }
${contentPreviewCss}
${draftGalleryCss}
${editorLayoutCss}
.pub-assets { display: flex; gap: 8px; flex-wrap: wrap; }
.pub-no-cover { display: inline-flex; align-items: center; gap: 5px; margin: 0 0 12px; color: var(--pub-secondary-text); font-size: 13px; }
.pub-asset { width: 130px; padding: 8px; border: 1px solid var(--pub-border); border-radius: 9px; }
.pub-asset[draggable=true] { cursor: grab; }
.pub-asset-dragging { opacity: .5; }
.pub-asset img { width: 100%; height: 95px; border-radius: 5px; object-fit: cover; }
.pub-asset small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pub-asset .pub-actions { margin-top: 5px; }
@media (hover: none) { .pub button:not(.pub-gallery-open) { min-height: 40px; } }
@container (max-width: 900px) { .pub-grid { grid-template-columns: 1fr; } }
@container (max-width: 640px) {
  .pub-wrap { padding: 20px 16px 40px; }
  .pub-type-nav { width: 100%; overflow-x: auto; }
  .pub-account-list-head { align-items: flex-start; }
  .pub-account-card-head { grid-template-columns: 44px minmax(0, 1fr); }
  .pub-account-card-head .pub-status { grid-column: 2; justify-self: start; }
  .pub-account-error { margin-left: 0; }
  .pub-platform { grid-template-columns: 80px minmax(0, 1fr); }
  .pub-head { flex-wrap: wrap; }
  .pub-page-nav { width: 100%; }
  .pub-history-tools { width: 100%; }
  .pub-history-search { flex: 1 1 100%; min-width: 0; }
  .pub-editor-status { order: 3; flex-basis: 100%; }
}
`;
		//#endregion
		//#region src/client/platform-iconfont-data.ts
		const ICONFONT_GLYPHS = {
			dy: {
				viewBox: "0 0 1024 1024",
				paths: [
					{
						d: "M0 0m184.32 0l655.36 0q184.32 0 184.32 184.32l0 655.36q0 184.32-184.32 184.32l-655.36 0q-184.32 0-184.32-184.32l0-655.36q0-184.32 184.32-184.32Z",
						fill: "#111111"
					},
					{
						d: "M204.27776 670.59712a246.25152 246.25152 0 0 1 245.97504-245.97504v147.57888a98.49856 98.49856 0 0 0-98.38592 98.38592c0 48.34304 26.14272 100.352 83.54816 100.352 3.81952 0 93.55264-0.88064 93.55264-77.19936V134.35904h157.26592a133.31456 133.31456 0 0 0 133.12 132.99712l-0.13312 147.31264a273.152 273.152 0 0 1-142.62272-38.912l-0.06144 317.98272c0 146.00192-124.24192 224.77824-241.14176 224.77824-131.74784 0.03072-231.1168-106.56768-231.1168-247.92064z",
						fill: "#FF4040"
					},
					{
						d: "M164.92544 631.23456a246.25152 246.25152 0 0 1 245.97504-245.97504v147.57888a98.49856 98.49856 0 0 0-98.38592 98.38592c0 48.34304 26.14272 100.352 83.54816 100.352 3.81952 0 93.55264-0.88064 93.55264-77.19936V94.99648h157.26592a133.31456 133.31456 0 0 0 133.12 132.99712l-0.13312 147.31264a273.152 273.152 0 0 1-142.62272-38.912l-0.06144 317.98272c0 146.00192-124.24192 224.77824-241.14176 224.77824-131.74784 0.03072-231.1168-106.56768-231.1168-247.92064z",
						fill: "#00F5FF"
					},
					{
						d: "M410.91072 427.58144c-158.8224 20.15232-284.44672 222.72-154.112 405.00224 120.40192 98.47808 373.68832 41.20576 380.70272-171.85792l-0.17408-324.1472a280.7296 280.7296 0 0 0 142.88896 38.62528V261.2224a144.98816 144.98816 0 0 1-72.8064-54.82496 135.23968 135.23968 0 0 1-54.70208-72.45824h-123.66848l-0.08192 561.41824c-0.11264 78.46912-130.9696 106.41408-164.18816 30.2592-83.18976-39.77216-64.37888-190.9248 46.31552-192.57344z",
						fill: "#FFFFFF"
					}
				]
			},
			ks: {
				viewBox: "0 0 1024 1024",
				paths: [
					{
						d: "M299.27936 624.43008v87.48544c0 14.64832 10.70592 21.24288 23.78752 14.65856l83.49696-42.01984v-32.76288L323.072 609.7664c-13.08672-6.58432-23.79264 0.01536-23.79264 14.66368zM654.42304 436.03456c36.72064 0 66.59584-29.87008 66.59584-66.59072s-29.8752-66.59584-66.59584-66.59584c-36.71552 0-66.5856 29.8752-66.5856 66.59584s29.87008 66.59072 66.5856 66.59072zM443.56096 435.65056c47.73376 0 86.56384-38.8352 86.56384-86.56896s-38.83008-86.56896-86.56384-86.56896-86.56896 38.8352-86.56896 86.56896 38.8352 86.56896 86.56896 86.56896z",
						fill: "#FF4A08"
					},
					{
						d: "M849.92 51.2H174.08c-67.8656 0-122.88 55.0144-122.88 122.88v675.84c0 67.8656 55.0144 122.88 122.88 122.88h675.84c67.8656 0 122.88-55.0144 122.88-122.88V174.08c0-67.8656-55.0144-122.88-122.88-122.88zM443.56096 204.8c54.05184 0 101.22752 29.89056 125.93664 73.99936 22.24128-20.85376 52.11136-33.664 84.93056-33.664 68.54656 0 124.30848 55.76704 124.30848 124.30848s-55.76704 124.30336-124.30848 124.30336c-41.40544 0-78.12608-20.37248-100.73088-51.60448-26.48576 31.29856-66.01728 51.22048-110.13632 51.22048-79.55968 0-144.2816-64.72704-144.2816-144.2816S364.00128 204.8 443.56096 204.8z m336.65536 505.63584c0 59.97568-48.78848 108.76416-108.76416 108.76416H515.328c-47.05792 0-87.22432-30.04416-102.34368-71.96672l-87.81824 42.40384c-9.43616 4.5568-18.97984 6.8608-28.37504 6.8608h-0.00512c-30.70976 0-53.00224-24.3712-53.00224-57.9328v-140.5696c0-33.57696 22.29248-57.94304 53.00736-57.94304 9.3952 0 18.93888 2.30912 28.36992 6.86592l87.59808 42.29632c14.93504-42.26048 55.26528-72.63232 102.56896-72.63232h156.11904c59.97568 0 108.76416 48.7936 108.76416 108.76928v85.08416z",
						fill: "#FF4A08"
					},
					{
						d: "M671.45216 574.28992H515.328c-28.14976 0-51.05664 22.90688-51.05664 51.05664v85.08928c0 28.14976 22.90688 51.05664 51.05664 51.05664h156.11904c28.14976 0 51.05664-22.90688 51.05664-51.05664v-85.08928c0-28.14976-22.90176-51.05664-51.05152-51.05664z",
						fill: "#FF4A08"
					}
				]
			},
			sph: {
				viewBox: "0 0 1024 1024",
				paths: [{
					d: "M282.04032 310.272c-2.96448 2.0736-9.33376 10.496-12.62592 32.22016-4.83328 31.85664-3.3792 95.90784 31.0016 220.20096 1.03936 3.4304 11.49952 37.6064 26.01472 73.73824 21.36064 53.18144 35.40992 71.08608 40.92928 76.61568 8.04864-3.29216 26.66496-15.33952 53.02272-47.40096 23.0656-28.0576 43.73504-61.53216 56.9856-91.9552-13.38368-23.23968-43.50976-74.47552-77.92128-126.04928C320.77312 329.74336 288.33792 312.6272 282.04032 310.272zM741.95968 310.272c-6.2976 2.3552-38.7328 19.47136-117.40672 137.3696-34.41152 51.57376-64.53248 102.8096-77.92128 126.04928 13.25568 30.42304 33.92 63.89248 56.9856 91.9552 26.35776 32.06144 44.9792 44.1088 53.02784 47.40096 5.52448-5.54496 19.63008-23.52128 41.08288-77.00992a985.216 985.216 0 0 0 25.85088-73.33888c34.37568-124.29312 35.83488-188.34944 31.0016-220.20608-3.29216-21.72416-9.66144-30.15168-12.6208-32.22016z",
					fill: "#FA9D3B"
				}, {
					d: "M849.92 51.2H174.08c-67.8656 0-122.88 55.0144-122.88 122.88v675.84c0 67.8656 55.0144 122.88 122.88 122.88h675.84c67.8656 0 122.88-55.0144 122.88-122.88V174.08c0-67.8656-55.0144-122.88-122.88-122.88z m-66.21184 528.50688l-0.1792 0.62976c-0.54784 1.83296-13.71136 45.57312-32.3584 90.07104-31.17568 74.37824-58.48064 106.11712-91.29472 106.11712-29.96736 0-64.49152-23.17824-102.61504-68.89472-16.52224-19.80928-32.03072-42.14784-45.2608-64.79872-13.23008 22.65088-28.73856 44.98944-45.2608 64.79872-38.12352 45.71648-72.64768 68.89472-102.61504 68.89472-32.81408 0-60.11904-31.73376-91.29472-106.11712-18.65216-44.4928-31.80544-88.23296-32.3584-90.07104l-0.1792-0.62976c-43.4944-157.11744-46.976-256.70656-10.65472-304.45056 19.60448-25.76896 44.35456-27.77088 51.47136-27.77088 0.54784 0 1.08544 0.01024 1.6128 0.03072 28.80512 0.38912 71.168 20.4288 165.12 160.11264 24.96512 37.12 47.62624 73.90208 64.1536 101.59104 16.53248-27.68896 39.18848-64.46592 64.1536-101.59104 93.952-139.68384 136.31488-159.72352 165.12-160.11264 0.52736-0.02048 1.06496-0.03072 1.6128-0.03072 7.1168 0 31.86688 2.00704 51.47136 27.77088 36.33152 47.744 32.84992 147.33312-10.64448 304.45056z",
					fill: "#FA9D3B"
				}]
			},
			xhs: {
				viewBox: "0 0 1024 1024",
				paths: [{
					d: "M726.51776 457.45152c-6.70208-0.0768-13.39392 0-20.00384-0.0768-2.37056 0-3.0464 1.05984-3.0464 3.23072 0.0768 5.10976 0.0768 10.13248 0.0768 15.232v0.01024c0.07168 4.87936 0 9.7536 0.07168 14.56128 0 3.90656 0.68096 4.66944 4.45952 4.66944 7.1424 0.0768 14.27456 0 21.41696 0.0768 2.67776 0 3.72736-1.28 3.65056-3.75808-0.08704-9.1648-0.08704-18.31936-0.15872-27.48416a6.7584 6.7584 0 0 0-6.46656-6.46144z",
					fill: "#FF2E4D"
				}, {
					d: "M849.92 51.2h-675.84c-67.8656 0-122.88 55.0144-122.88 122.88v675.84c0 67.8656 55.0144 122.88 122.88 122.88h675.84c67.8656 0 122.88-55.0144 122.88-122.88V174.08c0-67.8656-55.0144-122.88-122.88-122.88zM250.78784 505.73312c-0.73728 10.59328-1.41312 21.25312-2.60608 31.8464-2.08896 18.39104-6.24128 36.26496-14.6432 52.864-2.16064 4.12672-5.13536 7.79776-8.18176 12.45696-1.85344-3.90656-3.41504-6.97856-4.82816-10.13248a3203.59424 3203.59424 0 0 1-14.79168-33.56672c-0.52736-1.2032-0.896-2.92352-0.36864-3.97824 3.19488-6.83008 3.41504-14.12096 3.85536-21.40672 0.60416-9.15968 1.35168-18.24256 2.01728-27.39712 0.51712-7.00416 0.80896-13.9776 1.39776-20.96128 0.67584-8.10496 1.49504-16.21504 2.16064-24.24832 0.14848-1.96608 1.04448-2.56 2.82624-2.56 11.0848 0 22.07744 0 33.16224-0.07168 2.37056 0 3.0464 0.98304 2.89792 3.23072-0.96768 14.63296-1.86368 29.28128-2.89792 43.92448z m71.29088 87.32672c-0.73728 9.46176-5.13536 17.49504-12.5696 23.5008-5.43232 4.352-11.74528 6.15936-18.6624 6.08256-5.87264 0-11.66848-0.0768-17.54112 0-2.00192 0-3.27168-0.60416-4.09088-2.55488-3.41504-7.6544-6.90688-15.32416-10.32192-22.97344-0.52736-1.13152-0.67584-2.33472-1.13152-3.456-1.63328-4.12672-1.5616-4.28544 2.97472-4.36224h13.90592c5.94944 0 8.47872-2.46784 8.5504-8.56576 0.07168-4.57216 0.07168-9.14944 0.07168-13.73696V494.2336c0.14848 0.15872 0.22016 0.15872 0.29696 0.15872V408.63744c0-4.28544 0.14848-4.43392 4.38784-4.43392h29.21472c5.13536 0 5.20704 0.14848 5.20704 5.40672 0 27.1872 0 54.36416 0.0768 81.47968 0.0768 23.87456 0.29696 47.75936 0.29696 71.6288 0 10.14272 0.14848 20.26496-0.6656 30.34112z m75.58656-28.90752c-4.98688 11.56096-10.19904 22.97344-15.31904 34.4576-0.45568 1.13664-1.19296 2.25792-2.3808 4.42368v0.01024c-2.97472-4.5056-6.0928-8.18176-8.11008-12.39552-2.82624-6.13888-4.5312-12.83584-7.35744-18.9952-3.0464-6.6816-4.15744-13.88032-5.57568-20.94592-1.1776-6.02112-1.40288-12.25216-1.8432-18.3296-1.2032-15.39584-2.23744-30.78656-3.44064-46.09536a2449.95584 2449.95584 0 0 0-2.0736-25.1648c-0.14848-1.50016 0.2304-2.176 1.94048-2.176 11.52512 0 22.97344-0.14848 34.49856-0.22016 2.1504 0 3.0464 0.96768 3.11808 2.9952 0.29696 4.65408 0.51712 9.31328 0.88576 13.97248 0.29696 3.83488 0.73728 7.6544 1.04448 11.41248 0.51712 5.40672 1.04448 10.81344 1.41312 16.14336 0.51712 6.90688 0.51712 13.81888 1.4848 20.63872 1.34144 10.4448 0.29696 21.10464 3.93216 31.32928 0.89088 2.40128-0.96768 6.08768-2.21696 8.93952z m84.28032 22.016c-2.89792 6.6816-6.02112 13.21472-8.99072 19.82464-1.64352 3.74784-3.19488 7.49568-4.76672 11.25376-1.85344 4.51072-3.11808 5.40672-7.87456 5.40672h-22.2976c-7.52128 0-15.0272 0.23552-22.53312-0.0768-3.56352-0.14336-7.0656-1.27488-10.62912-2.02752-1.792-0.36864-2.16064-1.42336-1.41312-3.14368a3709.71648 3709.71648 0 0 0 13.45024-29.21472c1.04448-2.24768 1.85344-4.65408 3.0464-6.90688 0.29696-0.6144 1.41312-1.28 2.00192-1.13152 12.42112 3.15392 25.13408 2.77504 37.76512 2.63168a874.6496 874.6496 0 0 1 20.07552 0c3.19488 0.00512 3.50208 0.45568 2.16576 3.38432z m3.84-21.86752a4.48512 4.48512 0 0 1-2.74944 1.4336c-13.89568 0.0768-27.8784 0.14848-41.77408-0.0768-4.23936-0.08704-8.5504-1.05472-11.74528-4.28544-3.3536-3.3792-4.98688-7.36256-3.28192-11.93984a897.52576 897.52576 0 0 1 9.58464-24.10496c3.88096-9.15456 7.81312-18.31936 12.05248-28.2368-2.30912-0.14848-3.712-0.29696-5.04832-0.29696-4.09088-0.07168-8.18176 0.29696-12.27264-0.2304-4.45952-0.51712-8.99072-1.04448-12.48256-4.79232-3.42528-3.6864-3.94752-8.04352-2.60608-12.32384 2.1504-6.83008 4.97664-13.44 7.80288-20.04992 2.67776-6.15424 5.72416-12.16 8.47872-18.24256 2.97472-6.53824 5.86752-13.07136 8.77056-19.6096a1361.99168 1361.99168 0 0 0 7.6544-17.33632c0.73728-1.80736 1.8688-2.47808 3.87072-2.47808 10.93632 0.07168 21.92896 0 32.86528 0 3.6352 0 3.712 0.36864 2.29888 3.6864-6.31296 14.63296-12.71808 29.20448-18.95936 43.84768a11.52 11.52 0 0 0-1.19296 4.87936c0.22016 3.90656 1.04448 4.5056 5.06368 4.5056 8.17152 0.0768 16.35328 0 24.448 0 1.64864 0 3.3536 0.22016 4.98688 0.29696 2.30912 0.0768 2.60608 1.05984 1.63328 3.072a2455.21408 2455.21408 0 0 0-13.3888 29.21472c-3.03616 6.91712-5.93408 13.89568-8.9088 20.8128a1530.1632 1530.1632 0 0 1-6.1696 13.80864c-1.94048 4.20352-0.60416 6.31296 4.15232 6.38976 6.02112 0 12.04224 0.0768 18.05824 0 2.08896 0 3.13344 0.60416 2.08896 2.85184-3.6352 8.25344-7.21408 16.58368-10.84928 24.85248-0.67072 1.50016-1.408 3.072-2.3808 4.352z m134.81472 58.73664h-125.3376c-1.72032-0.22016-3.48672-0.22016-5.94432-0.22016v-0.01536c0.88064-2.61632 1.41312-4.41856 2.1504-6.0672 4.69504-10.29632 9.4464-20.5056 14.0544-30.79168 1.04448-2.33472 2.52928-2.92352 4.75648-2.92352h28.6976c4.54656 0 4.75648-0.2304 4.75648-4.74112V461.66016c0-3.97824-0.0768-4.05504-4.08064-4.05504-6.10304 0-12.26752-0.0768-18.36544 0-2.30912 0-3.27168-0.51712-3.27168-3.1488 0.14848-10.97216 0.0768-21.92896 0.0768-32.88576 0-3.90656 0.0768-3.90656 3.86048-3.90656h73.00096c4.23936 0 8.5504 0.0768 12.78976 0 2.01728 0 2.82624 0.82432 2.74944 2.85184-0.0768 11.41248-0.0768 22.82496-0.0768 34.31424 0 2.02752-0.73728 2.77504-2.82624 2.77504-6.6048-0.0768-13.14304 0.07168-19.77856 0.07168-2.29376 0-3.33824 1.05984-3.33824 3.46624 0.0768 18.39104 0.14336 36.7104 0.14336 55.11168 0 20.87424 0 41.74848 0.0768 62.6944 0 3.75808 0.36864 4.21376 4.17792 4.21376h31.4368c3.41504 0 3.87072 0.36864 3.93728 3.81952 0.08704 10.97216 0 21.92896 0.08704 32.89088-0.01024 2.8672-1.57184 3.16416-3.73248 3.16416z m198.69696-34.92864c-0.14848 16.37376-11.008 29.21472-26.38848 32.89088-4.31616 1.05472-8.78592 1.35168-13.24544 1.5104-6.83008 0.22016-13.7472 0.07168-20.58752 0.07168-4.23936 0-5.42208-0.83456-6.9888-4.66432-3.33824-7.95136-6.83008-15.90784-10.26048-23.87456l-0.66048-1.57184c-1.19296-3.072-0.81408-3.61472 2.45248-3.61472 9.43616-0.07168 18.95424 0.15872 28.3904-0.29184 5.65248-0.29696 8.03328-2.85696 8.18688-8.64256 0.22016-11.04384-0.29696-22.07744-0.14848-33.11104 0.0768-5.48864-6.84032-11.42272-11.74528-11.71968a32.8448 32.8448 0 0 0-2.74944-0.14336c-18.73408 0-37.54496 0-56.2688 0.07168-5.27872 0-5.65248 0.53248-5.65248 5.8624l0.20992 77.55776c0 4.14208-0.0768 4.21376-4.23936 4.21376h-31.22176c-4.01408 0-4.3008-0.3072-4.3008-4.28544v-39.94112c0.06144 0.14336 0.13312 0.14336 0.20992 0.14336v-40.99584c0-2.78016-1.85344-2.93888-3.78368-2.93888-10.19392 0.08704-20.44416 0.31232-30.62272 0.31232-6.92224 0-6.17984 0.8192-6.25664-6.38976-0.0768-9.90208 0-19.90144 0-29.80352 0-3.59936 0.36864-4.05504 3.94752-4.13184 10.7008-0.07168 21.33504 0 32.04096-0.07168 4.09088 0 4.31104-0.15872 4.38272-4.21376 0.0768-9.90208-0.0768-19.8144 0-29.73184 0-2.4832-1.04448-3.23072-3.41504-3.23072-6.84544 0.0768-13.76256-0.07168-20.60288 0-2.1504 0-2.89792-0.74752-2.89792-2.92352 0.09216-11.26912 0.09216-22.46144-0.06144-33.72544 0-2.70336 1.03424-3.29216 3.41504-3.29216 6.31296 0.0768 12.6464 0 18.95936 0 4.23424 0 4.45952-0.3072 4.5312-4.74112 0-2.61632 0.14848-5.24288 0-7.87456-0.07168-2.4832 1.04448-3.15904 3.34336-3.15904 9.07776 0.0768 18.22208 0.0768 27.28448 0.0768h4.97664c3.94752 0 4.0192 0 4.1728 4.05504 0.06656 2.4064-0.1536 4.87936-0.08704 7.28576 0.0768 3.3792 0.9728 4.2752 4.31616 4.36224 5.65248 0.0768 11.30496 0.0768 17.024 0.0768 14.6432 0.07168 27.3664 5.09952 37.0176 16.29184 5.35552 6.22592 8.69888 13.81888 9.216 22.14912 0.52736 8.47872 0.15872 17.03936 0.3072 25.52832 0 3.15904 0.22016 6.38976 0.36864 9.53344 0.14336 3.15904 0.896 3.97824 4.09088 3.90656a48.56832 48.56832 0 0 1 19.03104 3.15904c13.00992 5.03808 21.03296 14.18752 23.63904 28.01152a44.4416 44.4416 0 0 1 0.73728 8.33024c0.08192 17.88928 0.06656 35.78368-0.06656 53.6832zM810.14272 453.632c-5.94432 3.90656-12.1856 3.75808-19.4048 3.6864-2.23744 0-5.20192 0.07168-8.09984-0.0768-0.7424-0.07168-2.00704-0.98304-2.08896-1.5872-0.6656-8.84736-1.77152-17.792 1.35168-26.35264 2.75456-7.5776 9.58464-12.01664 17.61792-12.16a19.99872 19.99872 0 0 1 19.32288 14.336c2.30912 8.2688-1.55648 17.42336-8.69888 22.15424z",
					fill: "#FF2E4D"
				}]
			},
			blbl: {
				viewBox: "0 0 1024 1024",
				paths: [{
					d: "M729.32864 373.94944c-9.79456-5.94432-19.06176-6.784-19.14368-6.784l-1.06496-0.0512c-57.20064-3.8656-121.1648-5.83168-190.12608-5.83168l-13.98784 0.00512c-68.95616 0-132.92544 1.96096-190.12096 5.83168l-1.06496 0.0512c-0.08192 0-9.34912 0.83968-19.14368 6.784-15.04768 9.12896-24.27392 25.94816-27.4176 49.9712-10.07104 76.91264-4.38272 173.64992 0.18944 251.392 2.93888 49.96608 33.408 62.45888 85.04832 67.1488 10.78272 0.98816 69.08928 5.86752 159.50848 5.89312v-0.00512c90.4192-0.02048 148.72576-4.90496 159.5136-5.888 51.64032-4.68992 82.10944-17.18272 85.0432-67.1488 4.57728-77.74208 10.26048-174.47936 0.18944-251.392-3.1488-24.02816-12.37504-40.84736-27.42272-49.97632z m-390.9888 172.71808a23.64928 23.64928 0 0 1-31.68768-10.84416 23.68 23.68 0 0 1 10.84416-31.68768c2.03776-1.00352 50.69312-24.72448 110.5408-43.06432a23.68 23.68 0 1 1 13.88032 45.29152c-56.2944 17.24928-103.11168 40.07424-103.5776 40.30464z m268.89728 35.88608c-0.44032 2.23232-11.26912 54.64064-50.93888 54.64064-21.44256 0-36.10112-14.04928-44.98432-26.77248-8.69376 12.70784-22.80448 26.77248-42.65472 26.77248-35.5328 0-50.13504-48.26624-51.68128-53.77024a11.3664 11.3664 0 0 1 21.87776-6.1696c2.74944 9.6512 14.1312 37.20192 29.7984 37.20192 16.37376 0 28.89216-23.64416 31.98464-31.92832a11.37152 11.37152 0 0 1 10.6496-7.38816h0.06144c4.76672 0.03072 9.0112 3.02592 10.62912 7.50592 0.10752 0.28672 11.96544 31.81568 34.31424 31.81568 20.864 0 28.56448-35.95264 28.64128-36.32128a11.34592 11.34592 0 0 1 13.35808-8.93952 11.36128 11.36128 0 0 1 8.94464 13.35296z m110.11584-46.73536a23.68 23.68 0 0 1-31.68256 10.84416c-0.47104-0.2304-47.47264-23.1168-103.57248-40.30976a23.69024 23.69024 0 0 1-15.70816-29.58336 23.66976 23.66976 0 0 1 29.57824-15.70304c59.84768 18.33984 108.49792 42.0608 110.55104 43.06432a23.68 23.68 0 0 1 10.83392 31.68768z",
					fill: "#F16C8D"
				}, {
					d: "M849.92 51.2H174.08c-67.8656 0-122.88 55.0144-122.88 122.88v675.84c0 67.87072 55.0144 122.88 122.88 122.88h675.84c67.87072 0 122.88-55.00928 122.88-122.88V174.08c0-67.86048-55.00928-122.88-122.88-122.88z m-36.60288 627.45088c-2.62656 44.57984-21.82144 78.63296-55.51616 98.48832-25.68192 15.13472-54.17472 19.48672-81.13664 21.9392-32.45568 2.94912-92.71808 6.09792-164.66432 6.1184-71.94112-0.02048-132.20864-3.16416-164.66432-6.1184-26.96192-2.45248-55.45472-6.80448-81.13152-21.9392-33.69472-19.85536-52.8896-53.90336-55.51104-98.4832-4.70528-80.13312-10.5728-179.85536 0.19456-262.10816C221.5424 335.16544 280.99072 311.57248 311.5008 310.37952a2482.64192 2482.64192 0 0 1 81.42336-4.08576c-7.53664-8.53504-19.88096-23.3216-28.81536-38.11328-13.73696-22.73792 8.52992-41.68704 8.52992-41.68704s23.68-20.36736 44.52864 5.21216c15.69792 19.26656 38.37952 55.99744 48.61952 72.95488l53.20704-0.21504c13.2608 0 26.33216 0.07168 39.2192 0.21504 10.24-16.95744 32.9216-53.6832 48.61952-72.95488 20.84352-25.57952 44.52864-5.21216 44.52864-5.21216s22.26176 18.94912 8.5248 41.68704c-8.9344 14.79168-21.27872 29.57824-28.81536 38.11328 28.35968 0.97792 55.56224 2.33984 81.42336 4.08064 30.5152 1.19808 89.9584 24.79104 100.61312 106.17344 10.7776 82.24768 4.9152 181.96992 0.20992 262.10304z",
					fill: "#F16C8D"
				}]
			},
			tt: {
				viewBox: "0 0 1024 1024",
				paths: [
					{
						d: "M182.111 3.815H841.89a178.296 178.296 0 0 1 178.296 178.296V841.89a178.296 178.296 0 0 1-178.296 178.296H182.11A178.296 178.296 0 0 1 3.815 841.89V182.11A178.296 178.296 0 0 1 182.11 3.815z",
						fill: "#FFFFFF"
					},
					{
						d: "M841.889 1024H182.11A182.413 182.413 0 0 1 0 841.788V182.111A182.312 182.312 0 0 1 182.111 0H841.89A182.312 182.312 0 0 1 1024 182.111v659.677A182.413 182.413 0 0 1 841.889 1024zM182.11 7.73A174.582 174.582 0 0 0 7.731 182.111v659.677a174.582 174.582 0 0 0 174.38 174.482H841.89a174.582 174.582 0 0 0 174.38-174.482V182.111A174.582 174.582 0 0 0 841.89 7.731z",
						fill: "#DBDCDC"
					},
					{
						d: "M208.615 292.04l65.556-97.882 27.909 35.138 39.253-64.251 61.24 114.648V156.51h-261.02v172.876h261.02V291.94zM171.67 191.65a22.488 22.488 0 1 1 22.387 22.387 22.387 22.387 0 0 1-22.387-22.387z m516.216-35.138H883.15v28.612H687.887z m0 54.413H883.15v28.612H687.887z m0-108.725H883.15v28.612H687.887z m-253.791 54.312H655.36v28.612H434.096z m0 54.413H655.36v28.612H434.096z m0-108.725H655.36v28.612H434.096zM141.15 838.776H655.36v28.612H141.151z m0 54.413H655.36v28.612H141.151z m0-108.725H655.36v28.612H141.151z m546.736 54.312H883.15v28.612H687.887z m0 54.413H883.15v28.612H687.887z m0-108.725H883.15v28.612H687.887zM158.017 102.2a22.99 22.99 0 0 1 4.719 0 11.144 11.144 0 0 1 3.714 1.506 7.128 7.128 0 0 1 2.31 2.811 8.835 8.835 0 0 1 0.802 4.217 8.132 8.132 0 0 1-1.204 4.618 9.437 9.437 0 0 1-3.715 3.011 8.031 8.031 0 0 1 5.02 3.414 10.742 10.742 0 0 1 1.004 10.942 8.935 8.935 0 0 1-2.912 3.213 11.144 11.144 0 0 1-4.116 1.907 18.472 18.472 0 0 1-4.718 0.603h-18.372v-36.242z m-1.004 14.657a5.622 5.622 0 0 0 3.514-1.003 3.915 3.915 0 0 0 1.305-3.313 4.618 4.618 0 0 0 0-2.109 3.413 3.413 0 0 0-1.205-1.204 4.819 4.819 0 0 0-1.807-0.703h-9.537v8.433z m0 15.46a8.533 8.533 0 0 0 2.31 0 4.819 4.819 0 0 0 1.806-0.702 3.715 3.715 0 0 0 1.306-1.506 4.92 4.92 0 0 0 0.501-2.309 4.618 4.618 0 0 0-1.606-4.015 6.525 6.525 0 0 0-4.116-1.205h-8.734v10.039z m27.407 13.353a10.642 10.642 0 0 1-5.822 1.305h-4.418v-6.023h4.217a2.71 2.71 0 0 0 2.108-1.105 3.112 3.112 0 0 0 0.703-2.108 4.116 4.116 0 0 0 0-1.606l-9.236-24.697h7.73l5.923 17.97 5.12-17.87h7.53l-11.044 29.516a8.533 8.533 0 0 1-2.81 4.618z m36.443-34.133l-3.213 4.819h-5.32v13.452a2.41 2.41 0 0 0 3.011 3.012h2.31v5.622h-3.816a16.264 16.264 0 0 1-3.212 0 5.421 5.421 0 0 1-2.61-0.904 3.915 3.915 0 0 1-1.808-1.807 6.325 6.325 0 0 1-0.702-3.212v-16.163h-4.719v-4.82h4.317v-4.115l7.228-3.414v7.53z m46.18-9.337a17.167 17.167 0 0 1 6.526 1.105 12.95 12.95 0 0 1 5.22 3.312 15.26 15.26 0 0 1 3.514 5.622 23.09 23.09 0 0 1 1.204 7.931 23.793 23.793 0 0 1-1.003 7.229 15.46 15.46 0 0 1-3.113 5.822 13.252 13.252 0 0 1-5.12 3.815 16.063 16.063 0 0 1-7.228 1.406H250.98v-36.242z m-0.502 29.516a10.04 10.04 0 0 0 3.313 0 7.73 7.73 0 0 0 2.911-1.908 8.835 8.835 0 0 0 2.008-3.313 15.26 15.26 0 0 0 0.803-5.12 18.874 18.874 0 0 0-0.602-4.92 9.437 9.437 0 0 0-1.707-3.814 7.027 7.027 0 0 0-3.212-2.41 12.248 12.248 0 0 0-5.02-0.803h-5.622v22.79z m98.184-3.615a6.024 6.024 0 0 1-5.522 4.92c-5.622 0-6.023-7.43-6.023-7.43a11.144 11.144 0 0 1 0-1.907s0-7.328 6.023-7.429a6.024 6.024 0 0 1 5.522 4.92h6.726a12.449 12.449 0 0 0-12.549-10.04 12.75 12.75 0 0 0-12.85 11.947 21.384 21.384 0 0 0 0 3.714 12.75 12.75 0 0 0 12.85 11.947 12.348 12.348 0 0 0 12.549-10.04z m32.527-1.706h3.614a20.078 20.078 0 0 0 0-3.614 12.65 12.65 0 0 0-12.85-12.349 12.65 12.65 0 0 0-12.85 11.947 21.384 21.384 0 0 0 0 3.715 12.65 12.65 0 0 0 12.85 11.946 12.348 12.348 0 0 0 12.248-8.734h-7.33a5.522 5.522 0 0 1-4.918 3.313c-4.418 0-5.622-4.718-5.923-6.626h15.46z m-10.04-10.04c3.715 0 5.12 3.414 5.723 5.622h-10.943c0.603-2.309 2.008-5.621 5.723-5.722z m-143.46 10.04h3.614a20.078 20.078 0 0 0 0-3.614 12.75 12.75 0 0 0-12.85-12.349 12.65 12.65 0 0 0-12.75 11.947 21.384 21.384 0 0 0 0 3.715 12.65 12.65 0 0 0 12.75 11.946 12.147 12.147 0 0 0 12.148-8.734h-7.33a5.32 5.32 0 0 1-4.918 3.313c-4.418 0-5.622-4.718-5.923-6.626h15.46z m-10.04-10.04a6.325 6.325 0 0 1 5.723 5.622h-10.942c0.602-2.309 2.409-5.621 5.722-5.722z m79.411-4.417h-7.73a16.163 16.163 0 0 0-5.421-1.104 12.65 12.65 0 0 0-12.65 11.947 21.384 21.384 0 0 0 0 3.714 12.65 12.65 0 0 0 12.65 11.947 13.051 13.051 0 0 0 6.726-1.807l6.425 1.807z m-13.151 21.083c-5.522 0-5.923-7.43-5.923-7.43a11.144 11.144 0 0 1 0-1.907s0-7.328 5.923-7.429c5.42 0 5.923 7.43 5.923 7.43v1.907s-0.502 7.328-5.923 7.429z m42.064-14.055a9.336 9.336 0 0 0-8.533-8.132 10.04 10.04 0 0 0-8.333 3.313l-7.63-2.209v26.504h7.128v-15.16c0-7.529 6.024-6.926 6.024-6.926 4.517 0 4.216 6.123 4.216 6.123v15.963h7.228v-15.963c0-2.007-0.1-3.513-0.1-3.513z",
						fill: "#DBDCDC"
					},
					{
						d: "M0 220.26V841.89c0 5.32 0 10.641 0.803 15.862L1024 799.824V182.111c0-5.32 0-10.641-0.703-15.862z",
						fill: "#E62318"
					},
					{
						d: "M915.275 578.158v-48.59l-153.399 8.735v-24.396l-73.989 4.217v24.395l-153.4 8.734v48.49l153.4-8.634v106.918l73.99-4.217V586.893l153.398-8.735z",
						fill: "#FFFFFF"
					},
					{
						d: "M534.387 488.609v48.489l52.706-3.012v-0.1l135.931-66.962 138.943 51.2v0.201l53.308-3.112v-48.49l-35.539 2.008L787.978 435l121.575-59.834v-84.028l-73.99 4.217L665.4 304.99v-0.1l-59.03-28.11-75.395 119.768 62.544 22.689 40.258-63.95 201.788-11.445v11.746l-112.64 55.416-87.442-32.225-29.515 45.076 52.003 19.175-88.546 43.57-35.037 2.008zM875.32 594.723l-73.989 4.116 54.011 89.65 73.889-4.116-53.91-89.65zM534.69 706.861l73.989-4.116 49.292-95.573-73.989 4.216-49.292 95.473zM358.902 598.036l58.529 114.849 81.92-4.217-58.529-114.748-81.92 4.116z m-76.9-84.028l-59.834-75.395-81.619 4.618 59.733 75.294 81.72-4.517z m0-94.168l-59.834-75.294-81.619 4.518 59.733 75.394 81.72-4.618z",
						fill: "#FFFFFF"
					},
					{
						d: "M352.477 584.684l136.634-7.73v-48.49l-90.755 5.12V320.151l-73.989 4.116V537.8l-216.044 12.348v48.49l150.287-8.534-66.56 87.642-81.719 4.719v48.49l137.136-7.932v-0.2l105.01-138.14z",
						fill: "#FFFFFF"
					}
				]
			},
			bjh: {
				viewBox: "0 0 1136 1024",
				paths: [
					{
						d: "M537.27382507 511.99697067m-521.89554454 0a521.89554453 521.89554453 0 1 0 1043.79108907 0 521.89554453 521.89554453 0 1 0-1043.79108907 0Z",
						fill: "#E8E8E8"
					},
					{ d: "M788.10964373 298.749264v-10.94199467l-68.5783104-37.769872-32.80780586 22.86549547H261.270208l10.93593493 25.8463712H466.01151467l-22.83520214 112.26146453-75.54580373-4.97418453-53.67999253-8.94262613v376.8686848h100.3985504v-34.85564267h220.6756608v34.85564267h99.45945173v-182.518032c-5.07718187 1.99936747-10.25736213 3.9139136-15.55871467 5.73152106-28.96659627 9.91201707-57.27279573 15.58900907-82.85258453 17.3460288v100.71965974H414.34906667V432.9371264h221.675344v26.42194667a356.0692032 356.0692032 0 0 1 31.3961312-12.40819627 339.03216747 339.03216747 0 0 1 67.06363733-15.83741547v-21.0418304l-96.4725184-13.96528v12.9171264H504.81136427l66.3911232-110.33480106 216.90715626 0.06058773z" },
					{
						d: "M428.271936 708.30458133l74.5582368-78.52667946s87.47536427 16.8976864 150.1040416-29.82693014c0 0-34.78899733-21.8658112-38.7634976-20.866128 0 0 91.46198187 25.8463712 162.0275424-46.71855786 0 0-13.91681067-6.94931733-52.1774368-9.93625174 0 0 89.9594272 6.94931733 118.7806144-77.04229973 0 0-135.69041813-19.63015467-269.14517973 76.53337067s-145.38432213 186.38347627-145.38432107 186.38347626z",
						fill: "#175DFF"
					}
				]
			},
			fqsp: {
				viewBox: "0 0 1024 1024",
				paths: [
					{
						d: "M955.733333 540.01664c0 245.067093-198.662827 391.529813-443.733333 391.529813S68.266667 785.083733 68.266667 540.01664c0-245.06368 197.89824-380.255573 443.733333-320.6144 252.931413-71.461547 443.733333 75.55072 443.733333 320.6144z",
						fill: "#FF3000"
					},
					{
						d: "M512 952.026453c-127.16032 0-243.26144-38.58432-326.915413-108.642986C95.26272 768.160427 47.786667 663.258453 47.786667 540.01664c0-105.270613 34.597547-194.9184 100.05504-259.249493 62.897493-61.815467 152.19712-95.860053 251.450026-95.860054 36.420267 0 74.181973 4.488533 112.315734 13.349547 42.533547-11.5712 84.39808-17.431893 124.511573-17.431893 98.679467 0 183.545173 34.443947 245.425493 99.607893C943.476053 345.6512 976.213333 435.41504 976.213333 540.01664c0 123.241813-47.476053 228.143787-137.29792 303.366827-83.653973 70.058667-199.755093 108.642987-326.915413 108.642986zM399.28832 225.867093C213.54496 225.867093 88.746667 352.116053 88.746667 540.01664c0 218.4704 174.04928 371.049813 423.253333 371.049813 249.207467 0 423.253333-152.579413 423.253333-371.049813 0-190.344533-120.214187-318.231893-299.137706-318.231893-37.973333 0-77.861547 5.829973-118.54848 17.32608-3.386027 0.955733-6.970027 1.024-10.3936 0.19456-36.75136-8.915627-73.048747-13.438293-107.885227-13.438294z",
						fill: "#FF601A"
					},
					{
						d: "M371.053227 831.962453a20.466347 20.466347 0 0 1-6.331734-1.010346c-56.620373-18.40128-106.55744-50.930347-144.411306-94.071467C179.882667 690.81088 156.501333 635.818667 152.68864 577.8432a20.48 20.48 0 0 1 19.094187-21.78048c11.24352-0.730453 21.036373 7.806293 21.78048 19.094187 6.311253 96.017067 80.182613 183.156053 183.821653 216.838826a20.48 20.48 0 0 1-6.331733 39.96672z",
						fill: "#FFFFFF"
					},
					{
						d: "M172.31872 475.32032m-31.32416 0a31.32416 31.32416 0 1 0 62.64832 0 31.32416 31.32416 0 1 0-62.64832 0Z",
						fill: "#FFFFFF"
					},
					{
						d: "M450.952533 292.430507c-54.401707 0-94.64832-15.65696-119.61344-47.7184-40.76544-52.33664-22.770347-125.760853-21.981866-128.877227 2.409813-9.54368 10.99776-15.916373 20.609706-15.916373 0.914773 0 1.8432 0.136533 2.771627 0.252586a21.316267 21.316267 0 0 1 18.520747 21.398187c-1.419947 116.44928 110.025387 128.8192 114.773333 129.286827a21.285547 21.285547 0 0 1 19.176107 21.715626c-0.279893 11.14112-9.110187 19.575467-20.247894 20.11136-4.744533 0.22528-9.45152-0.259413-13.9776-0.259413-0.01024 0.006827-0.017067 0.006827-0.03072 0.006827z",
						fill: "#5DA500"
					},
					{
						d: "M329.980587 121.350827c-1.672533 137.304747 133.952853 150.698667 133.952853 150.698666a269.994667 269.994667 0 0 1-12.980907 0.31744c-159.095467 0-120.971947-151.016107-120.971946-151.016106m-0.034134-42.554027a42.349227 42.349227 0 0 0-27.0336 9.728 42.451627 42.451627 0 0 0-9.8304 11.636053 42.3936 42.3936 0 0 0-4.645546 11.9808c-3.150507 13.24032-18.51392 88.95488 26.129066 146.261334 29.211307 37.49888 75.096747 56.511147 136.3968 56.511146 4.88448 0 9.939627-0.12288 15.02208-0.36864 22.38464-1.078613 40.400213-19.298987 40.802987-41.704106 0.402773-22.350507-16.257707-41.1648-38.505813-43.124054-2.14016-0.273067-27.839147-3.805867-51.90656-19.17952-29.7984-19.029333-44.148053-47.786667-43.851094-87.883093 0.01024-0.433493 0.017067-0.873813 0.017067-1.307307 0-22.831787-17.974613-41.458347-40.5504-42.502826a40.96 40.96 0 0 0-2.044587-0.047787z",
						fill: "#167203"
					},
					{
						d: "M606.5664 318.211413c-53.009067 0-97.35168-34.48832-99.211947-35.956053a21.271893 21.271893 0 0 1 22.091094-36.020907c19.872427 9.17504 39.253333 13.824 57.606826 13.824 68.246187 0 106.9056-65.26976 107.287894-65.928533a21.333333 21.333333 0 0 1 18.455893-10.625707c3.099307 0 6.239573 0.67584 9.202347 2.106027a21.248 21.248 0 0 1 10.594986 26.873173c-34.123093 87.391573-87.371093 105.728-126.027093 105.728z",
						fill: "#5DA500"
					},
					{
						d: "M712.77568 204.7488c-28.173653 72.1408-69.25312 92.187307-106.20928 92.187307-46.24384 0-86.043307-31.382187-86.043307-31.382187 24.39168 11.257173 46.58176 15.786667 66.525867 15.786667 81.99168 0 125.72672-76.591787 125.72672-76.591787m-0.013653-42.87488c-14.77632 0-28.96896 7.703893-36.703574 21.367467-0.08192 0.139947-0.167253 0.273067-0.242346 0.416426-2.556587 4.13696-35.188053 55.135573-88.767147 55.135574-15.250773 0-31.634773-3.9936-48.687787-11.86816a42.540373 42.540373 0 0 0-54.101333 16.387413 42.550613 42.550613 0 0 0 9.925973 55.6544c5.259947 4.1472 53.097813 40.523093 112.384 40.523093 30.375253 0 58.026667-9.335467 82.189654-27.743573 26.10176-19.89632 47.353173-50.264747 63.17056-90.28608 1.426773-3.341653 2.440533-6.90176 2.976426-10.615467 2.676053-18.2272-6.61504-36.775253-23.917226-44.88192a42.779307 42.779307 0 0 0-18.2272-4.089173z",
						fill: "#167203"
					},
					{
						d: "M498.793813 282.064213c-3.027627 0-4.75136-0.12288-4.75136-0.12288-10.202453-0.70656-18.530987-8.574293-19.729066-18.732373s4.928853-19.735893 14.68416-22.797653c79.752533-25.04704 60.65152-103.266987 58.207573-112.100694-3.027627-10.9568 3.08224-22.398293 13.892267-25.931093a21.224107 21.224107 0 0 1 26.487466 12.649813c20.46976 54.084267 20.34688 96.7168-0.36864 126.713174-25.838933 37.413547-74.205867 40.321707-88.4224 40.321706z",
						fill: "#5DA500"
					},
					{
						d: "M567.688533 122.565973c49.861973 131.734187-48.930133 138.222933-68.89472 138.222934-2.184533 0-3.423573-0.075093-3.423573-0.075094 102.52288-32.197973 72.318293-138.14784 72.318293-138.14784m-0.310613-42.871466c-4.488533 0-9.045333 0.723627-13.513387 2.245973-21.661013 7.38304-33.69984 30.214827-27.14624 52.11136 0.484693 1.942187 4.908373 20.62336 0.94208 40.331947-4.621653 22.99904-18.926933 37.536427-45.03552 45.73184a42.550613 42.550613 0 0 0 10.089814 83.060053c0.771413 0.0512 2.911573 0.160427 6.079146 0.160427 16.827733 0 74.19904-3.570347 105.929387-49.50016 24.92416-36.089173 25.849173-85.323093 2.75456-146.336427-6.447787-17.03936-22.77376-27.805013-40.09984-27.805013z",
						fill: "#167203"
					},
					{
						d: "M413.52192 344.971947c-65.3824 0-89.391787-70.61504-90.381653-73.618774a21.271893 21.271893 0 0 1 36.683093-20.114773c18.561707 22.729387 39.44448 33.774933 63.832747 33.774933 33.30048 0 61.528747-21.108053 61.801813-21.323093a21.21728 21.21728 0 0 1 13.0048-4.440747 21.27872 21.27872 0 0 1 14.39744 36.949334c-35.273387 32.365227-68.693333 48.77312-99.33824 48.77312z",
						fill: "#5DA500"
					},
					{
						d: "M343.3472 264.700587c25.951573 31.77472 54.685013 41.591467 80.308907 41.591466 41.495893 0 74.816853-25.767253 74.816853-25.767253-34.89792 32.02048-62.88384 43.175253-84.95104 43.175253-50.742613 0-70.17472-58.999467-70.17472-58.999466M343.32672 222.149973A42.554027 42.554027 0 0 0 302.933333 278.009173c10.79296 32.771413 46.2336 88.23808 110.588587 88.23808 36.017493 0 74.141013-18.172587 113.319253-54.00576 1.324373-1.184427 2.577067-2.450773 3.744427-3.7888 13.74208-15.745707 14.363307-39.662933 0.474453-55.852373a42.581333 42.581333 0 0 0-32.365226-14.984533c-9.15456 0-18.35008 2.983253-26.098347 9.13408-1.949013 1.406293-24.128853 16.991573-48.933547 16.991573-11.229867 0-28.35456-2.69312-47.356586-25.9584a42.540373 42.540373 0 0 0-32.979627-15.633067z",
						fill: "#167203"
					},
					{
						d: "M505.79456 318.440107c-30.262613 0-53.087573-17.066667-53.087573-39.693654 0-22.6304 22.82496-39.697067 53.087573-39.697066 30.26944 0 53.0944 17.066667 53.0944 39.697066 0 22.6304-22.82496 39.693653-53.0944 39.693654z",
						fill: "#5DA500"
					},
					{
						d: "M505.79456 260.328107c17.568427 0 31.822507 8.250027 31.822507 18.42176 0 10.171733-14.25408 18.418347-31.822507 18.418346s-31.812267-8.246613-31.812267-18.418346c0-10.175147 14.24384-18.42176 31.812267-18.42176m0-42.550614c-42.3936 0-74.36288 26.210987-74.36288 60.96896 0 34.757973 31.96928 60.965547 74.36288 60.965547 42.3936 0 74.37312-26.210987 74.37312-60.965547 0-34.757973-31.976107-60.96896-74.37312-60.96896z",
						fill: "#167203"
					},
					{
						d: "M565.111467 450.993493s52.08064-72.58112-3.539627-135.253333c-10.88512-12.264107-31.3856-1.286827-61.433173 16.401067 0 0 17.2544 3.945813 31.361706 32.09216 14.107307 28.146347 33.611093 86.760107 33.611094 86.760106z",
						fill: "#5DA500"
					},
					{
						d: "M565.11488 471.473493a20.483413 20.483413 0 0 1-19.43552-14.015146c-0.191147-0.57344-19.206827-57.555627-32.484693-84.04992-7.91552-15.793493-16.05632-20.39808-18.169174-21.374294-8.454827-1.191253-14.250667-7.39328-16.042666-15.827626-1.83296-8.615253 3.177813-17.247573 10.769066-21.715627 25.081173-14.76608 42.786133-24.44288 59.692374-24.44288 10.929493 0 20.421973 4.181333 27.446613 12.09344 52.585813 59.255467 26.176853 131.085653 4.864 160.78848a20.483413 20.483413 0 0 1-16.64 8.543573z m-27.958613-136.32512c4.314453 5.33504 8.628907 11.881813 12.653226 19.909974 5.147307 10.27072 10.881707 24.122027 16.186027 37.85728 2.413227-18.80064-0.641707-40.94976-18.148693-61.733547-2.669227 0.48128-6.4512 1.969493-10.69056 3.966293z",
						fill: "#167203"
					}
				]
			},
			juejin: {
				viewBox: "0 0 1316 1024",
				paths: [{
					d: "M643.181714 247.698286l154.916572-123.172572L643.181714 0.256 643.072 0l-154.660571 124.269714 154.660571 123.245715 0.109714 0.182857z m0 388.461714h0.109715l399.579428-315.245714-108.361143-87.04-291.218285 229.888h-0.146286l-0.109714 0.146285L351.817143 234.093714l-108.251429 87.04 399.433143 315.136 0.146286-0.146285z m-0.146285 215.552l0.146285-0.146286 534.893715-422.034285 108.397714 87.04-243.309714 192L643.145143 1024 10.422857 525.056 0 516.754286l108.251429-86.893715L643.035429 851.748571z",
					fill: "#1E80FF"
				}]
			},
			wxmp: {
				viewBox: "0 0 1024 1024",
				paths: [{
					d: "M849.92 51.2H174.08c-67.8656 0-122.88 55.0144-122.88 122.88v675.84c0 67.8656 55.0144 122.88 122.88 122.88h675.84c67.8656 0 122.88-55.0144 122.88-122.88V174.08c0-67.8656-55.0144-122.88-122.88-122.88zM448.18432 230.94272c176.98304-53.95968 267.17696 110.98624 267.17696 110.98624-32.59392-17.78176-130.39104-37.53472-235.09504 16.7936s-126.4384 172.87168-126.4384 172.87168c-42.56256-45.4144-44.4928-118.6304-44.4928-118.6304 5.03296-137.41568 138.84928-182.02112 138.84928-182.02112zM393.50784 796.42112c-256.12288-49.6384-197.85216-273.38752-133.81632-371.95264 0 0-2.88256 138.13248 130.22208 214.4 0 0 15.82592 7.1936 10.79296 30.21312l-5.03808 29.49632s-6.656 20.1472 6.02624 22.30272c0 0 4.04992 0 13.39904-6.4768l48.92672-32.37376s10.07104-7.1936 23.01952-5.03808c12.94848 2.16064 95.68768 23.74656 177.70496-44.60032-0.00512 0-15.10912 213.67296-271.23712 164.02944z m256.8448-19.42016c16.54784-7.9104 97.1264-102.8864 58.98752-231.66464s-167.6288-157.55776-167.6288-157.55776c66.19136-28.0576 143.89248-7.19872 143.89248-7.19872 117.9904 34.5344 131.6608 146.77504 131.6608 146.77504 23.01952 200.71936-166.912 249.64608-166.912 249.64608z",
					fill: "#01CC7A"
				}]
			}
		};
		//#endregion
		//#region src/client/platform-icon.tsx
		function PlatformIcon({ platform, size = 44, className }) {
			const glyph = ICONFONT_GLYPHS[platform];
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				className,
				width: size,
				height: size,
				role: "presentation",
				"aria-hidden": true,
				focusable: false,
				style: {
					display: "block",
					flex: "none"
				},
				viewBox: glyph.viewBox,
				children: glyph.paths.map((path, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: path.d,
					fill: path.fill
				}, index))
			});
		}
		//#endregion
		//#region src/client/tips.tsx
		const DEFAULT_TIP_DURATION_MS = 3e3;
		const TipsContext = (0, react.createContext)(null);
		function scheduleTipDismiss(callback, durationMs = DEFAULT_TIP_DURATION_MS) {
			const timer = setTimeout(callback, durationMs);
			return () => clearTimeout(timer);
		}
		function PublisherTipsProvider({ children }) {
			const [tip, setTip] = (0, react.useState)();
			const sequence = (0, react.useRef)(0);
			const show = (0, react.useCallback)((kind, message) => {
				setTip({
					id: ++sequence.current,
					kind,
					message,
					durationMs: DEFAULT_TIP_DURATION_MS
				});
			}, []);
			const showSuccess = (0, react.useCallback)((message) => show("success", message), [show]);
			const showError = (0, react.useCallback)((message) => show("error", message), [show]);
			const clearTip = (0, react.useCallback)(() => setTip(void 0), []);
			const api = (0, react.useMemo)(() => ({
				showSuccess,
				showError,
				clearTip
			}), [
				showSuccess,
				showError,
				clearTip
			]);
			(0, react.useEffect)(() => {
				if (!tip) return;
				return scheduleTipDismiss(() => setTip((current) => current?.id === tip.id ? void 0 : current), tip.durationMs);
			}, [tip]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(TipsContext.Provider, {
				value: api,
				children: [children, tip && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: `pub-tip pub-tip-${tip.kind}`,
					role: tip.kind === "error" ? "alert" : "status",
					"aria-live": tip.kind === "error" ? "assertive" : "polite",
					children: tip.message
				}, tip.id)]
			});
		}
		function usePublisherTips() {
			const value = (0, react.useContext)(TipsContext);
			if (!value) throw new Error("PublisherTipsProvider is required");
			return value;
		}
		//#endregion
		//#region src/client/accounts.tsx
		function AccountsPage({ active }) {
			const { showError, showSuccess, clearTip } = usePublisherTips();
			const [capability, setCapability] = (0, react.useState)();
			const [accounts, setAccounts] = (0, react.useState)([]);
			const [platformCapabilities, setPlatformCapabilities] = (0, react.useState)([]);
			const [displayName, setDisplayName] = (0, react.useState)("");
			const [platform, setPlatform] = (0, react.useState)("dy");
			const [appId, setAppId] = (0, react.useState)("");
			const [appSecret, setAppSecret] = (0, react.useState)("");
			const [preview, setPreview] = (0, react.useState)();
			const [busy, setBusy] = (0, react.useState)("");
			const busyRef = (0, react.useRef)(false);
			const [serviceState, setServiceState] = (0, react.useState)("loading");
			const [serviceError, setServiceError] = (0, react.useState)("");
			const [serviceRetry, setServiceRetry] = (0, react.useState)(0);
			const serviceLoading = (0, react.useRef)(false);
			const pageGeneration = (0, react.useRef)(0);
			const activeRef = (0, react.useRef)(active);
			activeRef.current = active;
			const [loginErrors, setLoginErrors] = (0, react.useState)({});
			const [dialog, setDialog] = (0, react.useState)();
			const [nextName, setNextName] = (0, react.useState)("");
			const serviceReady = active && serviceState === "ready";
			const actionsDisabled = !serviceReady || busy !== "";
			(0, react.useEffect)(() => {
				setLoginErrors((current) => {
					const remaining = Object.fromEntries(Object.entries(current).filter(([id]) => accounts.some((account) => account.id === id && account.loginState !== "logged-in")));
					return Object.keys(remaining).length === Object.keys(current).length ? current : remaining;
				});
			}, [accounts]);
			const refresh = async (isCurrent) => {
				const rows = await api("accounts");
				if (isCurrent()) setAccounts(rows);
			};
			(0, react.useEffect)(() => {
				const generation = ++pageGeneration.current;
				busyRef.current = false;
				setBusy("");
				if (!active) {
					setServiceState("loading");
					return;
				}
				let live = true;
				const controller = new AbortController();
				const isCurrent = () => live && activeRef.current && pageGeneration.current === generation;
				serviceLoading.current = true;
				setServiceState("loading");
				setServiceError("");
				api("capability", void 0, controller.signal).then(async (value) => {
					if (!isCurrent()) return;
					setCapability(value);
					if (!value.supported) throw new Error(capabilityMessage(value));
					const [rows, supported] = await Promise.all([api("accounts", void 0, controller.signal), api("platform-capabilities", void 0, controller.signal)]);
					if (isCurrent()) {
						setAccounts(rows);
						setPlatformCapabilities(supported);
						setServiceState("ready");
					}
				}).catch((cause) => {
					if (!isCurrent()) return;
					setServiceError(cause instanceof Error ? cause.message : "发布能力检查失败");
					setServiceState("error");
				}).finally(() => {
					if (isCurrent()) serviceLoading.current = false;
				});
				return () => {
					live = false;
					controller.abort();
					serviceLoading.current = false;
					busyRef.current = false;
					pageGeneration.current += 1;
				};
			}, [active, serviceRetry]);
			const retryService = () => {
				if (!activeRef.current || serviceLoading.current || busyRef.current) return;
				serviceLoading.current = true;
				setServiceRetry((value) => value + 1);
			};
			(0, react.useEffect)(() => {
				if (!serviceReady) return;
				let live = true;
				let checking = false;
				const generation = pageGeneration.current;
				const checkOnFocus = () => {
					if (!activeRef.current || accounts.length === 0 || busyRef.current || checking) return;
					checking = true;
					Promise.all(accounts.map((account) => api("account-check-login", { id: account.id }))).then((rows) => {
						if (live && activeRef.current && pageGeneration.current === generation && !busyRef.current) setAccounts(rows);
					}).catch(() => {}).finally(() => {
						checking = false;
					});
				};
				window.addEventListener("focus", checkOnFocus);
				return () => {
					live = false;
					window.removeEventListener("focus", checkOnFocus);
				};
			}, [
				accounts,
				busy,
				serviceReady
			]);
			const act = async (label, task) => {
				if (!activeRef.current || !serviceReady || busyRef.current) return;
				const generation = pageGeneration.current;
				const isCurrent = () => activeRef.current && pageGeneration.current === generation;
				busyRef.current = true;
				setBusy(label);
				clearTip();
				try {
					await task(isCurrent);
				} catch (cause) {
					if (isCurrent()) showError(cause instanceof Error ? cause.message : "操作失败");
				} finally {
					if (isCurrent()) {
						busyRef.current = false;
						setBusy("");
					}
				}
			};
			const openLogin = async (account, isCurrent, added = false) => {
				if (!isCurrent()) return false;
				setBusy("正在打开登录页…");
				setLoginErrors((current) => {
					const next = { ...current };
					delete next[account.id];
					return next;
				});
				try {
					const result = await api("account-open-login", { id: account.id });
					if (!isCurrent()) return false;
					if (result?.navigationFailed) {
						setLoginErrors((current) => ({
							...current,
							[account.id]: "登录窗口已打开，但平台页面未完成加载。请检查窗口，必要时点击此账号的“登录”重试，无需重复添加。"
						}));
						return false;
					}
					return true;
				} catch (cause) {
					if (!isCurrent()) return false;
					const detail = cause instanceof Error ? cause.message : "操作失败";
					const message = `${added ? "账号已添加" : "账号已保留"}，登录窗口打开失败：${detail}。请点击此账号的“登录”重试，无需重复添加。`;
					setLoginErrors((current) => ({
						...current,
						[account.id]: message
					}));
					showError(message);
					return false;
				}
			};
			const create = () => act("正在创建账号…", async (isCurrent) => {
				if (platform === "wxmp" && !displayName.trim()) throw new Error("请填写公众号名称");
				const account = await api("accounts", {
					displayName,
					platform,
					...platform === "wxmp" ? {
						appId,
						appSecret
					} : {}
				});
				if (!isCurrent()) return;
				setAccounts((rows) => rows.some((row) => row.id === account.id) ? rows.map((row) => row.id === account.id ? account : row) : [...rows, account]);
				setDisplayName("");
				setAppId("");
				setAppSecret("");
				if (account.platform !== "wxmp" && !await openLogin(account, isCurrent, true)) return;
				await refresh(isCurrent);
				if (isCurrent()) showSuccess(account.platform === "wxmp" ? "公众号已添加，请检查接口状态。" : "登录窗口已打开；完成登录后回到 e宝工坊检查状态和账号名称。");
			});
			const rename = (account) => {
				setNextName(account.displayName);
				setDialog({
					kind: "rename",
					account
				});
			};
			const remove = (account) => {
				setDialog({
					kind: "delete",
					account
				});
			};
			const closeDialog = () => {
				if (!busyRef.current) setDialog(void 0);
			};
			const saveRename = () => {
				if (busyRef.current || dialog?.kind !== "rename") return;
				const name = nextName.trim();
				if (!name || name === dialog.account.displayName) return;
				const account = dialog.account;
				act("正在保存…", async (isCurrent) => {
					await api("account-update", {
						id: account.id,
						displayName: name
					});
					if (!isCurrent()) return;
					setDialog(void 0);
					await refresh(isCurrent);
				});
			};
			const confirmRemove = () => {
				if (busyRef.current || dialog?.kind !== "delete") return;
				const account = dialog.account;
				act("正在删除…", async (isCurrent) => {
					await api("account-delete", { id: account.id });
					if (!isCurrent()) return;
					setDialog(void 0);
					await refresh(isCurrent);
				});
			};
			const inspectImport = () => act("正在检查旧账号…", async (isCurrent) => {
				const result = await api("import-preview");
				if (isCurrent()) setPreview(result);
			});
			const applyImport = () => act("正在复制旧账号…", async (isCurrent) => {
				if (preview?.running) throw new Error("请先完全退出独立 MatrixMedia");
				await api("import-apply", {});
				if (!isCurrent()) return;
				setPreview(void 0);
				await refresh(isCurrent);
				if (isCurrent()) showSuccess("导入完成。已复制旧 session，原 MatrixMedia 数据未移动或删除；请检查登录状态。");
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
				serviceState === "loading" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pub-muted",
					role: "status",
					children: "正在启动 MatrixMedia 发布服务…"
				}),
				serviceState === "error" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "pub-error",
					role: "alert",
					children: [
						"发布服务启动失败：",
						serviceError,
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pub-actions",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								size: "sm",
								onClick: retryService,
								children: "重试启动服务"
							})
						})
					]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "pub-grid pub-account-layout",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-account-list-head",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "账号列表" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "pub-muted",
							children: serviceReady ? `已添加 ${accounts.length} 个平台账号` : "正在等待发布服务就绪"
						})] }), accounts.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "outline",
							size: "sm",
							disabled: actionsDisabled,
							onClick: () => void act("正在刷新…", refresh),
							children: "刷新列表"
						})]
					}), accounts.length === 0 ? serviceReady && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-card pub-empty",
						children: [
							"还没有发布账号",
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("br", {}),
							"请添加账号并完成平台登录。"
						]
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pub-account-cards",
						children: accounts.map((account) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
							className: "pub-account-card",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pub-account-card-head",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
											className: "pub-account-icon",
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PlatformIcon, { platform: account.platform })
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "pub-account-identity",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: account.displayName }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
												PLATFORM_LABELS[account.platform],
												" · 支持：",
												platformCapabilities.find((item) => item.platform === account.platform)?.contentTypes.map((type) => CONTENT_LABELS[type]).join("、") || "验收中"
											] })]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
											className: "pub-status",
											tone: account.loginState === "logged-in" ? "success" : account.loginState === "logged-out" ? "warning" : "neutral",
											children: account.platform === "wxmp" ? account.loginState === "logged-in" ? "凭据有效" : account.loginState === "logged-out" ? "凭据或网络异常" : "状态未知" : account.loginState === "logged-in" ? "已登录" : account.loginState === "logged-out" ? "需要登录" : "状态未知"
										})
									]
								}),
								account.platform === "wxmp" && account.loginError && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: "pub-account-error",
									children: account.loginError
								}),
								loginErrors[account.id] && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: "pub-warn",
									role: "alert",
									children: loginErrors[account.id]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pub-account-card-actions",
									role: "group",
									"aria-label": `${account.displayName}的账号操作`,
									children: [
										account.platform !== "wxmp" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "outline",
											size: "sm",
											disabled: actionsDisabled,
											onClick: () => void act("正在打开登录页…", async (isCurrent) => {
												await openLogin(account, isCurrent);
											}),
											children: account.loginState === "logged-in" ? "重新登录" : "登录"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "outline",
											size: "sm",
											disabled: actionsDisabled,
											onClick: () => void act("正在检查…", async (isCurrent) => {
												const next = await api("account-check-login", { id: account.id });
												if (isCurrent()) setAccounts((rows) => rows.map((row) => row.id === next.id ? next : row));
											}),
											children: "检查状态"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "outline",
											size: "sm",
											disabled: actionsDisabled,
											onClick: () => void act("正在打开后台…", async () => {
												await api("account-open-dashboard", { id: account.id });
											}),
											children: "打开平台后台"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "outline",
											size: "sm",
											disabled: actionsDisabled,
											onClick: () => rename(account),
											children: "改名"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "outline",
											size: "sm",
											className: "pub-danger-action",
											disabled: actionsDisabled,
											onClick: () => remove(account),
											children: "删除"
										})
									]
								})
							]
						}, account.id))
					})] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-card",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "添加账号" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pub-field",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
									htmlFor: "pub-account-platform",
									children: "平台"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
									id: "pub-account-platform",
									className: "pub-input",
									value: platform,
									onChange: (event) => setPlatform(event.target.value),
									children: PLATFORMS.map((value) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value,
										children: PLATFORM_LABELS[value]
									}, value))
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pub-field",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										htmlFor: "pub-account-name",
										children: ["账号名称", platform === "wxmp" ? "" : "（选填）"]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
										id: "pub-account-name",
										className: "pub-input-wrap",
										maxLength: 100,
										placeholder: platform === "wxmp" ? "例如：品牌公众号" : "留空则在登录后尝试识别平台昵称",
										value: displayName,
										onChange: (event) => setDisplayName(event.target.value)
									}),
									platform !== "wxmp" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", {
										className: "pub-muted",
										children: "识别不到时可在账号列表中改名。"
									})
								]
							}),
							platform === "wxmp" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pub-field",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
										htmlFor: "pub-wxmp-app-id",
										children: "公众号 AppID"
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
										id: "pub-wxmp-app-id",
										className: "pub-input-wrap",
										autoComplete: "off",
										value: appId,
										onChange: (event) => setAppId(event.target.value)
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pub-field",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
										htmlFor: "pub-wxmp-app-secret",
										children: "公众号 AppSecret"
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
										id: "pub-wxmp-app-secret",
										className: "pub-input-wrap",
										type: "password",
										autoComplete: "new-password",
										value: appSecret,
										onChange: (event) => setAppSecret(event.target.value)
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: "pub-muted",
									children: "使用公众号官方接口；请在微信公众平台确认草稿与发布权限，并配置本机出口 IP 白名单。密钥在本机加密保存。"
								})
							] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								size: "sm",
								variant: "primary",
								disabled: actionsDisabled,
								onClick: () => void create(),
								children: busy || (platform === "wxmp" ? "添加公众号" : "添加并打开登录页")
							}),
							capability?.legacyAccountImportSupported === false && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "pub-muted",
								children: "Windows 暂不支持导入独立 MatrixMedia 账号；请直接添加账号并登录。"
							}),
							capability?.legacyAccountImportSupported !== false && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pub-import",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "导入 MatrixMedia 账号" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										className: "pub-muted",
										children: "只复制 macOS 默认目录里的账号和 session；不会移动或删除原数据。导入前必须完全退出独立 MatrixMedia。"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										size: "sm",
										variant: "outline",
										disabled: actionsDisabled,
										onClick: () => void inspectImport(),
										children: "预览可导入账号"
									}),
									preview && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										style: { marginTop: 14 },
										children: preview.accounts.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
											className: "pub-muted",
											children: "没有发现可导入账号。"
										}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
												className: preview.running ? "pub-error" : "pub-muted",
												children: preview.running ? "检测到独立 MatrixMedia 仍在运行，请先退出。" : `发现 ${String(preview.accounts.length)} 个账号：`
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
												className: "pub-tags",
												children: preview.accounts.map((item, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
													tone: "neutral",
													children: [
														PLATFORM_LABELS[item.platform],
														" · ",
														item.displayName
													]
												}, `${item.platform}:${item.displayName}:${String(index)}`))
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
												className: "pub-actions",
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
													size: "sm",
													variant: "primary",
													disabled: preview.running || actionsDisabled,
													onClick: () => void applyImport(),
													children: "确认复制并导入"
												})
											})
										] })
									})
								]
							})
						]
					}) })]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherModal, {
					open: dialog?.kind === "rename",
					onClose: closeDialog,
					title: "修改账号名称",
					closeLabel: "关闭",
					className: "pub-modal-account",
					footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						size: "sm",
						variant: "outline",
						disabled: busy !== "",
						onClick: closeDialog,
						children: "取消"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						size: "sm",
						variant: "primary",
						type: "submit",
						form: "pub-account-rename-form",
						disabled: actionsDisabled || !nextName.trim() || nextName.trim() === dialog?.account.displayName,
						children: busy || "保存名称"
					})] }),
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("form", {
						id: "pub-account-rename-form",
						className: "pub-modal-field",
						onSubmit: (event) => {
							event.preventDefault();
							saveRename();
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
							className: "pub-modal-label",
							htmlFor: "pub-account-next-name",
							children: "新的账号名称"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
							id: "pub-account-next-name",
							className: "pub-input-wrap",
							"data-pub-initial-focus": true,
							maxLength: 100,
							value: nextName,
							disabled: busy !== "",
							onChange: (event) => setNextName(event.target.value)
						})]
					})
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherModal, {
					open: dialog?.kind === "delete",
					onClose: closeDialog,
					title: "删除账号",
					description: dialog?.kind === "delete" ? `删除“${dialog.account.displayName}”并清理其登录 session？` : "",
					closeLabel: "关闭",
					className: "pub-modal-account",
					footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						size: "sm",
						variant: "outline",
						"data-pub-initial-focus": true,
						disabled: busy !== "",
						onClick: closeDialog,
						children: "取消"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						size: "sm",
						variant: "outline",
						className: "pub-danger-action",
						disabled: actionsDisabled,
						onClick: confirmRemove,
						children: busy || "确认删除"
					})] }),
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-modal-copy",
						children: "历史提交记录会保留账号名称快照。"
					})
				})
			] });
		}
		//#endregion
		//#region src/client/internal-workspace-visibility.tsx
		const TARGETS = ["sidebar.workspaces", "conversation.hero.workspace"];
		const MARK = Symbol.for("cqai-publisher.internal-workspace-visibility.rc2");
		const EMPTY = () => ({
			phase: "pending",
			value: {
				workspaceIds: [],
				sessionIds: []
			}
		});
		function decodeVisibility(value) {
			if (!value || typeof value !== "object") throw new Error("Invalid Publisher visibility metadata");
			const data = value;
			const normalize = (ids) => {
				if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string" || !id || id.length > 512)) throw new Error("Invalid Publisher visibility identities");
				return [...new Set(ids)].sort();
			};
			return {
				workspaceIds: normalize(data.workspaceIds),
				sessionIds: normalize(data.sessionIds)
			};
		}
		var VisibilityStore = class {
			snapshot = EMPTY();
			listeners = /* @__PURE__ */ new Set();
			operation;
			controller;
			dirty = false;
			owners = 0;
			getSnapshot = () => this.snapshot;
			subscribe = (listener) => {
				this.listeners.add(listener);
				return () => {
					this.listeners.delete(listener);
				};
			};
			refresh = () => {
				if (this.owners === 0) return Promise.resolve();
				this.dirty = true;
				const markPending = () => {
					if (this.snapshot.phase === "pending") return;
					this.snapshot = {
						phase: "pending",
						value: this.snapshot.value
					};
					this.listeners.forEach((listener) => listener());
				};
				if (this.operation) {
					markPending();
					return this.operation;
				}
				const controller = new AbortController();
				this.controller = controller;
				this.operation = (async () => {
					await Promise.resolve();
					if (controller.signal.aborted) return;
					do {
						this.dirty = false;
						try {
							const response = await fetch("/api/cqai-publisher/internal-workspace-visibility", { signal: controller.signal });
							if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) throw new Error("Publisher visibility unavailable");
							const value = decodeVisibility(await response.json());
							if (controller.signal.aborted) return;
							if (!this.dirty) {
								const stableValue = JSON.stringify(value) === JSON.stringify(this.snapshot.value) ? this.snapshot.value : value;
								this.snapshot = {
									phase: "ready",
									value: stableValue
								};
								this.listeners.forEach((listener) => listener());
							}
						} catch {
							if (controller.signal.aborted) return;
						}
					} while (this.dirty);
				})().finally(() => {
					if (this.controller === controller) {
						this.controller = void 0;
						this.operation = void 0;
					}
				});
				markPending();
				return this.operation;
			};
			release() {
				if (--this.owners > 0) return;
				this.controller?.abort();
				this.controller = void 0;
				this.operation = void 0;
				this.dirty = false;
				this.snapshot = EMPTY();
				this.listeners.forEach((listener) => listener());
			}
		};
		const STORE = Symbol.for("cqai-publisher.internal-workspace-visibility.store.rc2");
		const globals$1 = globalThis;
		const store = globals$1[STORE] ??= new VisibilityStore();
		const getPublisherWorkspaceVisibilitySnapshot = store.getSnapshot;
		const subscribePublisherWorkspaceVisibility = store.subscribe;
		const refreshPublisherWorkspaceVisibility = store.refresh;
		/** Immutable display projections; ordinary source conversations survive even in the same cwd. */
		function createPublisherVisibilityProjector(visibility) {
			const hiddenWorkspaces = new Set(visibility.workspaceIds);
			const hiddenSessions = new Set(visibility.sessionIds);
			const workspaceCache = /* @__PURE__ */ new WeakMap();
			const sessionCache = /* @__PURE__ */ new WeakMap();
			const filterIds = (ids) => {
				const result = ids.filter((id) => !hiddenSessions.has(id));
				return result.length === ids.length ? ids : result;
			};
			return {
				workspaces(snapshot) {
					if (!snapshot || !Array.isArray(snapshot.items) || !Array.isArray(snapshot.archivedSessionIds) || !Array.isArray(snapshot.pinnedSessionIds) || snapshot.items.some((item) => !item || !Array.isArray(item.sessionIds))) return snapshot;
					const cached = workspaceCache.get(snapshot);
					if (cached) return cached;
					let changed = false;
					const items = snapshot.items.filter((item) => !hiddenWorkspaces.has(item.workspaceId)).map((item) => {
						const sessionIds = filterIds(item.sessionIds);
						if (sessionIds === item.sessionIds) return item;
						changed = true;
						return {
							...item,
							sessionIds
						};
					});
					const archivedSessionIds = filterIds(snapshot.archivedSessionIds);
					const pinnedSessionIds = filterIds(snapshot.pinnedSessionIds);
					const result = items.length !== snapshot.items.length || changed || archivedSessionIds !== snapshot.archivedSessionIds || pinnedSessionIds !== snapshot.pinnedSessionIds ? {
						...snapshot,
						items,
						archivedSessionIds,
						pinnedSessionIds
					} : snapshot;
					workspaceCache.set(snapshot, result);
					return result;
				},
				sessions(snapshot) {
					if (!snapshot || !Array.isArray(snapshot.ids) || !snapshot.byId || !snapshot.projectionsBySession) return snapshot;
					const cached = sessionCache.get(snapshot);
					if (cached) return cached;
					const ids = filterIds(snapshot.ids);
					const hasHidden = Object.keys(snapshot.byId).some((id) => hiddenSessions.has(id)) || Object.keys(snapshot.projectionsBySession).some((id) => hiddenSessions.has(id));
					const result = ids !== snapshot.ids || hasHidden ? {
						...snapshot,
						ids,
						byId: Object.fromEntries(Object.entries(snapshot.byId).filter(([id]) => !hiddenSessions.has(id))),
						projectionsBySession: Object.fromEntries(Object.entries(snapshot.projectionsBySession).filter(([id]) => !hiddenSessions.has(id)))
					} : snapshot;
					sessionCache.set(snapshot, result);
					return result;
				},
				search(result) {
					if (!result || !Array.isArray(result.items)) return result;
					const items = result.items.filter((item) => !hiddenSessions.has(item.sessionId));
					return items.length === result.items.length ? result : {
						...result,
						items
					};
				}
			};
		}
		function adapterOf(component) {
			return typeof component === "function" ? component[MARK] : void 0;
		}
		function isOfficialEntry(entry, target) {
			const original = adapterOf(entry.component)?.original ?? entry.component;
			const expected = target === "sidebar.workspaces" ? "WorkspaceBrowser" : "WorkspacePicker";
			if (typeof original !== "function" || original.name !== expected) return false;
			if (entry.locale !== "workspace") return false;
			const child = target === "sidebar.workspaces" ? "sidebar.workspaces.directoryFlow" : "conversation.hero.workspace.directoryFlow";
			if (!entry.children?.[child]) return false;
			return !entry.registrant || entry.registrant.includes("dsh-client-ui-workspace") || !entry.registrant.includes("plugin");
		}
		function makeRecord(original) {
			const record = {
				original,
				owners: /* @__PURE__ */ new Set()
			};
			function PublisherWorkspaceVisibilityAdapter(props) {
				const snapshot = (0, react.useSyncExternalStore)(store.subscribe, store.getSnapshot, store.getSnapshot);
				const projected = (0, react.useMemo)(() => createPublisherVisibilityProjector(snapshot.value), [snapshot]);
				return (0, react.createElement)(original, (0, react.useMemo)(() => {
					const next = { ...props };
					if (typeof props.useWorkspaces === "function") {
						const useWorkspaces = props.useWorkspaces;
						next.useWorkspaces = (select, equal) => useWorkspaces((state) => select(projected.workspaces(state)), equal);
					}
					if (typeof props.useSessions === "function") {
						const useSessions = props.useSessions;
						next.useSessions = (select, equal) => useSessions((state) => select(projected.sessions(state)), equal);
					}
					if (typeof props.searchSessions === "function") {
						const searchSessions = props.searchSessions;
						next.searchSessions = async (query, signal) => {
							const result = await searchSessions(query, signal);
							return createPublisherVisibilityProjector(store.getSnapshot().value).search(result);
						};
					}
					return next;
				}, [props, projected]));
			}
			record.wrapper = PublisherWorkspaceVisibilityAdapter;
			Object.defineProperty(record.wrapper, MARK, { value: record });
			return record;
		}
		/**
		* Rc.2 compatibility adapter over the public registration inspection face.
		* Keep the original entry identity, store and authorized child-slot dispatcher.
		* Unsupported components remain unchanged; this does not patch DS source or domain services.
		*/
		function registerPublisherWorkspaceVisibility(ctx) {
			const slots = ctx.slots;
			if (typeof slots?.entriesOfSlot !== "function" || typeof slots.subscribe !== "function") return () => {};
			const owner = {};
			const installed = /* @__PURE__ */ new Map();
			const cleanup = [];
			let disposed = false;
			store.owners += 1;
			const invalidate = (target) => {
				try {
					if (typeof slots.register === "function" && slots.entriesOfSlot(target).length) slots.register({
						name: target,
						priority: Number.MAX_SAFE_INTEGER
					}, () => null)();
				} catch (error) {
					if (error && typeof error === "object" && "code" in error && error.code === "INACTIVE_EFFECT") return;
					throw error;
				}
			};
			const install = (target) => {
				if (disposed) return;
				for (const entry of slots.entriesOfSlot(target)) {
					if (!isOfficialEntry(entry, target)) continue;
					let record = adapterOf(entry.component);
					if (!record) {
						record = makeRecord(entry.component);
						entry.component = record.wrapper;
						invalidate(target);
					}
					if (installed.get(entry) === record) continue;
					record.owners.add(owner);
					installed.set(entry, record);
				}
			};
			for (const target of TARGETS) {
				cleanup.push(slots.subscribe(target, () => install(target)));
				install(target);
			}
			const domains = ctx;
			for (const source of [domains.sessions?.list, domains.workspaces?.list]) {
				if (!source?.subscribe || !source.getSnapshot) continue;
				let last = JSON.stringify(source.getSnapshot(), (key, value) => {
					return [
						"byId",
						"projectionsBySession",
						"updatedAt",
						"retainedBy",
						"running"
					].includes(key) ? void 0 : value;
				});
				cleanup.push(source.subscribe(() => {
					const next = JSON.stringify(source.getSnapshot(), (key, value) => {
						return [
							"byId",
							"projectionsBySession",
							"updatedAt",
							"retainedBy",
							"running"
						].includes(key) ? void 0 : value;
					});
					if (next !== last) {
						last = next;
						store.refresh();
					}
				}));
			}
			if (typeof window !== "undefined") {
				const refresh = () => {
					store.refresh();
				};
				window.addEventListener("cqai-publisher-content-change", refresh);
				cleanup.push(() => window.removeEventListener("cqai-publisher-content-change", refresh));
			}
			store.refresh();
			return () => {
				if (disposed) return;
				disposed = true;
				const errors = [];
				try {
					for (const dispose of cleanup.reverse()) try {
						dispose();
					} catch (error) {
						errors.push(error);
					}
					for (const [entry, record] of installed) {
						record.owners.delete(owner);
						if (record.owners.size === 0 && entry.component === record.wrapper) {
							entry.component = record.original;
							const target = entry.children?.["sidebar.workspaces.directoryFlow"] ? TARGETS[0] : TARGETS[1];
							try {
								invalidate(target);
							} catch (error) {
								errors.push(error);
							}
						}
					}
				} finally {
					store.release();
				}
				if (errors.length) throw new AggregateError(errors, "Publisher workspace visibility cleanup failed");
			};
		}
		//#endregion
		//#region src/client/handoff.ts
		const STORAGE_KEY = "cqai-publisher-handoff";
		const EVENT_NAME = "cqai-publisher-handoff";
		const UUID$1 = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;
		let pendingHandoff;
		const DELIVERY_KEY = "cqai-publisher-auto-delivery";
		const DELIVERY_STORE = Symbol.for("cqai-publisher.auto-delivery");
		const globals = globalThis;
		const delivered = globals[DELIVERY_STORE] ??= /* @__PURE__ */ new Set();
		/** Claim a fresh live task once, including across client HMR and source-history reopening. */
		function claimPublisherAutoHandoff(sessionId, taskId) {
			if (!sessionId || !taskId || sessionId.length > 512 || taskId.length > 512) return false;
			const key = `${sessionId}/${taskId}`;
			try {
				const values = JSON.parse(window.sessionStorage.getItem(DELIVERY_KEY) ?? "[]");
				if (Array.isArray(values)) {
					for (const value of values.slice(-2048)) if (typeof value === "string") delivered.add(value);
				}
			} catch {}
			if (delivered.has(key)) return false;
			delivered.add(key);
			if (delivered.size > 2048) delivered.delete(delivered.values().next().value);
			try {
				window.sessionStorage.setItem(DELIVERY_KEY, JSON.stringify([...delivered]));
			} catch {}
			return true;
		}
		function valid(value) {
			if (typeof value !== "object" || value === null) return false;
			const candidate = value;
			return typeof candidate.contentId === "string" && UUID$1.test(candidate.contentId) && (candidate.contentType === "article" || candidate.contentType === "image-note" || candidate.contentType === "video") && (candidate.initialMode === void 0 || [
				"edit",
				"preview",
				"publish"
			].includes(candidate.initialMode)) && (candidate.platforms === void 0 || Array.isArray(candidate.platforms) && candidate.platforms.length > 0 && candidate.platforms.every((platform) => PLATFORMS.includes(platform)) && new Set(candidate.platforms).size === candidate.platforms.length);
		}
		/** Session storage also covers a handoff sent before the publisher panel mounts and page reloads. */
		function readPublisherHandoff() {
			try {
				const value = window.sessionStorage.getItem(STORAGE_KEY);
				if (!value) return pendingHandoff;
				try {
					const parsed = JSON.parse(value);
					if (valid(parsed)) {
						pendingHandoff = parsed;
						return parsed;
					}
				} catch {}
				window.sessionStorage.removeItem(STORAGE_KEY);
				pendingHandoff = void 0;
			} catch {}
			return pendingHandoff;
		}
		/** Update the remembered selection without restarting a panel handoff. */
		function rememberPublisherHandoff(input) {
			if (!valid(input)) throw new Error("发布草稿 ID 或类型无效");
			pendingHandoff = input.platforms ? {
				...input,
				platforms: [...input.platforms]
			} : input;
			try {
				window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pendingHandoff));
			} catch {}
		}
		function clearPublisherHandoff() {
			pendingHandoff = void 0;
			try {
				window.sessionStorage.removeItem(STORAGE_KEY);
			} catch {}
		}
		/** Save first so a panel mounted by the following layout navigation reads the exact draft. */
		function requestPublisherHandoff(input) {
			rememberPublisherHandoff(input);
			window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: input }));
		}
		function subscribePublisherHandoff(listener) {
			const onHandoff = (event) => {
				const input = event.detail;
				if (valid(input)) listener(input);
			};
			window.addEventListener(EVENT_NAME, onHandoff);
			return () => window.removeEventListener(EVENT_NAME, onHandoff);
		}
		//#endregion
		//#region src/client/article-handoff-card.tsx
		const HANDOFF_STATUS_EVENT = "cqai-publisher-handoff-status";
		const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;
		async function articleHandoffApi(path, body, signal) {
			const response = await fetch(`${API}/${path}`, {
				...body === void 0 ? {} : {
					method: "POST",
					headers: {
						"content-type": "application/json",
						"x-ejianbao": "1"
					},
					body: JSON.stringify(body)
				},
				signal
			});
			const value = await response.json();
			if (!response.ok) throw new Error(value.error ?? "文章转交失败，请重试");
			return value;
		}
		function parseArticleHandoffId(result) {
			if (result.isError) return null;
			for (const block of result.content) {
				if (block.type !== "text" || typeof block.text !== "string") continue;
				try {
					const record = JSON.parse(block.text);
					if (record && typeof record === "object" && !Array.isArray(record)) {
						const id = record.handoff_id ?? record.handoffId;
						if (typeof id === "string" && UUID.test(id)) return id;
					}
				} catch {}
			}
			return null;
		}
		function parseAutomaticArticleHandoff(result) {
			const handoffId = parseArticleHandoffId(result);
			if (!handoffId) return null;
			for (const block of result.content) {
				if (block.type !== "text" || typeof block.text !== "string") continue;
				try {
					const value = JSON.parse(block.text);
					if (value?.auto_open === true && value.handoff_id === handoffId && typeof value.task_id === "string" && value.task_id.length > 0 && value.task_id.length <= 512) return {
						handoffId,
						taskId: value.task_id
					};
				} catch {}
			}
			return null;
		}
		/** Observe live input and append deltas; history replacement never authorizes automatic navigation. */
		function watchAutomaticPublisherHandoffs(sessions, layout, onOpen) {
			if (typeof sessions.binding !== "function") return () => {};
			let flow;
			let disposed = false;
			const selected = () => {
				if (layout.panelInfo.getSnapshot().activePanelId !== null) return void 0;
				const visibility = getPublisherWorkspaceVisibilitySnapshot();
				const list = sessions.list.getSnapshot();
				const references = list.ids.filter((id) => (sessions.retainInfo(id).getSnapshot().retainedBy.mainView ?? 0) > 0);
				if (references.length !== 1 || list.byId[references[0]]?.origin === "subagent" || visibility.value.sessionIds.includes(references[0])) return void 0;
				if (visibility.phase !== "ready" && flow?.id !== references[0]) return void 0;
				return references[0];
			};
			const stillSelected = (owner) => !disposed && flow === owner && selected() === owner.id;
			const current = (owner) => stillSelected(owner) && !owner.signal?.aborted;
			const maybeOpen = (owner) => {
				if (!current(owner) || !owner.task || !owner.finished || !owner.signal || owner.opening || owner.binding.session.getSnapshot().running || owner.binding.session.getSnapshot().removed) return;
				owner.opening = true;
				const { handoffId, taskId } = owner.task;
				articleHandoffApi("article-handoff-open", {
					sessionId: owner.id,
					handoffId
				}, owner.signal).then((result) => {
					if (!current(owner) || result.handoff.source.sessionId !== owner.id || result.handoff.handoffId !== handoffId || result.handoff.delegation?.taskId !== taskId || !["article", "image-note"].includes(result.content.contentType)) return;
					onOpen(result);
				}).catch((cause) => {
					if (current(owner) && typeof window !== "undefined") window.dispatchEvent(new CustomEvent(HANDOFF_STATUS_EVENT, { detail: {
						sessionId: owner.id,
						handoffId,
						error: errorMessage(cause)
					} }));
				});
			};
			const sessionChanged = (owner) => {
				if (!stillSelected(owner)) return;
				for (const pending of owner.binding.session.getSnapshot().pendingSubmissions) {
					if (owner.prompts.has(pending.requestId)) continue;
					owner.prompts.add(pending.requestId);
					owner.request?.abort();
					owner.request = new AbortController();
					owner.signal = AbortSignal.any([owner.request.signal, layout.beginNavigation()]);
					owner.turn = void 0;
					owner.finished = false;
					owner.task = void 0;
					owner.opening = false;
				}
				maybeOpen(owner);
			};
			const eventsChanged = (owner) => {
				if (!current(owner)) return;
				const window = owner.binding.eventSource.getSnapshot();
				if (window.revision === owner.revision) return;
				owner.revision = window.revision;
				if (window.change.kind !== "append" || !owner.signal) return;
				for (const entry of window.change.entries) {
					if (entry.type !== "event") continue;
					const event = entry.event;
					if (event.type === "turn/start" && owner.turn === void 0) owner.turn = event.data.turn;
					if (event.type === "tool/result" && event.data.turn === owner.turn) {
						const callId = event.data.message.source?.callId ?? event.data.message.toolCallId;
						const call = window.entries.findLast((item) => item.type === "event" && item.event.type === "tool/call" && item.event.data.callId === callId);
						if (call?.type !== "event" || call.event.type !== "tool/call" || call.event.data.name !== "handoff_to_publisher") continue;
						const task = parseAutomaticArticleHandoff(event.data.message);
						if (task && claimPublisherAutoHandoff(owner.id, task.taskId)) owner.task = task;
					}
					if (event.type === "tool/ptc-dispatch" && event.data.name === "handoff_to_publisher" && event.data.isError === false) {
						const root = window.entries.findLast((item) => item.type === "event" && item.event.type === "tool/call" && item.event.data.callId === event.data.rootCallId);
						if (root?.type !== "event" || root.event.type !== "tool/call" || root.event.data.name !== "run_code" || owner.turn === void 0 || root.event.data.turn !== owner.turn) continue;
						const task = parseAutomaticArticleHandoff(event.data);
						if (task && claimPublisherAutoHandoff(owner.id, task.taskId)) owner.task = task;
					}
					if (event.type === "turn/end" && event.data.turn === owner.turn) owner.finished = event.data.reason.kind === "completed";
				}
				maybeOpen(owner);
			};
			const reconcile = () => {
				if (disposed) return;
				const id = selected(), binding = id ? sessions.binding(id) : void 0;
				if (flow?.id === id && flow?.binding === binding) {
					if (flow) maybeOpen(flow);
					return;
				}
				flow?.dispose();
				flow = void 0;
				if (!id || !binding) return;
				const snapshot = binding.session.getSnapshot();
				const owner = {
					id,
					binding,
					prompts: new Set(snapshot.pendingSubmissions.map((item) => item.requestId)),
					revision: binding.eventSource.getSnapshot().revision,
					dispose: () => {}
				};
				flow = owner;
				const removeSession = binding.session.subscribe(() => sessionChanged(owner));
				const removeEvents = binding.eventSource.subscribe(() => eventsChanged(owner));
				owner.dispose = () => {
					owner.request?.abort();
					removeEvents();
					removeSession();
				};
			};
			const cleanup = [
				sessions.list.subscribe(reconcile),
				layout.panelInfo.subscribe(reconcile),
				subscribePublisherWorkspaceVisibility(reconcile)
			];
			reconcile();
			return () => {
				disposed = true;
				flow?.dispose();
				flow = void 0;
				cleanup.forEach((dispose) => dispose());
			};
		}
		function articleHandoffIds(rows) {
			const ids = /* @__PURE__ */ new Set();
			const visit = (block) => {
				if ("kind" in block && block.kind === "tool-result" && block.call?.name === "handoff_to_publisher") {
					const id = parseArticleHandoffId(block);
					if (id) ids.add(id);
				}
				block.subCalls.forEach(visit);
			};
			rows.forEach((row) => visit(row.root));
			return [...ids];
		}
		function ArticleHandoffToolView(props) {
			if (props.phase !== "result") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				role: "status",
				children: "正在交给多平台发布…"
			});
			return parseArticleHandoffId(props.block) ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				role: "status",
				children: "已交给多平台发布，请在任务卡片查看进度。"
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				role: "alert",
				children: "转交准备失败，请检查来源后重试。"
			});
		}
		const handoffCardCss = `
.pub-handoff-card { box-sizing: border-box; width: min(100%, 420px); min-width: 0; display: flex; flex-direction: column; gap: 8px; padding: 12px; border: 1px solid var(--dsw-alias-border-l2, #e4e6e9); border-radius: 10px; background: var(--dsw-alias-bg-base, #fff); color: var(--dsw-alias-label-primary, #111318); font-family: var(--dsw-font-family, inherit); }
.pub-handoff-main { display: flex; align-items: center; gap: 10px; min-width: 0; }
.pub-handoff-icon { display: grid; place-items: center; flex: 0 0 32px; height: 32px; border-radius: 8px; background: var(--dsw-alias-bg-l2, #f4f5f7); color: var(--dsw-alias-label-secondary, #62666d); }
.pub-handoff-text { flex: 1; min-width: 0; }
.pub-handoff-title { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; font-weight: 500; line-height: 20px; }
.pub-handoff-meta { display: flex; align-items: center; gap: 6px; min-width: 0; color: var(--dsw-alias-label-secondary, #62666d); font-size: 12px; line-height: 18px; }
.pub-handoff-platforms { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pub-handoff-status, .pub-handoff-separator { flex-shrink: 0; }
.pub-handoff-open { flex-shrink: 0; width: auto; min-height: 28px; }
.pub-handoff-note { margin: 0; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow-wrap: anywhere; color: var(--dsw-alias-label-secondary, #62666d); font-size: 12px; line-height: 18px; }
.pub-handoff-error { color: var(--dsw-alias-text-error, #b42318); }
`;
		const handoffStatusLabels = {
			queued: "待处理",
			running: "处理中",
			completed: "Agent 已回复",
			failed: "未完成",
			interrupted: "已中断"
		};
		function ArticleHandoffCard({ sessionId, handoffId, beginNavigation, onOpen }) {
			const [handoff, setHandoff] = (0, react.useState)();
			const [error, setError] = (0, react.useState)("");
			const [busy, setBusy] = (0, react.useState)(false);
			const controller = (0, react.useRef)();
			const generation = (0, react.useRef)(0);
			(0, react.useEffect)(() => {
				const request = new AbortController();
				const current = ++generation.current;
				let timer;
				let remaining = 60;
				let active = false;
				setHandoff(void 0);
				setError("");
				setBusy(false);
				const load = async () => {
					try {
						const value = await articleHandoffApi(`article-handoff/${encodeURIComponent(sessionId)}/${encodeURIComponent(handoffId)}`, void 0, request.signal);
						if (value.handoffId !== handoffId || value.source.sessionId !== sessionId) throw new Error("文章转交与当前对话不匹配");
						if (request.signal.aborted || generation.current !== current) return;
						setHandoff(value);
						setError("");
						active = value.delegation?.status === "queued" || value.delegation?.status === "running";
					} catch (cause) {
						if (!request.signal.aborted && generation.current === current) setError(errorMessage(cause));
					}
					if (active && !request.signal.aborted && generation.current === current && remaining-- > 0) timer = setTimeout(() => void load(), 4e3);
				};
				const changed = (event) => {
					const detail = event.detail;
					if (detail?.sessionId === sessionId && detail.handoffId === handoffId && detail.error) setError(detail.error);
				};
				window.addEventListener(HANDOFF_STATUS_EVENT, changed);
				load();
				return () => {
					request.abort();
					controller.current?.abort();
					if (timer) clearTimeout(timer);
					window.removeEventListener(HANDOFF_STATUS_EVENT, changed);
					generation.current += 1;
				};
			}, [sessionId, handoffId]);
			const open = async () => {
				if (busy || !handoff) return;
				const navigation = beginNavigation();
				const request = new AbortController();
				controller.current = request;
				const current = generation.current;
				setBusy(true);
				setError("");
				try {
					const value = await articleHandoffApi("article-handoff-open", {
						sessionId,
						handoffId
					}, AbortSignal.any([navigation, request.signal]));
					if (value.handoff.handoffId !== handoffId || value.handoff.source.sessionId !== sessionId || !["article", "image-note"].includes(value.content.contentType)) throw new Error("转交结果不匹配");
					if (!navigation.aborted && !request.signal.aborted && generation.current === current) onOpen(value);
				} catch (cause) {
					if (!navigation.aborted && !request.signal.aborted && generation.current === current) setError(errorMessage(cause));
				} finally {
					if (generation.current === current) setBusy(false);
				}
			};
			const title = handoff?.title || "发布草稿";
			const platforms = handoff?.platforms.map((platform) => PLATFORM_LABELS[platform]).join("、") || "多平台发布";
			const status = handoff?.delegation ? handoffStatusLabels[handoff.delegation.status] : handoff ? "草稿已准备" : error ? "读取失败" : "正在读取…";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				"aria-label": "文章转交",
				className: "pub-handoff-card",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("style", { children: handoffCardCss }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-handoff-main",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "pub-handoff-icon",
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
									width: "18",
									height: "18",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "1.5",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M14 3v6h6M8 13h8M8 17h5" })]
								})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pub-handoff-text",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", {
									className: "pub-handoff-title",
									title,
									children: title
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pub-handoff-meta",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pub-handoff-platforms",
											title: platforms,
											children: platforms
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pub-handoff-separator",
											"aria-hidden": "true",
											children: "·"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pub-handoff-status",
											role: "status",
											"aria-live": "polite",
											children: status
										})
									]
								})]
							}),
							handoff && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								className: "pub-handoff-open",
								size: "sm",
								variant: "outline",
								disabled: busy,
								"aria-busy": busy,
								onClick: () => void open(),
								children: busy ? "打开中…" : "打开草稿"
							})
						]
					}),
					handoff?.delegation?.error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-handoff-note pub-handoff-error",
						title: handoff.delegation.error,
						children: handoff.delegation.error
					}),
					handoff && handoff.source.kind !== "creation-brief" && handoff.sourceChanged && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-handoff-note",
						children: "原稿已更新，可在草稿中检查更新。"
					}),
					handoff && handoff.source.kind !== "creation-brief" && !handoff.sourceAvailable && !handoff.contentId && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-handoff-note",
						children: "原稿已不可用，文章副本仍可转交。"
					}),
					error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-handoff-note pub-handoff-error",
						role: "alert",
						title: error,
						children: error
					})
				]
			});
		}
		function ArticleHandoffTurnTail({ turn, sessionId, useChat, ...navigation }) {
			const nodes = useChat((snapshot) => snapshot.nodes);
			const source = (0, react.useMemo)(() => nodes.turnDataSource(turn.turn, "tool-call"), [nodes, turn.turn]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: {
					display: "grid",
					gap: 12
				},
				children: articleHandoffIds((0, react.useSyncExternalStore)(source.subscribe, source.getSnapshot, source.getSnapshot)).map((handoffId) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ArticleHandoffCard, {
					sessionId,
					handoffId,
					...navigation
				}, `${sessionId}/${handoffId}`))
			});
		}
		const sourceControlsCss = `
.pub-card.pub-source-card { padding: 16px; }
.pub-source-card > summary { display: flex; align-items: center; gap: 8px; cursor: pointer; list-style: none; color: var(--pub-text, var(--dsw-alias-label-primary, #111318)); font-size: 13px; font-weight: 600; line-height: 20px; }
.pub-source-card > summary::-webkit-details-marker { display: none; }
.pub-source-card > summary::marker { content: ''; }
.pub-source-card > summary:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; border-radius: 3px; }
.pub-source-kind { margin-left: auto; color: var(--pub-secondary-text, var(--dsw-alias-label-secondary, #62666d)); font-size: 12px; font-weight: 400; }
.pub-source-chevron { flex: none; }
.pub-source-card[open] .pub-source-chevron { transform: rotate(180deg); }
.pub-source-body { display: grid; gap: 12px; min-width: 0; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--pub-border, var(--dsw-alias-border-l2, #e4e6e9)); font-size: 13px; line-height: 1.65; }
.pub-source-body p { margin: 0; white-space: pre-wrap; overflow-wrap: anywhere; }
.pub-source-label { color: var(--pub-secondary-text, var(--dsw-alias-label-secondary, #62666d)); font-size: 12px; }
.pub-source-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.pub-source-confirm { display: grid; gap: 8px; }
`;
		function ArticleSourceControls({ contentId, active, busy, onReturn, onUpdate }) {
			const [origin, setOrigin] = (0, react.useState)();
			const [error, setError] = (0, react.useState)("");
			const [refresh, setRefresh] = (0, react.useState)(0);
			const [confirm, setConfirm] = (0, react.useState)(false);
			const [operation, setOperation] = (0, react.useState)(false);
			const [expanded, setExpanded] = (0, react.useState)(false);
			const generation = (0, react.useRef)(0);
			(0, react.useEffect)(() => {
				setExpanded(false);
			}, [contentId]);
			(0, react.useEffect)(() => {
				if (!active) return;
				const controller = new AbortController(), current = ++generation.current;
				setOrigin(void 0);
				setError("");
				setConfirm(false);
				setOperation(false);
				articleHandoffApi(`article-origin/${encodeURIComponent(contentId)}`, void 0, controller.signal).then((value) => {
					if (!controller.signal.aborted && generation.current === current && value?.contentId === contentId) setOrigin(value);
				}).catch((cause) => {
					if (!controller.signal.aborted && generation.current === current) setError(errorMessage(cause));
				});
				return () => {
					controller.abort();
					generation.current += 1;
				};
			}, [
				active,
				contentId,
				refresh
			]);
			if (!origin) return error ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
				role: "status",
				children: ["来源信息暂时无法读取。", /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					size: "sm",
					variant: "outline",
					onClick: () => setRefresh((value) => value + 1),
					children: "重试"
				})]
			}) : null;
			const update = async () => {
				if (operation || busy) return;
				const current = generation.current;
				setOperation(true);
				setError("");
				try {
					await onUpdate(origin);
					if (generation.current === current) {
						setConfirm(false);
						setRefresh((value) => value + 1);
					}
				} catch (cause) {
					if (generation.current === current) setError(errorMessage(cause));
				} finally {
					if (generation.current === current) setOperation(false);
				}
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
				"aria-label": "文章来源",
				className: "pub-card pub-source-card",
				open: expanded,
				onToggle: (event) => setExpanded(event.currentTarget.open),
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("summary", { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "来源与要求" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "pub-source-kind",
							children: origin.source.kind === "markdown" ? "原稿" : origin.source.kind === "creation-brief" ? "创作任务" : "内容回复"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
							className: "pub-source-chevron",
							width: "14",
							height: "14",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "1.6",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m6 9 6 6 6-6" })
						})
					] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("style", { children: sourceControlsCss }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-source-body",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
								className: "pub-source-label",
								children: ["来自", origin.source.kind === "markdown" ? `原稿「${origin.source.fileName ?? origin.title}」` : origin.source.kind === "creation-brief" ? "外部对话的创作任务" : "外部对话的内容回复"]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pub-source-actions",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										size: "sm",
										variant: "outline",
										disabled: busy || operation || origin.sourceSessionAvailable === false,
										onClick: () => {
											onReturn(origin.source.sessionId).catch((cause) => setError(errorMessage(cause)));
										},
										children: "返回来源对话"
									}),
									origin.source.kind !== "creation-brief" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										size: "sm",
										variant: "outline",
										disabled: busy || operation,
										onClick: () => setRefresh((value) => value + 1),
										children: "检查原稿更新"
									}),
									origin.source.kind !== "creation-brief" && origin.sourceChanged && origin.sourceAvailable && origin.updateReady && origin.sourceSessionAvailable !== false && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										size: "sm",
										variant: "outline",
										disabled: busy || operation,
										onClick: () => setConfirm(true),
										children: "更新正文和配图"
									})
								]
							}),
							origin.instructions && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "发布要求：" }), origin.instructions] }),
							origin.creationBrief && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "创作需求：" }), origin.creationBrief] }),
							origin.sourceSessionAvailable === false && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								role: "status",
								children: "来源对话已删除或归档，发布草稿可以继续编辑。"
							}),
							origin.source.kind !== "creation-brief" && origin.sourceChanged && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								role: "status",
								children: "原稿已更新，当前发布稿保留你已有的编辑。"
							}),
							origin.source.kind !== "creation-brief" && origin.sourceChanged && origin.sourceAvailable && !origin.updateReady && origin.sourceSessionAvailable !== false && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "请返回来源对话重新转交最新原稿，查看新版本后再更新发布稿。" }),
							origin.source.kind !== "creation-brief" && !origin.sourceAvailable && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								role: "status",
								children: "原稿已不可用，发布稿中的内容和配图仍可使用。"
							}),
							confirm && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pub-source-confirm",
								role: "group",
								"aria-label": "确认更新原稿",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "更新将替换发布主稿的标题、正文，并导入新配图。原有素材和平台版本保留。请确认已审阅原稿的新版本。" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pub-source-actions",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										size: "sm",
										variant: "outline",
										disabled: operation,
										onClick: () => setConfirm(false),
										children: "保留当前发布稿"
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										size: "sm",
										variant: "primary",
										disabled: busy || operation,
										onClick: () => void update(),
										children: operation ? "正在更新…" : "确认更新原稿"
									})]
								})]
							}),
							error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								role: "alert",
								children: error
							})
						]
					})
				]
			});
		}
		//#endregion
		//#region src/client/internal-workspace-navigation.ts
		const GUARD = Symbol.for("cqai-publisher.internal-workspace-navigation.rc2");
		const CORDIS_ORIGINAL = Symbol.for("cordis.original");
		/** Match DS Workspace navigation order while excluding Publisher-owned folders. */
		function visibleTarget(owner, hidden) {
			const workspace = owner.services.workspaces.list.getSnapshot();
			const sessions = owner.services.sessions.list.getSnapshot();
			const current = Object.keys(sessions.byId).find((id) => {
				return (owner.services.sessions.retainInfo(id).getSnapshot().retainedBy.mainView ?? 0) > 0;
			});
			const currentWorkspace = current === void 0 ? void 0 : workspace.items.find((item) => item.sessionIds.includes(current));
			if (currentWorkspace && !hidden.has(currentWorkspace.workspaceId)) return currentWorkspace.workspaceId;
			if (workspace.phase !== "ready" || sessions.phase !== "ready") return void 0;
			let selected;
			let selectedTime = Number.NEGATIVE_INFINITY;
			for (const item of workspace.items) {
				if (hidden.has(item.workspaceId)) continue;
				let latest = Number.NEGATIVE_INFINITY;
				for (const id of item.sessionIds) {
					const session = sessions.byId[id];
					if (session !== void 0) latest = Math.max(latest, session.updatedAt);
				}
				if (latest === Number.NEGATIVE_INFINITY) latest = Date.parse(item.createdAt);
				if (selected === void 0 || latest > selectedTime) {
					selected = item.workspaceId;
					selectedTime = latest;
				}
			}
			return selected;
		}
		/**
		* New Conversation keeps DS's ordinary Workspace behavior, but never inherits
		* Publisher's internal Workspace. It does not create, hide or delete domain rows.
		*/
		function registerPublisherNewConversationGuard(ctx, services) {
			const service = services.uiWorkspace[CORDIS_ORIGINAL] ?? services.uiWorkspace;
			if (typeof service?.startSession !== "function") return () => {};
			let guard = service.startSession[GUARD];
			if (!guard) {
				guard = {
					original: service.startSession,
					originalDescriptor: Object.getOwnPropertyDescriptor(service, "startSession"),
					wrapper: void 0,
					owners: []
				};
				const record = guard;
				record.wrapper = function(workspaceId) {
					const owner = record.owners.at(-1);
					if (!owner || owner.disposed) return record.original.call(this, workspaceId);
					const generation = ++owner.generation;
					const invoke = () => {
						const visibility = getPublisherWorkspaceVisibilitySnapshot();
						if (visibility.phase !== "ready") return;
						const hidden = new Set(visibility.value.workspaceIds);
						if (hidden.size === 0 || workspaceId !== void 0 && !hidden.has(workspaceId)) {
							record.original.call(this, workspaceId);
							return;
						}
						const target = visibleTarget(owner, hidden);
						if (target !== void 0) record.original.call(this, target);
					};
					if (getPublisherWorkspaceVisibilitySnapshot().phase === "ready") {
						invoke();
						return;
					}
					const navigation = owner.ctx.layout.beginNavigation();
					refreshPublisherWorkspaceVisibility().then(() => {
						if (owner.disposed || owner.generation !== generation || navigation.aborted || record.owners.at(-1) !== owner || service.startSession !== record.wrapper) return;
						invoke();
					}).catch(() => {});
				};
				Object.defineProperty(record.wrapper, GUARD, { value: record });
				Object.defineProperty(service, "startSession", {
					configurable: true,
					writable: true,
					enumerable: guard.originalDescriptor?.enumerable ?? false,
					value: record.wrapper
				});
			}
			const owner = {
				ctx,
				services,
				generation: 0,
				disposed: false
			};
			guard.owners.push(owner);
			const record = guard;
			return () => {
				if (owner.disposed) return;
				owner.disposed = true;
				owner.generation += 1;
				record.owners = record.owners.filter((item) => item !== owner);
				if (record.owners.length || service.startSession !== record.wrapper) return;
				if (record.originalDescriptor) Object.defineProperty(service, "startSession", record.originalDescriptor);
				else delete service.startSession;
			};
		}
		//#endregion
		//#region src/client/agent-panel.tsx
		const PUBLISHER_AGENT_SLOT = "publisher.agent";
		const PUBLISHER_AGENT_REFERENCE_SOURCE = "publisherView";
		const SHORTCUTS = {
			article: [
				{
					label: "帮我写一篇文章",
					detail: "从选题、素材到完整草稿",
					icon: "write",
					prompt: "/publisher-write-article 帮我写一篇文章。先读取当前草稿和写作偏好，结合已有内容；缺少选题、素材或受众时，先问我必要的信息，再创作并保存到当前稿件。"
				},
				{
					label: "整理素材成文",
					detail: "把笔记和资料整理成文章",
					icon: "write",
					prompt: "/publisher-write-article 帮我把素材整理成文章。先读取当前草稿和已有素材；如果还没有素材，请让我提供笔记、资料或附件，再基于真实材料写作并保存到当前稿件。"
				},
				{
					label: "为文章配图",
					detail: "结合正文准备合适的图片",
					icon: "image",
					prompt: "/publisher-illustrate-article 帮我为当前文章生成并插入合适的配图。先读取正文；如果还没有正文，先让我提供或完成文章，再根据内容配图。"
				}
			],
			"image-note": [
				{
					label: "写小红书图文",
					detail: "整理标题、文案和分享重点",
					icon: "write",
					prompt: "/publisher-write-article 帮我写一篇适合小红书分享的图文。先读取当前图文草稿和写作偏好，结合已有图片与素材；缺少主题或真实素材时先问我，再把标题和文案保存到当前编辑目标，不切换稿件或编辑目标。"
				},
				{
					label: "写抖音图文",
					detail: "突出开头和图文表达节奏",
					icon: "write",
					prompt: "/publisher-write-article 帮我写一篇适合抖音发布的图文。先读取当前图文草稿和写作偏好，结合已有图片与素材；缺少主题或真实素材时先问我，再把标题和文案保存到当前编辑目标，不切换稿件或编辑目标。"
				},
				{
					label: "整理图文素材",
					detail: "梳理图片顺序和配套文字",
					icon: "image",
					prompt: "/publisher-edit-draft 帮我整理当前图文稿件的图片顺序和配套文字。先读取当前草稿和已有素材；缺少图片或分享主题时先问我，确认内容后保存到当前编辑目标。"
				}
			],
			video: [
				{
					label: "准备视频文案",
					detail: "起标题、写简介和话题",
					icon: "write",
					prompt: "/publisher-edit-draft 帮我准备当前视频的标题、简介、短标题和话题。先读取当前视频草稿和已有成片信息；缺少视频内容或发布需求时先问我，再保存到当前编辑目标。"
				},
				{
					label: "选择已有成片",
					detail: "从已有视频作品中选择",
					icon: "video",
					prompt: "/publisher-edit-draft 帮我为当前视频稿件选择已有成片。先读取当前草稿并列出可用的视频作品，让我选择后再关联到当前稿件；不要自动替换已关联的成片。"
				},
				{
					label: "整理发布信息",
					detail: "检查标题、封面和内容说明",
					icon: "video",
					prompt: "/publisher-edit-draft 帮我检查和整理当前视频稿件的发布信息，包括标题、封面、简介、话题和内容声明。先读取当前草稿，说明还缺什么，结合我的补充更新当前编辑目标，只准备草稿，不提交发布。"
				}
			]
		};
		function ShortcutIcon({ kind }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: "20",
				height: "20",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				"aria-hidden": "true",
				children: kind === "write" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(react_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M14 3v6h6M14 3l6 6M8 13h8M8 17h5" }) }) : kind === "image" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
						x: "3",
						y: "3",
						width: "18",
						height: "18",
						rx: "3"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
						cx: "8",
						cy: "8",
						r: "1.5"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m21 15-5-5L5 21" })
				] }) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
					x: "3",
					y: "5",
					width: "18",
					height: "14",
					rx: "3"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m10 9 5 3-5 3Z" })] })
			});
		}
		function PublisherChatHistory({ contentType, renderSlot, useSession, useChat, useInput, useProjection, inputActions }) {
			const session = useSession((value) => value);
			const chatEmpty = useChat((chat) => chat.order.length === 0 && chat.nodes.values().length === 0 && chat.timeline.turnOrder.length === 0);
			const input = useInput((value) => value);
			const inboxEmpty = useProjection("inbox", (inbox) => Boolean(inbox && inbox["next-turn"].length === 0 && inbox["next-step"].length === 0));
			const empty = session.openState === "open" && session.blank && !session.hasMore && !session.removed && !session.running && !session.awaitingFirstTurn && session.pendingSubmissions.length === 0 && chatEmpty && inboxEmpty;
			const available = empty && input.phase === "plain" && input.queue.length === 0 && !input.draft.trim() && input.attachmentIds.length === 0;
			const starting = (0, react.useRef)(false);
			const [error, setError] = (0, react.useState)("");
			(0, react.useEffect)(() => {
				if (available) starting.current = false;
			}, [available]);
			const start = (shortcut) => {
				if (!available || starting.current) return;
				starting.current = true;
				setError("");
				try {
					inputActions.setDraft(shortcut.prompt);
					inputActions.submit();
				} catch {
					starting.current = false;
					setError("暂时无法开始，请重试或在下方输入需求。");
				}
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "pub-agent-history",
				children: [
					available && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("nav", {
						className: "pub-agent-shortcuts",
						"aria-label": "创作快捷方式",
						"data-content-type": contentType,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "pub-agent-shortcuts-hint",
							children: "从这里开始，也可以直接告诉我你的需求"
						}), SHORTCUTS[contentType].map((shortcut) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "pub-agent-shortcut",
							onClick: () => start(shortcut),
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "pub-agent-shortcut-icon",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ShortcutIcon, { kind: shortcut.icon })
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "pub-agent-shortcut-copy",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: shortcut.label }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: shortcut.detail })]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "pub-agent-shortcut-arrow",
									"aria-hidden": "true",
									children: "↗"
								})
							]
						}, shortcut.label))]
					}),
					empty && error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-agent-shortcuts-error",
						role: "alert",
						children: error
					}),
					renderSlot("conversation.session", { view: "chat" })
				]
			});
		}
		function ArticleChatHistory(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherChatHistory, {
				...props,
				contentType: "article"
			}, props.sessionId);
		}
		function ImageNoteChatHistory(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherChatHistory, {
				...props,
				contentType: "image-note"
			}, props.sessionId);
		}
		function VideoChatHistory(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherChatHistory, {
				...props,
				contentType: "video"
			}, props.sessionId);
		}
		const HISTORY_VIEWS = {
			article: ArticleChatHistory,
			"image-note": ImageNoteChatHistory,
			video: VideoChatHistory
		};
		function NoPublisherWidthControls(_props) {
			return null;
		}
		/** Delegate input, transcript and pending interactions to DSH's public embedded Factory. */
		function PublisherAgentPanel({ contentType, renderFactorySlot }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("section", {
				className: "pub-agent-conversation",
				"aria-label": "稿件 Agent 对话",
				"data-content-type": contentType,
				children: renderFactorySlot("conversation.content", {
					variant: "embedded",
					phase: "active",
					hero: false
				}, {
					slots: {
						views: HISTORY_VIEWS[contentType],
						widthControls: NoPublisherWidthControls
					},
					fallback: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						role: "status",
						children: "Agent 输入组件尚未就绪，请稍后重试。"
					})
				})
			});
		}
		/** Wait for the Publisher main entry's declaration; unload leaves the global Conversation intact. */
		function registerPublisherAgent(ctx) {
			return ctx.slots.inject(PUBLISHER_AGENT_SLOT, () => ctx.slots.register({ name: PUBLISHER_AGENT_SLOT }, PublisherAgentPanel));
		}
		//#endregion
		//#region src/client/agent-splitter.tsx
		const WIDTH_STORAGE_KEY = "cqai.publisher.agent-panel-width";
		const MIN_AGENT_WIDTH = 280;
		const MIN_CONTENT_WIDTH = 360;
		const SPLITTER_WIDTH = 8;
		const OVERLAY_BREAKPOINT = 620;
		function savedWidth() {
			try {
				const value = Number(window.localStorage.getItem(WIDTH_STORAGE_KEY));
				return Number.isFinite(value) && value >= MIN_AGENT_WIDTH ? value : void 0;
			} catch {
				return;
			}
		}
		function storeWidth(width) {
			try {
				if (width === void 0) window.localStorage.removeItem(WIDTH_STORAGE_KEY);
				else window.localStorage.setItem(WIDTH_STORAGE_KEY, String(width));
			} catch {}
		}
		function maximumWidth(available) {
			return Math.max(MIN_AGENT_WIDTH, Math.floor(available - SPLITTER_WIDTH - MIN_CONTENT_WIDTH));
		}
		function fitWidth(width, available) {
			return Math.round(Math.max(MIN_AGENT_WIDTH, Math.min(width, maximumWidth(available))));
		}
		function defaultWidth(available) {
			return fitWidth(available <= 760 ? MIN_AGENT_WIDTH : Math.max(320, Math.min(available * .34, 440)), available);
		}
		/** Resize only the Publisher split; hiding or shrinking it never rewrites the user's preference. */
		function usePublisherAgentResize(surfaceRef, enabled) {
			const [width, setWidth] = (0, react.useState)();
			const [available, setAvailable] = (0, react.useState)(0);
			const [initialPreference] = (0, react.useState)(savedWidth);
			const preferred = (0, react.useRef)(initialPreference);
			const availableRef = (0, react.useRef)(0);
			const drag = (0, react.useRef)();
			const enabledRef = (0, react.useRef)(enabled);
			enabledRef.current = enabled;
			const finishDrag = (0, react.useCallback)((commit, update = true) => {
				const active = drag.current;
				if (!active) return;
				drag.current = void 0;
				active.surface?.removeAttribute("data-agent-resizing");
				if (commit && active.moved) {
					preferred.current = active.width;
					storeWidth(active.width);
				}
				if (update) setWidth(fitWidth(preferred.current ?? defaultWidth(availableRef.current), availableRef.current));
				try {
					active.target.releasePointerCapture(active.pointerId);
				} catch {}
			}, [surfaceRef]);
			(0, react.useEffect)(() => {
				const surface = surfaceRef.current;
				if (!surface) return;
				const measure = () => {
					const next = surface.getBoundingClientRect().width || surface.clientWidth;
					availableRef.current = next;
					setAvailable(next);
					if (!enabledRef.current || next <= OVERLAY_BREAKPOINT) finishDrag(false);
					if (next > 0) {
						const active = drag.current;
						const fitted = fitWidth(active?.width ?? preferred.current ?? defaultWidth(next), next);
						setWidth(fitted);
					}
				};
				measure();
				const observer = typeof ResizeObserver === "undefined" ? void 0 : new ResizeObserver(measure);
				observer?.observe(surface);
				if (!observer) window.addEventListener("resize", measure);
				return () => {
					observer?.disconnect();
					window.removeEventListener("resize", measure);
					finishDrag(false, false);
				};
			}, [
				surfaceRef,
				enabled,
				finishDrag
			]);
			const canResize = enabled && available > OVERLAY_BREAKPOINT;
			const shownWidth = width ?? defaultWidth(available);
			const reset = (0, react.useCallback)(() => {
				if (!enabledRef.current || availableRef.current <= OVERLAY_BREAKPOINT) return;
				finishDrag(false);
				preferred.current = void 0;
				storeWidth(void 0);
				setWidth(defaultWidth(availableRef.current));
			}, [finishDrag]);
			const onPointerDown = (0, react.useCallback)((event) => {
				if (!enabledRef.current || availableRef.current <= OVERLAY_BREAKPOINT || event.button !== 0 || event.isPrimary === false) return;
				event.preventDefault();
				finishDrag(false);
				const current = fitWidth(preferred.current ?? defaultWidth(availableRef.current), availableRef.current);
				drag.current = {
					pointerId: event.pointerId,
					startX: event.clientX,
					startWidth: current,
					width: current,
					moved: false,
					target: event.currentTarget,
					surface: surfaceRef.current
				};
				event.currentTarget.focus({ preventScroll: true });
				surfaceRef.current?.setAttribute("data-agent-resizing", "");
				try {
					event.currentTarget.setPointerCapture(event.pointerId);
				} catch {}
			}, [finishDrag, surfaceRef]);
			const onPointerMove = (0, react.useCallback)((event) => {
				const active = drag.current;
				if (!active || active.pointerId !== event.pointerId) return;
				active.moved ||= event.clientX !== active.startX;
				active.width = fitWidth(active.startWidth + event.clientX - active.startX, availableRef.current);
				setWidth(active.width);
			}, []);
			const onPointerUp = (0, react.useCallback)((event) => {
				if (drag.current?.pointerId === event.pointerId) finishDrag(true);
			}, [finishDrag]);
			const onPointerCancel = (0, react.useCallback)((event) => {
				if (drag.current?.pointerId === event.pointerId) finishDrag(false);
			}, [finishDrag]);
			(0, react.useEffect)(() => {
				const finish = (event) => {
					if (drag.current?.pointerId === event.pointerId) finishDrag(event.type === "pointerup");
				};
				const cancel = () => finishDrag(false);
				window.addEventListener("pointerup", finish);
				window.addEventListener("pointercancel", finish);
				window.addEventListener("blur", cancel);
				return () => {
					window.removeEventListener("pointerup", finish);
					window.removeEventListener("pointercancel", finish);
					window.removeEventListener("blur", cancel);
				};
			}, [finishDrag]);
			const onKeyDown = (0, react.useCallback)((event) => {
				if (!enabledRef.current || availableRef.current <= OVERLAY_BREAKPOINT || event.ctrlKey || event.altKey || event.metaKey) return;
				if (event.key === "Enter") {
					event.preventDefault();
					reset();
					return;
				}
				const current = fitWidth(preferred.current ?? defaultWidth(availableRef.current), availableRef.current);
				const step = event.shiftKey ? 64 : 16;
				const next = event.key === "ArrowLeft" ? current - step : event.key === "ArrowRight" ? current + step : event.key === "Home" ? MIN_AGENT_WIDTH : event.key === "End" ? maximumWidth(availableRef.current) : void 0;
				if (next === void 0) return;
				event.preventDefault();
				const fitted = fitWidth(next, availableRef.current);
				if (fitted === current) return;
				finishDrag(false);
				preferred.current = fitted;
				storeWidth(preferred.current);
				setWidth(preferred.current);
			}, [finishDrag, reset]);
			return {
				width,
				splitterProps: {
					tabIndex: canResize ? 0 : -1,
					"aria-hidden": canResize ? void 0 : true,
					"aria-valuemin": MIN_AGENT_WIDTH,
					"aria-valuemax": maximumWidth(available),
					"aria-valuenow": shownWidth,
					"aria-valuetext": `Agent 面板宽度 ${shownWidth} 像素，左右方向键调整，按 Enter 恢复默认`,
					onPointerDown,
					onPointerMove,
					onPointerUp,
					onPointerCancel,
					onLostPointerCapture: onPointerCancel,
					onKeyDown,
					onDoubleClick: reset
				}
			};
		}
		function PublisherAgentSplitter(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "pub-agent-splitter",
				role: "separator",
				"aria-label": "调整 Agent 面板宽度",
				"aria-orientation": "vertical",
				"aria-controls": "pub-agent-drawer",
				title: "拖动调整宽度 · 双击恢复默认",
				...props
			});
		}
		const agentSplitterCss = `
.pub-agent-splitter { position: relative; flex: 0 0 8px; min-width: 8px; min-height: 0; cursor: col-resize; touch-action: none; outline: none; background: transparent; }
.pub-agent-splitter::before { content: ''; position: absolute; top: 0; bottom: 0; left: 0; width: 1px; background: var(--dsw-alias-border-l1, #e4e6e9); }
.pub-agent-splitter:focus-visible { box-shadow: inset 0 0 0 2px var(--dsw-alias-state-business-primary, #4176e6); }
.pub-surface[data-agent-resizing], .pub-surface[data-agent-resizing] * { cursor: col-resize !important; user-select: none !important; -webkit-user-select: none !important; }
.pub-surface[data-agent-resizing] iframe { pointer-events: none; }
@container publisher-surface (max-width: 620px) { .pub-agent-splitter { display: none; } }
`;
		//#endregion
		//#region node_modules/mdurl/lib/decode.mjs
		const decodeCache = {};
		function getDecodeCache(exclude) {
			let cache = decodeCache[exclude];
			if (cache) return cache;
			cache = decodeCache[exclude] = [];
			for (let i = 0; i < 128; i++) {
				const ch = String.fromCharCode(i);
				cache.push(ch);
			}
			for (let i = 0; i < exclude.length; i++) {
				const ch = exclude.charCodeAt(i);
				cache[ch] = "%" + ("0" + ch.toString(16).toUpperCase()).slice(-2);
			}
			return cache;
		}
		function decode(string, exclude) {
			if (typeof exclude !== "string") exclude = decode.defaultChars;
			const cache = getDecodeCache(exclude);
			return string.replace(/(%[a-f0-9]{2})+/gi, function(seq) {
				let result = "";
				for (let i = 0, l = seq.length; i < l; i += 3) {
					const b1 = parseInt(seq.slice(i + 1, i + 3), 16);
					if (b1 < 128) {
						result += cache[b1];
						continue;
					}
					if ((b1 & 224) === 192 && i + 3 < l) {
						const b2 = parseInt(seq.slice(i + 4, i + 6), 16);
						if ((b2 & 192) === 128) {
							const chr = b1 << 6 & 1984 | b2 & 63;
							if (chr < 128) result += "��";
							else result += String.fromCharCode(chr);
							i += 3;
							continue;
						}
					}
					if ((b1 & 240) === 224 && i + 6 < l) {
						const b2 = parseInt(seq.slice(i + 4, i + 6), 16);
						const b3 = parseInt(seq.slice(i + 7, i + 9), 16);
						if ((b2 & 192) === 128 && (b3 & 192) === 128) {
							const chr = b1 << 12 & 61440 | b2 << 6 & 4032 | b3 & 63;
							if (chr < 2048 || chr >= 55296 && chr <= 57343) result += "���";
							else result += String.fromCharCode(chr);
							i += 6;
							continue;
						}
					}
					if ((b1 & 248) === 240 && i + 9 < l) {
						const b2 = parseInt(seq.slice(i + 4, i + 6), 16);
						const b3 = parseInt(seq.slice(i + 7, i + 9), 16);
						const b4 = parseInt(seq.slice(i + 10, i + 12), 16);
						if ((b2 & 192) === 128 && (b3 & 192) === 128 && (b4 & 192) === 128) {
							let chr = b1 << 18 & 1835008 | b2 << 12 & 258048 | b3 << 6 & 4032 | b4 & 63;
							if (chr < 65536 || chr > 1114111) result += "����";
							else {
								chr -= 65536;
								result += String.fromCharCode(55296 + (chr >> 10), 56320 + (chr & 1023));
							}
							i += 9;
							continue;
						}
					}
					result += "�";
				}
				return result;
			});
		}
		decode.defaultChars = ";/?:@&=+$,#";
		decode.componentChars = "";
		//#endregion
		//#region node_modules/mdurl/lib/encode.mjs
		const encodeCache = {};
		function getEncodeCache(exclude) {
			let cache = encodeCache[exclude];
			if (cache) return cache;
			cache = encodeCache[exclude] = [];
			for (let i = 0; i < 128; i++) {
				const ch = String.fromCharCode(i);
				if (/^[0-9a-z]$/i.test(ch)) cache.push(ch);
				else cache.push("%" + ("0" + i.toString(16).toUpperCase()).slice(-2));
			}
			for (let i = 0; i < exclude.length; i++) cache[exclude.charCodeAt(i)] = exclude[i];
			return cache;
		}
		function encode(string, exclude, keepEscaped) {
			if (typeof exclude !== "string") {
				keepEscaped = exclude;
				exclude = encode.defaultChars;
			}
			if (typeof keepEscaped === "undefined") keepEscaped = true;
			const cache = getEncodeCache(exclude);
			let result = "";
			for (let i = 0, l = string.length; i < l; i++) {
				const code = string.charCodeAt(i);
				if (keepEscaped && code === 37 && i + 2 < l) {
					if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
						result += string.slice(i, i + 3);
						i += 2;
						continue;
					}
				}
				if (code < 128) {
					result += cache[code];
					continue;
				}
				if (code >= 55296 && code <= 57343) {
					if (code >= 55296 && code <= 56319 && i + 1 < l) {
						const nextCode = string.charCodeAt(i + 1);
						if (nextCode >= 56320 && nextCode <= 57343) {
							result += encodeURIComponent(string[i] + string[i + 1]);
							i++;
							continue;
						}
					}
					result += "%EF%BF%BD";
					continue;
				}
				result += encodeURIComponent(string[i]);
			}
			return result;
		}
		encode.defaultChars = ";/?:@&=+$,-_.!~*'()#";
		encode.componentChars = "-_.!~*'()";
		//#endregion
		//#region node_modules/mdurl/lib/format.mjs
		function format(url) {
			let result = "";
			result += url.protocol || "";
			result += url.slashes ? "//" : "";
			result += url.auth ? url.auth + "@" : "";
			if (url.hostname && url.hostname.indexOf(":") !== -1) result += "[" + url.hostname + "]";
			else result += url.hostname || "";
			result += url.port ? ":" + url.port : "";
			result += url.pathname || "";
			result += url.search || "";
			result += url.hash || "";
			return result;
		}
		//#endregion
		//#region node_modules/mdurl/lib/parse.mjs
		function Url() {
			this.protocol = null;
			this.slashes = null;
			this.auth = null;
			this.port = null;
			this.hostname = null;
			this.hash = null;
			this.search = null;
			this.pathname = null;
		}
		const protocolPattern = /^([a-z0-9.+-]+:)/i;
		const portPattern = /:[0-9]*$/;
		const simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/;
		const unwise = [
			"{",
			"}",
			"|",
			"\\",
			"^",
			"`"
		].concat([
			"<",
			">",
			"\"",
			"`",
			" ",
			"\r",
			"\n",
			"	"
		]);
		const autoEscape = ["'"].concat(unwise);
		const nonHostChars = [
			"%",
			"/",
			"?",
			";",
			"#"
		].concat(autoEscape);
		const hostEndingChars = [
			"/",
			"?",
			"#"
		];
		const hostnameMaxLen = 255;
		const hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/;
		const hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/;
		const hostlessProtocol = {
			javascript: true,
			"javascript:": true
		};
		const slashedProtocol = {
			http: true,
			https: true,
			ftp: true,
			gopher: true,
			file: true,
			"http:": true,
			"https:": true,
			"ftp:": true,
			"gopher:": true,
			"file:": true
		};
		function urlParse(url, slashesDenoteHost) {
			if (url && url instanceof Url) return url;
			const u = new Url();
			u.parse(url, slashesDenoteHost);
			return u;
		}
		Url.prototype.parse = function(url, slashesDenoteHost) {
			let lowerProto, hec, slashes;
			let rest = url;
			rest = rest.trim();
			if (!slashesDenoteHost && url.split("#").length === 1) {
				const simplePath = simplePathPattern.exec(rest);
				if (simplePath) {
					this.pathname = simplePath[1];
					if (simplePath[2]) this.search = simplePath[2];
					return this;
				}
			}
			let proto = protocolPattern.exec(rest);
			if (proto) {
				proto = proto[0];
				lowerProto = proto.toLowerCase();
				this.protocol = proto;
				rest = rest.substr(proto.length);
			}
			if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
				slashes = rest.substr(0, 2) === "//";
				if (slashes && !(proto && hostlessProtocol[proto])) {
					rest = rest.substr(2);
					this.slashes = true;
				}
			}
			if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
				let hostEnd = -1;
				for (let i = 0; i < hostEndingChars.length; i++) {
					hec = rest.indexOf(hostEndingChars[i]);
					if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
				}
				let auth, atSign;
				if (hostEnd === -1) atSign = rest.lastIndexOf("@");
				else atSign = rest.lastIndexOf("@", hostEnd);
				if (atSign !== -1) {
					auth = rest.slice(0, atSign);
					rest = rest.slice(atSign + 1);
					this.auth = auth;
				}
				hostEnd = -1;
				for (let i = 0; i < nonHostChars.length; i++) {
					hec = rest.indexOf(nonHostChars[i]);
					if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
				}
				if (hostEnd === -1) hostEnd = rest.length;
				if (rest[hostEnd - 1] === ":") hostEnd--;
				const host = rest.slice(0, hostEnd);
				rest = rest.slice(hostEnd);
				this.parseHost(host);
				this.hostname = this.hostname || "";
				const ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
				if (!ipv6Hostname) {
					const hostparts = this.hostname.split(/\./);
					for (let i = 0, l = hostparts.length; i < l; i++) {
						const part = hostparts[i];
						if (!part) continue;
						if (!part.match(hostnamePartPattern)) {
							let newpart = "";
							for (let j = 0, k = part.length; j < k; j++) if (part.charCodeAt(j) > 127) newpart += "x";
							else newpart += part[j];
							if (!newpart.match(hostnamePartPattern)) {
								const validParts = hostparts.slice(0, i);
								const notHost = hostparts.slice(i + 1);
								const bit = part.match(hostnamePartStart);
								if (bit) {
									validParts.push(bit[1]);
									notHost.unshift(bit[2]);
								}
								if (notHost.length) rest = notHost.join(".") + rest;
								this.hostname = validParts.join(".");
								break;
							}
						}
					}
				}
				if (this.hostname.length > hostnameMaxLen) this.hostname = "";
				if (ipv6Hostname) this.hostname = this.hostname.substr(1, this.hostname.length - 2);
			}
			const hash = rest.indexOf("#");
			if (hash !== -1) {
				this.hash = rest.substr(hash);
				rest = rest.slice(0, hash);
			}
			const qm = rest.indexOf("?");
			if (qm !== -1) {
				this.search = rest.substr(qm);
				rest = rest.slice(0, qm);
			}
			if (rest) this.pathname = rest;
			if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) this.pathname = "";
			return this;
		};
		Url.prototype.parseHost = function(host) {
			let port = portPattern.exec(host);
			if (port) {
				port = port[0];
				if (port !== ":") this.port = port.substr(1);
				host = host.substr(0, host.length - port.length);
			}
			if (host) this.hostname = host;
		};
		//#endregion
		//#region node_modules/mdurl/index.mjs
		var mdurl_exports = /* @__PURE__ */ __exportAll({
			decode: () => decode,
			encode: () => encode,
			format: () => format,
			parse: () => urlParse
		});
		//#endregion
		//#region node_modules/uc.micro/properties/Any/regex.mjs
		var regex_default$5 = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
		//#endregion
		//#region node_modules/uc.micro/categories/Cc/regex.mjs
		var regex_default$4 = /[\0-\x1F\x7F-\x9F]/;
		//#endregion
		//#region node_modules/uc.micro/categories/Cf/regex.mjs
		var regex_default$3 = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/;
		//#endregion
		//#region node_modules/uc.micro/categories/P/regex.mjs
		var regex_default$2 = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/;
		//#endregion
		//#region node_modules/uc.micro/categories/S/regex.mjs
		var regex_default$1 = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC2\uFD40-\uFD4F\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF76\uDF7B-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC5\uDECE-\uDEDB\uDEE0-\uDEE8\uDEF0-\uDEF8\uDF00-\uDF92\uDF94-\uDFCA]/;
		//#endregion
		//#region node_modules/uc.micro/categories/Z/regex.mjs
		var regex_default = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;
		//#endregion
		//#region node_modules/uc.micro/index.mjs
		var uc_micro_exports = /* @__PURE__ */ __exportAll({
			Any: () => regex_default$5,
			Cc: () => regex_default$4,
			Cf: () => regex_default$3,
			P: () => regex_default$2,
			S: () => regex_default$1,
			Z: () => regex_default
		});
		//#endregion
		//#region node_modules/markdown-it/node_modules/entities/lib/esm/generated/decode-data-html.js
		var decode_data_html_default = new Uint16Array("ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻\"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻\xA0ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌".split("").map((c) => c.charCodeAt(0)));
		//#endregion
		//#region node_modules/markdown-it/node_modules/entities/lib/esm/generated/decode-data-xml.js
		var decode_data_xml_default = new Uint16Array("Ȁaglq	\x1Bɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map((c) => c.charCodeAt(0)));
		//#endregion
		//#region node_modules/markdown-it/node_modules/entities/lib/esm/decode_codepoint.js
		var _a;
		const decodeMap = /* @__PURE__ */ new Map([
			[0, 65533],
			[128, 8364],
			[130, 8218],
			[131, 402],
			[132, 8222],
			[133, 8230],
			[134, 8224],
			[135, 8225],
			[136, 710],
			[137, 8240],
			[138, 352],
			[139, 8249],
			[140, 338],
			[142, 381],
			[145, 8216],
			[146, 8217],
			[147, 8220],
			[148, 8221],
			[149, 8226],
			[150, 8211],
			[151, 8212],
			[152, 732],
			[153, 8482],
			[154, 353],
			[155, 8250],
			[156, 339],
			[158, 382],
			[159, 376]
		]);
		/**
		* Polyfill for `String.fromCodePoint`. It is used to create a string from a Unicode code point.
		*/
		const fromCodePoint$1 = (_a = String.fromCodePoint) !== null && _a !== void 0 ? _a : function(codePoint) {
			let output = "";
			if (codePoint > 65535) {
				codePoint -= 65536;
				output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
				codePoint = 56320 | codePoint & 1023;
			}
			output += String.fromCharCode(codePoint);
			return output;
		};
		/**
		* Replace the given code point with a replacement character if it is a
		* surrogate or is outside the valid range. Otherwise return the code
		* point unchanged.
		*/
		function replaceCodePoint(codePoint) {
			var _a;
			if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) return 65533;
			return (_a = decodeMap.get(codePoint)) !== null && _a !== void 0 ? _a : codePoint;
		}
		//#endregion
		//#region node_modules/markdown-it/node_modules/entities/lib/esm/decode.js
		var CharCodes;
		(function(CharCodes) {
			CharCodes[CharCodes["NUM"] = 35] = "NUM";
			CharCodes[CharCodes["SEMI"] = 59] = "SEMI";
			CharCodes[CharCodes["EQUALS"] = 61] = "EQUALS";
			CharCodes[CharCodes["ZERO"] = 48] = "ZERO";
			CharCodes[CharCodes["NINE"] = 57] = "NINE";
			CharCodes[CharCodes["LOWER_A"] = 97] = "LOWER_A";
			CharCodes[CharCodes["LOWER_F"] = 102] = "LOWER_F";
			CharCodes[CharCodes["LOWER_X"] = 120] = "LOWER_X";
			CharCodes[CharCodes["LOWER_Z"] = 122] = "LOWER_Z";
			CharCodes[CharCodes["UPPER_A"] = 65] = "UPPER_A";
			CharCodes[CharCodes["UPPER_F"] = 70] = "UPPER_F";
			CharCodes[CharCodes["UPPER_Z"] = 90] = "UPPER_Z";
		})(CharCodes || (CharCodes = {}));
		/** Bit that needs to be set to convert an upper case ASCII character to lower case */
		const TO_LOWER_BIT = 32;
		var BinTrieFlags;
		(function(BinTrieFlags) {
			BinTrieFlags[BinTrieFlags["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
			BinTrieFlags[BinTrieFlags["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
			BinTrieFlags[BinTrieFlags["JUMP_TABLE"] = 127] = "JUMP_TABLE";
		})(BinTrieFlags || (BinTrieFlags = {}));
		function isNumber(code) {
			return code >= CharCodes.ZERO && code <= CharCodes.NINE;
		}
		function isHexadecimalCharacter(code) {
			return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_F || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_F;
		}
		function isAsciiAlphaNumeric(code) {
			return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_Z || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_Z || isNumber(code);
		}
		/**
		* Checks if the given character is a valid end character for an entity in an attribute.
		*
		* Attribute values that aren't terminated properly aren't parsed, and shouldn't lead to a parser error.
		* See the example in https://html.spec.whatwg.org/multipage/parsing.html#named-character-reference-state
		*/
		function isEntityInAttributeInvalidEnd(code) {
			return code === CharCodes.EQUALS || isAsciiAlphaNumeric(code);
		}
		var EntityDecoderState;
		(function(EntityDecoderState) {
			EntityDecoderState[EntityDecoderState["EntityStart"] = 0] = "EntityStart";
			EntityDecoderState[EntityDecoderState["NumericStart"] = 1] = "NumericStart";
			EntityDecoderState[EntityDecoderState["NumericDecimal"] = 2] = "NumericDecimal";
			EntityDecoderState[EntityDecoderState["NumericHex"] = 3] = "NumericHex";
			EntityDecoderState[EntityDecoderState["NamedEntity"] = 4] = "NamedEntity";
		})(EntityDecoderState || (EntityDecoderState = {}));
		var DecodingMode;
		(function(DecodingMode) {
			/** Entities in text nodes that can end with any character. */
			DecodingMode[DecodingMode["Legacy"] = 0] = "Legacy";
			/** Only allow entities terminated with a semicolon. */
			DecodingMode[DecodingMode["Strict"] = 1] = "Strict";
			/** Entities in attributes have limitations on ending characters. */
			DecodingMode[DecodingMode["Attribute"] = 2] = "Attribute";
		})(DecodingMode || (DecodingMode = {}));
		/**
		* Token decoder with support of writing partial entities.
		*/
		var EntityDecoder = class {
			constructor(decodeTree, emitCodePoint, errors) {
				this.decodeTree = decodeTree;
				this.emitCodePoint = emitCodePoint;
				this.errors = errors;
				/** The current state of the decoder. */
				this.state = EntityDecoderState.EntityStart;
				/** Characters that were consumed while parsing an entity. */
				this.consumed = 1;
				/**
				* The result of the entity.
				*
				* Either the result index of a numeric entity, or the codepoint of a
				* numeric entity.
				*/
				this.result = 0;
				/** The current index in the decode tree. */
				this.treeIndex = 0;
				/** The number of characters that were consumed in excess. */
				this.excess = 1;
				/** The mode in which the decoder is operating. */
				this.decodeMode = DecodingMode.Strict;
			}
			/** Resets the instance to make it reusable. */
			startEntity(decodeMode) {
				this.decodeMode = decodeMode;
				this.state = EntityDecoderState.EntityStart;
				this.result = 0;
				this.treeIndex = 0;
				this.excess = 1;
				this.consumed = 1;
			}
			/**
			* Write an entity to the decoder. This can be called multiple times with partial entities.
			* If the entity is incomplete, the decoder will return -1.
			*
			* Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
			* entity is incomplete, and resume when the next string is written.
			*
			* @param string The string containing the entity (or a continuation of the entity).
			* @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
			* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
			*/
			write(str, offset) {
				switch (this.state) {
					case EntityDecoderState.EntityStart:
						if (str.charCodeAt(offset) === CharCodes.NUM) {
							this.state = EntityDecoderState.NumericStart;
							this.consumed += 1;
							return this.stateNumericStart(str, offset + 1);
						}
						this.state = EntityDecoderState.NamedEntity;
						return this.stateNamedEntity(str, offset);
					case EntityDecoderState.NumericStart: return this.stateNumericStart(str, offset);
					case EntityDecoderState.NumericDecimal: return this.stateNumericDecimal(str, offset);
					case EntityDecoderState.NumericHex: return this.stateNumericHex(str, offset);
					case EntityDecoderState.NamedEntity: return this.stateNamedEntity(str, offset);
				}
			}
			/**
			* Switches between the numeric decimal and hexadecimal states.
			*
			* Equivalent to the `Numeric character reference state` in the HTML spec.
			*
			* @param str The string containing the entity (or a continuation of the entity).
			* @param offset The current offset.
			* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
			*/
			stateNumericStart(str, offset) {
				if (offset >= str.length) return -1;
				if ((str.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X) {
					this.state = EntityDecoderState.NumericHex;
					this.consumed += 1;
					return this.stateNumericHex(str, offset + 1);
				}
				this.state = EntityDecoderState.NumericDecimal;
				return this.stateNumericDecimal(str, offset);
			}
			addToNumericResult(str, start, end, base) {
				if (start !== end) {
					const digitCount = end - start;
					this.result = this.result * Math.pow(base, digitCount) + parseInt(str.substr(start, digitCount), base);
					this.consumed += digitCount;
				}
			}
			/**
			* Parses a hexadecimal numeric entity.
			*
			* Equivalent to the `Hexademical character reference state` in the HTML spec.
			*
			* @param str The string containing the entity (or a continuation of the entity).
			* @param offset The current offset.
			* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
			*/
			stateNumericHex(str, offset) {
				const startIdx = offset;
				while (offset < str.length) {
					const char = str.charCodeAt(offset);
					if (isNumber(char) || isHexadecimalCharacter(char)) offset += 1;
					else {
						this.addToNumericResult(str, startIdx, offset, 16);
						return this.emitNumericEntity(char, 3);
					}
				}
				this.addToNumericResult(str, startIdx, offset, 16);
				return -1;
			}
			/**
			* Parses a decimal numeric entity.
			*
			* Equivalent to the `Decimal character reference state` in the HTML spec.
			*
			* @param str The string containing the entity (or a continuation of the entity).
			* @param offset The current offset.
			* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
			*/
			stateNumericDecimal(str, offset) {
				const startIdx = offset;
				while (offset < str.length) {
					const char = str.charCodeAt(offset);
					if (isNumber(char)) offset += 1;
					else {
						this.addToNumericResult(str, startIdx, offset, 10);
						return this.emitNumericEntity(char, 2);
					}
				}
				this.addToNumericResult(str, startIdx, offset, 10);
				return -1;
			}
			/**
			* Validate and emit a numeric entity.
			*
			* Implements the logic from the `Hexademical character reference start
			* state` and `Numeric character reference end state` in the HTML spec.
			*
			* @param lastCp The last code point of the entity. Used to see if the
			*               entity was terminated with a semicolon.
			* @param expectedLength The minimum number of characters that should be
			*                       consumed. Used to validate that at least one digit
			*                       was consumed.
			* @returns The number of characters that were consumed.
			*/
			emitNumericEntity(lastCp, expectedLength) {
				var _a;
				if (this.consumed <= expectedLength) {
					(_a = this.errors) === null || _a === void 0 || _a.absenceOfDigitsInNumericCharacterReference(this.consumed);
					return 0;
				}
				if (lastCp === CharCodes.SEMI) this.consumed += 1;
				else if (this.decodeMode === DecodingMode.Strict) return 0;
				this.emitCodePoint(replaceCodePoint(this.result), this.consumed);
				if (this.errors) {
					if (lastCp !== CharCodes.SEMI) this.errors.missingSemicolonAfterCharacterReference();
					this.errors.validateNumericCharacterReference(this.result);
				}
				return this.consumed;
			}
			/**
			* Parses a named entity.
			*
			* Equivalent to the `Named character reference state` in the HTML spec.
			*
			* @param str The string containing the entity (or a continuation of the entity).
			* @param offset The current offset.
			* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
			*/
			stateNamedEntity(str, offset) {
				const { decodeTree } = this;
				let current = decodeTree[this.treeIndex];
				let valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
				for (; offset < str.length; offset++, this.excess++) {
					const char = str.charCodeAt(offset);
					this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
					if (this.treeIndex < 0) return this.result === 0 || this.decodeMode === DecodingMode.Attribute && (valueLength === 0 || isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
					current = decodeTree[this.treeIndex];
					valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
					if (valueLength !== 0) {
						if (char === CharCodes.SEMI) return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
						if (this.decodeMode !== DecodingMode.Strict) {
							this.result = this.treeIndex;
							this.consumed += this.excess;
							this.excess = 0;
						}
					}
				}
				return -1;
			}
			/**
			* Emit a named entity that was not terminated with a semicolon.
			*
			* @returns The number of characters consumed.
			*/
			emitNotTerminatedNamedEntity() {
				var _a;
				const { result, decodeTree } = this;
				const valueLength = (decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
				this.emitNamedEntityData(result, valueLength, this.consumed);
				(_a = this.errors) === null || _a === void 0 || _a.missingSemicolonAfterCharacterReference();
				return this.consumed;
			}
			/**
			* Emit a named entity.
			*
			* @param result The index of the entity in the decode tree.
			* @param valueLength The number of bytes in the entity.
			* @param consumed The number of characters consumed.
			*
			* @returns The number of characters consumed.
			*/
			emitNamedEntityData(result, valueLength, consumed) {
				const { decodeTree } = this;
				this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~BinTrieFlags.VALUE_LENGTH : decodeTree[result + 1], consumed);
				if (valueLength === 3) this.emitCodePoint(decodeTree[result + 2], consumed);
				return consumed;
			}
			/**
			* Signal to the parser that the end of the input was reached.
			*
			* Remaining data will be emitted and relevant errors will be produced.
			*
			* @returns The number of characters consumed.
			*/
			end() {
				var _a;
				switch (this.state) {
					case EntityDecoderState.NamedEntity: return this.result !== 0 && (this.decodeMode !== DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
					case EntityDecoderState.NumericDecimal: return this.emitNumericEntity(0, 2);
					case EntityDecoderState.NumericHex: return this.emitNumericEntity(0, 3);
					case EntityDecoderState.NumericStart:
						(_a = this.errors) === null || _a === void 0 || _a.absenceOfDigitsInNumericCharacterReference(this.consumed);
						return 0;
					case EntityDecoderState.EntityStart: return 0;
				}
			}
		};
		/**
		* Creates a function that decodes entities in a string.
		*
		* @param decodeTree The decode tree.
		* @returns A function that decodes entities in a string.
		*/
		function getDecoder(decodeTree) {
			let ret = "";
			const decoder = new EntityDecoder(decodeTree, (str) => ret += fromCodePoint$1(str));
			return function decodeWithTrie(str, decodeMode) {
				let lastIndex = 0;
				let offset = 0;
				while ((offset = str.indexOf("&", offset)) >= 0) {
					ret += str.slice(lastIndex, offset);
					decoder.startEntity(decodeMode);
					const len = decoder.write(str, offset + 1);
					if (len < 0) {
						lastIndex = offset + decoder.end();
						break;
					}
					lastIndex = offset + len;
					offset = len === 0 ? lastIndex + 1 : lastIndex;
				}
				const result = ret + str.slice(lastIndex);
				ret = "";
				return result;
			};
		}
		/**
		* Determines the branch of the current node that is taken given the current
		* character. This function is used to traverse the trie.
		*
		* @param decodeTree The trie.
		* @param current The current node.
		* @param nodeIdx The index right after the current node and its value.
		* @param char The current character.
		* @returns The index of the next node, or -1 if no branch is taken.
		*/
		function determineBranch(decodeTree, current, nodeIdx, char) {
			const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
			const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
			if (branchCount === 0) return jumpOffset !== 0 && char === jumpOffset ? nodeIdx : -1;
			if (jumpOffset) {
				const value = char - jumpOffset;
				return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIdx + value] - 1;
			}
			let lo = nodeIdx;
			let hi = lo + branchCount - 1;
			while (lo <= hi) {
				const mid = lo + hi >>> 1;
				const midVal = decodeTree[mid];
				if (midVal < char) lo = mid + 1;
				else if (midVal > char) hi = mid - 1;
				else return decodeTree[mid + branchCount];
			}
			return -1;
		}
		const htmlDecoder = getDecoder(decode_data_html_default);
		getDecoder(decode_data_xml_default);
		/**
		* Decodes an HTML string.
		*
		* @param str The string to decode.
		* @param mode The decoding mode.
		* @returns The decoded string.
		*/
		function decodeHTML(str, mode = DecodingMode.Legacy) {
			return htmlDecoder(str, mode);
		}
		//#endregion
		//#region node_modules/markdown-it/lib/common/utils.mjs
		var utils_exports = /* @__PURE__ */ __exportAll({
			arrayReplaceAt: () => arrayReplaceAt,
			assign: () => assign$1,
			escapeHtml: () => escapeHtml,
			escapeRE: () => escapeRE$1,
			fromCodePoint: () => fromCodePoint,
			has: () => has,
			isMdAsciiPunct: () => isMdAsciiPunct,
			isPunctChar: () => isPunctChar,
			isSpace: () => isSpace,
			isString: () => isString$1,
			isValidEntityCode: () => isValidEntityCode,
			isWhiteSpace: () => isWhiteSpace,
			lib: () => lib,
			normalizeReference: () => normalizeReference,
			unescapeAll: () => unescapeAll,
			unescapeMd: () => unescapeMd
		});
		function _class$1(obj) {
			return Object.prototype.toString.call(obj);
		}
		function isString$1(obj) {
			return _class$1(obj) === "[object String]";
		}
		const _hasOwnProperty = Object.prototype.hasOwnProperty;
		function has(object, key) {
			return _hasOwnProperty.call(object, key);
		}
		function assign$1(obj) {
			Array.prototype.slice.call(arguments, 1).forEach(function(source) {
				if (!source) return;
				if (typeof source !== "object") throw new TypeError(source + "must be object");
				Object.keys(source).forEach(function(key) {
					obj[key] = source[key];
				});
			});
			return obj;
		}
		function arrayReplaceAt(src, pos, newElements) {
			return [].concat(src.slice(0, pos), newElements, src.slice(pos + 1));
		}
		function isValidEntityCode(c) {
			if (c >= 55296 && c <= 57343) return false;
			if (c >= 64976 && c <= 65007) return false;
			if ((c & 65535) === 65535 || (c & 65535) === 65534) return false;
			if (c >= 0 && c <= 8) return false;
			if (c === 11) return false;
			if (c >= 14 && c <= 31) return false;
			if (c >= 127 && c <= 159) return false;
			if (c > 1114111) return false;
			return true;
		}
		function fromCodePoint(c) {
			if (c > 65535) {
				c -= 65536;
				const surrogate1 = 55296 + (c >> 10);
				const surrogate2 = 56320 + (c & 1023);
				return String.fromCharCode(surrogate1, surrogate2);
			}
			return String.fromCharCode(c);
		}
		const UNESCAPE_MD_RE = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g;
		const UNESCAPE_ALL_RE = new RegExp(UNESCAPE_MD_RE.source + "|" + /&([a-z#][a-z0-9]{1,31});/gi.source, "gi");
		const DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
		function replaceEntityPattern(match, name) {
			if (name.charCodeAt(0) === 35 && DIGITAL_ENTITY_TEST_RE.test(name)) {
				const code = name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
				if (isValidEntityCode(code)) return fromCodePoint(code);
				return match;
			}
			const decoded = decodeHTML(match);
			if (decoded !== match) return decoded;
			return match;
		}
		function unescapeMd(str) {
			if (str.indexOf("\\") < 0) return str;
			return str.replace(UNESCAPE_MD_RE, "$1");
		}
		function unescapeAll(str) {
			if (str.indexOf("\\") < 0 && str.indexOf("&") < 0) return str;
			return str.replace(UNESCAPE_ALL_RE, function(match, escaped, entity) {
				if (escaped) return escaped;
				return replaceEntityPattern(match, entity);
			});
		}
		const HTML_ESCAPE_TEST_RE = /[&<>"]/;
		const HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
		const HTML_REPLACEMENTS = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			"\"": "&quot;"
		};
		function replaceUnsafeChar(ch) {
			return HTML_REPLACEMENTS[ch];
		}
		function escapeHtml(str) {
			if (HTML_ESCAPE_TEST_RE.test(str)) return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
			return str;
		}
		const REGEXP_ESCAPE_RE = /[.?*+^$[\]\\(){}|-]/g;
		function escapeRE$1(str) {
			return str.replace(REGEXP_ESCAPE_RE, "\\$&");
		}
		function isSpace(code) {
			switch (code) {
				case 9:
				case 32: return true;
			}
			return false;
		}
		function isWhiteSpace(code) {
			if (code >= 8192 && code <= 8202) return true;
			switch (code) {
				case 9:
				case 10:
				case 11:
				case 12:
				case 13:
				case 32:
				case 160:
				case 5760:
				case 8239:
				case 8287:
				case 12288: return true;
			}
			return false;
		}
		function isPunctChar(ch) {
			return regex_default$2.test(ch) || regex_default$1.test(ch);
		}
		function isMdAsciiPunct(ch) {
			switch (ch) {
				case 33:
				case 34:
				case 35:
				case 36:
				case 37:
				case 38:
				case 39:
				case 40:
				case 41:
				case 42:
				case 43:
				case 44:
				case 45:
				case 46:
				case 47:
				case 58:
				case 59:
				case 60:
				case 61:
				case 62:
				case 63:
				case 64:
				case 91:
				case 92:
				case 93:
				case 94:
				case 95:
				case 96:
				case 123:
				case 124:
				case 125:
				case 126: return true;
				default: return false;
			}
		}
		function normalizeReference(str) {
			str = str.trim().replace(/\s+/g, " ");
			if ("ẞ".toLowerCase() === "Ṿ") str = str.replace(/ẞ/g, "ß");
			return str.toLowerCase().toUpperCase();
		}
		const lib = {
			mdurl: mdurl_exports,
			ucmicro: uc_micro_exports
		};
		//#endregion
		//#region node_modules/markdown-it/lib/helpers/parse_link_label.mjs
		function parseLinkLabel(state, start, disableNested) {
			let level, found, marker, prevPos;
			const max = state.posMax;
			const oldPos = state.pos;
			state.pos = start + 1;
			level = 1;
			while (state.pos < max) {
				marker = state.src.charCodeAt(state.pos);
				if (marker === 93) {
					level--;
					if (level === 0) {
						found = true;
						break;
					}
				}
				prevPos = state.pos;
				state.md.inline.skipToken(state);
				if (marker === 91) {
					if (prevPos === state.pos - 1) level++;
					else if (disableNested) {
						state.pos = oldPos;
						return -1;
					}
				}
			}
			let labelEnd = -1;
			if (found) labelEnd = state.pos;
			state.pos = oldPos;
			return labelEnd;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/helpers/parse_link_destination.mjs
		function parseLinkDestination(str, start, max) {
			let code;
			let pos = start;
			const result = {
				ok: false,
				pos: 0,
				str: ""
			};
			if (str.charCodeAt(pos) === 60) {
				pos++;
				while (pos < max) {
					code = str.charCodeAt(pos);
					if (code === 10) return result;
					if (code === 60) return result;
					if (code === 62) {
						result.pos = pos + 1;
						result.str = unescapeAll(str.slice(start + 1, pos));
						result.ok = true;
						return result;
					}
					if (code === 92 && pos + 1 < max) {
						pos += 2;
						continue;
					}
					pos++;
				}
				return result;
			}
			let level = 0;
			while (pos < max) {
				code = str.charCodeAt(pos);
				if (code === 32) break;
				if (code < 32 || code === 127) break;
				if (code === 92 && pos + 1 < max) {
					if (str.charCodeAt(pos + 1) === 32) break;
					pos += 2;
					continue;
				}
				if (code === 40) {
					level++;
					if (level > 32) return result;
				}
				if (code === 41) {
					if (level === 0) break;
					level--;
				}
				pos++;
			}
			if (start === pos) return result;
			if (level !== 0) return result;
			result.str = unescapeAll(str.slice(start, pos));
			result.pos = pos;
			result.ok = true;
			return result;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/helpers/parse_link_title.mjs
		function parseLinkTitle(str, start, max, prev_state) {
			let code;
			let pos = start;
			const state = {
				ok: false,
				can_continue: false,
				pos: 0,
				str: "",
				marker: 0
			};
			if (prev_state) {
				state.str = prev_state.str;
				state.marker = prev_state.marker;
			} else {
				if (pos >= max) return state;
				let marker = str.charCodeAt(pos);
				if (marker !== 34 && marker !== 39 && marker !== 40) return state;
				start++;
				pos++;
				if (marker === 40) marker = 41;
				state.marker = marker;
			}
			while (pos < max) {
				code = str.charCodeAt(pos);
				if (code === state.marker) {
					state.pos = pos + 1;
					state.str += unescapeAll(str.slice(start, pos));
					state.ok = true;
					return state;
				} else if (code === 40 && state.marker === 41) return state;
				else if (code === 92 && pos + 1 < max) pos++;
				pos++;
			}
			state.can_continue = true;
			state.str += unescapeAll(str.slice(start, pos));
			return state;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/helpers/index.mjs
		var helpers_exports = /* @__PURE__ */ __exportAll({
			parseLinkDestination: () => parseLinkDestination,
			parseLinkLabel: () => parseLinkLabel,
			parseLinkTitle: () => parseLinkTitle
		});
		//#endregion
		//#region node_modules/markdown-it/lib/renderer.mjs
		/**
		* class Renderer
		*
		* Generates HTML from parsed token stream. Each instance has independent
		* copy of rules. Those can be rewritten with ease. Also, you can add new
		* rules if you create plugin and adds new token types.
		**/
		const default_rules = {};
		default_rules.code_inline = function(tokens, idx, options, env, slf) {
			const token = tokens[idx];
			return "<code" + slf.renderAttrs(token) + ">" + escapeHtml(token.content) + "</code>";
		};
		default_rules.code_block = function(tokens, idx, options, env, slf) {
			const token = tokens[idx];
			return "<pre" + slf.renderAttrs(token) + "><code>" + escapeHtml(tokens[idx].content) + "</code></pre>\n";
		};
		default_rules.fence = function(tokens, idx, options, env, slf) {
			const token = tokens[idx];
			const info = token.info ? unescapeAll(token.info).trim() : "";
			let langName = "";
			let langAttrs = "";
			if (info) {
				const arr = info.split(/(\s+)/g);
				langName = arr[0];
				langAttrs = arr.slice(2).join("");
			}
			let highlighted;
			if (options.highlight) highlighted = options.highlight(token.content, langName, langAttrs) || escapeHtml(token.content);
			else highlighted = escapeHtml(token.content);
			if (highlighted.indexOf("<pre") === 0) return highlighted + "\n";
			if (info) {
				const i = token.attrIndex("class");
				const tmpAttrs = token.attrs ? token.attrs.slice() : [];
				if (i < 0) tmpAttrs.push(["class", options.langPrefix + langName]);
				else {
					tmpAttrs[i] = tmpAttrs[i].slice();
					tmpAttrs[i][1] += " " + options.langPrefix + langName;
				}
				const tmpToken = { attrs: tmpAttrs };
				return `<pre><code${slf.renderAttrs(tmpToken)}>${highlighted}</code></pre>\n`;
			}
			return `<pre><code${slf.renderAttrs(token)}>${highlighted}</code></pre>\n`;
		};
		default_rules.image = function(tokens, idx, options, env, slf) {
			const token = tokens[idx];
			token.attrs[token.attrIndex("alt")][1] = slf.renderInlineAsText(token.children, options, env);
			return slf.renderToken(tokens, idx, options);
		};
		default_rules.hardbreak = function(tokens, idx, options) {
			return options.xhtmlOut ? "<br />\n" : "<br>\n";
		};
		default_rules.softbreak = function(tokens, idx, options) {
			return options.breaks ? options.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
		};
		default_rules.text = function(tokens, idx) {
			return escapeHtml(tokens[idx].content);
		};
		default_rules.html_block = function(tokens, idx) {
			return tokens[idx].content;
		};
		default_rules.html_inline = function(tokens, idx) {
			return tokens[idx].content;
		};
		/**
		* new Renderer()
		*
		* Creates new [[Renderer]] instance and fill [[Renderer#rules]] with defaults.
		**/
		function Renderer() {
			/**
			* Renderer#rules -> Object
			*
			* Contains render rules for tokens. Can be updated and extended.
			*
			* ##### Example
			*
			* ```javascript
			* var md = require('markdown-it')();
			*
			* md.renderer.rules.strong_open  = function () { return '<b>'; };
			* md.renderer.rules.strong_close = function () { return '</b>'; };
			*
			* var result = md.renderInline(...);
			* ```
			*
			* Each rule is called as independent static function with fixed signature:
			*
			* ```javascript
			* function my_token_render(tokens, idx, options, env, renderer) {
			*   // ...
			*   return renderedHTML;
			* }
			* ```
			*
			* See [source code](https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.mjs)
			* for more details and examples.
			**/
			this.rules = assign$1({}, default_rules);
		}
		/**
		* Renderer.renderAttrs(token) -> String
		*
		* Render token attributes to string.
		**/
		Renderer.prototype.renderAttrs = function renderAttrs(token) {
			let i, l, result;
			if (!token.attrs) return "";
			result = "";
			for (i = 0, l = token.attrs.length; i < l; i++) result += " " + escapeHtml(token.attrs[i][0]) + "=\"" + escapeHtml(token.attrs[i][1]) + "\"";
			return result;
		};
		/**
		* Renderer.renderToken(tokens, idx, options) -> String
		* - tokens (Array): list of tokens
		* - idx (Numbed): token index to render
		* - options (Object): params of parser instance
		*
		* Default token renderer. Can be overriden by custom function
		* in [[Renderer#rules]].
		**/
		Renderer.prototype.renderToken = function renderToken(tokens, idx, options) {
			const token = tokens[idx];
			let result = "";
			if (token.hidden) return "";
			if (token.block && token.nesting !== -1 && idx && tokens[idx - 1].hidden) result += "\n";
			result += (token.nesting === -1 ? "</" : "<") + token.tag;
			result += this.renderAttrs(token);
			if (token.nesting === 0 && options.xhtmlOut) result += " /";
			let needLf = false;
			if (token.block) {
				needLf = true;
				if (token.nesting === 1) {
					if (idx + 1 < tokens.length) {
						const nextToken = tokens[idx + 1];
						if (nextToken.type === "inline" || nextToken.hidden) needLf = false;
						else if (nextToken.nesting === -1 && nextToken.tag === token.tag) needLf = false;
					}
				}
			}
			result += needLf ? ">\n" : ">";
			return result;
		};
		/**
		* Renderer.renderInline(tokens, options, env) -> String
		* - tokens (Array): list on block tokens to render
		* - options (Object): params of parser instance
		* - env (Object): additional data from parsed input (references, for example)
		*
		* The same as [[Renderer.render]], but for single token of `inline` type.
		**/
		Renderer.prototype.renderInline = function(tokens, options, env) {
			let result = "";
			const rules = this.rules;
			for (let i = 0, len = tokens.length; i < len; i++) {
				const type = tokens[i].type;
				if (typeof rules[type] !== "undefined") result += rules[type](tokens, i, options, env, this);
				else result += this.renderToken(tokens, i, options);
			}
			return result;
		};
		/** internal
		* Renderer.renderInlineAsText(tokens, options, env) -> String
		* - tokens (Array): list on block tokens to render
		* - options (Object): params of parser instance
		* - env (Object): additional data from parsed input (references, for example)
		*
		* Special kludge for image `alt` attributes to conform CommonMark spec.
		* Don't try to use it! Spec requires to show `alt` content with stripped markup,
		* instead of simple escaping.
		**/
		Renderer.prototype.renderInlineAsText = function(tokens, options, env) {
			let result = "";
			for (let i = 0, len = tokens.length; i < len; i++) switch (tokens[i].type) {
				case "text":
					result += tokens[i].content;
					break;
				case "image":
					result += this.renderInlineAsText(tokens[i].children, options, env);
					break;
				case "html_inline":
				case "html_block":
					result += tokens[i].content;
					break;
				case "softbreak":
				case "hardbreak":
					result += "\n";
					break;
				default:
			}
			return result;
		};
		/**
		* Renderer.render(tokens, options, env) -> String
		* - tokens (Array): list on block tokens to render
		* - options (Object): params of parser instance
		* - env (Object): additional data from parsed input (references, for example)
		*
		* Takes token stream and generates HTML. Probably, you will never need to call
		* this method directly.
		**/
		Renderer.prototype.render = function(tokens, options, env) {
			let result = "";
			const rules = this.rules;
			for (let i = 0, len = tokens.length; i < len; i++) {
				const type = tokens[i].type;
				if (type === "inline") result += this.renderInline(tokens[i].children, options, env);
				else if (typeof rules[type] !== "undefined") result += rules[type](tokens, i, options, env, this);
				else result += this.renderToken(tokens, i, options, env);
			}
			return result;
		};
		//#endregion
		//#region node_modules/markdown-it/lib/ruler.mjs
		/**
		* class Ruler
		*
		* Helper class, used by [[MarkdownIt#core]], [[MarkdownIt#block]] and
		* [[MarkdownIt#inline]] to manage sequences of functions (rules):
		*
		* - keep rules in defined order
		* - assign the name to each rule
		* - enable/disable rules
		* - add/replace rules
		* - allow assign rules to additional named chains (in the same)
		* - cacheing lists of active rules
		*
		* You will not need use this class directly until write plugins. For simple
		* rules control use [[MarkdownIt.disable]], [[MarkdownIt.enable]] and
		* [[MarkdownIt.use]].
		**/
		/**
		* new Ruler()
		**/
		function Ruler() {
			this.__rules__ = [];
			this.__cache__ = null;
		}
		Ruler.prototype.__find__ = function(name) {
			for (let i = 0; i < this.__rules__.length; i++) if (this.__rules__[i].name === name) return i;
			return -1;
		};
		Ruler.prototype.__compile__ = function() {
			const self = this;
			const chains = [""];
			self.__rules__.forEach(function(rule) {
				if (!rule.enabled) return;
				rule.alt.forEach(function(altName) {
					if (chains.indexOf(altName) < 0) chains.push(altName);
				});
			});
			self.__cache__ = {};
			chains.forEach(function(chain) {
				self.__cache__[chain] = [];
				self.__rules__.forEach(function(rule) {
					if (!rule.enabled) return;
					if (chain && rule.alt.indexOf(chain) < 0) return;
					self.__cache__[chain].push(rule.fn);
				});
			});
		};
		/**
		* Ruler.at(name, fn [, options])
		* - name (String): rule name to replace.
		* - fn (Function): new rule function.
		* - options (Object): new rule options (not mandatory).
		*
		* Replace rule by name with new function & options. Throws error if name not
		* found.
		*
		* ##### Options:
		*
		* - __alt__ - array with names of "alternate" chains.
		*
		* ##### Example
		*
		* Replace existing typographer replacement rule with new one:
		*
		* ```javascript
		* var md = require('markdown-it')();
		*
		* md.core.ruler.at('replacements', function replace(state) {
		*   //...
		* });
		* ```
		**/
		Ruler.prototype.at = function(name, fn, options) {
			const index = this.__find__(name);
			const opt = options || {};
			if (index === -1) throw new Error("Parser rule not found: " + name);
			this.__rules__[index].fn = fn;
			this.__rules__[index].alt = opt.alt || [];
			this.__cache__ = null;
		};
		/**
		* Ruler.before(beforeName, ruleName, fn [, options])
		* - beforeName (String): new rule will be added before this one.
		* - ruleName (String): name of added rule.
		* - fn (Function): rule function.
		* - options (Object): rule options (not mandatory).
		*
		* Add new rule to chain before one with given name. See also
		* [[Ruler.after]], [[Ruler.push]].
		*
		* ##### Options:
		*
		* - __alt__ - array with names of "alternate" chains.
		*
		* ##### Example
		*
		* ```javascript
		* var md = require('markdown-it')();
		*
		* md.block.ruler.before('paragraph', 'my_rule', function replace(state) {
		*   //...
		* });
		* ```
		**/
		Ruler.prototype.before = function(beforeName, ruleName, fn, options) {
			const index = this.__find__(beforeName);
			const opt = options || {};
			if (index === -1) throw new Error("Parser rule not found: " + beforeName);
			this.__rules__.splice(index, 0, {
				name: ruleName,
				enabled: true,
				fn,
				alt: opt.alt || []
			});
			this.__cache__ = null;
		};
		/**
		* Ruler.after(afterName, ruleName, fn [, options])
		* - afterName (String): new rule will be added after this one.
		* - ruleName (String): name of added rule.
		* - fn (Function): rule function.
		* - options (Object): rule options (not mandatory).
		*
		* Add new rule to chain after one with given name. See also
		* [[Ruler.before]], [[Ruler.push]].
		*
		* ##### Options:
		*
		* - __alt__ - array with names of "alternate" chains.
		*
		* ##### Example
		*
		* ```javascript
		* var md = require('markdown-it')();
		*
		* md.inline.ruler.after('text', 'my_rule', function replace(state) {
		*   //...
		* });
		* ```
		**/
		Ruler.prototype.after = function(afterName, ruleName, fn, options) {
			const index = this.__find__(afterName);
			const opt = options || {};
			if (index === -1) throw new Error("Parser rule not found: " + afterName);
			this.__rules__.splice(index + 1, 0, {
				name: ruleName,
				enabled: true,
				fn,
				alt: opt.alt || []
			});
			this.__cache__ = null;
		};
		/**
		* Ruler.push(ruleName, fn [, options])
		* - ruleName (String): name of added rule.
		* - fn (Function): rule function.
		* - options (Object): rule options (not mandatory).
		*
		* Push new rule to the end of chain. See also
		* [[Ruler.before]], [[Ruler.after]].
		*
		* ##### Options:
		*
		* - __alt__ - array with names of "alternate" chains.
		*
		* ##### Example
		*
		* ```javascript
		* var md = require('markdown-it')();
		*
		* md.core.ruler.push('my_rule', function replace(state) {
		*   //...
		* });
		* ```
		**/
		Ruler.prototype.push = function(ruleName, fn, options) {
			const opt = options || {};
			this.__rules__.push({
				name: ruleName,
				enabled: true,
				fn,
				alt: opt.alt || []
			});
			this.__cache__ = null;
		};
		/**
		* Ruler.enable(list [, ignoreInvalid]) -> Array
		* - list (String|Array): list of rule names to enable.
		* - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
		*
		* Enable rules with given names. If any rule name not found - throw Error.
		* Errors can be disabled by second param.
		*
		* Returns list of found rule names (if no exception happened).
		*
		* See also [[Ruler.disable]], [[Ruler.enableOnly]].
		**/
		Ruler.prototype.enable = function(list, ignoreInvalid) {
			if (!Array.isArray(list)) list = [list];
			const result = [];
			list.forEach(function(name) {
				const idx = this.__find__(name);
				if (idx < 0) {
					if (ignoreInvalid) return;
					throw new Error("Rules manager: invalid rule name " + name);
				}
				this.__rules__[idx].enabled = true;
				result.push(name);
			}, this);
			this.__cache__ = null;
			return result;
		};
		/**
		* Ruler.enableOnly(list [, ignoreInvalid])
		* - list (String|Array): list of rule names to enable (whitelist).
		* - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
		*
		* Enable rules with given names, and disable everything else. If any rule name
		* not found - throw Error. Errors can be disabled by second param.
		*
		* See also [[Ruler.disable]], [[Ruler.enable]].
		**/
		Ruler.prototype.enableOnly = function(list, ignoreInvalid) {
			if (!Array.isArray(list)) list = [list];
			this.__rules__.forEach(function(rule) {
				rule.enabled = false;
			});
			this.enable(list, ignoreInvalid);
		};
		/**
		* Ruler.disable(list [, ignoreInvalid]) -> Array
		* - list (String|Array): list of rule names to disable.
		* - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
		*
		* Disable rules with given names. If any rule name not found - throw Error.
		* Errors can be disabled by second param.
		*
		* Returns list of found rule names (if no exception happened).
		*
		* See also [[Ruler.enable]], [[Ruler.enableOnly]].
		**/
		Ruler.prototype.disable = function(list, ignoreInvalid) {
			if (!Array.isArray(list)) list = [list];
			const result = [];
			list.forEach(function(name) {
				const idx = this.__find__(name);
				if (idx < 0) {
					if (ignoreInvalid) return;
					throw new Error("Rules manager: invalid rule name " + name);
				}
				this.__rules__[idx].enabled = false;
				result.push(name);
			}, this);
			this.__cache__ = null;
			return result;
		};
		/**
		* Ruler.getRules(chainName) -> Array
		*
		* Return array of active functions (rules) for given chain name. It analyzes
		* rules configuration, compiles caches if not exists and returns result.
		*
		* Default chain name is `''` (empty string). It can't be skipped. That's
		* done intentionally, to keep signature monomorphic for high speed.
		**/
		Ruler.prototype.getRules = function(chainName) {
			if (this.__cache__ === null) this.__compile__();
			return this.__cache__[chainName] || [];
		};
		//#endregion
		//#region node_modules/markdown-it/lib/token.mjs
		/**
		* class Token
		**/
		/**
		* new Token(type, tag, nesting)
		*
		* Create new token and fill passed properties.
		**/
		function Token(type, tag, nesting) {
			/**
			* Token#type -> String
			*
			* Type of the token (string, e.g. "paragraph_open")
			**/
			this.type = type;
			/**
			* Token#tag -> String
			*
			* html tag name, e.g. "p"
			**/
			this.tag = tag;
			/**
			* Token#attrs -> Array
			*
			* Html attributes. Format: `[ [ name1, value1 ], [ name2, value2 ] ]`
			**/
			this.attrs = null;
			/**
			* Token#map -> Array
			*
			* Source map info. Format: `[ line_begin, line_end ]`
			**/
			this.map = null;
			/**
			* Token#nesting -> Number
			*
			* Level change (number in {-1, 0, 1} set), where:
			*
			* -  `1` means the tag is opening
			* -  `0` means the tag is self-closing
			* - `-1` means the tag is closing
			**/
			this.nesting = nesting;
			/**
			* Token#level -> Number
			*
			* nesting level, the same as `state.level`
			**/
			this.level = 0;
			/**
			* Token#children -> Array
			*
			* An array of child nodes (inline and img tokens)
			**/
			this.children = null;
			/**
			* Token#content -> String
			*
			* In a case of self-closing tag (code, html, fence, etc.),
			* it has contents of this tag.
			**/
			this.content = "";
			/**
			* Token#markup -> String
			*
			* '*' or '_' for emphasis, fence string for fence, etc.
			**/
			this.markup = "";
			/**
			* Token#info -> String
			*
			* Additional information:
			*
			* - Info string for "fence" tokens
			* - The value "auto" for autolink "link_open" and "link_close" tokens
			* - The string value of the item marker for ordered-list "list_item_open" tokens
			**/
			this.info = "";
			/**
			* Token#meta -> Object
			*
			* A place for plugins to store an arbitrary data
			**/
			this.meta = null;
			/**
			* Token#block -> Boolean
			*
			* True for block-level tokens, false for inline tokens.
			* Used in renderer to calculate line breaks
			**/
			this.block = false;
			/**
			* Token#hidden -> Boolean
			*
			* If it's true, ignore this element when rendering. Used for tight lists
			* to hide paragraphs.
			**/
			this.hidden = false;
		}
		/**
		* Token.attrIndex(name) -> Number
		*
		* Search attribute index by name.
		**/
		Token.prototype.attrIndex = function attrIndex(name) {
			if (!this.attrs) return -1;
			const attrs = this.attrs;
			for (let i = 0, len = attrs.length; i < len; i++) if (attrs[i][0] === name) return i;
			return -1;
		};
		/**
		* Token.attrPush(attrData)
		*
		* Add `[ name, value ]` attribute to list. Init attrs if necessary
		**/
		Token.prototype.attrPush = function attrPush(attrData) {
			if (this.attrs) this.attrs.push(attrData);
			else this.attrs = [attrData];
		};
		/**
		* Token.attrSet(name, value)
		*
		* Set `name` attribute to `value`. Override old value if exists.
		**/
		Token.prototype.attrSet = function attrSet(name, value) {
			const idx = this.attrIndex(name);
			const attrData = [name, value];
			if (idx < 0) this.attrPush(attrData);
			else this.attrs[idx] = attrData;
		};
		/**
		* Token.attrGet(name)
		*
		* Get the value of attribute `name`, or null if it does not exist.
		**/
		Token.prototype.attrGet = function attrGet(name) {
			const idx = this.attrIndex(name);
			let value = null;
			if (idx >= 0) value = this.attrs[idx][1];
			return value;
		};
		/**
		* Token.attrJoin(name, value)
		*
		* Join value to existing attribute via space. Or create new attribute if not
		* exists. Useful to operate with token classes.
		**/
		Token.prototype.attrJoin = function attrJoin(name, value) {
			const idx = this.attrIndex(name);
			if (idx < 0) this.attrPush([name, value]);
			else this.attrs[idx][1] = this.attrs[idx][1] + " " + value;
		};
		//#endregion
		//#region node_modules/markdown-it/lib/rules_core/state_core.mjs
		function StateCore(src, md, env) {
			this.src = src;
			this.env = env;
			this.tokens = [];
			this.inlineMode = false;
			this.md = md;
		}
		StateCore.prototype.Token = Token;
		//#endregion
		//#region node_modules/markdown-it/lib/rules_core/normalize.mjs
		const NEWLINES_RE = /\r\n?|\n/g;
		const NULL_RE = /\0/g;
		function normalize(state) {
			let str;
			str = state.src.replace(NEWLINES_RE, "\n");
			str = str.replace(NULL_RE, "�");
			state.src = str;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_core/block.mjs
		function block(state) {
			let token;
			if (state.inlineMode) {
				token = new state.Token("inline", "", 0);
				token.content = state.src;
				token.map = [0, 1];
				token.children = [];
				state.tokens.push(token);
			} else state.md.block.parse(state.src, state.md, state.env, state.tokens);
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_core/inline.mjs
		function inline(state) {
			const tokens = state.tokens;
			for (let i = 0, l = tokens.length; i < l; i++) {
				const tok = tokens[i];
				if (tok.type === "inline") state.md.inline.parse(tok.content, state.md, state.env, tok.children);
			}
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_core/linkify.mjs
		function isLinkOpen$1(str) {
			return /^<a[>\s]/i.test(str);
		}
		function isLinkClose$1(str) {
			return /^<\/a\s*>/i.test(str);
		}
		function linkify$1(state) {
			const blockTokens = state.tokens;
			if (!state.md.options.linkify) return;
			for (let j = 0, l = blockTokens.length; j < l; j++) {
				if (blockTokens[j].type !== "inline" || !state.md.linkify.pretest(blockTokens[j].content)) continue;
				let tokens = blockTokens[j].children;
				let htmlLinkLevel = 0;
				for (let i = tokens.length - 1; i >= 0; i--) {
					const currentToken = tokens[i];
					if (currentToken.type === "link_close") {
						i--;
						while (tokens[i].level !== currentToken.level && tokens[i].type !== "link_open") i--;
						continue;
					}
					if (currentToken.type === "html_inline") {
						if (isLinkOpen$1(currentToken.content) && htmlLinkLevel > 0) htmlLinkLevel--;
						if (isLinkClose$1(currentToken.content)) htmlLinkLevel++;
					}
					if (htmlLinkLevel > 0) continue;
					if (currentToken.type === "text" && state.md.linkify.test(currentToken.content)) {
						const text = currentToken.content;
						let links = state.md.linkify.match(text);
						const nodes = [];
						let level = currentToken.level;
						let lastPos = 0;
						if (links.length > 0 && links[0].index === 0 && i > 0 && tokens[i - 1].type === "text_special") links = links.slice(1);
						for (let ln = 0; ln < links.length; ln++) {
							const url = links[ln].url;
							const fullUrl = state.md.normalizeLink(url);
							if (!state.md.validateLink(fullUrl)) continue;
							let urlText = links[ln].text;
							if (!links[ln].schema) urlText = state.md.normalizeLinkText("http://" + urlText).replace(/^http:\/\//, "");
							else if (links[ln].schema === "mailto:" && !/^mailto:/i.test(urlText)) urlText = state.md.normalizeLinkText("mailto:" + urlText).replace(/^mailto:/, "");
							else urlText = state.md.normalizeLinkText(urlText);
							const pos = links[ln].index;
							if (pos > lastPos) {
								const token = new state.Token("text", "", 0);
								token.content = text.slice(lastPos, pos);
								token.level = level;
								nodes.push(token);
							}
							const token_o = new state.Token("link_open", "a", 1);
							token_o.attrs = [["href", fullUrl]];
							token_o.level = level++;
							token_o.markup = "linkify";
							token_o.info = "auto";
							nodes.push(token_o);
							const token_t = new state.Token("text", "", 0);
							token_t.content = urlText;
							token_t.level = level;
							nodes.push(token_t);
							const token_c = new state.Token("link_close", "a", -1);
							token_c.level = --level;
							token_c.markup = "linkify";
							token_c.info = "auto";
							nodes.push(token_c);
							lastPos = links[ln].lastIndex;
						}
						if (lastPos < text.length) {
							const token = new state.Token("text", "", 0);
							token.content = text.slice(lastPos);
							token.level = level;
							nodes.push(token);
						}
						blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
					}
				}
			}
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_core/replacements.mjs
		const RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;
		const SCOPED_ABBR_TEST_RE = /\((c|tm|r)\)/i;
		const SCOPED_ABBR_RE = /\((c|tm|r)\)/gi;
		const SCOPED_ABBR = {
			c: "©",
			r: "®",
			tm: "™"
		};
		function replaceFn(match, name) {
			return SCOPED_ABBR[name.toLowerCase()];
		}
		function replace_scoped(inlineTokens) {
			let inside_autolink = 0;
			for (let i = inlineTokens.length - 1; i >= 0; i--) {
				const token = inlineTokens[i];
				if (token.type === "text" && !inside_autolink) token.content = token.content.replace(SCOPED_ABBR_RE, replaceFn);
				if (token.type === "link_open" && token.info === "auto") inside_autolink--;
				if (token.type === "link_close" && token.info === "auto") inside_autolink++;
			}
		}
		function replace_rare(inlineTokens) {
			let inside_autolink = 0;
			for (let i = inlineTokens.length - 1; i >= 0; i--) {
				const token = inlineTokens[i];
				if (token.type === "text" && !inside_autolink) {
					if (RARE_RE.test(token.content)) token.content = token.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/gm, "$1—").replace(/(^|\s)--(?=\s|$)/gm, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, "$1–");
				}
				if (token.type === "link_open" && token.info === "auto") inside_autolink--;
				if (token.type === "link_close" && token.info === "auto") inside_autolink++;
			}
		}
		function replace(state) {
			let blkIdx;
			if (!state.md.options.typographer) return;
			for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
				if (state.tokens[blkIdx].type !== "inline") continue;
				if (SCOPED_ABBR_TEST_RE.test(state.tokens[blkIdx].content)) replace_scoped(state.tokens[blkIdx].children);
				if (RARE_RE.test(state.tokens[blkIdx].content)) replace_rare(state.tokens[blkIdx].children);
			}
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_core/smartquotes.mjs
		const QUOTE_TEST_RE = /['"]/;
		const QUOTE_RE = /['"]/g;
		const APOSTROPHE = "’";
		function replaceAt(str, index, ch) {
			return str.slice(0, index) + ch + str.slice(index + 1);
		}
		function process_inlines(tokens, state) {
			let j;
			const stack = [];
			for (let i = 0; i < tokens.length; i++) {
				const token = tokens[i];
				const thisLevel = tokens[i].level;
				for (j = stack.length - 1; j >= 0; j--) if (stack[j].level <= thisLevel) break;
				stack.length = j + 1;
				if (token.type !== "text") continue;
				let text = token.content;
				let pos = 0;
				let max = text.length;
				OUTER: while (pos < max) {
					QUOTE_RE.lastIndex = pos;
					const t = QUOTE_RE.exec(text);
					if (!t) break;
					let canOpen = true;
					let canClose = true;
					pos = t.index + 1;
					const isSingle = t[0] === "'";
					let lastChar = 32;
					if (t.index - 1 >= 0) lastChar = text.charCodeAt(t.index - 1);
					else for (j = i - 1; j >= 0; j--) {
						if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak") break;
						if (!tokens[j].content) continue;
						lastChar = tokens[j].content.charCodeAt(tokens[j].content.length - 1);
						break;
					}
					let nextChar = 32;
					if (pos < max) nextChar = text.charCodeAt(pos);
					else for (j = i + 1; j < tokens.length; j++) {
						if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak") break;
						if (!tokens[j].content) continue;
						nextChar = tokens[j].content.charCodeAt(0);
						break;
					}
					const isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
					const isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));
					const isLastWhiteSpace = isWhiteSpace(lastChar);
					const isNextWhiteSpace = isWhiteSpace(nextChar);
					if (isNextWhiteSpace) canOpen = false;
					else if (isNextPunctChar) {
						if (!(isLastWhiteSpace || isLastPunctChar)) canOpen = false;
					}
					if (isLastWhiteSpace) canClose = false;
					else if (isLastPunctChar) {
						if (!(isNextWhiteSpace || isNextPunctChar)) canClose = false;
					}
					if (nextChar === 34 && t[0] === "\"") {
						if (lastChar >= 48 && lastChar <= 57) canClose = canOpen = false;
					}
					if (canOpen && canClose) {
						canOpen = isLastPunctChar;
						canClose = isNextPunctChar;
					}
					if (!canOpen && !canClose) {
						if (isSingle) token.content = replaceAt(token.content, t.index, APOSTROPHE);
						continue;
					}
					if (canClose) for (j = stack.length - 1; j >= 0; j--) {
						let item = stack[j];
						if (stack[j].level < thisLevel) break;
						if (item.single === isSingle && stack[j].level === thisLevel) {
							item = stack[j];
							let openQuote;
							let closeQuote;
							if (isSingle) {
								openQuote = state.md.options.quotes[2];
								closeQuote = state.md.options.quotes[3];
							} else {
								openQuote = state.md.options.quotes[0];
								closeQuote = state.md.options.quotes[1];
							}
							token.content = replaceAt(token.content, t.index, closeQuote);
							tokens[item.token].content = replaceAt(tokens[item.token].content, item.pos, openQuote);
							pos += closeQuote.length - 1;
							if (item.token === i) pos += openQuote.length - 1;
							text = token.content;
							max = text.length;
							stack.length = j;
							continue OUTER;
						}
					}
					if (canOpen) stack.push({
						token: i,
						pos: t.index,
						single: isSingle,
						level: thisLevel
					});
					else if (canClose && isSingle) token.content = replaceAt(token.content, t.index, APOSTROPHE);
				}
			}
		}
		function smartquotes(state) {
			if (!state.md.options.typographer) return;
			for (let blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
				if (state.tokens[blkIdx].type !== "inline" || !QUOTE_TEST_RE.test(state.tokens[blkIdx].content)) continue;
				process_inlines(state.tokens[blkIdx].children, state);
			}
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_core/text_join.mjs
		function text_join(state) {
			let curr, last;
			const blockTokens = state.tokens;
			const l = blockTokens.length;
			for (let j = 0; j < l; j++) {
				if (blockTokens[j].type !== "inline") continue;
				const tokens = blockTokens[j].children;
				const max = tokens.length;
				for (curr = 0; curr < max; curr++) if (tokens[curr].type === "text_special") tokens[curr].type = "text";
				for (curr = last = 0; curr < max; curr++) if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
				else {
					if (curr !== last) tokens[last] = tokens[curr];
					last++;
				}
				if (curr !== last) tokens.length = last;
			}
		}
		//#endregion
		//#region node_modules/markdown-it/lib/parser_core.mjs
		/** internal
		* class Core
		*
		* Top-level rules executor. Glues block/inline parsers and does intermediate
		* transformations.
		**/
		const _rules$2 = [
			["normalize", normalize],
			["block", block],
			["inline", inline],
			["linkify", linkify$1],
			["replacements", replace],
			["smartquotes", smartquotes],
			["text_join", text_join]
		];
		/**
		* new Core()
		**/
		function Core() {
			/**
			* Core#ruler -> Ruler
			*
			* [[Ruler]] instance. Keep configuration of core rules.
			**/
			this.ruler = new Ruler();
			for (let i = 0; i < _rules$2.length; i++) this.ruler.push(_rules$2[i][0], _rules$2[i][1]);
		}
		/**
		* Core.process(state)
		*
		* Executes core chain rules.
		**/
		Core.prototype.process = function(state) {
			const rules = this.ruler.getRules("");
			for (let i = 0, l = rules.length; i < l; i++) rules[i](state);
		};
		Core.prototype.State = StateCore;
		//#endregion
		//#region node_modules/markdown-it/lib/rules_block/state_block.mjs
		function StateBlock(src, md, env, tokens) {
			this.src = src;
			this.md = md;
			this.env = env;
			this.tokens = tokens;
			this.bMarks = [];
			this.eMarks = [];
			this.tShift = [];
			this.sCount = [];
			this.bsCount = [];
			this.blkIndent = 0;
			this.line = 0;
			this.lineMax = 0;
			this.tight = false;
			this.ddIndent = -1;
			this.listIndent = -1;
			this.parentType = "root";
			this.level = 0;
			const s = this.src;
			for (let start = 0, pos = 0, indent = 0, offset = 0, len = s.length, indent_found = false; pos < len; pos++) {
				const ch = s.charCodeAt(pos);
				if (!indent_found) if (isSpace(ch)) {
					indent++;
					if (ch === 9) offset += 4 - offset % 4;
					else offset++;
					continue;
				} else indent_found = true;
				if (ch === 10 || pos === len - 1) {
					if (ch !== 10) pos++;
					this.bMarks.push(start);
					this.eMarks.push(pos);
					this.tShift.push(indent);
					this.sCount.push(offset);
					this.bsCount.push(0);
					indent_found = false;
					indent = 0;
					offset = 0;
					start = pos + 1;
				}
			}
			this.bMarks.push(s.length);
			this.eMarks.push(s.length);
			this.tShift.push(0);
			this.sCount.push(0);
			this.bsCount.push(0);
			this.lineMax = this.bMarks.length - 1;
		}
		StateBlock.prototype.push = function(type, tag, nesting) {
			const token = new Token(type, tag, nesting);
			token.block = true;
			if (nesting < 0) this.level--;
			token.level = this.level;
			if (nesting > 0) this.level++;
			this.tokens.push(token);
			return token;
		};
		StateBlock.prototype.isEmpty = function isEmpty(line) {
			return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
		};
		StateBlock.prototype.skipEmptyLines = function skipEmptyLines(from) {
			for (let max = this.lineMax; from < max; from++) if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) break;
			return from;
		};
		StateBlock.prototype.skipSpaces = function skipSpaces(pos) {
			for (let max = this.src.length; pos < max; pos++) if (!isSpace(this.src.charCodeAt(pos))) break;
			return pos;
		};
		StateBlock.prototype.skipSpacesBack = function skipSpacesBack(pos, min) {
			if (pos <= min) return pos;
			while (pos > min) if (!isSpace(this.src.charCodeAt(--pos))) return pos + 1;
			return pos;
		};
		StateBlock.prototype.skipChars = function skipChars(pos, code) {
			for (let max = this.src.length; pos < max; pos++) if (this.src.charCodeAt(pos) !== code) break;
			return pos;
		};
		StateBlock.prototype.skipCharsBack = function skipCharsBack(pos, code, min) {
			if (pos <= min) return pos;
			while (pos > min) if (code !== this.src.charCodeAt(--pos)) return pos + 1;
			return pos;
		};
		StateBlock.prototype.getLines = function getLines(begin, end, indent, keepLastLF) {
			if (begin >= end) return "";
			const queue = new Array(end - begin);
			for (let i = 0, line = begin; line < end; line++, i++) {
				let lineIndent = 0;
				const lineStart = this.bMarks[line];
				let first = lineStart;
				let last;
				if (line + 1 < end || keepLastLF) last = this.eMarks[line] + 1;
				else last = this.eMarks[line];
				while (first < last && lineIndent < indent) {
					const ch = this.src.charCodeAt(first);
					if (isSpace(ch)) if (ch === 9) lineIndent += 4 - (lineIndent + this.bsCount[line]) % 4;
					else lineIndent++;
					else if (first - lineStart < this.tShift[line]) lineIndent++;
					else break;
					first++;
				}
				if (lineIndent > indent) queue[i] = new Array(lineIndent - indent + 1).join(" ") + this.src.slice(first, last);
				else queue[i] = this.src.slice(first, last);
			}
			return queue.join("");
		};
		StateBlock.prototype.Token = Token;
		//#endregion
		//#region node_modules/markdown-it/lib/rules_block/table.mjs
		const MAX_AUTOCOMPLETED_CELLS = 65536;
		function getLine(state, line) {
			const pos = state.bMarks[line] + state.tShift[line];
			const max = state.eMarks[line];
			return state.src.slice(pos, max);
		}
		function escapedSplit(str) {
			const result = [];
			const max = str.length;
			let pos = 0;
			let ch = str.charCodeAt(pos);
			let isEscaped = false;
			let lastPos = 0;
			let current = "";
			while (pos < max) {
				if (ch === 124) if (!isEscaped) {
					result.push(current + str.substring(lastPos, pos));
					current = "";
					lastPos = pos + 1;
				} else {
					current += str.substring(lastPos, pos - 1);
					lastPos = pos;
				}
				isEscaped = ch === 92;
				pos++;
				ch = str.charCodeAt(pos);
			}
			result.push(current + str.substring(lastPos));
			return result;
		}
		function table(state, startLine, endLine, silent) {
			if (startLine + 2 > endLine) return false;
			let nextLine = startLine + 1;
			if (state.sCount[nextLine] < state.blkIndent) return false;
			if (state.sCount[nextLine] - state.blkIndent >= 4) return false;
			let pos = state.bMarks[nextLine] + state.tShift[nextLine];
			if (pos >= state.eMarks[nextLine]) return false;
			const firstCh = state.src.charCodeAt(pos++);
			if (firstCh !== 124 && firstCh !== 45 && firstCh !== 58) return false;
			if (pos >= state.eMarks[nextLine]) return false;
			const secondCh = state.src.charCodeAt(pos++);
			if (secondCh !== 124 && secondCh !== 45 && secondCh !== 58 && !isSpace(secondCh)) return false;
			if (firstCh === 45 && isSpace(secondCh)) return false;
			while (pos < state.eMarks[nextLine]) {
				const ch = state.src.charCodeAt(pos);
				if (ch !== 124 && ch !== 45 && ch !== 58 && !isSpace(ch)) return false;
				pos++;
			}
			let lineText = getLine(state, startLine + 1);
			let columns = lineText.split("|");
			const aligns = [];
			for (let i = 0; i < columns.length; i++) {
				const t = columns[i].trim();
				if (!t) if (i === 0 || i === columns.length - 1) continue;
				else return false;
				if (!/^:?-+:?$/.test(t)) return false;
				if (t.charCodeAt(t.length - 1) === 58) aligns.push(t.charCodeAt(0) === 58 ? "center" : "right");
				else if (t.charCodeAt(0) === 58) aligns.push("left");
				else aligns.push("");
			}
			lineText = getLine(state, startLine).trim();
			if (lineText.indexOf("|") === -1) return false;
			if (state.sCount[startLine] - state.blkIndent >= 4) return false;
			columns = escapedSplit(lineText);
			if (columns.length && columns[0] === "") columns.shift();
			if (columns.length && columns[columns.length - 1] === "") columns.pop();
			const columnCount = columns.length;
			if (columnCount === 0 || columnCount !== aligns.length) return false;
			if (silent) return true;
			const oldParentType = state.parentType;
			state.parentType = "table";
			const terminatorRules = state.md.block.ruler.getRules("blockquote");
			const token_to = state.push("table_open", "table", 1);
			const tableLines = [startLine, 0];
			token_to.map = tableLines;
			const token_tho = state.push("thead_open", "thead", 1);
			token_tho.map = [startLine, startLine + 1];
			const token_htro = state.push("tr_open", "tr", 1);
			token_htro.map = [startLine, startLine + 1];
			for (let i = 0; i < columns.length; i++) {
				const token_ho = state.push("th_open", "th", 1);
				if (aligns[i]) token_ho.attrs = [["style", "text-align:" + aligns[i]]];
				const token_il = state.push("inline", "", 0);
				token_il.content = columns[i].trim();
				token_il.children = [];
				state.push("th_close", "th", -1);
			}
			state.push("tr_close", "tr", -1);
			state.push("thead_close", "thead", -1);
			let tbodyLines;
			let autocompletedCells = 0;
			for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
				if (state.sCount[nextLine] < state.blkIndent) break;
				let terminate = false;
				for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
					terminate = true;
					break;
				}
				if (terminate) break;
				lineText = getLine(state, nextLine).trim();
				if (!lineText) break;
				if (state.sCount[nextLine] - state.blkIndent >= 4) break;
				columns = escapedSplit(lineText);
				if (columns.length && columns[0] === "") columns.shift();
				if (columns.length && columns[columns.length - 1] === "") columns.pop();
				autocompletedCells += columnCount - columns.length;
				if (autocompletedCells > MAX_AUTOCOMPLETED_CELLS) break;
				if (nextLine === startLine + 2) {
					const token_tbo = state.push("tbody_open", "tbody", 1);
					token_tbo.map = tbodyLines = [startLine + 2, 0];
				}
				const token_tro = state.push("tr_open", "tr", 1);
				token_tro.map = [nextLine, nextLine + 1];
				for (let i = 0; i < columnCount; i++) {
					const token_tdo = state.push("td_open", "td", 1);
					if (aligns[i]) token_tdo.attrs = [["style", "text-align:" + aligns[i]]];
					const token_il = state.push("inline", "", 0);
					token_il.content = columns[i] ? columns[i].trim() : "";
					token_il.children = [];
					state.push("td_close", "td", -1);
				}
				state.push("tr_close", "tr", -1);
			}
			if (tbodyLines) {
				state.push("tbody_close", "tbody", -1);
				tbodyLines[1] = nextLine;
			}
			state.push("table_close", "table", -1);
			tableLines[1] = nextLine;
			state.parentType = oldParentType;
			state.line = nextLine;
			return true;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_block/code.mjs
		function code(state, startLine, endLine) {
			if (state.sCount[startLine] - state.blkIndent < 4) return false;
			let nextLine = startLine + 1;
			let last = nextLine;
			while (nextLine < endLine) {
				if (state.isEmpty(nextLine)) {
					nextLine++;
					continue;
				}
				if (state.sCount[nextLine] - state.blkIndent >= 4) {
					nextLine++;
					last = nextLine;
					continue;
				}
				break;
			}
			state.line = last;
			const token = state.push("code_block", "code", 0);
			token.content = state.getLines(startLine, last, 4 + state.blkIndent, false) + "\n";
			token.map = [startLine, state.line];
			return true;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_block/fence.mjs
		function fence(state, startLine, endLine, silent) {
			let pos = state.bMarks[startLine] + state.tShift[startLine];
			let max = state.eMarks[startLine];
			if (state.sCount[startLine] - state.blkIndent >= 4) return false;
			if (pos + 3 > max) return false;
			const marker = state.src.charCodeAt(pos);
			if (marker !== 126 && marker !== 96) return false;
			let mem = pos;
			pos = state.skipChars(pos, marker);
			let len = pos - mem;
			if (len < 3) return false;
			const markup = state.src.slice(mem, pos);
			const params = state.src.slice(pos, max);
			if (marker === 96) {
				if (params.indexOf(String.fromCharCode(marker)) >= 0) return false;
			}
			if (silent) return true;
			let nextLine = startLine;
			let haveEndMarker = false;
			for (;;) {
				nextLine++;
				if (nextLine >= endLine) break;
				pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
				max = state.eMarks[nextLine];
				if (pos < max && state.sCount[nextLine] < state.blkIndent) break;
				if (state.src.charCodeAt(pos) !== marker) continue;
				if (state.sCount[nextLine] - state.blkIndent >= 4) continue;
				pos = state.skipChars(pos, marker);
				if (pos - mem < len) continue;
				pos = state.skipSpaces(pos);
				if (pos < max) continue;
				haveEndMarker = true;
				break;
			}
			len = state.sCount[startLine];
			state.line = nextLine + (haveEndMarker ? 1 : 0);
			const token = state.push("fence", "code", 0);
			token.info = params;
			token.content = state.getLines(startLine + 1, nextLine, len, true);
			token.markup = markup;
			token.map = [startLine, state.line];
			return true;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_block/blockquote.mjs
		function blockquote(state, startLine, endLine, silent) {
			let pos = state.bMarks[startLine] + state.tShift[startLine];
			let max = state.eMarks[startLine];
			const oldLineMax = state.lineMax;
			if (state.sCount[startLine] - state.blkIndent >= 4) return false;
			if (state.src.charCodeAt(pos) !== 62) return false;
			if (silent) return true;
			const oldBMarks = [];
			const oldBSCount = [];
			const oldSCount = [];
			const oldTShift = [];
			const terminatorRules = state.md.block.ruler.getRules("blockquote");
			const oldParentType = state.parentType;
			state.parentType = "blockquote";
			let lastLineEmpty = false;
			let nextLine;
			for (nextLine = startLine; nextLine < endLine; nextLine++) {
				const isOutdented = state.sCount[nextLine] < state.blkIndent;
				pos = state.bMarks[nextLine] + state.tShift[nextLine];
				max = state.eMarks[nextLine];
				if (pos >= max) break;
				if (state.src.charCodeAt(pos++) === 62 && !isOutdented) {
					let initial = state.sCount[nextLine] + 1;
					let spaceAfterMarker;
					let adjustTab;
					if (state.src.charCodeAt(pos) === 32) {
						pos++;
						initial++;
						adjustTab = false;
						spaceAfterMarker = true;
					} else if (state.src.charCodeAt(pos) === 9) {
						spaceAfterMarker = true;
						if ((state.bsCount[nextLine] + initial) % 4 === 3) {
							pos++;
							initial++;
							adjustTab = false;
						} else adjustTab = true;
					} else spaceAfterMarker = false;
					let offset = initial;
					oldBMarks.push(state.bMarks[nextLine]);
					state.bMarks[nextLine] = pos;
					while (pos < max) {
						const ch = state.src.charCodeAt(pos);
						if (isSpace(ch)) if (ch === 9) offset += 4 - (offset + state.bsCount[nextLine] + (adjustTab ? 1 : 0)) % 4;
						else offset++;
						else break;
						pos++;
					}
					lastLineEmpty = pos >= max;
					oldBSCount.push(state.bsCount[nextLine]);
					state.bsCount[nextLine] = state.sCount[nextLine] + 1 + (spaceAfterMarker ? 1 : 0);
					oldSCount.push(state.sCount[nextLine]);
					state.sCount[nextLine] = offset - initial;
					oldTShift.push(state.tShift[nextLine]);
					state.tShift[nextLine] = pos - state.bMarks[nextLine];
					continue;
				}
				if (lastLineEmpty) break;
				let terminate = false;
				for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
					terminate = true;
					break;
				}
				if (terminate) {
					state.lineMax = nextLine;
					if (state.blkIndent !== 0) {
						oldBMarks.push(state.bMarks[nextLine]);
						oldBSCount.push(state.bsCount[nextLine]);
						oldTShift.push(state.tShift[nextLine]);
						oldSCount.push(state.sCount[nextLine]);
						state.sCount[nextLine] -= state.blkIndent;
					}
					break;
				}
				oldBMarks.push(state.bMarks[nextLine]);
				oldBSCount.push(state.bsCount[nextLine]);
				oldTShift.push(state.tShift[nextLine]);
				oldSCount.push(state.sCount[nextLine]);
				state.sCount[nextLine] = -1;
			}
			const oldIndent = state.blkIndent;
			state.blkIndent = 0;
			const token_o = state.push("blockquote_open", "blockquote", 1);
			token_o.markup = ">";
			const lines = [startLine, 0];
			token_o.map = lines;
			state.md.block.tokenize(state, startLine, nextLine);
			const token_c = state.push("blockquote_close", "blockquote", -1);
			token_c.markup = ">";
			state.lineMax = oldLineMax;
			state.parentType = oldParentType;
			lines[1] = state.line;
			for (let i = 0; i < oldTShift.length; i++) {
				state.bMarks[i + startLine] = oldBMarks[i];
				state.tShift[i + startLine] = oldTShift[i];
				state.sCount[i + startLine] = oldSCount[i];
				state.bsCount[i + startLine] = oldBSCount[i];
			}
			state.blkIndent = oldIndent;
			return true;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_block/hr.mjs
		function hr(state, startLine, endLine, silent) {
			const max = state.eMarks[startLine];
			if (state.sCount[startLine] - state.blkIndent >= 4) return false;
			let pos = state.bMarks[startLine] + state.tShift[startLine];
			const marker = state.src.charCodeAt(pos++);
			if (marker !== 42 && marker !== 45 && marker !== 95) return false;
			let cnt = 1;
			while (pos < max) {
				const ch = state.src.charCodeAt(pos++);
				if (ch !== marker && !isSpace(ch)) return false;
				if (ch === marker) cnt++;
			}
			if (cnt < 3) return false;
			if (silent) return true;
			state.line = startLine + 1;
			const token = state.push("hr", "hr", 0);
			token.map = [startLine, state.line];
			token.markup = Array(cnt + 1).join(String.fromCharCode(marker));
			return true;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_block/list.mjs
		function skipBulletListMarker(state, startLine) {
			const max = state.eMarks[startLine];
			let pos = state.bMarks[startLine] + state.tShift[startLine];
			const marker = state.src.charCodeAt(pos++);
			if (marker !== 42 && marker !== 45 && marker !== 43) return -1;
			if (pos < max) {
				if (!isSpace(state.src.charCodeAt(pos))) return -1;
			}
			return pos;
		}
		function skipOrderedListMarker(state, startLine) {
			const start = state.bMarks[startLine] + state.tShift[startLine];
			const max = state.eMarks[startLine];
			let pos = start;
			if (pos + 1 >= max) return -1;
			let ch = state.src.charCodeAt(pos++);
			if (ch < 48 || ch > 57) return -1;
			for (;;) {
				if (pos >= max) return -1;
				ch = state.src.charCodeAt(pos++);
				if (ch >= 48 && ch <= 57) {
					if (pos - start >= 10) return -1;
					continue;
				}
				if (ch === 41 || ch === 46) break;
				return -1;
			}
			if (pos < max) {
				ch = state.src.charCodeAt(pos);
				if (!isSpace(ch)) return -1;
			}
			return pos;
		}
		function markTightParagraphs(state, idx) {
			const level = state.level + 2;
			for (let i = idx + 2, l = state.tokens.length - 2; i < l; i++) if (state.tokens[i].level === level && state.tokens[i].type === "paragraph_open") {
				state.tokens[i + 2].hidden = true;
				state.tokens[i].hidden = true;
				i += 2;
			}
		}
		function list(state, startLine, endLine, silent) {
			let max, pos, start, token;
			let nextLine = startLine;
			let tight = true;
			if (state.sCount[nextLine] - state.blkIndent >= 4) return false;
			if (state.listIndent >= 0 && state.sCount[nextLine] - state.listIndent >= 4 && state.sCount[nextLine] < state.blkIndent) return false;
			let isTerminatingParagraph = false;
			if (silent && state.parentType === "paragraph") {
				if (state.sCount[nextLine] >= state.blkIndent) isTerminatingParagraph = true;
			}
			let isOrdered;
			let markerValue;
			let posAfterMarker;
			if ((posAfterMarker = skipOrderedListMarker(state, nextLine)) >= 0) {
				isOrdered = true;
				start = state.bMarks[nextLine] + state.tShift[nextLine];
				markerValue = Number(state.src.slice(start, posAfterMarker - 1));
				if (isTerminatingParagraph && markerValue !== 1) return false;
			} else if ((posAfterMarker = skipBulletListMarker(state, nextLine)) >= 0) isOrdered = false;
			else return false;
			if (isTerminatingParagraph) {
				if (state.skipSpaces(posAfterMarker) >= state.eMarks[nextLine]) return false;
			}
			if (silent) return true;
			const markerCharCode = state.src.charCodeAt(posAfterMarker - 1);
			const listTokIdx = state.tokens.length;
			if (isOrdered) {
				token = state.push("ordered_list_open", "ol", 1);
				if (markerValue !== 1) token.attrs = [["start", markerValue]];
			} else token = state.push("bullet_list_open", "ul", 1);
			const listLines = [nextLine, 0];
			token.map = listLines;
			token.markup = String.fromCharCode(markerCharCode);
			let prevEmptyEnd = false;
			const terminatorRules = state.md.block.ruler.getRules("list");
			const oldParentType = state.parentType;
			state.parentType = "list";
			while (nextLine < endLine) {
				pos = posAfterMarker;
				max = state.eMarks[nextLine];
				const initial = state.sCount[nextLine] + posAfterMarker - (state.bMarks[nextLine] + state.tShift[nextLine]);
				let offset = initial;
				while (pos < max) {
					const ch = state.src.charCodeAt(pos);
					if (ch === 9) offset += 4 - (offset + state.bsCount[nextLine]) % 4;
					else if (ch === 32) offset++;
					else break;
					pos++;
				}
				const contentStart = pos;
				let indentAfterMarker;
				if (contentStart >= max) indentAfterMarker = 1;
				else indentAfterMarker = offset - initial;
				if (indentAfterMarker > 4) indentAfterMarker = 1;
				const indent = initial + indentAfterMarker;
				token = state.push("list_item_open", "li", 1);
				token.markup = String.fromCharCode(markerCharCode);
				const itemLines = [nextLine, 0];
				token.map = itemLines;
				if (isOrdered) token.info = state.src.slice(start, posAfterMarker - 1);
				const oldTight = state.tight;
				const oldTShift = state.tShift[nextLine];
				const oldSCount = state.sCount[nextLine];
				const oldListIndent = state.listIndent;
				state.listIndent = state.blkIndent;
				state.blkIndent = indent;
				state.tight = true;
				state.tShift[nextLine] = contentStart - state.bMarks[nextLine];
				state.sCount[nextLine] = offset;
				if (contentStart >= max && state.isEmpty(nextLine + 1)) state.line = Math.min(state.line + 2, endLine);
				else state.md.block.tokenize(state, nextLine, endLine, true);
				if (!state.tight || prevEmptyEnd) tight = false;
				prevEmptyEnd = state.line - nextLine > 1 && state.isEmpty(state.line - 1);
				state.blkIndent = state.listIndent;
				state.listIndent = oldListIndent;
				state.tShift[nextLine] = oldTShift;
				state.sCount[nextLine] = oldSCount;
				state.tight = oldTight;
				token = state.push("list_item_close", "li", -1);
				token.markup = String.fromCharCode(markerCharCode);
				nextLine = state.line;
				itemLines[1] = nextLine;
				if (nextLine >= endLine) break;
				if (state.sCount[nextLine] < state.blkIndent) break;
				if (state.sCount[nextLine] - state.blkIndent >= 4) break;
				let terminate = false;
				for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
					terminate = true;
					break;
				}
				if (terminate) break;
				if (isOrdered) {
					posAfterMarker = skipOrderedListMarker(state, nextLine);
					if (posAfterMarker < 0) break;
					start = state.bMarks[nextLine] + state.tShift[nextLine];
				} else {
					posAfterMarker = skipBulletListMarker(state, nextLine);
					if (posAfterMarker < 0) break;
				}
				if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) break;
			}
			if (isOrdered) token = state.push("ordered_list_close", "ol", -1);
			else token = state.push("bullet_list_close", "ul", -1);
			token.markup = String.fromCharCode(markerCharCode);
			listLines[1] = nextLine;
			state.line = nextLine;
			state.parentType = oldParentType;
			if (tight) markTightParagraphs(state, listTokIdx);
			return true;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_block/reference.mjs
		function reference(state, startLine, _endLine, silent) {
			let pos = state.bMarks[startLine] + state.tShift[startLine];
			let max = state.eMarks[startLine];
			let nextLine = startLine + 1;
			if (state.sCount[startLine] - state.blkIndent >= 4) return false;
			if (state.src.charCodeAt(pos) !== 91) return false;
			function getNextLine(nextLine) {
				const endLine = state.lineMax;
				if (nextLine >= endLine || state.isEmpty(nextLine)) return null;
				let isContinuation = false;
				if (state.sCount[nextLine] - state.blkIndent > 3) isContinuation = true;
				if (state.sCount[nextLine] < 0) isContinuation = true;
				if (!isContinuation) {
					const terminatorRules = state.md.block.ruler.getRules("reference");
					const oldParentType = state.parentType;
					state.parentType = "reference";
					let terminate = false;
					for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
						terminate = true;
						break;
					}
					state.parentType = oldParentType;
					if (terminate) return null;
				}
				const pos = state.bMarks[nextLine] + state.tShift[nextLine];
				const max = state.eMarks[nextLine];
				return state.src.slice(pos, max + 1);
			}
			let str = state.src.slice(pos, max + 1);
			max = str.length;
			let labelEnd = -1;
			for (pos = 1; pos < max; pos++) {
				const ch = str.charCodeAt(pos);
				if (ch === 91) return false;
				else if (ch === 93) {
					labelEnd = pos;
					break;
				} else if (ch === 10) {
					const lineContent = getNextLine(nextLine);
					if (lineContent !== null) {
						str += lineContent;
						max = str.length;
						nextLine++;
					}
				} else if (ch === 92) {
					pos++;
					if (pos < max && str.charCodeAt(pos) === 10) {
						const lineContent = getNextLine(nextLine);
						if (lineContent !== null) {
							str += lineContent;
							max = str.length;
							nextLine++;
						}
					}
				}
			}
			if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 58) return false;
			for (pos = labelEnd + 2; pos < max; pos++) {
				const ch = str.charCodeAt(pos);
				if (ch === 10) {
					const lineContent = getNextLine(nextLine);
					if (lineContent !== null) {
						str += lineContent;
						max = str.length;
						nextLine++;
					}
				} else if (isSpace(ch)) {} else break;
			}
			const destRes = state.md.helpers.parseLinkDestination(str, pos, max);
			if (!destRes.ok) return false;
			const href = state.md.normalizeLink(destRes.str);
			if (!state.md.validateLink(href)) return false;
			pos = destRes.pos;
			const destEndPos = pos;
			const destEndLineNo = nextLine;
			const start = pos;
			for (; pos < max; pos++) {
				const ch = str.charCodeAt(pos);
				if (ch === 10) {
					const lineContent = getNextLine(nextLine);
					if (lineContent !== null) {
						str += lineContent;
						max = str.length;
						nextLine++;
					}
				} else if (isSpace(ch)) {} else break;
			}
			let titleRes = state.md.helpers.parseLinkTitle(str, pos, max);
			while (titleRes.can_continue) {
				const lineContent = getNextLine(nextLine);
				if (lineContent === null) break;
				str += lineContent;
				pos = max;
				max = str.length;
				nextLine++;
				titleRes = state.md.helpers.parseLinkTitle(str, pos, max, titleRes);
			}
			let title;
			if (pos < max && start !== pos && titleRes.ok) {
				title = titleRes.str;
				pos = titleRes.pos;
			} else {
				title = "";
				pos = destEndPos;
				nextLine = destEndLineNo;
			}
			while (pos < max) {
				if (!isSpace(str.charCodeAt(pos))) break;
				pos++;
			}
			if (pos < max && str.charCodeAt(pos) !== 10) {
				if (title) {
					title = "";
					pos = destEndPos;
					nextLine = destEndLineNo;
					while (pos < max) {
						if (!isSpace(str.charCodeAt(pos))) break;
						pos++;
					}
				}
			}
			if (pos < max && str.charCodeAt(pos) !== 10) return false;
			const label = normalizeReference(str.slice(1, labelEnd));
			if (!label) return false;
			/* istanbul ignore if */
			if (silent) return true;
			if (typeof state.env.references === "undefined") state.env.references = {};
			if (typeof state.env.references[label] === "undefined") state.env.references[label] = {
				title,
				href
			};
			state.line = nextLine;
			return true;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/common/html_blocks.mjs
		var html_blocks_default = [
			"address",
			"article",
			"aside",
			"base",
			"basefont",
			"blockquote",
			"body",
			"caption",
			"center",
			"col",
			"colgroup",
			"dd",
			"details",
			"dialog",
			"dir",
			"div",
			"dl",
			"dt",
			"fieldset",
			"figcaption",
			"figure",
			"footer",
			"form",
			"frame",
			"frameset",
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
			"head",
			"header",
			"hr",
			"html",
			"iframe",
			"legend",
			"li",
			"link",
			"main",
			"menu",
			"menuitem",
			"nav",
			"noframes",
			"ol",
			"optgroup",
			"option",
			"p",
			"param",
			"search",
			"section",
			"summary",
			"table",
			"tbody",
			"td",
			"tfoot",
			"th",
			"thead",
			"title",
			"tr",
			"track",
			"ul"
		];
		//#endregion
		//#region node_modules/markdown-it/lib/common/html_re.mjs
		const HTML_TAG_RE = /* @__PURE__ */ new RegExp("^(?:<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>|<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>|<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->|<[?][\\s\\S]*?[?]>|<![A-Za-z][^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)");
		const HTML_OPEN_CLOSE_TAG_RE = /* @__PURE__ */ new RegExp("^(?:<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>|<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>)");
		//#endregion
		//#region node_modules/markdown-it/lib/rules_block/html_block.mjs
		const HTML_SEQUENCES = [
			[
				/^<(script|pre|style|textarea)(?=(\s|>|$))/i,
				/<\/(script|pre|style|textarea)>/i,
				true
			],
			[
				/^<!--/,
				/-->/,
				true
			],
			[
				/^<\?/,
				/\?>/,
				true
			],
			[
				/^<![A-Z]/,
				/>/,
				true
			],
			[
				/^<!\[CDATA\[/,
				/\]\]>/,
				true
			],
			[
				new RegExp("^</?(" + html_blocks_default.join("|") + ")(?=(\\s|/?>|$))", "i"),
				/^$/,
				true
			],
			[
				new RegExp(HTML_OPEN_CLOSE_TAG_RE.source + "\\s*$"),
				/^$/,
				false
			]
		];
		function html_block(state, startLine, endLine, silent) {
			let pos = state.bMarks[startLine] + state.tShift[startLine];
			let max = state.eMarks[startLine];
			if (state.sCount[startLine] - state.blkIndent >= 4) return false;
			if (!state.md.options.html) return false;
			if (state.src.charCodeAt(pos) !== 60) return false;
			let lineText = state.src.slice(pos, max);
			let i = 0;
			for (; i < HTML_SEQUENCES.length; i++) if (HTML_SEQUENCES[i][0].test(lineText)) break;
			if (i === HTML_SEQUENCES.length) return false;
			if (silent) return HTML_SEQUENCES[i][2];
			let nextLine = startLine + 1;
			if (!HTML_SEQUENCES[i][1].test(lineText)) for (; nextLine < endLine; nextLine++) {
				if (state.sCount[nextLine] < state.blkIndent) break;
				pos = state.bMarks[nextLine] + state.tShift[nextLine];
				max = state.eMarks[nextLine];
				lineText = state.src.slice(pos, max);
				if (HTML_SEQUENCES[i][1].test(lineText)) {
					if (lineText.length !== 0) nextLine++;
					break;
				}
			}
			state.line = nextLine;
			const token = state.push("html_block", "", 0);
			token.map = [startLine, nextLine];
			token.content = state.getLines(startLine, nextLine, state.blkIndent, true);
			return true;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_block/heading.mjs
		function heading(state, startLine, endLine, silent) {
			let pos = state.bMarks[startLine] + state.tShift[startLine];
			let max = state.eMarks[startLine];
			if (state.sCount[startLine] - state.blkIndent >= 4) return false;
			let ch = state.src.charCodeAt(pos);
			if (ch !== 35 || pos >= max) return false;
			let level = 1;
			ch = state.src.charCodeAt(++pos);
			while (ch === 35 && pos < max && level <= 6) {
				level++;
				ch = state.src.charCodeAt(++pos);
			}
			if (level > 6 || pos < max && !isSpace(ch)) return false;
			if (silent) return true;
			max = state.skipSpacesBack(max, pos);
			const tmp = state.skipCharsBack(max, 35, pos);
			if (tmp > pos && isSpace(state.src.charCodeAt(tmp - 1))) max = tmp;
			state.line = startLine + 1;
			const token_o = state.push("heading_open", "h" + String(level), 1);
			token_o.markup = "########".slice(0, level);
			token_o.map = [startLine, state.line];
			const token_i = state.push("inline", "", 0);
			token_i.content = state.src.slice(pos, max).trim();
			token_i.map = [startLine, state.line];
			token_i.children = [];
			const token_c = state.push("heading_close", "h" + String(level), -1);
			token_c.markup = "########".slice(0, level);
			return true;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_block/lheading.mjs
		function lheading(state, startLine, endLine) {
			const terminatorRules = state.md.block.ruler.getRules("paragraph");
			if (state.sCount[startLine] - state.blkIndent >= 4) return false;
			const oldParentType = state.parentType;
			state.parentType = "paragraph";
			let level = 0;
			let marker;
			let nextLine = startLine + 1;
			for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
				if (state.sCount[nextLine] - state.blkIndent > 3) continue;
				if (state.sCount[nextLine] >= state.blkIndent) {
					let pos = state.bMarks[nextLine] + state.tShift[nextLine];
					const max = state.eMarks[nextLine];
					if (pos < max) {
						marker = state.src.charCodeAt(pos);
						if (marker === 45 || marker === 61) {
							pos = state.skipChars(pos, marker);
							pos = state.skipSpaces(pos);
							if (pos >= max) {
								level = marker === 61 ? 1 : 2;
								break;
							}
						}
					}
				}
				if (state.sCount[nextLine] < 0) continue;
				let terminate = false;
				for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
					terminate = true;
					break;
				}
				if (terminate) break;
			}
			if (!level) return false;
			const content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
			state.line = nextLine + 1;
			const token_o = state.push("heading_open", "h" + String(level), 1);
			token_o.markup = String.fromCharCode(marker);
			token_o.map = [startLine, state.line];
			const token_i = state.push("inline", "", 0);
			token_i.content = content;
			token_i.map = [startLine, state.line - 1];
			token_i.children = [];
			const token_c = state.push("heading_close", "h" + String(level), -1);
			token_c.markup = String.fromCharCode(marker);
			state.parentType = oldParentType;
			return true;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_block/paragraph.mjs
		function paragraph(state, startLine, endLine) {
			const terminatorRules = state.md.block.ruler.getRules("paragraph");
			const oldParentType = state.parentType;
			let nextLine = startLine + 1;
			state.parentType = "paragraph";
			for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
				if (state.sCount[nextLine] - state.blkIndent > 3) continue;
				if (state.sCount[nextLine] < 0) continue;
				let terminate = false;
				for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
					terminate = true;
					break;
				}
				if (terminate) break;
			}
			const content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
			state.line = nextLine;
			const token_o = state.push("paragraph_open", "p", 1);
			token_o.map = [startLine, state.line];
			const token_i = state.push("inline", "", 0);
			token_i.content = content;
			token_i.map = [startLine, state.line];
			token_i.children = [];
			state.push("paragraph_close", "p", -1);
			state.parentType = oldParentType;
			return true;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/parser_block.mjs
		/** internal
		* class ParserBlock
		*
		* Block-level tokenizer.
		**/
		const _rules$1 = [
			[
				"table",
				table,
				["paragraph", "reference"]
			],
			["code", code],
			[
				"fence",
				fence,
				[
					"paragraph",
					"reference",
					"blockquote",
					"list"
				]
			],
			[
				"blockquote",
				blockquote,
				[
					"paragraph",
					"reference",
					"blockquote",
					"list"
				]
			],
			[
				"hr",
				hr,
				[
					"paragraph",
					"reference",
					"blockquote",
					"list"
				]
			],
			[
				"list",
				list,
				[
					"paragraph",
					"reference",
					"blockquote"
				]
			],
			["reference", reference],
			[
				"html_block",
				html_block,
				[
					"paragraph",
					"reference",
					"blockquote"
				]
			],
			[
				"heading",
				heading,
				[
					"paragraph",
					"reference",
					"blockquote"
				]
			],
			["lheading", lheading],
			["paragraph", paragraph]
		];
		/**
		* new ParserBlock()
		**/
		function ParserBlock() {
			/**
			* ParserBlock#ruler -> Ruler
			*
			* [[Ruler]] instance. Keep configuration of block rules.
			**/
			this.ruler = new Ruler();
			for (let i = 0; i < _rules$1.length; i++) this.ruler.push(_rules$1[i][0], _rules$1[i][1], { alt: (_rules$1[i][2] || []).slice() });
		}
		ParserBlock.prototype.tokenize = function(state, startLine, endLine) {
			const rules = this.ruler.getRules("");
			const len = rules.length;
			const maxNesting = state.md.options.maxNesting;
			let line = startLine;
			let hasEmptyLines = false;
			while (line < endLine) {
				state.line = line = state.skipEmptyLines(line);
				if (line >= endLine) break;
				if (state.sCount[line] < state.blkIndent) break;
				if (state.level >= maxNesting) {
					state.line = endLine;
					break;
				}
				const prevLine = state.line;
				let ok = false;
				for (let i = 0; i < len; i++) {
					ok = rules[i](state, line, endLine, false);
					if (ok) {
						if (prevLine >= state.line) throw new Error("block rule didn't increment state.line");
						break;
					}
				}
				if (!ok) throw new Error("none of the block rules matched");
				state.tight = !hasEmptyLines;
				if (state.isEmpty(state.line - 1)) hasEmptyLines = true;
				line = state.line;
				if (line < endLine && state.isEmpty(line)) {
					hasEmptyLines = true;
					line++;
					state.line = line;
				}
			}
		};
		/**
		* ParserBlock.parse(str, md, env, outTokens)
		*
		* Process input string and push block tokens into `outTokens`
		**/
		ParserBlock.prototype.parse = function(src, md, env, outTokens) {
			if (!src) return;
			const state = new this.State(src, md, env, outTokens);
			this.tokenize(state, state.line, state.lineMax);
		};
		ParserBlock.prototype.State = StateBlock;
		//#endregion
		//#region node_modules/markdown-it/lib/rules_inline/state_inline.mjs
		function StateInline(src, md, env, outTokens) {
			this.src = src;
			this.env = env;
			this.md = md;
			this.tokens = outTokens;
			this.tokens_meta = Array(outTokens.length);
			this.pos = 0;
			this.posMax = this.src.length;
			this.level = 0;
			this.pending = "";
			this.pendingLevel = 0;
			this.cache = {};
			this.delimiters = [];
			this._prev_delimiters = [];
			this.backticks = {};
			this.backticksScanned = false;
			this.linkLevel = 0;
		}
		StateInline.prototype.pushPending = function() {
			const token = new Token("text", "", 0);
			token.content = this.pending;
			token.level = this.pendingLevel;
			this.tokens.push(token);
			this.pending = "";
			return token;
		};
		StateInline.prototype.push = function(type, tag, nesting) {
			if (this.pending) this.pushPending();
			const token = new Token(type, tag, nesting);
			let token_meta = null;
			if (nesting < 0) {
				this.level--;
				this.delimiters = this._prev_delimiters.pop();
			}
			token.level = this.level;
			if (nesting > 0) {
				this.level++;
				this._prev_delimiters.push(this.delimiters);
				this.delimiters = [];
				token_meta = { delimiters: this.delimiters };
			}
			this.pendingLevel = this.level;
			this.tokens.push(token);
			this.tokens_meta.push(token_meta);
			return token;
		};
		StateInline.prototype.scanDelims = function(start, canSplitWord) {
			const max = this.posMax;
			const marker = this.src.charCodeAt(start);
			const lastChar = start > 0 ? this.src.charCodeAt(start - 1) : 32;
			let pos = start;
			while (pos < max && this.src.charCodeAt(pos) === marker) pos++;
			const count = pos - start;
			const nextChar = pos < max ? this.src.charCodeAt(pos) : 32;
			const isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
			const isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));
			const isLastWhiteSpace = isWhiteSpace(lastChar);
			const isNextWhiteSpace = isWhiteSpace(nextChar);
			const left_flanking = !isNextWhiteSpace && (!isNextPunctChar || isLastWhiteSpace || isLastPunctChar);
			const right_flanking = !isLastWhiteSpace && (!isLastPunctChar || isNextWhiteSpace || isNextPunctChar);
			return {
				can_open: left_flanking && (canSplitWord || !right_flanking || isLastPunctChar),
				can_close: right_flanking && (canSplitWord || !left_flanking || isNextPunctChar),
				length: count
			};
		};
		StateInline.prototype.Token = Token;
		//#endregion
		//#region node_modules/markdown-it/lib/rules_inline/text.mjs
		function isTerminatorChar(ch) {
			switch (ch) {
				case 10:
				case 33:
				case 35:
				case 36:
				case 37:
				case 38:
				case 42:
				case 43:
				case 45:
				case 58:
				case 60:
				case 61:
				case 62:
				case 64:
				case 91:
				case 92:
				case 93:
				case 94:
				case 95:
				case 96:
				case 123:
				case 125:
				case 126: return true;
				default: return false;
			}
		}
		function text(state, silent) {
			let pos = state.pos;
			while (pos < state.posMax && !isTerminatorChar(state.src.charCodeAt(pos))) pos++;
			if (pos === state.pos) return false;
			if (!silent) state.pending += state.src.slice(state.pos, pos);
			state.pos = pos;
			return true;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_inline/linkify.mjs
		const SCHEME_RE = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i;
		function linkify(state, silent) {
			if (!state.md.options.linkify) return false;
			if (state.linkLevel > 0) return false;
			const pos = state.pos;
			const max = state.posMax;
			if (pos + 3 > max) return false;
			if (state.src.charCodeAt(pos) !== 58) return false;
			if (state.src.charCodeAt(pos + 1) !== 47) return false;
			if (state.src.charCodeAt(pos + 2) !== 47) return false;
			const match = state.pending.match(SCHEME_RE);
			if (!match) return false;
			const proto = match[1];
			const link = state.md.linkify.matchAtStart(state.src.slice(pos - proto.length));
			if (!link) return false;
			let url = link.url;
			if (url.length <= proto.length) return false;
			url = url.replace(/\*+$/, "");
			const fullUrl = state.md.normalizeLink(url);
			if (!state.md.validateLink(fullUrl)) return false;
			if (!silent) {
				state.pending = state.pending.slice(0, -proto.length);
				const token_o = state.push("link_open", "a", 1);
				token_o.attrs = [["href", fullUrl]];
				token_o.markup = "linkify";
				token_o.info = "auto";
				const token_t = state.push("text", "", 0);
				token_t.content = state.md.normalizeLinkText(url);
				const token_c = state.push("link_close", "a", -1);
				token_c.markup = "linkify";
				token_c.info = "auto";
			}
			state.pos += url.length - proto.length;
			return true;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_inline/newline.mjs
		function newline(state, silent) {
			let pos = state.pos;
			if (state.src.charCodeAt(pos) !== 10) return false;
			const pmax = state.pending.length - 1;
			const max = state.posMax;
			if (!silent) if (pmax >= 0 && state.pending.charCodeAt(pmax) === 32) if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 32) {
				let ws = pmax - 1;
				while (ws >= 1 && state.pending.charCodeAt(ws - 1) === 32) ws--;
				state.pending = state.pending.slice(0, ws);
				state.push("hardbreak", "br", 0);
			} else {
				state.pending = state.pending.slice(0, -1);
				state.push("softbreak", "br", 0);
			}
			else state.push("softbreak", "br", 0);
			pos++;
			while (pos < max && isSpace(state.src.charCodeAt(pos))) pos++;
			state.pos = pos;
			return true;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_inline/escape.mjs
		const ESCAPED = [];
		for (let i = 0; i < 256; i++) ESCAPED.push(0);
		"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(ch) {
			ESCAPED[ch.charCodeAt(0)] = 1;
		});
		function escape(state, silent) {
			let pos = state.pos;
			const max = state.posMax;
			if (state.src.charCodeAt(pos) !== 92) return false;
			pos++;
			if (pos >= max) return false;
			let ch1 = state.src.charCodeAt(pos);
			if (ch1 === 10) {
				if (!silent) state.push("hardbreak", "br", 0);
				pos++;
				while (pos < max) {
					ch1 = state.src.charCodeAt(pos);
					if (!isSpace(ch1)) break;
					pos++;
				}
				state.pos = pos;
				return true;
			}
			let escapedStr = state.src[pos];
			if (ch1 >= 55296 && ch1 <= 56319 && pos + 1 < max) {
				const ch2 = state.src.charCodeAt(pos + 1);
				if (ch2 >= 56320 && ch2 <= 57343) {
					escapedStr += state.src[pos + 1];
					pos++;
				}
			}
			const origStr = "\\" + escapedStr;
			if (!silent) {
				const token = state.push("text_special", "", 0);
				if (ch1 < 256 && ESCAPED[ch1] !== 0) token.content = escapedStr;
				else token.content = origStr;
				token.markup = origStr;
				token.info = "escape";
			}
			state.pos = pos + 1;
			return true;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_inline/backticks.mjs
		function backtick(state, silent) {
			let pos = state.pos;
			if (state.src.charCodeAt(pos) !== 96) return false;
			const start = pos;
			pos++;
			const max = state.posMax;
			while (pos < max && state.src.charCodeAt(pos) === 96) pos++;
			const marker = state.src.slice(start, pos);
			const openerLength = marker.length;
			if (state.backticksScanned && (state.backticks[openerLength] || 0) <= start) {
				if (!silent) state.pending += marker;
				state.pos += openerLength;
				return true;
			}
			let matchEnd = pos;
			let matchStart;
			while ((matchStart = state.src.indexOf("`", matchEnd)) !== -1) {
				matchEnd = matchStart + 1;
				while (matchEnd < max && state.src.charCodeAt(matchEnd) === 96) matchEnd++;
				const closerLength = matchEnd - matchStart;
				if (closerLength === openerLength) {
					if (!silent) {
						const token = state.push("code_inline", "code", 0);
						token.markup = marker;
						token.content = state.src.slice(pos, matchStart).replace(/\n/g, " ").replace(/^ (.+) $/, "$1");
					}
					state.pos = matchEnd;
					return true;
				}
				state.backticks[closerLength] = matchStart;
			}
			state.backticksScanned = true;
			if (!silent) state.pending += marker;
			state.pos += openerLength;
			return true;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_inline/strikethrough.mjs
		function strikethrough_tokenize(state, silent) {
			const start = state.pos;
			const marker = state.src.charCodeAt(start);
			if (silent) return false;
			if (marker !== 126) return false;
			const scanned = state.scanDelims(state.pos, true);
			let len = scanned.length;
			const ch = String.fromCharCode(marker);
			if (len < 2) return false;
			let token;
			if (len % 2) {
				token = state.push("text", "", 0);
				token.content = ch;
				len--;
			}
			for (let i = 0; i < len; i += 2) {
				token = state.push("text", "", 0);
				token.content = ch + ch;
				state.delimiters.push({
					marker,
					length: 0,
					token: state.tokens.length - 1,
					end: -1,
					open: scanned.can_open,
					close: scanned.can_close
				});
			}
			state.pos += scanned.length;
			return true;
		}
		function postProcess$1(state, delimiters) {
			let token;
			const loneMarkers = [];
			const max = delimiters.length;
			for (let i = 0; i < max; i++) {
				const startDelim = delimiters[i];
				if (startDelim.marker !== 126) continue;
				if (startDelim.end === -1) continue;
				const endDelim = delimiters[startDelim.end];
				token = state.tokens[startDelim.token];
				token.type = "s_open";
				token.tag = "s";
				token.nesting = 1;
				token.markup = "~~";
				token.content = "";
				token = state.tokens[endDelim.token];
				token.type = "s_close";
				token.tag = "s";
				token.nesting = -1;
				token.markup = "~~";
				token.content = "";
				if (state.tokens[endDelim.token - 1].type === "text" && state.tokens[endDelim.token - 1].content === "~") loneMarkers.push(endDelim.token - 1);
			}
			while (loneMarkers.length) {
				const i = loneMarkers.pop();
				let j = i + 1;
				while (j < state.tokens.length && state.tokens[j].type === "s_close") j++;
				j--;
				if (i !== j) {
					token = state.tokens[j];
					state.tokens[j] = state.tokens[i];
					state.tokens[i] = token;
				}
			}
		}
		function strikethrough_postProcess(state) {
			const tokens_meta = state.tokens_meta;
			const max = state.tokens_meta.length;
			postProcess$1(state, state.delimiters);
			for (let curr = 0; curr < max; curr++) if (tokens_meta[curr] && tokens_meta[curr].delimiters) postProcess$1(state, tokens_meta[curr].delimiters);
		}
		var strikethrough_default = {
			tokenize: strikethrough_tokenize,
			postProcess: strikethrough_postProcess
		};
		//#endregion
		//#region node_modules/markdown-it/lib/rules_inline/emphasis.mjs
		function emphasis_tokenize(state, silent) {
			const start = state.pos;
			const marker = state.src.charCodeAt(start);
			if (silent) return false;
			if (marker !== 95 && marker !== 42) return false;
			const scanned = state.scanDelims(state.pos, marker === 42);
			for (let i = 0; i < scanned.length; i++) {
				const token = state.push("text", "", 0);
				token.content = String.fromCharCode(marker);
				state.delimiters.push({
					marker,
					length: scanned.length,
					token: state.tokens.length - 1,
					end: -1,
					open: scanned.can_open,
					close: scanned.can_close
				});
			}
			state.pos += scanned.length;
			return true;
		}
		function postProcess(state, delimiters) {
			const max = delimiters.length;
			for (let i = max - 1; i >= 0; i--) {
				const startDelim = delimiters[i];
				if (startDelim.marker !== 95 && startDelim.marker !== 42) continue;
				if (startDelim.end === -1) continue;
				const endDelim = delimiters[startDelim.end];
				const isStrong = i > 0 && delimiters[i - 1].end === startDelim.end + 1 && delimiters[i - 1].marker === startDelim.marker && delimiters[i - 1].token === startDelim.token - 1 && delimiters[startDelim.end + 1].token === endDelim.token + 1;
				const ch = String.fromCharCode(startDelim.marker);
				const token_o = state.tokens[startDelim.token];
				token_o.type = isStrong ? "strong_open" : "em_open";
				token_o.tag = isStrong ? "strong" : "em";
				token_o.nesting = 1;
				token_o.markup = isStrong ? ch + ch : ch;
				token_o.content = "";
				const token_c = state.tokens[endDelim.token];
				token_c.type = isStrong ? "strong_close" : "em_close";
				token_c.tag = isStrong ? "strong" : "em";
				token_c.nesting = -1;
				token_c.markup = isStrong ? ch + ch : ch;
				token_c.content = "";
				if (isStrong) {
					state.tokens[delimiters[i - 1].token].content = "";
					state.tokens[delimiters[startDelim.end + 1].token].content = "";
					i--;
				}
			}
		}
		function emphasis_post_process(state) {
			const tokens_meta = state.tokens_meta;
			const max = state.tokens_meta.length;
			postProcess(state, state.delimiters);
			for (let curr = 0; curr < max; curr++) if (tokens_meta[curr] && tokens_meta[curr].delimiters) postProcess(state, tokens_meta[curr].delimiters);
		}
		var emphasis_default = {
			tokenize: emphasis_tokenize,
			postProcess: emphasis_post_process
		};
		//#endregion
		//#region node_modules/markdown-it/lib/rules_inline/link.mjs
		function link(state, silent) {
			let code, label, res, ref;
			let href = "";
			let title = "";
			let start = state.pos;
			let parseReference = true;
			if (state.src.charCodeAt(state.pos) !== 91) return false;
			const oldPos = state.pos;
			const max = state.posMax;
			const labelStart = state.pos + 1;
			const labelEnd = state.md.helpers.parseLinkLabel(state, state.pos, true);
			if (labelEnd < 0) return false;
			let pos = labelEnd + 1;
			if (pos < max && state.src.charCodeAt(pos) === 40) {
				parseReference = false;
				pos++;
				for (; pos < max; pos++) {
					code = state.src.charCodeAt(pos);
					if (!isSpace(code) && code !== 10) break;
				}
				if (pos >= max) return false;
				start = pos;
				res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
				if (res.ok) {
					href = state.md.normalizeLink(res.str);
					if (state.md.validateLink(href)) pos = res.pos;
					else href = "";
					start = pos;
					for (; pos < max; pos++) {
						code = state.src.charCodeAt(pos);
						if (!isSpace(code) && code !== 10) break;
					}
					res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
					if (pos < max && start !== pos && res.ok) {
						title = res.str;
						pos = res.pos;
						for (; pos < max; pos++) {
							code = state.src.charCodeAt(pos);
							if (!isSpace(code) && code !== 10) break;
						}
					}
				}
				if (pos >= max || state.src.charCodeAt(pos) !== 41) parseReference = true;
				pos++;
			}
			if (parseReference) {
				if (typeof state.env.references === "undefined") return false;
				if (pos < max && state.src.charCodeAt(pos) === 91) {
					start = pos + 1;
					pos = state.md.helpers.parseLinkLabel(state, pos);
					if (pos >= 0) label = state.src.slice(start, pos++);
					else pos = labelEnd + 1;
				} else pos = labelEnd + 1;
				if (!label) label = state.src.slice(labelStart, labelEnd);
				ref = state.env.references[normalizeReference(label)];
				if (!ref) {
					state.pos = oldPos;
					return false;
				}
				href = ref.href;
				title = ref.title;
			}
			if (!silent) {
				state.pos = labelStart;
				state.posMax = labelEnd;
				const token_o = state.push("link_open", "a", 1);
				const attrs = [["href", href]];
				token_o.attrs = attrs;
				if (title) attrs.push(["title", title]);
				state.linkLevel++;
				state.md.inline.tokenize(state);
				state.linkLevel--;
				state.push("link_close", "a", -1);
			}
			state.pos = pos;
			state.posMax = max;
			return true;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_inline/image.mjs
		function image(state, silent) {
			let code, content, label, pos, ref, res, title, start;
			let href = "";
			const oldPos = state.pos;
			const max = state.posMax;
			if (state.src.charCodeAt(state.pos) !== 33) return false;
			if (state.src.charCodeAt(state.pos + 1) !== 91) return false;
			const labelStart = state.pos + 2;
			const labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 1, false);
			if (labelEnd < 0) return false;
			pos = labelEnd + 1;
			if (pos < max && state.src.charCodeAt(pos) === 40) {
				pos++;
				for (; pos < max; pos++) {
					code = state.src.charCodeAt(pos);
					if (!isSpace(code) && code !== 10) break;
				}
				if (pos >= max) return false;
				start = pos;
				res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
				if (res.ok) {
					href = state.md.normalizeLink(res.str);
					if (state.md.validateLink(href)) pos = res.pos;
					else href = "";
				}
				start = pos;
				for (; pos < max; pos++) {
					code = state.src.charCodeAt(pos);
					if (!isSpace(code) && code !== 10) break;
				}
				res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
				if (pos < max && start !== pos && res.ok) {
					title = res.str;
					pos = res.pos;
					for (; pos < max; pos++) {
						code = state.src.charCodeAt(pos);
						if (!isSpace(code) && code !== 10) break;
					}
				} else title = "";
				if (pos >= max || state.src.charCodeAt(pos) !== 41) {
					state.pos = oldPos;
					return false;
				}
				pos++;
			} else {
				if (typeof state.env.references === "undefined") return false;
				if (pos < max && state.src.charCodeAt(pos) === 91) {
					start = pos + 1;
					pos = state.md.helpers.parseLinkLabel(state, pos);
					if (pos >= 0) label = state.src.slice(start, pos++);
					else pos = labelEnd + 1;
				} else pos = labelEnd + 1;
				if (!label) label = state.src.slice(labelStart, labelEnd);
				ref = state.env.references[normalizeReference(label)];
				if (!ref) {
					state.pos = oldPos;
					return false;
				}
				href = ref.href;
				title = ref.title;
			}
			if (!silent) {
				content = state.src.slice(labelStart, labelEnd);
				const tokens = [];
				state.md.inline.parse(content, state.md, state.env, tokens);
				const token = state.push("image", "img", 0);
				const attrs = [["src", href], ["alt", ""]];
				token.attrs = attrs;
				token.children = tokens;
				token.content = content;
				if (title) attrs.push(["title", title]);
			}
			state.pos = pos;
			state.posMax = max;
			return true;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_inline/autolink.mjs
		const EMAIL_RE = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/;
		const AUTOLINK_RE = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
		function autolink(state, silent) {
			let pos = state.pos;
			if (state.src.charCodeAt(pos) !== 60) return false;
			const start = state.pos;
			const max = state.posMax;
			for (;;) {
				if (++pos >= max) return false;
				const ch = state.src.charCodeAt(pos);
				if (ch === 60) return false;
				if (ch === 62) break;
			}
			const url = state.src.slice(start + 1, pos);
			if (AUTOLINK_RE.test(url)) {
				const fullUrl = state.md.normalizeLink(url);
				if (!state.md.validateLink(fullUrl)) return false;
				if (!silent) {
					const token_o = state.push("link_open", "a", 1);
					token_o.attrs = [["href", fullUrl]];
					token_o.markup = "autolink";
					token_o.info = "auto";
					const token_t = state.push("text", "", 0);
					token_t.content = state.md.normalizeLinkText(url);
					const token_c = state.push("link_close", "a", -1);
					token_c.markup = "autolink";
					token_c.info = "auto";
				}
				state.pos += url.length + 2;
				return true;
			}
			if (EMAIL_RE.test(url)) {
				const fullUrl = state.md.normalizeLink("mailto:" + url);
				if (!state.md.validateLink(fullUrl)) return false;
				if (!silent) {
					const token_o = state.push("link_open", "a", 1);
					token_o.attrs = [["href", fullUrl]];
					token_o.markup = "autolink";
					token_o.info = "auto";
					const token_t = state.push("text", "", 0);
					token_t.content = state.md.normalizeLinkText(url);
					const token_c = state.push("link_close", "a", -1);
					token_c.markup = "autolink";
					token_c.info = "auto";
				}
				state.pos += url.length + 2;
				return true;
			}
			return false;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_inline/html_inline.mjs
		function isLinkOpen(str) {
			return /^<a[>\s]/i.test(str);
		}
		function isLinkClose(str) {
			return /^<\/a\s*>/i.test(str);
		}
		function isLetter(ch) {
			const lc = ch | 32;
			return lc >= 97 && lc <= 122;
		}
		function html_inline(state, silent) {
			if (!state.md.options.html) return false;
			const max = state.posMax;
			const pos = state.pos;
			if (state.src.charCodeAt(pos) !== 60 || pos + 2 >= max) return false;
			const ch = state.src.charCodeAt(pos + 1);
			if (ch !== 33 && ch !== 63 && ch !== 47 && !isLetter(ch)) return false;
			const match = state.src.slice(pos).match(HTML_TAG_RE);
			if (!match) return false;
			if (!silent) {
				const token = state.push("html_inline", "", 0);
				token.content = match[0];
				if (isLinkOpen(token.content)) state.linkLevel++;
				if (isLinkClose(token.content)) state.linkLevel--;
			}
			state.pos += match[0].length;
			return true;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_inline/entity.mjs
		const DIGITAL_RE = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i;
		const NAMED_RE = /^&([a-z][a-z0-9]{1,31});/i;
		function entity(state, silent) {
			const pos = state.pos;
			const max = state.posMax;
			if (state.src.charCodeAt(pos) !== 38) return false;
			if (pos + 1 >= max) return false;
			if (state.src.charCodeAt(pos + 1) === 35) {
				const match = state.src.slice(pos).match(DIGITAL_RE);
				if (match) {
					if (!silent) {
						const code = match[1][0].toLowerCase() === "x" ? parseInt(match[1].slice(1), 16) : parseInt(match[1], 10);
						const token = state.push("text_special", "", 0);
						token.content = isValidEntityCode(code) ? fromCodePoint(code) : fromCodePoint(65533);
						token.markup = match[0];
						token.info = "entity";
					}
					state.pos += match[0].length;
					return true;
				}
			} else {
				const match = state.src.slice(pos).match(NAMED_RE);
				if (match) {
					const decoded = decodeHTML(match[0]);
					if (decoded !== match[0]) {
						if (!silent) {
							const token = state.push("text_special", "", 0);
							token.content = decoded;
							token.markup = match[0];
							token.info = "entity";
						}
						state.pos += match[0].length;
						return true;
					}
				}
			}
			return false;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_inline/balance_pairs.mjs
		function processDelimiters(delimiters) {
			const openersBottom = {};
			const max = delimiters.length;
			if (!max) return;
			let headerIdx = 0;
			let lastTokenIdx = -2;
			const jumps = [];
			for (let closerIdx = 0; closerIdx < max; closerIdx++) {
				const closer = delimiters[closerIdx];
				jumps.push(0);
				if (delimiters[headerIdx].marker !== closer.marker || lastTokenIdx !== closer.token - 1) headerIdx = closerIdx;
				lastTokenIdx = closer.token;
				closer.length = closer.length || 0;
				if (!closer.close) continue;
				if (!openersBottom.hasOwnProperty(closer.marker)) openersBottom[closer.marker] = [
					-1,
					-1,
					-1,
					-1,
					-1,
					-1
				];
				const minOpenerIdx = openersBottom[closer.marker][(closer.open ? 3 : 0) + closer.length % 3];
				let openerIdx = headerIdx - jumps[headerIdx] - 1;
				let newMinOpenerIdx = openerIdx;
				for (; openerIdx > minOpenerIdx; openerIdx -= jumps[openerIdx] + 1) {
					const opener = delimiters[openerIdx];
					if (opener.marker !== closer.marker) continue;
					if (opener.open && opener.end < 0) {
						let isOddMatch = false;
						if (opener.close || closer.open) {
							if ((opener.length + closer.length) % 3 === 0) {
								if (opener.length % 3 !== 0 || closer.length % 3 !== 0) isOddMatch = true;
							}
						}
						if (!isOddMatch) {
							const lastJump = openerIdx > 0 && !delimiters[openerIdx - 1].open ? jumps[openerIdx - 1] + 1 : 0;
							jumps[closerIdx] = closerIdx - openerIdx + lastJump;
							jumps[openerIdx] = lastJump;
							closer.open = false;
							opener.end = closerIdx;
							opener.close = false;
							newMinOpenerIdx = -1;
							lastTokenIdx = -2;
							break;
						}
					}
				}
				if (newMinOpenerIdx !== -1) openersBottom[closer.marker][(closer.open ? 3 : 0) + (closer.length || 0) % 3] = newMinOpenerIdx;
			}
		}
		function link_pairs(state) {
			const tokens_meta = state.tokens_meta;
			const max = state.tokens_meta.length;
			processDelimiters(state.delimiters);
			for (let curr = 0; curr < max; curr++) if (tokens_meta[curr] && tokens_meta[curr].delimiters) processDelimiters(tokens_meta[curr].delimiters);
		}
		//#endregion
		//#region node_modules/markdown-it/lib/rules_inline/fragments_join.mjs
		function fragments_join(state) {
			let curr, last;
			let level = 0;
			const tokens = state.tokens;
			const max = state.tokens.length;
			for (curr = last = 0; curr < max; curr++) {
				if (tokens[curr].nesting < 0) level--;
				tokens[curr].level = level;
				if (tokens[curr].nesting > 0) level++;
				if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
				else {
					if (curr !== last) tokens[last] = tokens[curr];
					last++;
				}
			}
			if (curr !== last) tokens.length = last;
		}
		//#endregion
		//#region node_modules/markdown-it/lib/parser_inline.mjs
		/** internal
		* class ParserInline
		*
		* Tokenizes paragraph content.
		**/
		const _rules = [
			["text", text],
			["linkify", linkify],
			["newline", newline],
			["escape", escape],
			["backticks", backtick],
			["strikethrough", strikethrough_default.tokenize],
			["emphasis", emphasis_default.tokenize],
			["link", link],
			["image", image],
			["autolink", autolink],
			["html_inline", html_inline],
			["entity", entity]
		];
		const _rules2 = [
			["balance_pairs", link_pairs],
			["strikethrough", strikethrough_default.postProcess],
			["emphasis", emphasis_default.postProcess],
			["fragments_join", fragments_join]
		];
		/**
		* new ParserInline()
		**/
		function ParserInline() {
			/**
			* ParserInline#ruler -> Ruler
			*
			* [[Ruler]] instance. Keep configuration of inline rules.
			**/
			this.ruler = new Ruler();
			for (let i = 0; i < _rules.length; i++) this.ruler.push(_rules[i][0], _rules[i][1]);
			/**
			* ParserInline#ruler2 -> Ruler
			*
			* [[Ruler]] instance. Second ruler used for post-processing
			* (e.g. in emphasis-like rules).
			**/
			this.ruler2 = new Ruler();
			for (let i = 0; i < _rules2.length; i++) this.ruler2.push(_rules2[i][0], _rules2[i][1]);
		}
		ParserInline.prototype.skipToken = function(state) {
			const pos = state.pos;
			const rules = this.ruler.getRules("");
			const len = rules.length;
			const maxNesting = state.md.options.maxNesting;
			const cache = state.cache;
			if (typeof cache[pos] !== "undefined") {
				state.pos = cache[pos];
				return;
			}
			let ok = false;
			if (state.level < maxNesting) for (let i = 0; i < len; i++) {
				state.level++;
				ok = rules[i](state, true);
				state.level--;
				if (ok) {
					if (pos >= state.pos) throw new Error("inline rule didn't increment state.pos");
					break;
				}
			}
			else state.pos = state.posMax;
			if (!ok) state.pos++;
			cache[pos] = state.pos;
		};
		ParserInline.prototype.tokenize = function(state) {
			const rules = this.ruler.getRules("");
			const len = rules.length;
			const end = state.posMax;
			const maxNesting = state.md.options.maxNesting;
			while (state.pos < end) {
				const prevPos = state.pos;
				let ok = false;
				if (state.level < maxNesting) for (let i = 0; i < len; i++) {
					ok = rules[i](state, false);
					if (ok) {
						if (prevPos >= state.pos) throw new Error("inline rule didn't increment state.pos");
						break;
					}
				}
				if (ok) {
					if (state.pos >= end) break;
					continue;
				}
				state.pending += state.src[state.pos++];
			}
			if (state.pending) state.pushPending();
		};
		/**
		* ParserInline.parse(str, md, env, outTokens)
		*
		* Process input string and push inline tokens into `outTokens`
		**/
		ParserInline.prototype.parse = function(str, md, env, outTokens) {
			const state = new this.State(str, md, env, outTokens);
			this.tokenize(state);
			const rules = this.ruler2.getRules("");
			const len = rules.length;
			for (let i = 0; i < len; i++) rules[i](state);
		};
		ParserInline.prototype.State = StateInline;
		//#endregion
		//#region node_modules/linkify-it/lib/re.mjs
		function re_default(opts) {
			const re = {};
			opts = opts || {};
			re.src_Any = regex_default$5.source;
			re.src_Cc = regex_default$4.source;
			re.src_Z = regex_default.source;
			re.src_P = regex_default$2.source;
			re.src_ZPCc = [
				re.src_Z,
				re.src_P,
				re.src_Cc
			].join("|");
			re.src_ZCc = [re.src_Z, re.src_Cc].join("|");
			const text_separators = "[><｜]";
			re.src_pseudo_letter = `(?:(?!${text_separators}|${re.src_ZPCc})${re.src_Any})`;
			re.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
			re.src_auth = `(?:(?:(?!${re.src_ZCc}|[@/\\[\\]()]).){1,50}@)?`;
			re.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?";
			re.src_host_terminator = `(?=$|${text_separators}|${re.src_ZPCc})(?!${opts["---"] ? "-(?!--)|" : "-|"}_|:\\d|\\.-|\\.(?!$|${re.src_ZPCc}))`;
			re.src_path = `(?:[/?#](?:(?!${re.src_ZCc}|${text_separators}|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!${re.src_ZCc}|\\]).)*\\]|\\((?:(?!${re.src_ZCc}|[)]).)*\\)|\\{(?:(?!${re.src_ZCc}|[}]).)*\\}|\\"(?:(?!${re.src_ZCc}|["]).)+\\"|\\'(?:(?!${re.src_ZCc}|[']).)+\\'|\\'(?=${re.src_pseudo_letter}|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!${re.src_ZCc}|[.]|$)|` + (opts["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + `,(?!${re.src_ZCc}|$)|;(?!${re.src_ZCc}|$)|\\!+(?!${re.src_ZCc}|[!]|$)|\\?(?!${re.src_ZCc}|[?]|$))+|\\/)?`;
			re.src_email_name = "[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\\"\\.a-zA-Z0-9_]{0,63}";
			re.src_xn = "xn--[a-z0-9\\-]{1,59}";
			re.src_domain_root = "(?:" + re.src_xn + `|${re.src_pseudo_letter}{1,63})`;
			re.src_domain = "(?:" + re.src_xn + `|(?:${re.src_pseudo_letter})|(?:${re.src_pseudo_letter}(?:-|${re.src_pseudo_letter}){0,61}${re.src_pseudo_letter}))`;
			re.src_host = `(?:(?:(?:(?:${re.src_domain})\\.)*${re.src_domain}))`;
			re.tpl_host_fuzzy = "(?:" + re.src_ip4 + `|(?:(?:(?:${re.src_domain})\\.)+(?:%TLDS%)))`;
			re.tpl_host_no_ip_fuzzy = `(?:(?:(?:${re.src_domain})\\.)+(?:%TLDS%))`;
			re.src_host_strict = re.src_host + re.src_host_terminator;
			re.tpl_host_fuzzy_strict = re.tpl_host_fuzzy + re.src_host_terminator;
			re.src_host_port_strict = re.src_host + re.src_port + re.src_host_terminator;
			re.tpl_host_port_fuzzy_strict = re.tpl_host_fuzzy + re.src_port + re.src_host_terminator;
			re.tpl_host_port_no_ip_fuzzy_strict = re.tpl_host_no_ip_fuzzy + re.src_port + re.src_host_terminator;
			re.tpl_host_fuzzy_test = `localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:${re.src_ZPCc}|>|$))`;
			re.tpl_email_fuzzy = `(^|${text_separators}|"|\\(|${re.src_ZCc})(${re.src_email_name}@${re.tpl_host_fuzzy_strict})`;
			re.tpl_link_fuzzy = `(^|(?![.:/\\-_@])(?:[$+<=>^\`|\uff5c]|${re.src_ZPCc}))((?![$+<=>^\`|\uff5c])${re.tpl_host_port_fuzzy_strict}${re.src_path})`;
			re.tpl_link_no_ip_fuzzy = `(^|(?![.:/\\-_@])(?:[$+<=>^\`|\uff5c]|${re.src_ZPCc}))((?![$+<=>^\`|\uff5c])${re.tpl_host_port_no_ip_fuzzy_strict}${re.src_path})`;
			return re;
		}
		//#endregion
		//#region node_modules/linkify-it/index.mjs
		function assign(obj) {
			Array.prototype.slice.call(arguments, 1).forEach(function(source) {
				if (!source) return;
				Object.keys(source).forEach(function(key) {
					obj[key] = source[key];
				});
			});
			return obj;
		}
		function _class(obj) {
			return Object.prototype.toString.call(obj);
		}
		function isString(obj) {
			return _class(obj) === "[object String]";
		}
		function isObject(obj) {
			return _class(obj) === "[object Object]";
		}
		function isRegExp(obj) {
			return _class(obj) === "[object RegExp]";
		}
		function isFunction(obj) {
			return _class(obj) === "[object Function]";
		}
		function escapeRE(str) {
			return str.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
		}
		const defaultOptions = {
			fuzzyLink: true,
			fuzzyEmail: true,
			fuzzyIP: false
		};
		function isOptionsObj(obj) {
			return Object.keys(obj || {}).reduce(function(acc, k) {
				return acc || defaultOptions.hasOwnProperty(k);
			}, false);
		}
		const defaultSchemas = {
			"http:": { validate: function(text, pos, self) {
				const tail = text.slice(pos);
				if (!self.re.http) self.re.http = new RegExp(`^\\/\\/${self.re.src_auth}${self.re.src_host_port_strict}${self.re.src_path}`, "i");
				if (self.re.http.test(tail)) return tail.match(self.re.http)[0].length;
				return 0;
			} },
			"https:": "http:",
			"ftp:": "http:",
			"//": { validate: function(text, pos, self) {
				const tail = text.slice(pos);
				if (!self.re.no_http) self.re.no_http = new RegExp("^" + self.re.src_auth + `(?:localhost|(?:(?:${self.re.src_domain})\\.)+${self.re.src_domain_root})` + self.re.src_port + self.re.src_host_terminator + self.re.src_path, "i");
				if (self.re.no_http.test(tail)) {
					if (pos >= 3 && text[pos - 3] === ":") return 0;
					if (pos >= 3 && text[pos - 3] === "/") return 0;
					return tail.match(self.re.no_http)[0].length;
				}
				return 0;
			} },
			"mailto:": { validate: function(text, pos, self) {
				const tail = text.slice(pos);
				if (!self.re.mailto) self.re.mailto = new RegExp(`^${self.re.src_email_name}@${self.re.src_host_strict}`, "i");
				if (self.re.mailto.test(tail)) return tail.match(self.re.mailto)[0].length;
				return 0;
			} }
		};
		const tlds_2ch_src_re = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]";
		const tlds_default = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split("|");
		function createValidator(re) {
			return function(text, pos) {
				const tail = text.slice(pos);
				if (re.test(tail)) return tail.match(re)[0].length;
				return 0;
			};
		}
		function createNormalizer() {
			return function(match, self) {
				self.normalize(match);
			};
		}
		function compile(self) {
			const re = self.re = re_default(self.__opts__);
			const tlds = self.__tlds__.slice();
			self.onCompile();
			if (!self.__tlds_replaced__) tlds.push(tlds_2ch_src_re);
			tlds.push(re.src_xn);
			re.src_tlds = tlds.join("|");
			function untpl(tpl) {
				return tpl.replace("%TLDS%", re.src_tlds);
			}
			re.email_fuzzy = RegExp(untpl(re.tpl_email_fuzzy), "i");
			re.email_fuzzy_global = RegExp(untpl(re.tpl_email_fuzzy), "ig");
			re.link_fuzzy = RegExp(untpl(re.tpl_link_fuzzy), "i");
			re.link_fuzzy_global = RegExp(untpl(re.tpl_link_fuzzy), "ig");
			re.link_no_ip_fuzzy = RegExp(untpl(re.tpl_link_no_ip_fuzzy), "i");
			re.link_no_ip_fuzzy_global = RegExp(untpl(re.tpl_link_no_ip_fuzzy), "ig");
			re.host_fuzzy_test = RegExp(untpl(re.tpl_host_fuzzy_test), "i");
			const aliases = [];
			self.__compiled__ = {};
			function schemaError(name, val) {
				throw new Error(`(LinkifyIt) Invalid schema "${name}": ${val}`);
			}
			Object.keys(self.__schemas__).forEach(function(name) {
				const val = self.__schemas__[name];
				if (val === null) return;
				const compiled = {
					validate: null,
					link: null
				};
				self.__compiled__[name] = compiled;
				if (isObject(val)) {
					if (isRegExp(val.validate)) compiled.validate = createValidator(val.validate);
					else if (isFunction(val.validate)) compiled.validate = val.validate;
					else schemaError(name, val);
					if (isFunction(val.normalize)) compiled.normalize = val.normalize;
					else if (!val.normalize) compiled.normalize = createNormalizer();
					else schemaError(name, val);
					return;
				}
				if (isString(val)) {
					aliases.push(name);
					return;
				}
				schemaError(name, val);
			});
			aliases.forEach(function(alias) {
				if (!self.__compiled__[self.__schemas__[alias]]) return;
				self.__compiled__[alias].validate = self.__compiled__[self.__schemas__[alias]].validate;
				self.__compiled__[alias].normalize = self.__compiled__[self.__schemas__[alias]].normalize;
			});
			self.__compiled__[""] = {
				validate: null,
				normalize: createNormalizer()
			};
			const slist = Object.keys(self.__compiled__).filter(function(name) {
				return name.length > 0 && self.__compiled__[name];
			}).map(escapeRE).join("|");
			self.re.schema_test = RegExp(`(^|(?!_)(?:[><\uff5c]|${re.src_ZPCc}))(${slist})`, "i");
			self.re.schema_search = RegExp(`(^|(?!_)(?:[><\uff5c]|${re.src_ZPCc}))(${slist})`, "ig");
			self.re.schema_at_start = RegExp(`^${self.re.schema_search.source}`, "i");
			self.re.pretest = RegExp(`(${self.re.schema_test.source})|(${self.re.host_fuzzy_test.source})|@`, "i");
		}
		/**
		* class Match
		*
		* Match result. Single element of array, returned by [[LinkifyIt#match]]
		**/
		function Match(text, schema, index, lastIndex) {
			const raw = text.slice(index, lastIndex);
			/**
			* Match#schema -> String
			*
			* Prefix (protocol) for matched string.
			**/
			this.schema = schema.toLowerCase();
			/**
			* Match#index -> Number
			*
			* First position of matched string.
			**/
			this.index = index;
			/**
			* Match#lastIndex -> Number
			*
			* Next position after matched string.
			**/
			this.lastIndex = lastIndex;
			/**
			* Match#raw -> String
			*
			* Matched string.
			**/
			this.raw = raw;
			/**
			* Match#text -> String
			*
			* Notmalized text of matched string.
			**/
			this.text = raw;
			/**
			* Match#url -> String
			*
			* Normalized url of matched string.
			**/
			this.url = raw;
		}
		/**
		* class LinkifyIt
		**/
		/**
		* new LinkifyIt(schemas, options)
		* - schemas (Object): Optional. Additional schemas to validate (prefix/validator)
		* - options (Object): { fuzzyLink|fuzzyEmail|fuzzyIP: true|false }
		*
		* Creates new linkifier instance with optional additional schemas.
		* Can be called without `new` keyword for convenience.
		*
		* By default understands:
		*
		* - `http(s)://...` , `ftp://...`, `mailto:...` & `//...` links
		* - "fuzzy" links and emails (example.com, foo@bar.com).
		*
		* `schemas` is an object, where each key/value describes protocol/rule:
		*
		* - __key__ - link prefix (usually, protocol name with `:` at the end, `skype:`
		*   for example). `linkify-it` makes shure that prefix is not preceeded with
		*   alphanumeric char and symbols. Only whitespaces and punctuation allowed.
		* - __value__ - rule to check tail after link prefix
		*   - _String_ - just alias to existing rule
		*   - _Object_
		*     - _validate_ - validator function (should return matched length on success),
		*       or `RegExp`.
		*     - _normalize_ - optional function to normalize text & url of matched result
		*       (for example, for @twitter mentions).
		*
		* `options`:
		*
		* - __fuzzyLink__ - recognige URL-s without `http(s):` prefix. Default `true`.
		* - __fuzzyIP__ - allow IPs in fuzzy links above. Can conflict with some texts
		*   like version numbers. Default `false`.
		* - __fuzzyEmail__ - recognize emails without `mailto:` prefix.
		*
		**/
		function LinkifyIt(schemas, options) {
			if (!(this instanceof LinkifyIt)) return new LinkifyIt(schemas, options);
			if (!options) {
				if (isOptionsObj(schemas)) {
					options = schemas;
					schemas = {};
				}
			}
			this.__opts__ = assign({}, defaultOptions, options);
			this.__schemas__ = assign({}, defaultSchemas, schemas);
			this.__compiled__ = {};
			this.__tlds__ = tlds_default;
			this.__tlds_replaced__ = false;
			this.re = {};
			compile(this);
		}
		/** chainable
		* LinkifyIt#add(schema, definition)
		* - schema (String): rule name (fixed pattern prefix)
		* - definition (String|RegExp|Object): schema definition
		*
		* Add new rule definition. See constructor description for details.
		**/
		LinkifyIt.prototype.add = function add(schema, definition) {
			this.__schemas__[schema] = definition;
			compile(this);
			return this;
		};
		/** chainable
		* LinkifyIt#set(options)
		* - options (Object): { fuzzyLink|fuzzyEmail|fuzzyIP: true|false }
		*
		* Set recognition options for links without schema.
		**/
		LinkifyIt.prototype.set = function set(options) {
			this.__opts__ = assign(this.__opts__, options);
			return this;
		};
		/**
		* LinkifyIt#test(text) -> Boolean
		*
		* Searches linkifiable pattern and returns `true` on success or `false` on fail.
		**/
		LinkifyIt.prototype.test = function test(text) {
			if (!text.length) return false;
			let m, re;
			if (this.re.schema_test.test(text)) {
				re = this.re.schema_search;
				re.lastIndex = 0;
				while ((m = re.exec(text)) !== null) if (this.testSchemaAt(text, m[2], re.lastIndex)) return true;
			}
			if (this.__opts__.fuzzyLink && this.__compiled__["http:"]) {
				if (text.search(this.re.host_fuzzy_test) >= 0) {
					if (text.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy) !== null) return true;
				}
			}
			if (this.__opts__.fuzzyEmail && this.__compiled__["mailto:"]) {
				if (text.indexOf("@") >= 0) {
					if (text.match(this.re.email_fuzzy) !== null) return true;
				}
			}
			return false;
		};
		/**
		* LinkifyIt#pretest(text) -> Boolean
		*
		* Very quick check, that can give false positives. Returns true if link MAY BE
		* can exists. Can be used for speed optimization, when you need to check that
		* link NOT exists.
		**/
		LinkifyIt.prototype.pretest = function pretest(text) {
			return this.re.pretest.test(text);
		};
		/**
		* LinkifyIt#testSchemaAt(text, name, position) -> Number
		* - text (String): text to scan
		* - name (String): rule (schema) name
		* - position (Number): text offset to check from
		*
		* Similar to [[LinkifyIt#test]] but checks only specific protocol tail exactly
		* at given position. Returns length of found pattern (0 on fail).
		**/
		LinkifyIt.prototype.testSchemaAt = function testSchemaAt(text, schema, pos) {
			if (!this.__compiled__[schema.toLowerCase()]) return 0;
			return this.__compiled__[schema.toLowerCase()].validate(text, pos, this);
		};
		/**
		* LinkifyIt#match(text) -> Array|null
		*
		* Returns array of found link descriptions or `null` on fail. We strongly
		* recommend to use [[LinkifyIt#test]] first, for best speed.
		*
		* ##### Result match description
		*
		* - __schema__ - link schema, can be empty for fuzzy links, or `//` for
		*   protocol-neutral  links.
		* - __index__ - offset of matched text
		* - __lastIndex__ - index of next char after mathch end
		* - __raw__ - matched text
		* - __text__ - normalized text
		* - __url__ - link, generated from matched text
		**/
		LinkifyIt.prototype.match = function match(text) {
			const result = [];
			const type_schemed = [];
			const type_fuzzy_link = [];
			const type_fuzzy_email = [];
			let m, len, re;
			function choose(a, b) {
				if (!a) return b;
				if (!b) return a;
				if (a.index !== b.index) return a.index < b.index ? a : b;
				return a.lastIndex >= b.lastIndex ? a : b;
			}
			if (!text.length) return null;
			if (this.re.schema_test.test(text)) {
				re = this.re.schema_search;
				re.lastIndex = 0;
				while ((m = re.exec(text)) !== null) {
					len = this.testSchemaAt(text, m[2], re.lastIndex);
					if (len) type_schemed.push({
						schema: m[2],
						index: m.index + m[1].length,
						lastIndex: m.index + m[0].length + len
					});
				}
			}
			if (this.__opts__.fuzzyLink && this.__compiled__["http:"]) {
				re = this.__opts__.fuzzyIP ? this.re.link_fuzzy_global : this.re.link_no_ip_fuzzy_global;
				re.lastIndex = 0;
				while ((m = re.exec(text)) !== null) type_fuzzy_link.push({
					schema: "",
					index: m.index + m[1].length,
					lastIndex: m.index + m[0].length
				});
			}
			if (this.__opts__.fuzzyEmail && this.__compiled__["mailto:"]) {
				re = this.re.email_fuzzy_global;
				re.lastIndex = 0;
				while ((m = re.exec(text)) !== null) type_fuzzy_email.push({
					schema: "mailto:",
					index: m.index + m[1].length,
					lastIndex: m.index + m[0].length
				});
			}
			const indexes = [
				0,
				0,
				0
			];
			let lastIndex = 0;
			for (;;) {
				const candidates = [
					type_schemed[indexes[0]],
					type_fuzzy_email[indexes[1]],
					type_fuzzy_link[indexes[2]]
				];
				const candidate = choose(choose(candidates[0], candidates[1]), candidates[2]);
				if (!candidate) break;
				if (candidate === candidates[0]) indexes[0]++;
				else if (candidate === candidates[1]) indexes[1]++;
				else indexes[2]++;
				if (candidate.index < lastIndex) continue;
				const match = new Match(text, candidate.schema, candidate.index, candidate.lastIndex);
				this.__compiled__[match.schema].normalize(match, this);
				result.push(match);
				lastIndex = candidate.lastIndex;
			}
			if (result.length) return result;
			return null;
		};
		/**
		* LinkifyIt#matchAtStart(text) -> Match|null
		*
		* Returns fully-formed (not fuzzy) link if it starts at the beginning
		* of the string, and null otherwise.
		**/
		LinkifyIt.prototype.matchAtStart = function matchAtStart(text) {
			if (!text.length) return null;
			const m = this.re.schema_at_start.exec(text);
			if (!m) return null;
			const len = this.testSchemaAt(text, m[2], m[0].length);
			if (!len) return null;
			const match = new Match(text, m[2], m.index + m[1].length, m.index + m[0].length + len);
			this.__compiled__[match.schema].normalize(match, this);
			return match;
		};
		/** chainable
		* LinkifyIt#tlds(list [, keepOld]) -> this
		* - list (Array): list of tlds
		* - keepOld (Boolean): merge with current list if `true` (`false` by default)
		*
		* Load (or merge) new tlds list. Those are user for fuzzy links (without prefix)
		* to avoid false positives. By default this algorythm used:
		*
		* - hostname with any 2-letter root zones are ok.
		* - biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф
		*   are ok.
		* - encoded (`xn--...`) root zones are ok.
		*
		* If list is replaced, then exact match for 2-chars root zones will be checked.
		**/
		LinkifyIt.prototype.tlds = function tlds(list, keepOld) {
			list = Array.isArray(list) ? list : [list];
			if (!keepOld) {
				this.__tlds__ = list.slice();
				this.__tlds_replaced__ = true;
				compile(this);
				return this;
			}
			this.__tlds__ = this.__tlds__.concat(list).sort().filter(function(el, idx, arr) {
				return el !== arr[idx - 1];
			}).reverse();
			compile(this);
			return this;
		};
		/**
		* LinkifyIt#normalize(match)
		*
		* Default normalizer (if schema does not define it's own).
		**/
		LinkifyIt.prototype.normalize = function normalize(match) {
			if (!match.schema) match.url = `http://${match.url}`;
			if (match.schema === "mailto:" && !/^mailto:/i.test(match.url)) match.url = `mailto:${match.url}`;
		};
		/**
		* LinkifyIt#onCompile()
		*
		* Override to modify basic RegExp-s.
		**/
		LinkifyIt.prototype.onCompile = function onCompile() {};
		//#endregion
		//#region node_modules/markdown-it/lib/presets/default.mjs
		var import_punycode = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
			/** Highest positive signed 32-bit float value */
			const maxInt = 2147483647;
			/** Bootstring parameters */
			const base = 36;
			const tMin = 1;
			const tMax = 26;
			const skew = 38;
			const damp = 700;
			const initialBias = 72;
			const initialN = 128;
			const delimiter = "-";
			/** Regular expressions */
			const regexPunycode = /^xn--/;
			const regexNonASCII = /[^\0-\x7F]/;
			const regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;
			/** Error messages */
			const errors = {
				"overflow": "Overflow: input needs wider integers to process",
				"not-basic": "Illegal input >= 0x80 (not a basic code point)",
				"invalid-input": "Invalid input"
			};
			/** Convenience shortcuts */
			const baseMinusTMin = base - tMin;
			const floor = Math.floor;
			const stringFromCharCode = String.fromCharCode;
			/**
			* A generic error utility function.
			* @private
			* @param {String} type The error type.
			* @returns {Error} Throws a `RangeError` with the applicable error message.
			*/
			function error(type) {
				throw new RangeError(errors[type]);
			}
			/**
			* A generic `Array#map` utility function.
			* @private
			* @param {Array} array The array to iterate over.
			* @param {Function} callback The function that gets called for every array
			* item.
			* @returns {Array} A new array of values returned by the callback function.
			*/
			function map(array, callback) {
				const result = [];
				let length = array.length;
				while (length--) result[length] = callback(array[length]);
				return result;
			}
			/**
			* A simple `Array#map`-like wrapper to work with domain name strings or email
			* addresses.
			* @private
			* @param {String} domain The domain name or email address.
			* @param {Function} callback The function that gets called for every
			* character.
			* @returns {String} A new string of characters returned by the callback
			* function.
			*/
			function mapDomain(domain, callback) {
				const parts = domain.split("@");
				let result = "";
				if (parts.length > 1) {
					result = parts[0] + "@";
					domain = parts[1];
				}
				domain = domain.replace(regexSeparators, ".");
				const encoded = map(domain.split("."), callback).join(".");
				return result + encoded;
			}
			/**
			* Creates an array containing the numeric code points of each Unicode
			* character in the string. While JavaScript uses UCS-2 internally,
			* this function will convert a pair of surrogate halves (each of which
			* UCS-2 exposes as separate characters) into a single code point,
			* matching UTF-16.
			* @see `punycode.ucs2.encode`
			* @see <https://mathiasbynens.be/notes/javascript-encoding>
			* @memberOf punycode.ucs2
			* @name decode
			* @param {String} string The Unicode input string (UCS-2).
			* @returns {Array} The new array of code points.
			*/
			function ucs2decode(string) {
				const output = [];
				let counter = 0;
				const length = string.length;
				while (counter < length) {
					const value = string.charCodeAt(counter++);
					if (value >= 55296 && value <= 56319 && counter < length) {
						const extra = string.charCodeAt(counter++);
						if ((extra & 64512) == 56320) output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
						else {
							output.push(value);
							counter--;
						}
					} else output.push(value);
				}
				return output;
			}
			/**
			* Creates a string based on an array of numeric code points.
			* @see `punycode.ucs2.decode`
			* @memberOf punycode.ucs2
			* @name encode
			* @param {Array} codePoints The array of numeric code points.
			* @returns {String} The new Unicode string (UCS-2).
			*/
			const ucs2encode = (codePoints) => String.fromCodePoint(...codePoints);
			/**
			* Converts a basic code point into a digit/integer.
			* @see `digitToBasic()`
			* @private
			* @param {Number} codePoint The basic numeric code point value.
			* @returns {Number} The numeric value of a basic code point (for use in
			* representing integers) in the range `0` to `base - 1`, or `base` if
			* the code point does not represent a value.
			*/
			const basicToDigit = function(codePoint) {
				if (codePoint >= 48 && codePoint < 58) return 26 + (codePoint - 48);
				if (codePoint >= 65 && codePoint < 91) return codePoint - 65;
				if (codePoint >= 97 && codePoint < 123) return codePoint - 97;
				return base;
			};
			/**
			* Converts a digit/integer into a basic code point.
			* @see `basicToDigit()`
			* @private
			* @param {Number} digit The numeric value of a basic code point.
			* @returns {Number} The basic code point whose value (when used for
			* representing integers) is `digit`, which needs to be in the range
			* `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
			* used; else, the lowercase form is used. The behavior is undefined
			* if `flag` is non-zero and `digit` has no uppercase form.
			*/
			const digitToBasic = function(digit, flag) {
				return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
			};
			/**
			* Bias adaptation function as per section 3.4 of RFC 3492.
			* https://tools.ietf.org/html/rfc3492#section-3.4
			* @private
			*/
			const adapt = function(delta, numPoints, firstTime) {
				let k = 0;
				delta = firstTime ? floor(delta / damp) : delta >> 1;
				delta += floor(delta / numPoints);
				for (; delta > 455; k += base) delta = floor(delta / baseMinusTMin);
				return floor(k + 36 * delta / (delta + skew));
			};
			/**
			* Converts a Punycode string of ASCII-only symbols to a string of Unicode
			* symbols.
			* @memberOf punycode
			* @param {String} input The Punycode string of ASCII-only symbols.
			* @returns {String} The resulting string of Unicode symbols.
			*/
			const decode = function(input) {
				const output = [];
				const inputLength = input.length;
				let i = 0;
				let n = initialN;
				let bias = initialBias;
				let basic = input.lastIndexOf(delimiter);
				if (basic < 0) basic = 0;
				for (let j = 0; j < basic; ++j) {
					if (input.charCodeAt(j) >= 128) error("not-basic");
					output.push(input.charCodeAt(j));
				}
				for (let index = basic > 0 ? basic + 1 : 0; index < inputLength;) {
					const oldi = i;
					for (let w = 1, k = base;; k += base) {
						if (index >= inputLength) error("invalid-input");
						const digit = basicToDigit(input.charCodeAt(index++));
						if (digit >= base) error("invalid-input");
						if (digit > floor((maxInt - i) / w)) error("overflow");
						i += digit * w;
						const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
						if (digit < t) break;
						const baseMinusT = base - t;
						if (w > floor(maxInt / baseMinusT)) error("overflow");
						w *= baseMinusT;
					}
					const out = output.length + 1;
					bias = adapt(i - oldi, out, oldi == 0);
					if (floor(i / out) > maxInt - n) error("overflow");
					n += floor(i / out);
					i %= out;
					output.splice(i++, 0, n);
				}
				return String.fromCodePoint(...output);
			};
			/**
			* Converts a string of Unicode symbols (e.g. a domain name label) to a
			* Punycode string of ASCII-only symbols.
			* @memberOf punycode
			* @param {String} input The string of Unicode symbols.
			* @returns {String} The resulting Punycode string of ASCII-only symbols.
			*/
			const encode = function(input) {
				const output = [];
				input = ucs2decode(input);
				const inputLength = input.length;
				let n = initialN;
				let delta = 0;
				let bias = initialBias;
				for (const currentValue of input) if (currentValue < 128) output.push(stringFromCharCode(currentValue));
				const basicLength = output.length;
				let handledCPCount = basicLength;
				if (basicLength) output.push(delimiter);
				while (handledCPCount < inputLength) {
					let m = maxInt;
					for (const currentValue of input) if (currentValue >= n && currentValue < m) m = currentValue;
					const handledCPCountPlusOne = handledCPCount + 1;
					if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) error("overflow");
					delta += (m - n) * handledCPCountPlusOne;
					n = m;
					for (const currentValue of input) {
						if (currentValue < n && ++delta > maxInt) error("overflow");
						if (currentValue === n) {
							let q = delta;
							for (let k = base;; k += base) {
								const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
								if (q < t) break;
								const qMinusT = q - t;
								const baseMinusT = base - t;
								output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
								q = floor(qMinusT / baseMinusT);
							}
							output.push(stringFromCharCode(digitToBasic(q, 0)));
							bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
							delta = 0;
							++handledCPCount;
						}
					}
					++delta;
					++n;
				}
				return output.join("");
			};
			/**
			* Converts a Punycode string representing a domain name or an email address
			* to Unicode. Only the Punycoded parts of the input will be converted, i.e.
			* it doesn't matter if you call it on a string that has already been
			* converted to Unicode.
			* @memberOf punycode
			* @param {String} input The Punycoded domain name or email address to
			* convert to Unicode.
			* @returns {String} The Unicode representation of the given Punycode
			* string.
			*/
			const toUnicode = function(input) {
				return mapDomain(input, function(string) {
					return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
				});
			};
			/**
			* Converts a Unicode string representing a domain name or an email address to
			* Punycode. Only the non-ASCII parts of the domain name will be converted,
			* i.e. it doesn't matter if you call it with a domain that's already in
			* ASCII.
			* @memberOf punycode
			* @param {String} input The domain name or email address to convert, as a
			* Unicode string.
			* @returns {String} The Punycode representation of the given domain name or
			* email address.
			*/
			const toASCII = function(input) {
				return mapDomain(input, function(string) {
					return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
				});
			};
			module.exports = {
				/**
				* A string representing the current Punycode.js version number.
				* @memberOf punycode
				* @type String
				*/
				"version": "2.3.1",
				/**
				* An object of methods to convert from JavaScript's internal character
				* representation (UCS-2) to Unicode code points, and back.
				* @see <https://mathiasbynens.be/notes/javascript-encoding>
				* @memberOf punycode
				* @type Object
				*/
				"ucs2": {
					"decode": ucs2decode,
					"encode": ucs2encode
				},
				"decode": decode,
				"encode": encode,
				"toASCII": toASCII,
				"toUnicode": toUnicode
			};
		})))(), 1);
		//#endregion
		//#region node_modules/markdown-it/lib/index.mjs
		const config = {
			default: {
				options: {
					html: false,
					xhtmlOut: false,
					breaks: false,
					langPrefix: "language-",
					linkify: false,
					typographer: false,
					quotes: "“”‘’",
					highlight: null,
					maxNesting: 100
				},
				components: {
					core: {},
					block: {},
					inline: {}
				}
			},
			zero: {
				options: {
					html: false,
					xhtmlOut: false,
					breaks: false,
					langPrefix: "language-",
					linkify: false,
					typographer: false,
					quotes: "“”‘’",
					highlight: null,
					maxNesting: 20
				},
				components: {
					core: { rules: [
						"normalize",
						"block",
						"inline",
						"text_join"
					] },
					block: { rules: ["paragraph"] },
					inline: {
						rules: ["text"],
						rules2: ["balance_pairs", "fragments_join"]
					}
				}
			},
			commonmark: {
				options: {
					html: true,
					xhtmlOut: true,
					breaks: false,
					langPrefix: "language-",
					linkify: false,
					typographer: false,
					quotes: "“”‘’",
					highlight: null,
					maxNesting: 20
				},
				components: {
					core: { rules: [
						"normalize",
						"block",
						"inline",
						"text_join"
					] },
					block: { rules: [
						"blockquote",
						"code",
						"fence",
						"heading",
						"hr",
						"html_block",
						"lheading",
						"list",
						"reference",
						"paragraph"
					] },
					inline: {
						rules: [
							"autolink",
							"backticks",
							"emphasis",
							"entity",
							"escape",
							"html_inline",
							"image",
							"link",
							"newline",
							"text"
						],
						rules2: [
							"balance_pairs",
							"emphasis",
							"fragments_join"
						]
					}
				}
			}
		};
		const BAD_PROTO_RE = /^(vbscript|javascript|file|data):/;
		const GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;
		function validateLink(url) {
			const str = url.trim().toLowerCase();
			return BAD_PROTO_RE.test(str) ? GOOD_DATA_RE.test(str) : true;
		}
		const RECODE_HOSTNAME_FOR = [
			"http:",
			"https:",
			"mailto:"
		];
		function normalizeLink(url) {
			const parsed = urlParse(url, true);
			if (parsed.hostname) {
				if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) try {
					parsed.hostname = import_punycode.default.toASCII(parsed.hostname);
				} catch (er) {}
			}
			return encode(format(parsed));
		}
		function normalizeLinkText(url) {
			const parsed = urlParse(url, true);
			if (parsed.hostname) {
				if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) try {
					parsed.hostname = import_punycode.default.toUnicode(parsed.hostname);
				} catch (er) {}
			}
			return decode(format(parsed), decode.defaultChars + "%");
		}
		/**
		* class MarkdownIt
		*
		* Main parser/renderer class.
		*
		* ##### Usage
		*
		* ```javascript
		* // node.js, "classic" way:
		* var MarkdownIt = require('markdown-it'),
		*     md = new MarkdownIt();
		* var result = md.render('# markdown-it rulezz!');
		*
		* // node.js, the same, but with sugar:
		* var md = require('markdown-it')();
		* var result = md.render('# markdown-it rulezz!');
		*
		* // browser without AMD, added to "window" on script load
		* // Note, there are no dash.
		* var md = window.markdownit();
		* var result = md.render('# markdown-it rulezz!');
		* ```
		*
		* Single line rendering, without paragraph wrap:
		*
		* ```javascript
		* var md = require('markdown-it')();
		* var result = md.renderInline('__markdown-it__ rulezz!');
		* ```
		**/
		/**
		* new MarkdownIt([presetName, options])
		* - presetName (String): optional, `commonmark` / `zero`
		* - options (Object)
		*
		* Creates parser instanse with given config. Can be called without `new`.
		*
		* ##### presetName
		*
		* MarkdownIt provides named presets as a convenience to quickly
		* enable/disable active syntax rules and options for common use cases.
		*
		* - ["commonmark"](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/commonmark.mjs) -
		*   configures parser to strict [CommonMark](http://commonmark.org/) mode.
		* - [default](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/default.mjs) -
		*   similar to GFM, used when no preset name given. Enables all available rules,
		*   but still without html, typographer & autolinker.
		* - ["zero"](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/zero.mjs) -
		*   all rules disabled. Useful to quickly setup your config via `.enable()`.
		*   For example, when you need only `bold` and `italic` markup and nothing else.
		*
		* ##### options:
		*
		* - __html__ - `false`. Set `true` to enable HTML tags in source. Be careful!
		*   That's not safe! You may need external sanitizer to protect output from XSS.
		*   It's better to extend features via plugins, instead of enabling HTML.
		* - __xhtmlOut__ - `false`. Set `true` to add '/' when closing single tags
		*   (`<br />`). This is needed only for full CommonMark compatibility. In real
		*   world you will need HTML output.
		* - __breaks__ - `false`. Set `true` to convert `\n` in paragraphs into `<br>`.
		* - __langPrefix__ - `language-`. CSS language class prefix for fenced blocks.
		*   Can be useful for external highlighters.
		* - __linkify__ - `false`. Set `true` to autoconvert URL-like text to links.
		* - __typographer__  - `false`. Set `true` to enable [some language-neutral
		*   replacement](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.mjs) +
		*   quotes beautification (smartquotes).
		* - __quotes__ - `“”‘’`, String or Array. Double + single quotes replacement
		*   pairs, when typographer enabled and smartquotes on. For example, you can
		*   use `'«»„“'` for Russian, `'„“‚‘'` for German, and
		*   `['«\xA0', '\xA0»', '‹\xA0', '\xA0›']` for French (including nbsp).
		* - __highlight__ - `null`. Highlighter function for fenced code blocks.
		*   Highlighter `function (str, lang)` should return escaped HTML. It can also
		*   return empty string if the source was not changed and should be escaped
		*   externaly. If result starts with <pre... internal wrapper is skipped.
		*
		* ##### Example
		*
		* ```javascript
		* // commonmark mode
		* var md = require('markdown-it')('commonmark');
		*
		* // default mode
		* var md = require('markdown-it')();
		*
		* // enable everything
		* var md = require('markdown-it')({
		*   html: true,
		*   linkify: true,
		*   typographer: true
		* });
		* ```
		*
		* ##### Syntax highlighting
		*
		* ```js
		* var hljs = require('highlight.js') // https://highlightjs.org/
		*
		* var md = require('markdown-it')({
		*   highlight: function (str, lang) {
		*     if (lang && hljs.getLanguage(lang)) {
		*       try {
		*         return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
		*       } catch (__) {}
		*     }
		*
		*     return ''; // use external default escaping
		*   }
		* });
		* ```
		*
		* Or with full wrapper override (if you need assign class to `<pre>` or `<code>`):
		*
		* ```javascript
		* var hljs = require('highlight.js') // https://highlightjs.org/
		*
		* // Actual default values
		* var md = require('markdown-it')({
		*   highlight: function (str, lang) {
		*     if (lang && hljs.getLanguage(lang)) {
		*       try {
		*         return '<pre><code class="hljs">' +
		*                hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
		*                '</code></pre>';
		*       } catch (__) {}
		*     }
		*
		*     return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>';
		*   }
		* });
		* ```
		*
		**/
		function MarkdownIt(presetName, options) {
			if (!(this instanceof MarkdownIt)) return new MarkdownIt(presetName, options);
			if (!options) {
				if (!isString$1(presetName)) {
					options = presetName || {};
					presetName = "default";
				}
			}
			/**
			* MarkdownIt#inline -> ParserInline
			*
			* Instance of [[ParserInline]]. You may need it to add new rules when
			* writing plugins. For simple rules control use [[MarkdownIt.disable]] and
			* [[MarkdownIt.enable]].
			**/
			this.inline = new ParserInline();
			/**
			* MarkdownIt#block -> ParserBlock
			*
			* Instance of [[ParserBlock]]. You may need it to add new rules when
			* writing plugins. For simple rules control use [[MarkdownIt.disable]] and
			* [[MarkdownIt.enable]].
			**/
			this.block = new ParserBlock();
			/**
			* MarkdownIt#core -> Core
			*
			* Instance of [[Core]] chain executor. You may need it to add new rules when
			* writing plugins. For simple rules control use [[MarkdownIt.disable]] and
			* [[MarkdownIt.enable]].
			**/
			this.core = new Core();
			/**
			* MarkdownIt#renderer -> Renderer
			*
			* Instance of [[Renderer]]. Use it to modify output look. Or to add rendering
			* rules for new token types, generated by plugins.
			*
			* ##### Example
			*
			* ```javascript
			* var md = require('markdown-it')();
			*
			* function myToken(tokens, idx, options, env, self) {
			*   //...
			*   return result;
			* };
			*
			* md.renderer.rules['my_token'] = myToken
			* ```
			*
			* See [[Renderer]] docs and [source code](https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.mjs).
			**/
			this.renderer = new Renderer();
			/**
			* MarkdownIt#linkify -> LinkifyIt
			*
			* [linkify-it](https://github.com/markdown-it/linkify-it) instance.
			* Used by [linkify](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/linkify.mjs)
			* rule.
			**/
			this.linkify = new LinkifyIt();
			/**
			* MarkdownIt#validateLink(url) -> Boolean
			*
			* Link validation function. CommonMark allows too much in links. By default
			* we disable `javascript:`, `vbscript:`, `file:` schemas, and almost all `data:...` schemas
			* except some embedded image types.
			*
			* You can change this behaviour:
			*
			* ```javascript
			* var md = require('markdown-it')();
			* // enable everything
			* md.validateLink = function () { return true; }
			* ```
			**/
			this.validateLink = validateLink;
			/**
			* MarkdownIt#normalizeLink(url) -> String
			*
			* Function used to encode link url to a machine-readable format,
			* which includes url-encoding, punycode, etc.
			**/
			this.normalizeLink = normalizeLink;
			/**
			* MarkdownIt#normalizeLinkText(url) -> String
			*
			* Function used to decode link url to a human-readable format`
			**/
			this.normalizeLinkText = normalizeLinkText;
			/**
			* MarkdownIt#utils -> utils
			*
			* Assorted utility functions, useful to write plugins. See details
			* [here](https://github.com/markdown-it/markdown-it/blob/master/lib/common/utils.mjs).
			**/
			this.utils = utils_exports;
			/**
			* MarkdownIt#helpers -> helpers
			*
			* Link components parser functions, useful to write plugins. See details
			* [here](https://github.com/markdown-it/markdown-it/blob/master/lib/helpers).
			**/
			this.helpers = assign$1({}, helpers_exports);
			this.options = {};
			this.configure(presetName);
			if (options) this.set(options);
		}
		/** chainable
		* MarkdownIt.set(options)
		*
		* Set parser options (in the same format as in constructor). Probably, you
		* will never need it, but you can change options after constructor call.
		*
		* ##### Example
		*
		* ```javascript
		* var md = require('markdown-it')()
		*             .set({ html: true, breaks: true })
		*             .set({ typographer, true });
		* ```
		*
		* __Note:__ To achieve the best possible performance, don't modify a
		* `markdown-it` instance options on the fly. If you need multiple configurations
		* it's best to create multiple instances and initialize each with separate
		* config.
		**/
		MarkdownIt.prototype.set = function(options) {
			assign$1(this.options, options);
			return this;
		};
		/** chainable, internal
		* MarkdownIt.configure(presets)
		*
		* Batch load of all options and compenent settings. This is internal method,
		* and you probably will not need it. But if you will - see available presets
		* and data structure [here](https://github.com/markdown-it/markdown-it/tree/master/lib/presets)
		*
		* We strongly recommend to use presets instead of direct config loads. That
		* will give better compatibility with next versions.
		**/
		MarkdownIt.prototype.configure = function(presets) {
			const self = this;
			if (isString$1(presets)) {
				const presetName = presets;
				presets = config[presetName];
				if (!presets) throw new Error("Wrong `markdown-it` preset \"" + presetName + "\", check name");
			}
			if (!presets) throw new Error("Wrong `markdown-it` preset, can't be empty");
			if (presets.options) self.set(presets.options);
			if (presets.components) Object.keys(presets.components).forEach(function(name) {
				if (presets.components[name].rules) self[name].ruler.enableOnly(presets.components[name].rules);
				if (presets.components[name].rules2) self[name].ruler2.enableOnly(presets.components[name].rules2);
			});
			return this;
		};
		/** chainable
		* MarkdownIt.enable(list, ignoreInvalid)
		* - list (String|Array): rule name or list of rule names to enable
		* - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
		*
		* Enable list or rules. It will automatically find appropriate components,
		* containing rules with given names. If rule not found, and `ignoreInvalid`
		* not set - throws exception.
		*
		* ##### Example
		*
		* ```javascript
		* var md = require('markdown-it')()
		*             .enable(['sub', 'sup'])
		*             .disable('smartquotes');
		* ```
		**/
		MarkdownIt.prototype.enable = function(list, ignoreInvalid) {
			let result = [];
			if (!Array.isArray(list)) list = [list];
			[
				"core",
				"block",
				"inline"
			].forEach(function(chain) {
				result = result.concat(this[chain].ruler.enable(list, true));
			}, this);
			result = result.concat(this.inline.ruler2.enable(list, true));
			const missed = list.filter(function(name) {
				return result.indexOf(name) < 0;
			});
			if (missed.length && !ignoreInvalid) throw new Error("MarkdownIt. Failed to enable unknown rule(s): " + missed);
			return this;
		};
		/** chainable
		* MarkdownIt.disable(list, ignoreInvalid)
		* - list (String|Array): rule name or list of rule names to disable.
		* - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
		*
		* The same as [[MarkdownIt.enable]], but turn specified rules off.
		**/
		MarkdownIt.prototype.disable = function(list, ignoreInvalid) {
			let result = [];
			if (!Array.isArray(list)) list = [list];
			[
				"core",
				"block",
				"inline"
			].forEach(function(chain) {
				result = result.concat(this[chain].ruler.disable(list, true));
			}, this);
			result = result.concat(this.inline.ruler2.disable(list, true));
			const missed = list.filter(function(name) {
				return result.indexOf(name) < 0;
			});
			if (missed.length && !ignoreInvalid) throw new Error("MarkdownIt. Failed to disable unknown rule(s): " + missed);
			return this;
		};
		/** chainable
		* MarkdownIt.use(plugin, params)
		*
		* Load specified plugin with given params into current parser instance.
		* It's just a sugar to call `plugin(md, params)` with curring.
		*
		* ##### Example
		*
		* ```javascript
		* var iterator = require('markdown-it-for-inline');
		* var md = require('markdown-it')()
		*             .use(iterator, 'foo_replace', 'text', function (tokens, idx) {
		*               tokens[idx].content = tokens[idx].content.replace(/foo/g, 'bar');
		*             });
		* ```
		**/
		MarkdownIt.prototype.use = function(plugin) {
			const args = [this].concat(Array.prototype.slice.call(arguments, 1));
			plugin.apply(plugin, args);
			return this;
		};
		/** internal
		* MarkdownIt.parse(src, env) -> Array
		* - src (String): source string
		* - env (Object): environment sandbox
		*
		* Parse input string and return list of block tokens (special token type
		* "inline" will contain list of inline tokens). You should not call this
		* method directly, until you write custom renderer (for example, to produce
		* AST).
		*
		* `env` is used to pass data between "distributed" rules and return additional
		* metadata like reference info, needed for the renderer. It also can be used to
		* inject data in specific cases. Usually, you will be ok to pass `{}`,
		* and then pass updated object to renderer.
		**/
		MarkdownIt.prototype.parse = function(src, env) {
			if (typeof src !== "string") throw new Error("Input data should be a String");
			const state = new this.core.State(src, this, env);
			this.core.process(state);
			return state.tokens;
		};
		/**
		* MarkdownIt.render(src [, env]) -> String
		* - src (String): source string
		* - env (Object): environment sandbox
		*
		* Render markdown string into html. It does all magic for you :).
		*
		* `env` can be used to inject additional metadata (`{}` by default).
		* But you will not need it with high probability. See also comment
		* in [[MarkdownIt.parse]].
		**/
		MarkdownIt.prototype.render = function(src, env) {
			env = env || {};
			return this.renderer.render(this.parse(src, env), this.options, env);
		};
		/** internal
		* MarkdownIt.parseInline(src, env) -> Array
		* - src (String): source string
		* - env (Object): environment sandbox
		*
		* The same as [[MarkdownIt.parse]] but skip all block rules. It returns the
		* block tokens list with the single `inline` element, containing parsed inline
		* tokens in `children` property. Also updates `env` object.
		**/
		MarkdownIt.prototype.parseInline = function(src, env) {
			const state = new this.core.State(src, this, env);
			state.inlineMode = true;
			this.core.process(state);
			return state.tokens;
		};
		/**
		* MarkdownIt.renderInline(src [, env]) -> String
		* - src (String): source string
		* - env (Object): environment sandbox
		*
		* Similar to [[MarkdownIt.render]] but for single paragraph content. Result
		* will NOT be wrapped into `<p>` tags.
		**/
		MarkdownIt.prototype.renderInline = function(src, env) {
			env = env || {};
			return this.renderer.render(this.parseInline(src, env), this.options, env);
		};
		//#endregion
		//#region src/article-assets.ts
		const markdown$2 = new MarkdownIt({
			html: false,
			linkify: false
		});
		/** Read actual Markdown image nodes so code examples do not count as article pictures. */
		function articleImageSources(body) {
			const sources = [];
			const visit = (tokens) => {
				for (const token of tokens) {
					if (token.type === "image") sources.push(token.attrGet("src") ?? "");
					if (token.children) visit(token.children);
				}
			};
			visit(markdown$2.parse(body, {}));
			return sources;
		}
		function hasRawArticleImage(body) {
			const visit = (tokens) => tokens.some((token) => token.type !== "image" && ((token.type === "text" || token.type === "html_inline" || token.type === "html_block") && /<img\b/iu.test(token.content) || !!token.children && visit(token.children)));
			return visit(markdown$2.parse(body, {}));
		}
		//#endregion
		//#region src/submission-validation.ts
		const FIELD_LABELS$2 = {
			category: "分类",
			topic: "话题",
			original: "原创声明"
		};
		const XHS_IMAGE_STATEMENTS = /* @__PURE__ */ new Set([
			"none",
			"ai_generated",
			"fiction",
			"marketing"
		]);
		const MANAGED_IMAGE = /^ebao-asset:\/\/([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/iu;
		const WECHAT_COVER_LIMIT = 10 * 1024 * 1024;
		const WECHAT_BODY_IMAGE_LIMIT = 1024 * 1024;
		function usableWechatCover(asset) {
			return asset.mime === "image/jpeg" || asset.mime === "image/png";
		}
		/** Explain changes made only to the platform submission copy; the editable draft stays intact. */
		function articleSubmissionWarnings(content, accounts, capabilities) {
			if (content.contentType !== "article") return [];
			return accounts.flatMap((account) => {
				const selected = projectContentForPlatform(content, account.platform);
				const sources = articleImageSources(selected.body);
				const assets = new Map(selected.assets.map((asset) => [asset.id, asset]));
				const notes = [];
				if ((account.platform === "wxmp" || account.platform === "bjh") && selected.tags.length > 0) notes.push("文章标签暂不写入该平台");
				if (account.platform === "juejin" && !selected.platformFields.juejin?.category?.trim()) notes.push("未填写分类，将使用默认分类“前端”");
				const limit = account.platform === "wxmp" ? 64 : capabilities.find((item) => item.platform === account.platform)?.maxTitleLength?.article;
				if (limit && selected.title.length > limit) notes.push(`标题将截短至 ${limit} 字`);
				if (account.platform === "wxmp" && selected.summary.length > 120) notes.push("摘要将截短至 120 字");
				const selectedCover = selected.assets.find((asset) => asset.id === selected.coverAssetId);
				const effectiveCoverId = selectedCover?.id ?? selected.assets[0]?.id;
				if (account.platform === "tt" || account.platform === "dy") {
					if (sources.length > 0 || hasRawArticleImage(selected.body)) notes.push(`正文图片会在原位置保留占位，请从发布历史打开${PLATFORM_LABELS[account.platform]}草稿手动补图`);
				} else if (account.platform === "juejin" || account.platform === "blbl") {
					if (sources.length > 0 || hasRawArticleImage(selected.body)) notes.push("正文插图将从该平台版本移除");
					if (selected.assets.some((asset) => asset.id !== effectiveCoverId)) notes.push("非封面图片不会提交到该平台");
				} else {
					if (sources.some((source) => {
						const id = MANAGED_IMAGE.exec(source)?.[1];
						const asset = id ? assets.get(id) : void 0;
						return !asset || account.platform === "wxmp" && asset.mime === "image/webp";
					}) || hasRawArticleImage(selected.body)) notes.push("不符合该平台要求的正文图片将从平台版本移除");
					if (account.platform === "wxmp" && selected.assets.some((asset) => asset.mime === "image/webp")) notes.push("WebP 素材不会上传到公众号");
				}
				if (account.platform === "wxmp") {
					const cover = selected.assets.find((asset) => asset.id === selected.coverAssetId);
					if ((!cover || !usableWechatCover(cover)) && selected.assets.some(usableWechatCover)) notes.push("将自动选取可用的 JPEG/PNG 封面");
					const effectiveCover = cover && usableWechatCover(cover) ? cover : selected.assets.find(usableWechatCover);
					const usedBodyIds = new Set(sources.flatMap((source) => {
						const id = MANAGED_IMAGE.exec(source)?.[1];
						const asset = id ? assets.get(id) : void 0;
						return asset && (asset.mime === "image/jpeg" || asset.mime === "image/png") ? [asset.id] : [];
					}));
					if (effectiveCover && effectiveCover.bytes >= WECHAT_COVER_LIMIT || [...usedBodyIds].some((id) => (assets.get(id)?.bytes ?? 0) >= WECHAT_BODY_IMAGE_LIMIT)) notes.push("超限图片上传前将尝试压缩，草稿需核对画质");
					if (selected.assets.some((asset) => asset.id !== effectiveCover?.id && !usedBodyIds.has(asset.id))) notes.push("未使用或不兼容的素材不会上传到公众号");
				} else if (!selectedCover && selected.assets.length > 0 && account.platform !== "tt" && account.platform !== "dy") notes.push("将自动选取首张图片作为封面");
				if ((account.platform === "tt" || account.platform === "dy") && effectiveCoverId) notes.push(`封面需手动设置，请从发布历史打开${PLATFORM_LABELS[account.platform]}草稿`);
				if (account.platform !== "wxmp" && selected.coverAssetId && !selectedCover && selected.assets.length === 0) notes.push("封面不在该平台所选图片中，提交时将忽略");
				return notes.map((note) => `${PLATFORM_LABELS[account.platform]}：${note}`);
			});
		}
		/** Shared UI/Host preflight; the Worker still independently validates login and its own content snapshot. */
		function contentSubmissionError(content, accounts, capabilities, mode) {
			if (content.contentType === "video") return "草稿内容类型不匹配";
			if (!content.title.trim() && accounts.length === 0) return "请填写标题";
			if (accounts.length === 0) return "请选择支持此类型的发布账号";
			for (const account of accounts) {
				const selected = projectContentForPlatform(content, account.platform);
				if (selected.contentType === "image-note" && account.platform === "tt") return "头条暂不支持图文发布";
				if (!selected.title.trim()) return "请填写标题";
				if (selected.contentType === "article" && !selected.body.trim()) return "请填写正文";
				if (selected.contentType === "article" && account.platform === "dy" && selected.summary.length > 30) return "抖音文章摘要不能超过 30 字，请先用模型压缩至30字以内";
				if (selected.contentType === "image-note" && selected.assets.length === 0) return "图文至少添加一张图片";
				if (selected.contentType === "image-note" && account.platform !== "wxmp" && selected.coverAssetId && !selected.assets.some((asset) => asset.id === selected.coverAssetId)) return `${PLATFORM_LABELS[account.platform]}封面不在该平台已选图片中`;
				if (selected.contentType === "article" && account.platform === "wxmp") {
					if (!selected.assets.some(usableWechatCover)) return "微信公众号文章需要一张 JPEG/PNG 封面图片";
				}
				const capability = capabilities.find((item) => item.platform === account.platform);
				if (!capability?.modes[selected.contentType]?.includes(mode)) return `${PLATFORM_LABELS[account.platform]}暂不支持此内容类型和提交方式`;
				if (selected.contentType === "article" && account.platform === "wxmp") {
					const theme = resolveArticleTheme(selected);
					const requiredVersion = theme === "classic" ? 0 : theme === "editorial" ? 1 : 2;
					if ((capability.articleThemeVersion ?? 0) < requiredVersion) return `当前 Publisher Worker 不支持“${ARTICLE_THEME_LABELS[theme]}”公众号排版，请更新 Worker 并重启应用；也可切换为基础主题后提交`;
				}
				const titleLimit = capability.maxTitleLength?.[selected.contentType];
				const titleLength = account.platform === "wxmp" && selected.contentType === "image-note" ? Array.from(selected.title).length : selected.title.length;
				if (selected.contentType !== "article" && titleLimit !== void 0 && titleLength > titleLimit) return `${PLATFORM_LABELS[account.platform]}标题不能超过 ${titleLimit} 字`;
				const assetLimit = capability.maxAssets?.[selected.contentType];
				if (selected.contentType !== "article" && assetLimit !== void 0 && selected.assets.length > assetLimit) return `${PLATFORM_LABELS[account.platform]}当前最多支持 ${assetLimit} 张图片`;
				for (const field of capability.requiredFields[selected.contentType] ?? []) if (!selected.platformFields[account.platform]?.[field]?.trim()) {
					if (selected.contentType === "article" && account.platform === "juejin" && field === "category") continue;
					return `请填写${PLATFORM_LABELS[account.platform]}的${FIELD_LABELS$2[field] || field}`;
				}
				if (selected.contentType === "image-note" && account.platform === "xhs" && !XHS_IMAGE_STATEMENTS.has(selected.creativeStatement)) return "小红书图文暂不支持所选内容声明";
			}
		}
		//#endregion
		//#region src/client/wechat-preview-html.tsx
		const markdown$1 = new MarkdownIt({
			html: false,
			linkify: false
		});
		const managedImage = /^ebao-asset:\/\/([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/iu;
		const imageWarning = "【图片无法预览：请使用当前草稿中已上传的图片】";
		const allowedTags$1 = /* @__PURE__ */ new Set([
			"p",
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
			"blockquote",
			"ul",
			"ol",
			"li",
			"em",
			"strong",
			"s",
			"a",
			"table",
			"thead",
			"tbody",
			"tr",
			"th",
			"td"
		]);
		function visitImages(tokens, visit) {
			for (const token of tokens) {
				if (token.type === "image") visit(token);
				if (token.children) visitImages(token.children, visit);
			}
		}
		/** Count images actually embedded in Markdown, rather than plain-text asset references. */
		function wechatBodyImageIds(body) {
			const ids = /* @__PURE__ */ new Set();
			visitImages(markdown$1.parse(body, {}), (token) => {
				const id = managedImage.exec(token.attrGet("src") ?? "")?.[1];
				if (id) ids.add(id);
			});
			return ids;
		}
		function localImageUrl(token, content, assetUrl) {
			const id = managedImage.exec(token.attrGet("src") ?? "")?.[1];
			if (!id || !content.assets.some((asset) => asset.id === id)) return;
			const expected = `${API}/content-asset/${encodeURIComponent(content.id)}/${encodeURIComponent(id)}`;
			try {
				const url = assetUrl(id);
				if (url === expected) return url;
			} catch {}
		}
		function ManagedPreviewImage({ src, alt }) {
			const [failed, setFailed] = (0, react.useState)(false);
			(0, react.useEffect)(() => setFailed(false), [src]);
			return failed ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: "pub-wechat-preview-image-error",
				children: ["图片加载失败：", alt || "正文图片"]
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
				src,
				alt,
				loading: "lazy",
				onError: () => setFailed(true)
			});
		}
		function safeLinkProps$1(token) {
			const href = token.attrGet("href") ?? "";
			return /^(?:https?:\/\/|mailto:)/iu.test(href) ? {
				href,
				target: "_blank",
				rel: "noopener noreferrer"
			} : {};
		}
		/** Render the Worker's Markdown token structure as React nodes, never injected HTML. */
		function renderTokens(tokens, content, assetUrl) {
			const root = {
				tag: null,
				props: {},
				children: []
			};
			const frames = [root];
			let key = 0;
			const append = (node) => {
				frames[frames.length - 1].children.push(node);
			};
			for (const token of tokens) {
				if (token.hidden) continue;
				if (token.type === "inline") {
					frames[frames.length - 1].children.push(...renderTokens(token.children ?? [], content, assetUrl));
					continue;
				}
				if (token.type === "image") {
					const src = localImageUrl(token, content, assetUrl);
					append(src ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ManagedPreviewImage, {
						src,
						alt: token.content
					}, key++) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "pub-wechat-preview-image-error",
						children: imageWarning
					}, key++));
					continue;
				}
				if (token.type === "text" || token.type === "html_inline" || token.type === "html_block") {
					append(token.content);
					continue;
				}
				if (token.type === "code_inline") {
					append(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: token.content }, key++));
					continue;
				}
				if (token.type === "fence" || token.type === "code_block") {
					append(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: token.content }) }, key++));
					continue;
				}
				if (token.type === "hr") {
					append(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("hr", {}, key++));
					continue;
				}
				if (token.type === "hardbreak") {
					append(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("br", {}, key++));
					continue;
				}
				if (token.type === "softbreak") {
					append("\n");
					continue;
				}
				if (token.nesting === 1) {
					const tag = allowedTags$1.has(token.tag) ? token.tag : "span";
					const props = token.type === "link_open" ? safeLinkProps$1(token) : token.type === "ordered_list_open" && token.attrGet("start") ? { start: Number(token.attrGet("start")) } : {};
					frames.push({
						tag,
						props,
						children: []
					});
					continue;
				}
				if (token.nesting === -1) {
					if (frames.length > 1) {
						const frame = frames.pop();
						append((0, react.createElement)(frame.tag, {
							key: key++,
							...frame.props
						}, ...frame.children));
					}
					continue;
				}
				if (token.content) append(token.content);
			}
			return root.children;
		}
		function ArticleMarkdownPreview({ body, content, assetUrl }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "pub-preview pub-wechat-markdown",
				"aria-label": "文章正文预览",
				children: renderTokens(markdown$1.parse(body, {}), content, assetUrl)
			});
		}
		//#endregion
		//#region src/client/content-preview.tsx
		/** Both preview mounts use the same encoded, same-origin asset URL. */
		function contentAssetUrl(contentId, assetId) {
			return `${API}/content-asset/${encodeURIComponent(contentId)}/${encodeURIComponent(assetId)}`;
		}
		function AssetPreviewImage({ src, alt, className = "", thumbnail = false }) {
			const [failed, setFailed] = (0, react.useState)(false);
			(0, react.useEffect)(() => setFailed(false), [src]);
			return failed ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: `pub-content-preview-image-error ${className}`,
				role: "img",
				"aria-label": `${alt} 加载失败`,
				style: {
					minHeight: thumbnail ? 95 : 120,
					width: "100%",
					display: "grid",
					placeItems: "center"
				},
				children: ["图片加载失败：", alt]
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
				className,
				src,
				alt,
				loading: "lazy",
				onError: () => setFailed(true)
			});
		}
		const ARTICLE_DISCLOSURES = {
			ai_generated: "本文包含 AI 生成内容",
			fiction: "虚构演绎，仅供娱乐",
			marketing: "营销推广",
			personal_opinion: "个人观点，仅供参考",
			repost: "转载",
			self_made_no_repost: "自制，禁止转载"
		};
		/** The same content projection drives the Publisher and conversation previews. */
		function previewContentModel(content, platform) {
			const disclosure = platform && content.contentType === "article" ? ARTICLE_DISCLOSURES[content.creativeStatement] : void 0;
			const body = platform === "blbl" && content.summary ? `${content.summary}\n\n${content.body}` : content.body;
			const renderedBody = disclosure ? `${body.trimEnd()}\n\n> 内容声明：${disclosure}` : body;
			const embeddedAssets = wechatBodyImageIds(renderedBody);
			const cover = content.assets.find((asset) => asset.id === content.coverAssetId);
			return {
				renderedBody,
				embeddedAssets,
				cover,
				remainingAssets: content.assets.filter((asset) => asset.id !== cover?.id && !embeddedAssets.has(asset.id)),
				articleTheme: resolveArticleTheme(content)
			};
		}
		function VideoContentPreview({ content, videoSourceName, videoPreviewUrl }) {
			const [failed, setFailed] = (0, react.useState)(false);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "pub-content-preview-shell pub-content-preview-video",
				"aria-label": "视频平台分享预览",
				children: [
					videoPreviewUrl && !failed ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("video", {
						className: "pub-content-preview-video-player",
						src: videoPreviewUrl,
						controls: true,
						playsInline: true,
						preload: "metadata",
						onError: () => setFailed(true),
						children: "当前环境无法播放此视频。"
					}, videoPreviewUrl) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-content-preview-video-error",
						role: "status",
						children: failed ? content.videoSource?.kind === "local" ? "本地视频无法读取。文件可能已移动、删除或发生变化，请重新选择文件。" : "e剪宝成片无法播放，请检查作品文件或重新选择。" : "选择视频来源后即可预览。"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
						className: "pub-content-preview-title",
						children: content.title || "未填写标题"
					}),
					videoSourceName && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
						className: "pub-content-preview-video-source",
						children: ["视频来源：", videoSourceName]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-content-preview-text",
						children: content.description || "暂无视频描述"
					}),
					content.tags.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-content-preview-tags",
						children: content.tags.map((tag) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: ["#", tag] }, tag))
					})
				]
			});
		}
		function PublisherContentPreview({ content, platform, device, videoSourceName, videoPreviewUrl }) {
			if (content.contentType === "video") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(VideoContentPreview, {
				content,
				videoSourceName,
				videoPreviewUrl
			}, videoPreviewUrl ?? content.id);
			const assetUrl = (id) => contentAssetUrl(content.id, id);
			const { renderedBody, embeddedAssets, cover, remainingAssets, articleTheme } = previewContentModel(content, platform);
			const imageNote = content.contentType === "image-note";
			if (platform === "wxmp" && !imageNote) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "pub-content-preview-shell pub-content-preview-wechat",
				"data-device": device,
				"data-theme": articleTheme,
				"aria-label": "微信公众号文章平台分享预览",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-wechat-preview-bar",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "pub-wechat-preview-mark",
							"aria-hidden": "true"
						}), "微信公众号 · 移动端排版预览"]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
						className: "pub-wechat-preview-article",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
							className: "pub-wechat-preview-title",
							children: content.title || "未填写标题"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pub-wechat-preview-body ebao-article-reader",
							"data-theme": articleTheme,
							"aria-label": "公众号正文预览",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ArticleMarkdownPreview, {
								body: renderedBody || "暂无正文",
								content,
								assetUrl
							})
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "pub-wechat-preview-metadata",
						"aria-label": "公众号草稿独立字段",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "草稿独立字段" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pub-wechat-preview-cover-row",
								children: [cover ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AssetPreviewImage, {
									className: "pub-wechat-preview-cover",
									src: assetUrl(cover.id),
									alt: cover.name
								}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "pub-wechat-preview-no-cover",
									children: "未选封面"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "封面" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "单独用于草稿封面；只有在正文中插入的图片才会出现在文章里。" })] })]
							}),
							content.summary && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
								className: "pub-wechat-preview-summary",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "摘要" }), content.summary]
							}),
							remainingAssets.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
								className: "pub-wechat-preview-unused",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("summary", { children: [remainingAssets.length, " 张素材未插入正文，不会出现在公众号文章里"] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "pub-wechat-preview-unused-grid",
									children: remainingAssets.map((asset) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AssetPreviewImage, {
										src: assetUrl(asset.id),
										alt: asset.name
									}, asset.id))
								})]
							})
						]
					})
				]
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: `pub-content-preview-shell${imageNote ? "" : " ebao-article-reader"}`,
				"data-device": device,
				"data-theme": imageNote ? void 0 : platform ? "native" : articleTheme,
				"aria-label": `${imageNote ? "图文" : "文章"}平台分享预览`,
				children: [
					imageNote && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ImageNoteCarousel, {
						contentId: content.id,
						assets: content.assets,
						renderImage: (asset) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AssetPreviewImage, {
							src: assetUrl(asset.id),
							alt: asset.name
						})
					}),
					!imageNote && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pub-content-preview-kicker",
						children: platform ? `${PLATFORM_LABELS[platform]} · 内容结构预览` : "主稿 · 阅读排版预览"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
						className: "pub-content-preview-title",
						children: content.title || "未填写标题"
					}),
					!imageNote && cover && !embeddedAssets.has(cover.id) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AssetPreviewImage, {
						className: "pub-content-preview-cover",
						src: assetUrl(cover.id),
						alt: cover.name
					}),
					imageNote ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-content-preview-text",
						children: content.body || "暂无正文"
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ArticleMarkdownPreview, {
						body: renderedBody || "暂无正文",
						content,
						assetUrl
					}),
					!imageNote && remainingAssets.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
						className: "pub-content-preview-unused",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("summary", { children: [remainingAssets.length, " 张素材未插入正文，不会显示在文章正文里"] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pub-content-preview-note-images",
							"aria-label": "尚未插入正文的图片素材",
							children: remainingAssets.map((asset) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AssetPreviewImage, {
								className: "pub-content-preview-image",
								src: assetUrl(asset.id),
								alt: asset.name
							}, asset.id))
						})]
					}),
					content.tags.length > 0 && (imageNote || !platform || ![
						"wxmp",
						"tt",
						"bjh",
						"dy"
					].includes(platform)) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-content-preview-tags",
						children: content.tags.map((tag) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: ["#", tag] }, tag))
					})
				]
			});
		}
		//#endregion
		//#region src/client/agent-publication-card.tsx
		const FIELD_LABELS$1 = {
			category: "分类",
			topic: "话题",
			original: "原创声明"
		};
		const STYLE_OWNER = "cqai-dsh-plugin-publisher";
		const STYLE_ID = `${STYLE_OWNER}/agent-publication-card`;
		/** A persisted tool result locates a request; the server owns its current state. */
		function parseAgentPublicationRequestId(result) {
			if (result.isError) return null;
			for (const item of result.content) {
				if (item.type !== "text" || typeof item.text !== "string") continue;
				try {
					const value = JSON.parse(item.text);
					if (!value || typeof value !== "object" || Array.isArray(value)) continue;
					const record = value;
					const id = record.request_id ?? record.requestId;
					if (typeof id === "string" && /^[a-z0-9][a-z0-9_-]{0,119}$/iu.test(id)) return id;
				} catch {}
			}
			return null;
		}
		function AgentPublicationToolView(props) {
			if (props.phase !== "result") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "pub-agent-publication-wait",
				role: "status",
				children: "正在准备发布确认…"
			});
			if (!parseAgentPublicationRequestId(props.block)) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "pub-agent-publication-wait",
				role: "alert",
				children: props.block.isError ? "发布确认准备失败，请让 Agent 检查内容后重新准备。" : "未收到有效的发布确认请求，请让 Agent 重新准备。"
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "pub-agent-publication-wait",
				role: "status",
				children: "已准备发布确认，请在本轮回复下方核对后确认。"
			});
		}
		function onlyToutiao(request) {
			return isToutiaoOnly(request.submission ? request.submission.targets.map((target) => target.platform) : request.requestedPlatforms.length ? request.requestedPlatforms : request.accounts.filter((account) => request.accountIds.includes(account.id)).map((account) => account.platform));
		}
		function statusLabel(request, uncertain, cancellation) {
			if (uncertain) return onlyToutiao(request) ? cancellation ? "取消未完成" : "提交未完成" : cancellation ? "取消结果待确认" : "提交结果待确认";
			switch (request.state) {
				case "awaiting-confirmation": return "待你确认";
				case "submitting": return "正在提交";
				case "cancelled": return "已取消本次发布";
				case "stale": return "内容已更新，需重新准备";
				case "uncertain": return onlyToutiao(request) ? "提交未完成" : "提交结果待确认";
				case "submitted": switch (request.submission?.state) {
					case "queued": return "排队中";
					case "running": return "执行中";
					case "completed": return "本机执行完成";
					case "failed": return "执行失败";
					default: return onlyToutiao(request) ? "任务未完成" : "已受理，执行结果待确认";
				}
			}
		}
		function submissionStatusMessage(request) {
			switch (request.submission?.state) {
				case "queued": return "已进入本机提交队列，等待执行。";
				case "running": return "本机任务正在执行，状态会自动更新。";
				case "completed": return "本机执行完成，请到平台后台核对。";
				case "failed": return "本机执行失败，请核对下方原因和平台稿件。";
				default: return;
			}
		}
		function accountProblem(request, account, mode) {
			if (account.loginState !== "logged-in") return account.loginState === "logged-out" ? "未登录" : "登录状态未确认";
			const warnings = articleSubmissionWarnings(request.content, [account], request.capabilities);
			const effectiveMode = request.content.contentType === "article" && warnings.length > 0 ? "draft" : mode;
			const capability = request.capabilities.find((item) => item.platform === account.platform);
			if (!capability?.contentTypes.includes(request.content.contentType)) return "暂不支持此内容类型";
			if (!capability.modes[request.content.contentType]?.includes(effectiveMode)) return "暂不支持此提交方式";
		}
		function initialAccountIds(request) {
			const platforms = /* @__PURE__ */ new Set();
			return request.accountIds.filter((id) => {
				const account = request.accounts.find((item) => item.id === id);
				if (!account || platforms.has(account.platform)) return false;
				platforms.add(account.platform);
				return true;
			});
		}
		function videoProblems(request, accounts) {
			const content = request.content;
			const problems = [];
			if (!content.title.trim()) problems.push("请填写标题");
			if (!content.videoSource) problems.push("请先选择一条 e剪宝成片或一个本地视频");
			for (const account of accounts) {
				const capability = request.capabilities.find((item) => item.platform === account.platform);
				const limit = capability?.maxTitleLength?.video;
				if (limit !== void 0 && content.title.length > limit) problems.push(`${PLATFORM_LABELS[account.platform]}标题不能超过 ${limit} 字`);
				for (const field of capability?.requiredFields.video ?? []) {
					const value = content.platformFields[account.platform]?.[field] ?? content[field];
					if (typeof value !== "string" || !value.trim()) problems.push(`请填写${PLATFORM_LABELS[account.platform]}的${FIELD_LABELS$1[field] ?? field}`);
				}
			}
			return problems;
		}
		function AgentPublicationCard({ sessionId, requestId }) {
			const id = (0, react.useId)();
			const [request, setRequest] = (0, react.useState)();
			const [accountIds, setAccountIds] = (0, react.useState)([]);
			const [mode, setMode] = (0, react.useState)("draft");
			const [preview, setPreview] = (0, react.useState)("master");
			const [loading, setLoading] = (0, react.useState)(true);
			const [busy, setBusy] = (0, react.useState)(false);
			const [uncertain, setUncertain] = (0, react.useState)(false);
			const [pendingAction, setPendingAction] = (0, react.useState)();
			const [error, setError] = (0, react.useState)("");
			const alive = (0, react.useRef)(false);
			const operation = (0, react.useRef)(false);
			const responseGeneration = (0, react.useRef)(0);
			const outcomePending = (0, react.useRef)(false);
			const requestRef = (0, react.useRef)();
			const receive = (0, react.useCallback)((value, resetChoices) => {
				if (value.sessionId !== sessionId || value.requestId !== requestId) throw new Error("发布请求与当前对话不匹配");
				const display = {
					...value,
					warnings: displayArticleWarnings(value.warnings),
					...value.submission ? { submission: projectSubmissionForDisplay(value.submission) } : {}
				};
				requestRef.current = display;
				setRequest(display);
				if (resetChoices || value.state !== "awaiting-confirmation") {
					setAccountIds(initialAccountIds(value));
					setMode(value.mode);
				}
				setUncertain(false);
				setPendingAction(void 0);
				outcomePending.current = value.state !== "awaiting-confirmation";
			}, [sessionId, requestId]);
			const refresh = (0, react.useCallback)(async (initial = false) => {
				if (operation.current && !initial) return;
				operation.current = true;
				const generation = ++responseGeneration.current;
				setLoading(true);
				setError("");
				try {
					const value = await api(`agent-publication/${encodeURIComponent(sessionId)}/${encodeURIComponent(requestId)}`);
					if (alive.current && generation === responseGeneration.current) receive(value, initial);
				} catch (cause) {
					if (alive.current && generation === responseGeneration.current) setError(errorMessage(cause));
				} finally {
					if (generation === responseGeneration.current) {
						operation.current = false;
						if (alive.current) setLoading(false);
					}
				}
			}, [
				sessionId,
				requestId,
				receive
			]);
			(0, react.useEffect)(() => {
				alive.current = true;
				refresh(true);
				return () => {
					alive.current = false;
					responseGeneration.current += 1;
				};
			}, [refresh]);
			(0, react.useEffect)(() => {
				if (uncertain || request?.state !== "submitted" || request.submission?.state !== "queued" && request.submission?.state !== "running") return;
				const timer = setInterval(() => {
					refresh();
				}, 4e3);
				return () => clearInterval(timer);
			}, [
				request?.state,
				request?.submission?.state,
				uncertain,
				refresh
			]);
			const selectedAccounts = request?.accounts.filter((account) => accountIds.includes(account.id)) ?? [];
			const douyinSummary = request?.content.contentType === "article" && selectedAccounts.some((account) => account.platform === "dy") ? projectContentForPlatform(request.content, "dy").summary : "";
			const warnings = request && !request.submission ? articleSubmissionWarnings(request.content, selectedAccounts, request.capabilities) : [];
			const effectiveMode = request?.submission?.mode ?? (request?.content.contentType === "article" && warnings.length > 0 ? "draft" : mode);
			const accountProblems = request ? [
				...selectedAccounts.length === 0 ? ["请至少选择一个发布账号"] : [],
				...request.requestedPlatforms.filter((platform) => !selectedAccounts.some((account) => account.platform === platform)).map((platform) => `请为${PLATFORM_LABELS[platform]}选择一个账号`),
				...selectedAccounts.filter((account) => request.requestedPlatforms.length > 0 && !request.requestedPlatforms.includes(account.platform)).map((account) => `本次请求未包含${PLATFORM_LABELS[account.platform]}，请取消该账号或让 Agent 重新准备目标平台`),
				...selectedAccounts.flatMap((account) => {
					const problem = accountProblem(request, account, effectiveMode);
					return problem ? [`${PLATFORM_LABELS[account.platform]} · ${account.displayName}：${problem}`] : [];
				})
			] : [];
			const contentProblems = request ? request.content.contentType === "video" ? videoProblems(request, selectedAccounts) : selectedAccounts.length > 0 ? [contentSubmissionError(request.content, selectedAccounts, request.capabilities, effectiveMode)].filter((value) => !!value) : [] : [];
			const editable = !!request && request.state === "awaiting-confirmation" && !uncertain && !outcomePending.current && !busy && !loading;
			const ready = editable && selectedAccounts.length > 0 && accountProblems.length === 0 && contentProblems.length === 0;
			const changeAccount = (platform, accountId) => {
				if (!editable) return;
				setAccountIds((previous) => [...previous.filter((existing) => request.accounts.find((account) => account.id === existing)?.platform !== platform), ...accountId ? [accountId] : []]);
				setError("");
			};
			const mutate = async (action) => {
				if (operation.current || outcomePending.current || !requestRef.current || requestRef.current.state !== "awaiting-confirmation") return;
				if (action === "confirm" && !ready) return;
				operation.current = true;
				outcomePending.current = true;
				setBusy(true);
				setPendingAction(action);
				setError("");
				const choices = {
					accountIds: [...accountIds],
					mode: effectiveMode
				};
				const generation = ++responseGeneration.current;
				try {
					const value = await api(`agent-publication-${action}`, {
						sessionId,
						requestId,
						...action === "confirm" ? choices : {}
					});
					if (alive.current && generation === responseGeneration.current) receive(value, true);
				} catch (cause) {
					if (alive.current && generation === responseGeneration.current) {
						setUncertain(true);
						setError(onlyToutiao(requestRef.current) ? isOperationTimeout(errorMessage(cause)) ? "操作超时，任务未完成" : `${action === "confirm" ? "提交" : "取消"}未完成：${errorMessage(cause)}。请从发布历史打开平台稿件核对。` : `${action === "confirm" ? "提交" : "取消"}响应未确认：${errorMessage(cause)}。请刷新本次请求状态后核对。`);
					}
				} finally {
					if (generation === responseGeneration.current) {
						operation.current = false;
						if (alive.current) setBusy(false);
					}
				}
			};
			if (!request) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "pub-agent-publication",
				"aria-label": "Agent 发布确认",
				"aria-busy": loading,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("style", {
						"data-plugin": STYLE_OWNER,
						"data-plugin-css": STYLE_ID,
						children: cardCss
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "发布确认" }),
					loading ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						role: "status",
						children: "正在加载本次发布请求…"
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
						className: "pub-agent-publication-error",
						role: "alert",
						children: ["无法加载发布请求：", error]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						type: "button",
						size: "sm",
						variant: "outline",
						onClick: () => void refresh(true),
						children: "重新加载确认请求"
					})] })
				]
			});
			const submission = request.submission;
			const platforms = [...new Set(submission ? submission.targets.map((target) => target.platform) : request.requestedPlatforms.length > 0 ? request.requestedPlatforms : request.accounts.map((account) => account.platform))];
			const previewPlatforms = [.../* @__PURE__ */ new Set([...platforms, ...Object.keys(request.content.platformVariants ?? {})])];
			const previewContent = preview === "master" ? request.content : projectContentForPlatform(request.content, preview);
			const videoSource = previewContent.videoSource;
			const videoPreviewUrl = videoSource && `/api/cqai-publisher/video-preview/${videoSource.kind}/${encodeURIComponent(videoSource.kind === "work" ? videoSource.workId : videoSource.localVideoId)}`;
			const videoSourceName = videoSource?.kind === "local" ? videoSource.fileName : videoSource ? "e剪宝成片" : void 0;
			const sameServerAccounts = [...accountIds].sort().join("\0") === [...request.accountIds].sort().join("\0");
			const allWarnings = [.../* @__PURE__ */ new Set([...sameServerAccounts ? request.warnings : [], ...warnings])];
			const canChoose = request.state === "awaiting-confirmation" && !uncertain;
			const accountCount = submission?.targets.length ?? selectedAccounts.length;
			const contentExcerpt = (request.content.contentType === "video" ? request.content.description : request.content.summary || request.content.body)?.replace(/^\s{0,3}#{1,6}\s+/gmu, "").replace(/\s+/gu, " ").slice(0, 110);
			const statusMessage = submissionStatusMessage(request);
			const notes = [...new Set([request.message && (onlyToutiao(request) && request.state === "uncertain" ? "任务未完成，请从发布历史打开平台稿件核对，勿重复提交" : request.message), submission?.message].filter((value) => !!value))];
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "pub-agent-publication",
				"aria-label": "Agent 发布确认",
				"aria-busy": busy || loading,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("style", {
						"data-plugin": STYLE_OWNER,
						"data-plugin-css": STYLE_ID,
						children: cardCss
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: canChoose ? "发布确认" : "本次发布" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "pub-agent-publication-status",
						role: "status",
						"aria-live": "polite",
						"aria-atomic": "true",
						children: busy ? pendingAction === "cancel" ? "正在取消…" : "正在提交…" : statusLabel(request, uncertain, pendingAction === "cancel")
					})] }),
					statusMessage && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-agent-publication-notes",
						children: statusMessage
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "pub-agent-publication-content",
						"aria-label": "本次发布内容",
						"aria-describedby": canChoose && contentProblems.length ? `${id}-content-errors` : void 0,
						children: [
							canChoose && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", {
								className: "pub-agent-publication-step",
								children: "1 核对内容"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "pub-agent-publication-title",
								children: submission?.title || request.content.title || "未填写标题"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
								className: "pub-agent-publication-notes",
								children: [
									CONTENT_LABELS[request.content.contentType],
									" · 第 ",
									request.content.revision,
									" 版 · ",
									request.content.assets.length,
									" 张图片"
								]
							}),
							contentExcerpt && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "pub-agent-publication-excerpt",
								children: contentExcerpt
							}),
							douyinSummary && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
								className: "pub-agent-publication-summary",
								"aria-label": "本次抖音摘要",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "抖音摘要" }), douyinSummary]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
								className: "pub-agent-publication-preview",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: "查看全文和平台版本" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										className: "pub-agent-publication-notes",
										children: submission ? "预览为提交时的本地内容，最终显示请到平台后台核对。" : "核对主稿和各平台版本，平台调整见提交方式下方。"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
										htmlFor: `${id}-preview`,
										children: "预览版本"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
										id: `${id}-preview`,
										value: preview,
										onChange: (event) => setPreview(event.target.value),
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: "master",
											children: "主稿"
										}), previewPlatforms.map((platform) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
											value: platform,
											children: [PLATFORM_LABELS[platform], request.content.platformVariants?.[platform] ? " · 平台版本" : " · 跟随主稿"]
										}, platform))]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "pub-agent-publication-preview-body",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherContentPreview, {
											content: previewContent,
											platform: preview === "master" ? void 0 : preview,
											videoSourceName,
											videoPreviewUrl
										})
									}),
									preview !== "tt" && previewContent.summary && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
										className: "pub-agent-publication-summary",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "摘要" }), previewContent.summary]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("dl", {
										className: "pub-agent-publication-metadata",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: "内容声明" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: STATEMENT_LABELS[previewContent.creativeStatement] })] }),
											previewContent.contentType === "video" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: "视频号短标题" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: previewContent.shortTitle || "未填写" })] }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: "图片素材" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: previewContent.assets.length ? previewContent.assets.map((asset) => asset.name).join("、") : "无" })] }),
											preview !== "master" && Object.entries(previewContent.platformFields[preview] ?? {}).map(([field, value]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: FIELD_LABELS$1[field] ?? field }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: value || "未填写" })] }, field))
										]
									})
								]
							}),
							canChoose && contentProblems.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
								id: `${id}-content-errors`,
								className: "pub-agent-publication-error",
								children: [...new Set(contentProblems)].map((problem) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: problem }, problem))
							})
						]
					}),
					!canChoose ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "pub-agent-publication-targets",
						"aria-label": submission ? "已提交目标账号" : "本次目标账号",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("strong", { children: [
							submission ? "已提交目标账号" : "本次目标账号",
							" · ",
							accountCount,
							" 个"
						] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", { children: submission ? submission.targets.map((target) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [
							PLATFORM_LABELS[target.platform],
							" · ",
							target.accountName
						] }, target.accountId)) : selectedAccounts.map((account) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [
							PLATFORM_LABELS[account.platform],
							" · ",
							account.displayName
						] }, account.id)) })]
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("fieldset", {
						disabled: !editable,
						className: "pub-agent-publication-targets",
						"aria-describedby": accountProblems.length ? `${id}-account-errors` : void 0,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("legend", { children: ["2 选择账号 ", /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: "pub-agent-publication-notes",
								children: [
									"· 已选 ",
									accountCount,
									" 个"
								]
							})] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "pub-agent-publication-platforms",
								children: platforms.map((platform) => {
									const selected = selectedAccounts.find((account) => account.platform === platform);
									const selectedProblem = selected && accountProblem(request, selected, mode);
									return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("fieldset", {
										className: "pub-agent-publication-platform",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("legend", { children: PLATFORM_LABELS[platform] }),
											selected && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
												className: "pub-agent-publication-selected-account",
												children: [selected.displayName, /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: selectedProblem || "已登录" })]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
												className: "pub-agent-publication-account-options",
												open: !selected || !!selectedProblem,
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: selected ? "更换账号" : "选择账号" }),
													/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
														type: "radio",
														name: `${id}-account-${platform}`,
														checked: !selected,
														onChange: () => changeAccount(platform, "")
													}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "不提交到此平台" })] }),
													request.accounts.filter((account) => account.platform === platform).map((account) => {
														const problem = accountProblem(request, account, mode);
														return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
															type: "radio",
															name: `${id}-account-${platform}`,
															value: account.id,
															checked: accountIds.includes(account.id),
															disabled: !!problem,
															onChange: () => changeAccount(platform, account.id)
														}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [account.displayName, /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("small", { children: [problem || "已登录", account.loginError ? ` · ${account.loginError}` : ""] })] })] }, account.id);
													}),
													!request.accounts.some((account) => account.platform === platform) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "尚无账号，请登录该平台后让 Agent 重新准备。" })
												]
											})
										]
									}, platform);
								})
							}),
							platforms.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "尚无发布账号，请先在平台账号管理中登录。" }),
							accountProblems.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
								id: `${id}-account-errors`,
								className: "pub-agent-publication-error",
								children: [...new Set(accountProblems)].map((problem) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: problem }, problem))
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "pub-agent-publication-choice",
						"aria-label": "本次提交方式",
						children: [
							canChoose && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("fieldset", {
								disabled: !editable,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("legend", {
										className: "pub-agent-publication-step",
										children: "3 确认方式"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
										htmlFor: `${id}-mode`,
										children: "提交方式"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
										id: `${id}-mode`,
										value: mode,
										"aria-describedby": `${id}-effective-mode`,
										onChange: (event) => {
											setMode(event.target.value);
											setError("");
										},
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: "publish",
											children: "立即发布"
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: "draft",
											children: "转存草稿"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
								id: `${id}-effective-mode`,
								className: "pub-agent-publication-effective",
								children: [
									"本次实际提交方式：",
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: effectiveMode === "draft" ? "转存草稿" : "立即发布" }),
									!submission && effectiveMode !== mode && "。文章需要按平台要求调整，将整批转存草稿供你核对。",
									submission?.requestedMode === "publish" && submission.mode === "draft" && (!onlyToutiao(request) || !!submission.adjustments?.length) && "。本次已按平台要求转存草稿供你核对。"
								]
							}),
							allWarnings.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
								className: "pub-agent-publication-notes",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("summary", { children: [
									submission ? "提交时说明" : "平台调整说明",
									" · ",
									allWarnings.length,
									" 项"
								] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", { children: allWarnings.map((warning) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: warning }, warning)) })]
							})
						]
					}),
					request.errors.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
						className: "pub-agent-publication-notes",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("summary", { children: [
							"准备请求时发现的问题 · ",
							request.errors.length,
							" 项"
						] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", { children: request.errors.map((problem, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: problem }, `${index}-${problem}`)) })]
					}),
					notes.map((note) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-agent-publication-notes",
						children: note
					}, note)),
					!!submission?.adjustments?.length && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
						className: "pub-agent-publication-notes",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: "查看已执行的平台调整" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
							"aria-label": "已提交平台调整",
							children: submission.adjustments.flatMap((adjustment) => adjustment.messages.map((message) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [
								submission.targets.find((target) => target.accountId === adjustment.accountId)?.accountName ?? "目标账号",
								"：",
								message
							] }, `${adjustment.accountId}-${message}`)))
						})]
					}),
					request.state === "stale" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						role: "status",
						children: "请让 Agent 根据最新内容重新生成发布确认卡片。"
					}),
					(uncertain || request.state === "uncertain" || submission?.state === "unknown") && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						role: "status",
						children: onlyToutiao(request) ? "任务未完成，请从发布历史打开平台稿件核对，勿重复提交。" : "本次结果尚未确认，请刷新状态并到平台后台核对。"
					}),
					error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-agent-publication-error",
						role: "alert",
						children: error
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-agent-publication-actions",
						children: [canChoose && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							className: "pub-agent-publication-confirm",
							type: "button",
							size: "sm",
							variant: "primary",
							disabled: !ready,
							onClick: () => void mutate("confirm"),
							children: busy && pendingAction === "confirm" ? "正在提交…" : `确认${effectiveMode === "draft" ? "转存草稿" : "发布"} · ${accountCount} 个账号`
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							type: "button",
							size: "sm",
							variant: "outline",
							disabled: !editable,
							onClick: () => void mutate("cancel"),
							children: "取消本次发布"
						})] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							type: "button",
							size: "sm",
							variant: "outline",
							disabled: busy || loading,
							onClick: () => void refresh(),
							children: loading ? "正在刷新…" : "刷新状态"
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-agent-publication-footnote",
						children: "提交队列和本机执行状态不代表平台最终发布成功，请到各平台后台核对。"
					})
				]
			});
		}
		const cardCss = `${contentPreviewCss}
.pub-agent-publication { --pub-border: var(--dsw-alias-border-l2, #e4e6e9); --pub-surface: var(--dsw-alias-bg-layer-1, #fff); --pub-soft: var(--dsw-alias-bg-module-platform, #f5f6f7); --pub-text: var(--dsw-alias-label-primary, #111318); --pub-secondary-text: var(--dsw-alias-label-secondary, #535961); display: grid; gap: 12px; width: 100%; min-width: 0; box-sizing: border-box; padding: 14px; border: 1px solid var(--pub-border); border-radius: 12px; background: var(--pub-surface); color: var(--pub-text); font: inherit; font-size: 13px; line-height: 1.6; overflow-wrap: anywhere; }
.pub-agent-publication * { box-sizing: border-box; }
.pub-agent-publication p, .pub-agent-publication ul, .pub-agent-publication dl { margin: 0; }
.pub-agent-publication header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 6px 12px; }
.pub-agent-publication header > strong { font-size: 14px; }
.pub-agent-publication header > span, .pub-agent-publication-footnote, .pub-agent-publication-notes { color: var(--pub-secondary-text); }
.pub-agent-publication-status { padding: 2px 8px; border-radius: 6px; background: var(--pub-soft); }
.pub-agent-publication-content { display: grid; gap: 6px; min-width: 0; }
.pub-agent-publication-step { display: block; font-weight: 600; }
.pub-agent-publication-title { font-size: 14px; font-weight: 600; }
.pub-agent-publication-excerpt { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; color: var(--pub-secondary-text); }
.pub-agent-publication summary { cursor: pointer; font-weight: 500; }
.pub-agent-publication select { width: 100%; min-width: 0; min-height: 34px; padding: 5px 8px; border: 1px solid var(--pub-border); border-radius: 8px; background: var(--pub-surface); color: inherit; font: inherit; }
.pub-agent-publication :is(button, input, select, summary):focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary, #4176e6); outline-offset: 2px; }
.pub-agent-publication-preview > :is(label, select) { display: block; margin-top: 8px; }
.pub-agent-publication-preview > summary { padding: 4px 0; }
.pub-agent-publication-preview > .pub-agent-publication-notes { margin-top: 6px; }
.pub-agent-publication-preview-body { max-height: 420px; margin-top: 10px; overflow: auto; min-width: 0; }
.pub-agent-publication .pub-content-preview-shell { min-height: 0; max-width: 100%; border-radius: 8px; padding: 16px; box-shadow: none; }
.pub-agent-publication .pub-content-preview-wechat { padding: 0; }
.pub-agent-publication :is(.pub-content-preview-title, .pub-wechat-preview-title) { font-size: 18px; }
.pub-agent-publication-summary { padding-top: 10px; }
.pub-agent-publication-summary > strong { display: block; }
.pub-agent-publication .pub-agent-publication-metadata { display: grid; gap: 6px; padding-top: 10px; color: var(--pub-secondary-text); }
.pub-agent-publication-metadata > div { display: grid; grid-template-columns: 64px minmax(0, 1fr); gap: 8px; }
.pub-agent-publication-metadata dd { min-width: 0; margin: 0; }
.pub-agent-publication fieldset { min-width: 0; margin: 0; padding: 0; border: 0; }
.pub-agent-publication-targets > legend { margin-bottom: 8px; font-weight: 600; }
.pub-agent-publication-targets > legend > span { font-weight: 400; }
.pub-agent-publication-targets > ul { padding-left: 18px; margin-top: 8px; }
.pub-agent-publication-platforms { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr)); gap: 8px; }
.pub-agent-publication .pub-agent-publication-platform { padding: 6px 10px; border: 1px solid var(--pub-border); border-radius: 8px; }
.pub-agent-publication-platform legend { padding: 0 4px; }
.pub-agent-publication-platform label { display: grid; grid-template-columns: 18px minmax(0, 1fr); align-items: start; gap: 8px; min-height: 32px; padding: 6px 0; cursor: pointer; }
.pub-agent-publication input { margin: 4px 0 0; accent-color: var(--dsw-alias-state-business-primary, #4176e6); }
.pub-agent-publication-platform small { display: block; color: var(--pub-secondary-text); }
.pub-agent-publication-selected-account { padding: 4px 0; font-weight: 500; }
.pub-agent-publication-selected-account small { font-weight: 400; }
.pub-agent-publication-account-options > summary { min-height: 28px; padding: 3px 0; color: var(--pub-secondary-text); font-size: 12px; }
.pub-agent-publication-platform label:has(input:disabled) { cursor: default; }
.pub-agent-publication-choice { display: grid; gap: 8px; padding: 10px; border-radius: 8px; background: var(--pub-soft); }
.pub-agent-publication-choice fieldset { display: grid; gap: 6px; }
.pub-agent-publication-choice legend { margin-bottom: 6px; }
.pub-agent-publication-choice label { font-size: 12px; color: var(--pub-secondary-text); }
.pub-agent-publication-notes ul, ul.pub-agent-publication-notes { padding-left: 18px; }
.pub-agent-publication-error { color: var(--dsw-alias-state-error-primary, #dc2626); }
ul.pub-agent-publication-error { padding-left: 18px; }
.pub-agent-publication-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.pub-agent-publication-actions > button { flex: 0 1 auto; min-height: 34px; }
.pub-agent-publication-actions > .pub-agent-publication-confirm { flex: 1 1 180px; }
.pub-agent-publication-actions > button:disabled { opacity: .5; cursor: not-allowed; }
.pub-agent-publication-footnote { font-size: 12px; }
`;
		//#endregion
		//#region src/client/agent-publication-turn-tail.tsx
		/** Read official paired Tool results, including nested calls, without reconstructing the transcript. */
		function publicationRequestIds(rows) {
			const ids = /* @__PURE__ */ new Set();
			const visit = (block) => {
				if ("kind" in block && block.kind === "tool-result" && block.call?.name === "publisher_request_publication") {
					const requestId = parseAgentPublicationRequestId(block);
					if (requestId) ids.add(requestId);
				}
				block.subCalls.forEach(visit);
			};
			rows.forEach((row) => visit(row.root));
			return [...ids];
		}
		/** The official Turn tail stays visible when a completed Turn's Tool process is folded. */
		function AgentPublicationTurnTail({ turn, sessionId, useChat }) {
			const nodes = useChat((snapshot) => snapshot.nodes);
			const source = (0, react.useMemo)(() => nodes.turnDataSource(turn.turn, "tool-call"), [nodes, turn.turn]);
			const requestIds = publicationRequestIds((0, react.useSyncExternalStore)(source.subscribe, source.getSnapshot, source.getSnapshot));
			if (requestIds.length === 0) return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "pub-agent-publication-tail",
				"aria-label": "本轮发布确认",
				style: {
					display: "grid",
					gap: 12,
					minWidth: 0,
					width: "100%"
				},
				children: requestIds.map((requestId) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AgentPublicationCard, {
					sessionId,
					requestId
				}, `${sessionId}/${requestId}`))
			});
		}
		//#endregion
		//#region src/content-targets.ts
		/** Account choices are independent of the Worker capability/acceptance gate. */
		const CONTENT_ACCOUNT_PLATFORMS = {
			article: [
				"juejin",
				"blbl",
				"dy",
				"tt",
				"bjh",
				"wxmp"
			],
			"image-note": [
				"xhs",
				"dy",
				"ks",
				"wxmp"
			]
		};
		function selectedContentAccounts(contentType, accounts, selection) {
			return CONTENT_ACCOUNT_PLATFORMS[contentType].flatMap((platform) => {
				const account = accounts.find((item) => item.platform === platform && item.id === selection[platform]);
				return account ? [account] : [];
			});
		}
		function contentModeAvailable(platform, contentType, mode, capabilities) {
			return capabilities.some((item) => item.platform === platform && item.modes[contentType]?.includes(mode));
		}
		//#endregion
		//#region src/client/account-platform-order.ts
		/** Show requested targets first while leaving every supported platform available for manual changes. */
		function accountPlatformOrder(contentType, intendedPlatforms) {
			const allowed = CONTENT_ACCOUNT_PLATFORMS[contentType];
			const requested = intendedPlatforms?.filter((platform) => allowed.includes(platform)) ?? [];
			return [.../* @__PURE__ */ new Set([...requested, ...allowed])];
		}
		//#endregion
		//#region src/client/article-image.ts
		/** Normalize article assets before they enter the shared, immutable content package. */
		async function articleUploadFile(file) {
			if (file.type !== "image/webp" && !/\.webp$/iu.test(file.name)) return file;
			let bitmap;
			try {
				bitmap = await createImageBitmap(file);
			} catch {
				throw new Error("WebP 图片无法解码，请换一张图片");
			}
			try {
				const canvas = document.createElement("canvas");
				canvas.width = bitmap.width;
				canvas.height = bitmap.height;
				const context = canvas.getContext("2d");
				if (!context) throw new Error("当前环境无法转换 WebP 图片");
				context.fillStyle = "#fff";
				context.fillRect(0, 0, canvas.width, canvas.height);
				context.drawImage(bitmap, 0, 0);
				const blob = await new Promise((resolve, reject) => {
					canvas.toBlob((value) => value ? resolve(value) : reject(/* @__PURE__ */ new Error("WebP 转换失败")), "image/jpeg", .92);
				});
				if (blob.type !== "image/jpeg" || blob.size < 1) throw new Error("WebP 转换失败");
				if (blob.size > 20 * 1024 * 1024) throw new Error("转换后的 JPEG 超过 20MB，请缩小图片后重试");
				return new File([blob], file.name.replace(/\.webp$/iu, "") + ".jpg", { type: "image/jpeg" });
			} finally {
				bitmap.close();
			}
		}
		//#endregion
		//#region src/client/project-directory-info.tsx
		const APP_LABELS = {
			finder: "访达",
			explorer: "文件资源管理器",
			filemanager: "文件管理器",
			cursor: "Cursor",
			vscode: "VS Code",
			vscodeinsiders: "VS Code Insiders",
			windsurf: "Windsurf",
			zed: "Zed",
			sublimetext: "Sublime Text",
			xcode: "Xcode",
			androidstudio: "Android Studio",
			intellij: "IntelliJ IDEA",
			pycharm: "PyCharm",
			webstorm: "WebStorm",
			phpstorm: "PhpStorm",
			goland: "GoLand",
			rider: "Rider",
			rustrover: "RustRover",
			fork: "Fork",
			sourcetree: "Sourcetree",
			github: "GitHub Desktop",
			tower: "Tower",
			gitkraken: "GitKraken",
			smartgit: "SmartGit",
			sublimemerge: "Sublime Merge",
			ghostty: "Ghostty",
			warp: "Warp",
			iterm: "iTerm",
			kitty: "Kitty",
			terminal: "终端",
			windowsterminal: "Windows Terminal",
			gitbash: "Git Bash",
			gnometerminal: "GNOME Terminal",
			konsole: "Konsole"
		};
		function hostUrl(route) {
			const origin = globalThis.location?.origin;
			return new URL(route, origin && origin !== "null" ? origin : "http://dsh.internal").toString();
		}
		function AppIcon({ id }) {
			const [failed, setFailed] = (0, react.useState)(false);
			return failed ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.7",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
					x: "3",
					y: "3",
					width: "18",
					height: "18",
					rx: "5"
				})
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
				width: "18",
				height: "18",
				src: hostUrl(`/open-in-app/icon/${encodeURIComponent(id)}`),
				alt: "",
				"aria-hidden": "true",
				onError: () => setFailed(true)
			});
		}
		const style = `
.pub-project-directory { margin-bottom: 18px; }
.pub-project-directory-head { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
.pub-project-directory-head h2 { margin: 0; }
.pub-project-directory-path { display: block; margin-top: 12px; color: var(--pub-secondary-text); font: 11px/1.5 var(--ds-font-family-code, monospace); overflow-wrap: anywhere; user-select: all; }
.pub-project-directory-actions { display: flex; align-items: center; gap: 8px; margin-top: 12px; }
.pub-project-directory button { font: inherit; cursor: pointer; }
.pub-project-directory-copy, .pub-project-directory-retry { min-height: 28px; padding: 4px 9px; border: 1px solid var(--pub-border); border-radius: 7px; background: var(--pub-surface); color: var(--pub-text); font-size: 12px !important; }
.pub-project-directory-open { display: inline-flex; align-items: stretch; border: 1px solid var(--pub-border); border-radius: 8px; background: var(--pub-surface); overflow: hidden; }
.pub-project-directory-open button { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 28px; padding: 4px 9px; border: 0; background: transparent; color: var(--pub-text); font-size: 12px; white-space: nowrap; }
.pub-project-directory-open button + button { padding-inline: 6px; border-left: 1px solid var(--pub-border); }
.pub-project-directory-open button:hover:not(:disabled), .pub-project-directory-copy:hover { background: var(--pub-soft); }
.pub-project-directory-open button:disabled { opacity: .45; cursor: not-allowed; }
.pub-project-directory-open img, .pub-project-directory-open svg { flex: none; object-fit: contain; }
.pub-project-directory-status { margin: 8px 0 0; color: var(--pub-tertiary-text); font-size: 12px; }
.pub-project-directory-error { margin: 8px 0 0; color: var(--dsw-alias-state-error-primary, #dc2626); font-size: 12px; overflow-wrap: anywhere; }
`;
		function ProjectDirectoryInfo({ contentId }) {
			const [path, setPath] = (0, react.useState)("");
			const [error, setError] = (0, react.useState)("");
			const [retry, setRetry] = (0, react.useState)(0);
			const [copyStatus, setCopyStatus] = (0, react.useState)("");
			const [apps, setApps] = (0, react.useState)(null);
			const [appsError, setAppsError] = (0, react.useState)("");
			const [selectedApp, setSelectedApp] = (0, react.useState)("");
			const [menuOpen, setMenuOpen] = (0, react.useState)(false);
			const [opening, setOpening] = (0, react.useState)(false);
			const [openError, setOpenError] = (0, react.useState)("");
			const openingRef = (0, react.useRef)(false);
			(0, react.useEffect)(() => {
				let cancelled = false;
				setPath("");
				setError("");
				setCopyStatus("");
				setOpenError("");
				api("project-workspace", { contentId }).then((result) => {
					if (!cancelled) setPath(result.path);
				}).catch((cause) => {
					if (!cancelled) setError(errorMessage(cause));
				});
				return () => {
					cancelled = true;
				};
			}, [contentId, retry]);
			(0, react.useEffect)(() => {
				let cancelled = false;
				fetch(hostUrl("/open-in-app/apps"), { headers: { accept: "application/json" } }).then(async (response) => {
					if (!response.ok) throw new Error(`HTTP ${response.status}`);
					const result = await response.json();
					if (!Array.isArray(result.apps)) throw new Error("应用列表格式无效");
					if (!cancelled) setApps(result.apps.filter((id) => typeof id === "string"));
				}).catch((cause) => {
					if (!cancelled) {
						setApps([]);
						setAppsError(errorMessage(cause));
					}
				});
				return () => {
					cancelled = true;
				};
			}, []);
			const copy = async () => {
				try {
					await navigator.clipboard.writeText(path);
					setCopyStatus("已复制路径");
				} catch {
					setCopyStatus("复制失败，请手动选中路径");
				}
			};
			const available = (apps ?? []).filter((id) => APP_LABELS[id]);
			const current = selectedApp && available.includes(selectedApp) ? selectedApp : available.find((id) => id === "finder" || id === "explorer" || id === "filemanager") ?? available[0];
			const openDirectory = async (appId) => {
				if (!path || openingRef.current) return;
				openingRef.current = true;
				setOpening(true);
				setOpenError("");
				try {
					const response = await fetch(hostUrl("/open-in-app/open"), {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({
							app: appId,
							path
						})
					});
					if (!response.ok) throw new Error(`打开失败（HTTP ${response.status}）`);
				} catch (cause) {
					setOpenError(errorMessage(cause));
				} finally {
					openingRef.current = false;
					setOpening(false);
				}
			};
			const items = available.map((id) => ({
				id,
				label: APP_LABELS[id],
				icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AppIcon, { id })
			}));
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(EditorSection, {
				title: "项目目录",
				className: "pub-project-directory",
				hint: error || openError ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "pub-warn",
					role: "status",
					children: error ? "目录不可用" : "打开失败"
				}) : "打开 / 复制路径",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("style", { children: style }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pub-project-directory-head",
						children: path && current && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
							open: menuOpen,
							align: "end",
							dense: true,
							portal: true,
							selection: "fill",
							onClose: () => setMenuOpen(false),
							items,
							selectedId: current,
							onSelect: (id) => {
								setMenuOpen(false);
								if (openingRef.current) return;
								setSelectedApp(id);
								openDirectory(id);
							},
							anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pub-project-directory-open",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									"aria-label": `在${APP_LABELS[current]}中打开项目目录`,
									disabled: opening,
									onClick: () => void openDirectory(current),
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(AppIcon, { id: current }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "打开文件夹" })]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "选择打开项目目录的应用",
									"aria-haspopup": "menu",
									"aria-expanded": menuOpen,
									disabled: opening,
									onClick: () => setMenuOpen((value) => !value),
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutlineMedium, { size: 12 })
								})]
							})
						})
					}),
					error ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
						className: "pub-project-directory-error",
						role: "alert",
						children: [
							"项目目录不可用：",
							error,
							" ",
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: "pub-project-directory-retry",
								type: "button",
								onClick: () => setRetry((value) => value + 1),
								children: "重试"
							})
						]
					}) : path ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
							className: "pub-project-directory-path",
							children: path
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pub-project-directory-actions",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: "pub-project-directory-copy",
								type: "button",
								onClick: () => void copy(),
								children: "复制路径"
							}), copyStatus && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								role: "status",
								children: copyStatus
							})]
						}),
						apps === null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "pub-project-directory-status",
							role: "status",
							children: "正在检查可打开的应用…"
						}),
						apps !== null && !current && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
							className: "pub-project-directory-status",
							role: "status",
							children: [appsError ? `暂时无法读取本机应用：${appsError}` : "本机没有可用的打开应用", "；仍可复制路径。"]
						}),
						openError && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "pub-project-directory-error",
							role: "alert",
							children: openError
						})
					] }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-project-directory-status",
						role: "status",
						children: "正在读取项目目录…"
					})
				]
			}, contentId);
		}
		//#endregion
		//#region ../cqai-dsh-plugin-imagegen/src/history-origin.ts
		function generationOrigin(value) {
			const hasCanvas = value.canvas !== void 0;
			const ecommerceFields = [
				value.projectId,
				value.projectName,
				value.slotKey,
				value.slotLabel
			];
			const hasEcommerce = value.workflow === "ecommerce" || ecommerceFields.some((field) => field !== void 0);
			if (value.workflow !== void 0 && value.workflow !== "ecommerce") return "unknown";
			if (hasCanvas && hasEcommerce) return "unknown";
			if (hasCanvas) {
				if (value.canvas === null || typeof value.canvas !== "object") return "unknown";
				const canvasId = value.canvas.canvasId;
				return typeof canvasId === "string" && canvasId.trim() !== "" ? "canvas" : "unknown";
			}
			if (hasEcommerce) {
				if (ecommerceFields.some((field) => field !== void 0 && (typeof field !== "string" || field.trim() === ""))) return "unknown";
				return "ecommerce";
			}
			return "normal";
		}
		//#endregion
		//#region src/client/imagegen-library.ts
		/** Read existing e图宝 results through its same-origin API; never starts generation. */
		const BASE = "/api/dsh-imagegen";
		const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
		const LABELS = {
			normal: "普通生成",
			canvas: "画布生成",
			ecommerce: "商品套图",
			gallery: "图库收藏",
			unknown: "生成历史"
		};
		const HISTORY_FILE = "[a-zA-Z0-9][a-zA-Z0-9-]*-[0-9]+\\.(?:png|jpg|jpeg|webp|gif)";
		const RUN_ID = "(?:[a-f0-9-]{36}|legacy-[a-f0-9]{32})";
		const RUN_FILE = "[a-f0-9]{64}\\.(?:png|jpg|webp|gif|bmp)";
		const CANVAS_FILE = "[a-f0-9]{64}\\.(?:png|jpg|jpeg|webp|gif|bmp|tiff|tif)";
		const NOT_READY = "e图宝图片服务暂未就绪，请稍候或重启应用";
		const INVALID_RECORD = "e图宝生成记录格式无效，请刷新后重试";
		const IMAGE_TYPES = {
			"image/jpeg": "jpg",
			"image/png": "png",
			"image/webp": "webp"
		};
		function object(value) {
			return value !== null && typeof value === "object" && !Array.isArray(value);
		}
		function checkAborted(signal) {
			if (signal?.aborted) throw signal.reason ?? new DOMException("请求已取消", "AbortError");
		}
		function isAbort(error, signal) {
			return signal?.aborted === true || object(error) && error.name === "AbortError";
		}
		function validSource(source) {
			return typeof source === "string" && Object.hasOwn(LABELS, source);
		}
		function safeImageUrl$1(url, source) {
			if (typeof url !== "string" || /[\s%?#\\]/u.test(url)) return false;
			const history = `history/image/${HISTORY_FILE}`;
			const suffix = source === "ecommerce" ? `(?:ecommerce/asset/${RUN_ID}/${RUN_FILE}|${history})` : source === "canvas" ? `(?:canvas/asset/${CANVAS_FILE}|${history})` : source === "gallery" ? `gallery/image/${HISTORY_FILE}` : history;
			return new RegExp(`^${BASE}/${suffix}$`).test(url);
		}
		function checkResponseLocation(response, requested) {
			if (response.redirected) throw new Error("e图宝图片接口发生跳转，请刷新后重试");
			if (response.url && typeof location !== "undefined" && response.url !== new URL(requested, location.href).href) throw new Error("e图宝图片接口地址不一致，请刷新后重试");
		}
		async function jsonRequest(path, body, signal) {
			checkAborted(signal);
			let response;
			try {
				response = await fetch(path, {
					method: body === void 0 ? "GET" : "POST",
					credentials: "same-origin",
					redirect: "error",
					signal,
					...body === void 0 ? {} : {
						headers: { "content-type": "application/json" },
						body: JSON.stringify(body)
					}
				});
			} catch (error) {
				if (isAbort(error, signal)) throw error;
				throw new Error("无法读取 e图宝生成记录，请稍后重试");
			}
			checkAborted(signal);
			checkResponseLocation(response, path);
			if (response.status === 404 || response.status === 503 || !response.headers.get("content-type")?.includes("application/json")) throw new Error(NOT_READY);
			let result;
			try {
				result = await response.json();
			} catch (error) {
				if (isAbort(error, signal)) throw error;
				throw new Error(INVALID_RECORD);
			}
			checkAborted(signal);
			if (!object(result)) throw new Error(INVALID_RECORD);
			if (!response.ok || result.ok !== true) throw new Error(typeof result.message === "string" && result.message.trim() ? result.message : "读取 e图宝生成记录失败，请稍后重试");
			return result;
		}
		function records(value) {
			if (!Array.isArray(value) || value.some((item) => !object(item))) throw new Error(INVALID_RECORD);
			return value;
		}
		function timestamp(value) {
			if (typeof value !== "number" || !Number.isFinite(value) || value < 0) throw new Error(INVALID_RECORD);
			return value;
		}
		function requiredId(value) {
			if (typeof value !== "string" || !value.trim()) throw new Error(INVALID_RECORD);
			return value;
		}
		function promptOf(value) {
			if (typeof value !== "string") throw new Error(INVALID_RECORD);
			return value;
		}
		function displayName(value, fallback) {
			return value.replace(/[\r\n\t]+/gu, " ").trim().slice(0, 60) || fallback;
		}
		function imageHash(value) {
			return typeof value === "string" && /^[a-f0-9]{64}$/u.test(value) ? value : void 0;
		}
		function assetHash(url) {
			return url.match(/^\/api\/dsh-imagegen\/(?:canvas\/asset|ecommerce\/asset\/[^/]+)\/([a-f0-9]{64})\./u)?.[1];
		}
		function representativePriority(image) {
			if (image.url.startsWith(`${BASE}/ecommerce/asset/`)) return 0;
			if (image.url.startsWith(`${BASE}/history/image/`)) return 1;
			if (image.url.startsWith(`${BASE}/canvas/asset/`)) return 2;
			return 3;
		}
		function uniqueImages(images) {
			const merge = (existing, image) => {
				const representative = representativePriority(image) < representativePriority(existing) ? image : existing;
				const sha256 = imageHash(existing.sha256) ?? imageHash(image.sha256);
				return {
					...representative,
					...sha256 === void 0 ? {} : { sha256 },
					createdAt: Math.max(existing.createdAt, image.createdAt),
					searchText: [...new Set([
						existing.searchText,
						existing.name,
						existing.prompt,
						image.searchText,
						image.name,
						image.prompt
					].filter(Boolean))].join("\n")
				};
			};
			const urls = /* @__PURE__ */ new Map();
			for (const image of images.sort((left, right) => right.createdAt - left.createdAt)) {
				const existing = urls.get(image.url);
				urls.set(image.url, existing ? merge(existing, image) : image);
			}
			const groups = /* @__PURE__ */ new Map();
			for (const image of urls.values()) {
				const hash = imageHash(image.sha256) ?? assetHash(image.url);
				const identity = hash === void 0 ? image.url : `sha256:${hash}`;
				const existing = groups.get(identity);
				if (!existing) {
					groups.set(identity, image);
					continue;
				}
				groups.set(identity, merge(existing, image));
			}
			return [...groups.values()].sort((left, right) => right.createdAt - left.createdAt);
		}
		function imagesFromEntry(entry, source) {
			const id = requiredId(entry.id);
			const createdAt = timestamp(entry.createdAt);
			const prompt = promptOf(entry.prompt);
			return records(entry.images).map((image, index) => {
				if (!safeImageUrl$1(image.url, source)) throw new Error("e图宝图片地址无效，已停止读取");
				return {
					id: `${source}:${id}:${index}`,
					url: image.url,
					name: `${displayName(prompt, LABELS[source])}-${index + 1}`,
					prompt,
					createdAt,
					source,
					label: LABELS[source],
					...imageHash(image.sha256) === void 0 ? {} : { sha256: imageHash(image.sha256) }
				};
			});
		}
		async function historyImages(scope, signal) {
			return records((await jsonRequest(`${BASE}/history/list`, {
				includeImageHashes: true,
				...scope === void 0 ? {} : { scope }
			}, signal)).entries).flatMap((entry) => imagesFromEntry(entry, scope ?? generationOrigin(entry)));
		}
		async function galleryImages(signal) {
			return records((await jsonRequest(`${BASE}/gallery/list`, { includeImageHashes: true }, signal)).entries).flatMap((entry) => imagesFromEntry(entry, "gallery"));
		}
		async function canvasImages(signal) {
			const projects = records((await jsonRequest(`${BASE}/canvas/list`, {}, signal)).projects);
			const groups = Array.from({ length: projects.length }, () => []);
			let next = 0;
			const worker = async () => {
				for (;;) {
					checkAborted(signal);
					const index = next++;
					if (index >= projects.length) return;
					const id = requiredId(projects[index].id);
					const document = (await jsonRequest(`${BASE}/canvas/read`, { id }, signal)).document;
					if (!object(document) || document.id !== id) throw new Error(INVALID_RECORD);
					const updatedAt = timestamp(document.updatedAt);
					const title = displayName(typeof document.title === "string" ? document.title : "", LABELS.canvas);
					groups[index] = records(document.nodes).flatMap((node) => {
						if (node.type !== "image" && node.type !== "file") return [];
						const metadata = node.metadata;
						if (!object(metadata) || !object(metadata.asset)) return [];
						const asset = metadata.asset;
						if (asset.origin !== "generated" || typeof asset.mime !== "string" || !/^image\/(?:png|jpeg|webp|gif|bmp|tiff)(?:;|$)/iu.test(asset.mime)) return [];
						if (!safeImageUrl$1(asset.url, "canvas") || !asset.url.startsWith(`${BASE}/canvas/asset/`)) throw new Error("e图宝图片地址无效，已停止读取");
						const nodeId = requiredId(node.id);
						const name = displayName(typeof asset.name === "string" ? asset.name : typeof node.title === "string" ? node.title : "", title);
						const prompt = typeof metadata.prompt === "string" ? metadata.prompt : name;
						const createdAt = object(metadata.skill) && metadata.skill.createdAt !== void 0 ? timestamp(metadata.skill.createdAt) : updatedAt;
						return [{
							id: `canvas:${id}:${nodeId}`,
							url: asset.url,
							name,
							prompt,
							createdAt,
							source: "canvas",
							label: LABELS.canvas
						}];
					});
				}
			};
			await Promise.all(Array.from({ length: Math.min(3, projects.length) }, worker));
			return groups.flat();
		}
		async function ecommerceImages(signal) {
			const summaries = records((await jsonRequest(`${BASE}/ecommerce/list`, void 0, signal)).runs);
			const groups = Array.from({ length: summaries.length }, () => []);
			let next = 0;
			const worker = async () => {
				for (;;) {
					checkAborted(signal);
					const index = next++;
					if (index >= summaries.length) return;
					const summary = summaries[index];
					const id = requiredId(summary.id);
					if (!new RegExp(`^${RUN_ID}$`).test(id)) throw new Error(INVALID_RECORD);
					const run = (await jsonRequest(`${BASE}/ecommerce/get?id=${encodeURIComponent(id)}`, void 0, signal)).run;
					if (!object(run) || run.id !== id) throw new Error(INVALID_RECORD);
					const createdAt = timestamp(run.createdAt);
					const product = displayName(typeof summary.name === "string" ? summary.name : "", LABELS.ecommerce);
					groups[index] = records(run.slots).flatMap((slot) => {
						const key = requiredId(slot.key);
						const request = slot.request;
						if (!object(request)) throw new Error(INVALID_RECORD);
						const prompt = promptOf(request.prompt);
						const slotName = displayName(typeof slot.label === "string" ? slot.label : "", "图片");
						const outputs = (value, attemptPrompt, at, attempt) => records(value).map((image, imageIndex) => {
							if (!safeImageUrl$1(image.url, "ecommerce") || !image.url.startsWith(`${BASE}/ecommerce/asset/${id}/`)) throw new Error("e图宝图片地址无效，已停止读取");
							return {
								id: `ecommerce:${id}:${key}:${attempt === void 0 ? "" : `attempt-${attempt}:`}${imageIndex}`,
								url: image.url,
								name: `${product}-${slotName}${attempt === void 0 ? "" : `-第${attempt}次`}-${imageIndex + 1}`,
								prompt: attemptPrompt,
								createdAt: at,
								source: "ecommerce",
								label: LABELS.ecommerce
							};
						});
						return [...outputs(slot.images, prompt, createdAt), ...records(slot.attempts ?? []).flatMap((attempt) => {
							if (!object(attempt.request) || !Number.isSafeInteger(attempt.number) || Number(attempt.number) < 1) throw new Error(INVALID_RECORD);
							return outputs(attempt.images, promptOf(attempt.request.prompt), timestamp(attempt.finishedAt ?? attempt.startedAt ?? createdAt), Number(attempt.number));
						})];
					});
				}
			};
			await Promise.all(Array.from({ length: Math.min(3, summaries.length) }, worker));
			return groups.flat();
		}
		async function listImagegenImages(scope, signal) {
			if (![
				"all",
				"normal",
				"canvas",
				"ecommerce",
				"gallery"
			].includes(scope)) throw new Error("图片来源无效");
			checkAborted(signal);
			const labelled = async (label, read) => {
				try {
					return await read();
				} catch (error) {
					if (isAbort(error, signal)) throw error;
					throw new Error(`${label}读取失败：${error instanceof Error ? error.message : "请稍后重试"}`);
				}
			};
			const images = scope === "all" ? (await Promise.all([
				labelled("生成历史", () => historyImages(void 0, signal)),
				labelled(LABELS.canvas, () => canvasImages(signal)),
				labelled(LABELS.ecommerce, () => ecommerceImages(signal)),
				labelled(LABELS.gallery, () => galleryImages(signal))
			])).flat() : scope === "ecommerce" ? await ecommerceImages(signal) : scope === "gallery" ? await galleryImages(signal) : scope === "canvas" ? (await Promise.all([historyImages("canvas", signal), canvasImages(signal)])).flat() : await historyImages("normal", signal);
			checkAborted(signal);
			return uniqueImages(images);
		}
		async function readImagegenFile(image, signal) {
			if (!validSource(image.source) || !safeImageUrl$1(image.url, image.source)) throw new Error("e图宝图片地址无效，已停止读取");
			checkAborted(signal);
			let response;
			try {
				response = await fetch(image.url, {
					credentials: "same-origin",
					redirect: "error",
					signal
				});
			} catch (error) {
				if (isAbort(error, signal)) throw error;
				throw new Error("读取 e图宝图片失败，请刷新后重试");
			}
			checkAborted(signal);
			checkResponseLocation(response, image.url);
			if (response.status === 404 || response.status === 503) throw new Error("这张 e图宝图片已删除或暂时无法读取，请刷新记录");
			if (!response.ok) throw new Error("读取 e图宝图片失败，请刷新后重试");
			const mime = response.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() ?? "";
			const extension = IMAGE_TYPES[mime];
			if (!extension) throw new Error("仅支持导入 JPEG、PNG 或 WebP 图片");
			const declaredSize = Number(response.headers.get("content-length"));
			if (Number.isFinite(declaredSize) && declaredSize > MAX_IMAGE_BYTES) throw new Error("单张图片不能超过 20MB");
			let blob;
			try {
				blob = await response.blob();
			} catch (error) {
				if (isAbort(error, signal)) throw error;
				throw new Error("读取 e图宝图片失败，请刷新后重试");
			}
			checkAborted(signal);
			if (blob.size === 0) throw new Error("e图宝图片为空，请刷新记录");
			if (blob.size > MAX_IMAGE_BYTES) throw new Error("单张图片不能超过 20MB");
			const name = displayName(image.name, LABELS[image.source]).replace(/[\\/:*?"<>|\u0000-\u001f]/gu, "_").replace(/\.(?:png|jpe?g|webp|gif|bmp)$/iu, "");
			return new File([blob], `${name || "e图宝图片"}.${extension}`, { type: mime });
		}
		//#endregion
		//#region src/client/imagegen-picker-style.ts
		const imagegenPickerCss = `
.pub-imagegen-picker { --pub-border: var(--dsw-alias-border-l2, #e4e6e9); --pub-surface: var(--dsw-alias-bg-layer-1, #fff); --pub-soft: var(--dsw-alias-bg-module-platform, #f5f6f7); --pub-text: var(--dsw-alias-label-primary, #111318); --pub-secondary-text: var(--dsw-alias-label-secondary, #535961); width: min(840px, 100%); max-height: 100%; box-sizing: border-box; color: var(--pub-text); }
.pub-imagegen-picker-content { min-height: 0; overflow-y: auto; }
.pub-imagegen-picker-body { display: grid; gap: 16px; }
.pub-imagegen-picker-tools { display: grid; grid-template-columns: minmax(130px, .7fr) minmax(0, 1.3fr); gap: 12px; }
.pub-imagegen-picker-tools label { display: grid; gap: 6px; font-size: 13px; color: var(--pub-secondary-text); }
.pub-imagegen-picker-tools :is(input, select) { min-height: 40px; width: 100%; min-width: 0; box-sizing: border-box; padding: 8px 10px; border: 1px solid var(--pub-border); border-radius: 8px; background: var(--pub-surface); color: var(--pub-text); font: inherit; }
.pub-imagegen-picker :is(input, select, button):focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary, #4176e6); outline-offset: 2px; }
.pub-imagegen-picker-count { margin: 0; color: var(--pub-secondary-text); font-size: 13px; }
.pub-imagegen-picker-status { padding: 24px 12px; text-align: center; background: var(--pub-soft); border-radius: 10px; color: var(--pub-secondary-text); }
.pub-imagegen-picker-error { padding: 10px 12px; border-radius: 8px; background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #dc2626) 8%, var(--pub-surface)); color: var(--dsw-alias-state-error-primary, #dc2626); overflow-wrap: anywhere; }
.pub-imagegen-picker-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); grid-auto-rows: max-content; align-items: start; align-content: start; gap: 12px; max-height: min(54vh, 560px); overflow-y: auto; padding: 3px; }
.pub-imagegen-picker-card { min-width: 0; border: 1px solid var(--pub-border); border-radius: 10px; overflow: hidden; background: var(--pub-surface); }
.pub-imagegen-picker-card[data-selected="true"] { border-color: var(--dsw-alias-state-business-primary, #4176e6); }
.pub-imagegen-picker-choice { display: block; cursor: pointer; }
.pub-imagegen-picker-thumb { position: relative; aspect-ratio: 1; background: var(--pub-soft); overflow: hidden; }
.pub-imagegen-picker-thumb img { display: block; width: 100%; height: 100%; object-fit: contain; }
.pub-imagegen-picker-thumb[data-failed="true"] img { visibility: hidden; }
.pub-imagegen-picker-thumb[data-failed="true"]::after { content: '图片加载失败'; position: absolute; inset: 0; display: grid; place-items: center; color: var(--pub-secondary-text); font-size: 13px; }
.pub-imagegen-picker-order { position: absolute; top: 8px; right: 8px; min-width: 24px; height: 24px; display: grid; place-items: center; border-radius: 50%; background: var(--dsw-alias-state-business-primary, #4176e6); color: var(--dsw-alias-label-on-color, #fff); font-size: 12px; }
.pub-imagegen-picker-caption { display: flex; gap: 8px; align-items: flex-start; min-height: 44px; padding: 10px; font-size: 13px; }
.pub-imagegen-picker-caption input { flex: 0 0 auto; margin-top: 3px; }
.pub-imagegen-picker-name { min-width: 0; overflow-wrap: anywhere; }
.pub-imagegen-picker-name small { display: block; color: var(--pub-secondary-text); }
.pub-imagegen-picker-retry { padding: 0 10px 10px; }
@media (max-width: 520px) { .pub-imagegen-picker-tools { grid-template-columns: minmax(0, 1fr); } .pub-imagegen-picker-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; } }
`;
		//#endregion
		//#region src/client/imagegen-picker.tsx
		const SOURCES = [
			{
				value: "all",
				label: "全部生图"
			},
			{
				value: "normal",
				label: "普通生图"
			},
			{
				value: "canvas",
				label: "画布生图"
			},
			{
				value: "ecommerce",
				label: "电商套图"
			},
			{
				value: "gallery",
				label: "素材库"
			}
		];
		function ImagegenPicker({ remaining, onCancel, onImport }) {
			const id = (0, react.useId)();
			const [source, setSource] = (0, react.useState)("all");
			const [query, setQuery] = (0, react.useState)("");
			const [images, setImages] = (0, react.useState)([]);
			const [selected, setSelected] = (0, react.useState)([]);
			const [failed, setFailed] = (0, react.useState)({});
			const [attempts, setAttempts] = (0, react.useState)({});
			const [loading, setLoading] = (0, react.useState)(true);
			const [loadError, setLoadError] = (0, react.useState)("");
			const [importError, setImportError] = (0, react.useState)("");
			const [importing, setImporting] = (0, react.useState)(false);
			const [retry, setRetry] = (0, react.useState)(0);
			const [visibleLimit, setVisibleLimit] = (0, react.useState)(60);
			const alive = (0, react.useRef)(false);
			const importingRef = (0, react.useRef)(false);
			const listController = (0, react.useRef)();
			const importController = (0, react.useRef)();
			const capacity = Math.max(0, Math.min(20, remaining));
			(0, react.useEffect)(() => {
				alive.current = true;
				return () => {
					alive.current = false;
					importController.current?.abort();
				};
			}, []);
			(0, react.useEffect)(() => {
				const controller = new AbortController();
				listController.current = controller;
				setLoading(true);
				setLoadError("");
				setImages([]);
				setSelected([]);
				setFailed({});
				setAttempts({});
				setQuery("");
				setImportError("");
				setVisibleLimit(60);
				listImagegenImages(source, controller.signal).then((rows) => {
					if (!controller.signal.aborted) setImages(rows);
				}).catch((cause) => {
					if (!controller.signal.aborted) setLoadError(errorMessage(cause));
				}).finally(() => {
					if (!controller.signal.aborted) setLoading(false);
				});
				return () => {
					controller.abort();
				};
			}, [source, retry]);
			const close = () => {
				if (importingRef.current) return;
				listController.current?.abort();
				onCancel();
			};
			const toggle = (imageId, checked) => {
				if (importingRef.current || failed[imageId]) return;
				setSelected((current) => checked ? current.includes(imageId) || current.length >= capacity ? current : [...current, imageId] : current.filter((value) => value !== imageId));
				setImportError("");
			};
			const importSelected = async () => {
				if (importingRef.current || selected.length === 0 || selected.length > capacity) return;
				const chosen = selected.map((imageId) => images.find((image) => image.id === imageId)).filter((image) => !!image && !failed[image.id]);
				if (chosen.length !== selected.length) return;
				importingRef.current = true;
				setImporting(true);
				setImportError("");
				const controller = new AbortController();
				importController.current = controller;
				try {
					const result = await onImport(chosen, controller.signal);
					if (!alive.current || controller.signal.aborted) return;
					const imported = new Set(result.importedIds);
					setSelected((current) => current.filter((imageId) => !imported.has(imageId)));
					if (result.error) setImportError(`${imported.size ? `已导入 ${imported.size} 张图片，剩余 ${chosen.length - imported.size} 张未导入：` : "导入失败："}${result.error}`);
					else if (imported.size === chosen.length) onCancel();
				} catch (cause) {
					if (alive.current && !controller.signal.aborted) setImportError(`导入失败：${errorMessage(cause)}`);
				} finally {
					importingRef.current = false;
					if (alive.current) setImporting(false);
				}
			};
			const search = query.trim().toLocaleLowerCase();
			const visible = images.filter((image) => !search || `${image.prompt}\n${image.name}\n${image.searchText ?? ""}`.toLocaleLowerCase().includes(search));
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(PublisherModal, {
				open: true,
				title: "从 e图宝选择",
				description: "将已生成图片复制到当前图文草稿，按选择顺序添加。",
				closeLabel: "关闭图片选择",
				className: "pub-imagegen-picker",
				contentClassName: "pub-imagegen-picker-content",
				onClose: close,
				footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					type: "button",
					size: "sm",
					variant: "outline",
					disabled: importing,
					onClick: close,
					children: "取消"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					type: "button",
					size: "sm",
					variant: "primary",
					disabled: importing || loading || selected.length === 0 || selected.length > capacity,
					onClick: () => void importSelected(),
					children: importing ? "正在导入…" : `导入选中图片（${selected.length}）`
				})] }),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("style", {
					"data-plugin": "cqai-dsh-plugin-publisher",
					"data-plugin-css": "cqai-dsh-plugin-publisher/imagegen-picker",
					children: imagegenPickerCss
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "pub-imagegen-picker-body",
					"aria-busy": loading || importing,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pub-imagegen-picker-tools",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								htmlFor: `${id}-source`,
								children: ["图片来源", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
									id: `${id}-source`,
									disabled: importing,
									value: source,
									"data-pub-initial-focus": true,
									onChange: (event) => {
										if (event.target.value !== source) {
											listController.current?.abort();
											setSource(event.target.value);
										}
									},
									children: SOURCES.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: item.value,
										children: item.label
									}, item.value))
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								htmlFor: `${id}-search`,
								children: ["搜索图片", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									id: `${id}-search`,
									type: "search",
									placeholder: "搜索提示词或文件名",
									value: query,
									disabled: importing,
									onChange: (event) => {
										setQuery(event.target.value);
										setVisibleLimit(60);
									}
								})]
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
							className: "pub-imagegen-picker-count",
							role: "status",
							"aria-live": "polite",
							children: [
								"已选 ",
								selected.length,
								" 张 · 当前草稿还能添加 ",
								capacity,
								" 张",
								selected.length >= capacity ? " · 已达到可选数量" : ""
							]
						}),
						importing && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							role: "status",
							children: "正在逐张导入并保存，请稍候…"
						}),
						importError && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "pub-imagegen-picker-error",
							role: "alert",
							children: importError
						}),
						loading ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pub-imagegen-picker-status",
							role: "status",
							children: "正在加载图片…"
						}) : loadError ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pub-imagegen-picker-status",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
								role: "alert",
								children: ["图片加载失败：", loadError]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								type: "button",
								size: "sm",
								variant: "outline",
								onClick: () => setRetry((value) => value + 1),
								children: "重新加载"
							})]
						}) : images.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pub-imagegen-picker-status",
							children: "此来源暂无可选图片，请先在 e图宝生成或添加图片。"
						}) : visible.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pub-imagegen-picker-status",
							children: "没有匹配的图片，请修改搜索内容。"
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pub-imagegen-picker-grid",
							"aria-label": "可选图片",
							children: visible.slice(0, visibleLimit).map((image) => {
								const order = selected.indexOf(image.id);
								return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pub-imagegen-picker-card",
									"data-selected": order >= 0,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										className: "pub-imagegen-picker-choice",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "pub-imagegen-picker-thumb",
											"data-failed": !!failed[image.id],
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
												src: image.url,
												alt: "",
												loading: "lazy",
												decoding: "async",
												onLoad: () => setFailed((current) => ({
													...current,
													[image.id]: false
												})),
												onError: () => {
													setFailed((current) => ({
														...current,
														[image.id]: true
													}));
													setSelected((current) => current.filter((value) => value !== image.id));
												}
											}, attempts[image.id] ?? 0), order >= 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "pub-imagegen-picker-order",
												"aria-label": `第 ${order + 1} 张`,
												children: order + 1
											})]
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: "pub-imagegen-picker-caption",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: order >= 0,
												disabled: importing || !!failed[image.id] || order < 0 && selected.length >= capacity,
												"aria-label": `选择${image.name}`,
												onChange: (event) => toggle(image.id, event.target.checked)
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
												className: "pub-imagegen-picker-name",
												children: [image.name, /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: image.label })]
											})]
										})]
									}), failed[image.id] && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "pub-imagegen-picker-retry",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											type: "button",
											size: "sm",
											variant: "outline",
											disabled: importing,
											onClick: () => setAttempts((current) => ({
												...current,
												[image.id]: (current[image.id] ?? 0) + 1
											})),
											children: "重试图片"
										})
									})]
								}, image.id);
							})
						}),
						!loading && !loadError && visible.length > visibleLimit && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							type: "button",
							size: "sm",
							variant: "outline",
							disabled: importing,
							onClick: () => setVisibleLimit((value) => value + 60),
							children: [
								"显示更多图片（已显示 ",
								visibleLimit,
								"/",
								visible.length,
								"）"
							]
						})
					]
				})]
			});
		}
		//#endregion
		//#region src/client/content-patch.ts
		const FIELDS = [
			"title",
			"body",
			"summary",
			"tags",
			"creativeStatement",
			"articleTheme",
			"coverAssetId",
			"description",
			"shortTitle",
			"videoSource"
		];
		const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
		const VARIANT_FIELDS = [
			"title",
			"body",
			"summary",
			"tags",
			"coverAssetId",
			"assetOrder"
		];
		/** Only send fields changed by this editor, rather than a stale copy of the whole draft. */
		function changedContentFields(before, after) {
			const patch = {};
			for (const field of FIELDS) if (!same(before[field], after[field])) patch[field] = after[field] ?? null;
			const previousOrder = before.assets.map((asset) => asset.id);
			const nextOrder = after.assets.map((asset) => asset.id);
			if (!same(previousOrder, nextOrder)) patch.assetOrder = nextOrder;
			const variants = {};
			const unset = {};
			for (const platform of /* @__PURE__ */ new Set([...Object.keys(before.platformVariants ?? {}), ...Object.keys(after.platformVariants ?? {})])) {
				const prior = before.platformVariants?.[platform];
				const next = after.platformVariants?.[platform];
				if (same(prior, next)) continue;
				if (!next) {
					unset[platform] = Object.keys(prior ?? {});
					continue;
				}
				const fields = {};
				for (const field of /* @__PURE__ */ new Set([...Object.keys(prior ?? {}), ...Object.keys(next)])) {
					if (same(prior?.[field], next[field])) continue;
					if (!Object.hasOwn(next, field)) (unset[platform] ??= []).push(field);
					else fields[field] = next[field];
				}
				if (Object.keys(fields).length) variants[platform] = fields;
			}
			if (Object.keys(variants).length) patch.platformVariants = variants;
			if (Object.keys(unset).length) patch.unsetVariantFields = unset;
			const platformFields = {};
			for (const platform of /* @__PURE__ */ new Set([...Object.keys(before.platformFields), ...Object.keys(after.platformFields)])) {
				const prior = before.platformFields[platform] ?? {};
				const next = after.platformFields[platform] ?? {};
				const fields = {};
				for (const field of /* @__PURE__ */ new Set([...Object.keys(prior), ...Object.keys(next)])) if (!same(prior[field], next[field])) fields[field] = next[field] ?? null;
				if (Object.keys(fields).length) platformFields[platform] = fields;
			}
			if (Object.keys(platformFields).length) patch.platformFields = platformFields;
			return patch;
		}
		/** Preserve newer local changes made while an earlier patch is saving. */
		function mergeContentPatches(earlier, later) {
			const merged = {
				...earlier,
				...later
			};
			for (const key of ["platformVariants", "platformFields"]) {
				if (!earlier[key] && !later[key]) continue;
				const groups = { ...earlier[key] };
				for (const [platform, fields] of Object.entries(later[key] ?? {})) groups[platform] = fields === null ? null : {
					...groups[platform] ?? {},
					...fields
				};
				merged[key] = groups;
			}
			const unset = {};
			for (const platform of /* @__PURE__ */ new Set([
				...Object.keys(earlier.unsetVariantFields ?? {}),
				...Object.keys(later.unsetVariantFields ?? {}),
				...Object.keys(earlier.platformVariants ?? {}),
				...Object.keys(later.platformVariants ?? {})
			])) {
				const id = platform;
				const fields = new Set(earlier.unsetVariantFields?.[id] ?? []);
				if (earlier.platformVariants?.[id] === null && later.platformVariants?.[id]) for (const field of VARIANT_FIELDS) fields.add(field);
				if (later.platformVariants && Object.hasOwn(later.platformVariants, id)) {
					const replacement = later.platformVariants[id];
					if (replacement === null) fields.clear();
					else for (const field of Object.keys(replacement ?? {})) fields.delete(field);
				}
				for (const field of later.unsetVariantFields?.[id] ?? []) fields.add(field);
				if (fields.size) unset[id] = [...fields];
			}
			for (const [platform, fields] of Object.entries(later.unsetVariantFields ?? {})) {
				const variant = merged.platformVariants?.[platform];
				if (variant) {
					const next = { ...variant };
					for (const field of fields) delete next[field];
					merged.platformVariants = {
						...merged.platformVariants,
						[platform]: next
					};
				}
			}
			if (Object.keys(unset).length) merged.unsetVariantFields = unset;
			else delete merged.unsetVariantFields;
			return merged;
		}
		/** Overlay pending local fields on the latest Host snapshot, keeping unrelated Agent edits. */
		function applyContentPatch(content, patch) {
			const next = { ...content };
			for (const field of FIELDS) if (Object.hasOwn(patch, field)) {
				const value = patch[field];
				if (value === null) delete next[field];
				else next[field] = value;
			}
			if (patch.assetOrder) {
				const byId = new Map(content.assets.map((asset) => [asset.id, asset]));
				next.assets = [...patch.assetOrder.flatMap((id) => byId.has(id) ? [byId.get(id)] : []), ...content.assets.filter((asset) => !patch.assetOrder.includes(asset.id))];
			}
			next.platformVariants = { ...content.platformVariants };
			for (const [platform, fields] of Object.entries(patch.platformVariants ?? {})) {
				const id = platform;
				if (fields === null) {
					delete next.platformVariants[id];
					continue;
				}
				const variant = { ...next.platformVariants[id] };
				for (const [field, value] of Object.entries(fields)) if (value === null && field !== "coverAssetId") delete variant[field];
				else variant[field] = value;
				next.platformVariants[id] = variant;
			}
			for (const [platform, fields] of Object.entries(patch.unsetVariantFields ?? {})) {
				const id = platform;
				const variant = { ...next.platformVariants[id] };
				for (const field of fields) delete variant[field];
				if (Object.keys(variant).length) next.platformVariants[id] = variant;
				else delete next.platformVariants[id];
			}
			next.platformFields = { ...content.platformFields };
			for (const [platform, fields] of Object.entries(patch.platformFields ?? {})) {
				const id = platform;
				if (fields === null) {
					delete next.platformFields[id];
					continue;
				}
				const values = { ...next.platformFields[id] };
				for (const [field, value] of Object.entries(fields ?? {})) if (value === null) delete values[field];
				else values[field] = value;
				if (Object.keys(values).length) next.platformFields[id] = values;
				else delete next.platformFields[id];
			}
			return next;
		}
		//#endregion
		//#region src/client/content.tsx
		const FIELD_LABELS = {
			category: "分类",
			topic: "话题",
			original: "原创声明"
		};
		function ContentEditor({ contentType, active, selectedContentId, initialMode = "edit", intendedPlatforms, handoffGeneration, agentOpen, onToggleAgent, onDraftReady, onAgentTargetChange, onRestartAgent, onDeleteContent, onReturnToSource, onSourceNavigation, onSelectedContentChange, onOpenWritingProfile, onBack }) {
			const { showError, showSuccess, clearTip } = usePublisherTips();
			const [draft, setDraft] = (0, react.useState)();
			const draftRef = (0, react.useRef)();
			const serverDraftRef = (0, react.useRef)();
			const bodyInputRef = (0, react.useRef)(null);
			const importInputRef = (0, react.useRef)(null);
			const imageInputRef = (0, react.useRef)(null);
			const dirtyRef = (0, react.useRef)(false);
			const pendingChanges = (0, react.useRef)({});
			const inFlightChanges = (0, react.useRef)();
			const saveTask = (0, react.useRef)();
			const [editVersion, setEditVersion] = (0, react.useState)(0);
			const [tagsInput, setTagsInput] = (0, react.useState)("");
			const [accounts, setAccounts] = (0, react.useState)([]);
			const [capabilities, setCapabilities] = (0, react.useState)([]);
			const [accountsPending, setAccountsPending] = (0, react.useState)(true);
			const [capabilitiesPending, setCapabilitiesPending] = (0, react.useState)(true);
			const [accountsError, setAccountsError] = (0, react.useState)("");
			const [capabilitiesError, setCapabilitiesError] = (0, react.useState)("");
			const [selection, setSelection] = (0, react.useState)({});
			const [mode, setMode] = (0, react.useState)("draft");
			const [preview, setPreview] = (0, react.useState)(false);
			const [contentView, setContentView] = (0, react.useState)("master");
			const contentViewRef = (0, react.useRef)("master");
			const [busy, setBusy] = (0, react.useState)(false);
			const busyRef = (0, react.useRef)(false);
			const compressionRequest = (0, react.useRef)();
			const [compressingSummary, setCompressingSummary] = (0, react.useState)(false);
			const [publishOpen, setPublishOpen] = (0, react.useState)(false);
			const [confirm, setConfirm] = (0, react.useState)();
			const [deleteDraftId, setDeleteDraftId] = (0, react.useState)();
			const [restartAgent, setRestartAgent] = (0, react.useState)(false);
			const [saveError, setSaveError] = (0, react.useState)("");
			const [handoffError, setHandoffError] = (0, react.useState)("");
			const [handoffRetry, setHandoffRetry] = (0, react.useState)(0);
			const [draggedAssetId, setDraggedAssetId] = (0, react.useState)();
			const [runtimeCapability, setRuntimeCapability] = (0, react.useState)();
			const [imagegenPickerDraftId, setImagegenPickerDraftId] = (0, react.useState)();
			const editorAlive = (0, react.useRef)(false);
			const selectedIdRef = (0, react.useRef)(selectedContentId);
			const activeRef = (0, react.useRef)(active);
			selectedIdRef.current = selectedContentId;
			activeRef.current = active;
			(0, react.useEffect)(() => {
				editorAlive.current = true;
				return () => {
					editorAlive.current = false;
				};
			}, []);
			(0, react.useEffect)(() => () => {
				compressionRequest.current?.abort();
			}, []);
			(0, react.useEffect)(() => {
				compressionRequest.current?.abort();
			}, [selectedContentId, active]);
			(0, react.useEffect)(() => {
				setImagegenPickerDraftId(void 0);
			}, [selectedContentId, active]);
			(0, react.useEffect)(() => {
				setConfirm(void 0);
				setPublishOpen(false);
			}, [selectedContentId, active]);
			const intendedPlatformsKey = intendedPlatforms?.join(",");
			(0, react.useEffect)(() => {
				setSelection({});
			}, [selectedContentId, intendedPlatformsKey]);
			(0, react.useEffect)(() => {
				setHandoffError("");
				if (selectedContentId) {
					setPreview(initialMode === "preview");
					contentViewRef.current = "master";
					setContentView("master");
					setTagsInput(draftRef.current?.tags.join(" ") ?? "");
				}
			}, [selectedContentId, initialMode]);
			(0, react.useEffect)(() => {
				if (active && draft?.id === selectedContentId && initialMode === "publish") setPublishOpen(true);
			}, [
				active,
				draft?.id,
				selectedContentId,
				initialMode
			]);
			const setServerDraft = (value) => {
				const previous = serverDraftRef.current;
				if (value?.id === previous?.id && value && previous && previous.revision > value.revision) value = previous;
				serverDraftRef.current = value;
				draftRef.current = value;
				dirtyRef.current = false;
				pendingChanges.current = {};
				inFlightChanges.current = void 0;
				setSaveError("");
				setHandoffError("");
				setDraft(value);
				const view = contentViewRef.current;
				setTagsInput(value ? (view === "master" ? value : projectContentForPlatform(value, view)).tags.join(" ") : "");
			};
			const acceptServerSnapshot = (value) => {
				const previous = serverDraftRef.current;
				const latest = previous?.id === value.id && previous.revision > value.revision ? previous : value;
				serverDraftRef.current = latest;
				const local = inFlightChanges.current?.id === latest.id ? mergeContentPatches(inFlightChanges.current.patch, pendingChanges.current) : pendingChanges.current;
				const merged = applyContentPatch(latest, local);
				draftRef.current = merged;
				setDraft(merged);
				if (!Object.hasOwn(local, "tags") && !Object.hasOwn(local.platformVariants?.[contentViewRef.current] ?? {}, "tags")) setTagsInput((contentViewRef.current === "master" ? merged : projectContentForPlatform(merged, contentViewRef.current)).tags.join(" "));
			};
			(0, react.useEffect)(() => {
				if (active && draft && draft.id === selectedContentId && !handoffError) onDraftReady?.(draft, contentViewRef.current === "master" ? { kind: "main" } : {
					kind: "platform",
					platform: contentViewRef.current
				});
			}, [
				active,
				draft?.id,
				selectedContentId,
				handoffError,
				handoffGeneration,
				onDraftReady
			]);
			(0, react.useEffect)(() => {
				if (!active || busy || !selectedContentId) return;
				let live = true;
				const selectedAtStart = draftRef.current?.id;
				(async () => {
					if (selectedContentId !== selectedAtStart && (dirtyRef.current || saveTask.current)) await flush();
					else if (saveTask.current) try {
						await flush();
					} catch {
						return;
					}
					if (!live) return;
					const requested = await api(`content/${selectedContentId}`);
					if (!live || busyRef.current || draftRef.current?.id !== selectedAtStart && draftRef.current?.id !== requested.id) return;
					if (requested.contentType !== contentType) throw new Error("指定草稿内容类型不匹配");
					const current = draftRef.current;
					if (current?.id !== requested.id || !dirtyRef.current && !saveTask.current && requested.revision > current.revision) setServerDraft(requested);
					else setHandoffError("");
				})().catch((cause) => {
					if (!live) return;
					const message = errorMessage(cause);
					setHandoffError(`无法打开指定草稿：${message}`);
					showError(message);
				});
				return () => {
					live = false;
				};
			}, [
				contentType,
				active,
				selectedContentId,
				busy,
				handoffRetry,
				handoffGeneration
			]);
			(0, react.useEffect)(() => {
				if (!active || !agentOpen || !selectedContentId) return;
				let live = true;
				let reading = false;
				const refresh = async () => {
					if (reading || busyRef.current) return;
					reading = true;
					try {
						if (saveTask.current) try {
							await saveTask.current;
						} catch {}
						const latest = await api(`content/${selectedContentId}`);
						if (!live || busyRef.current || latest.contentType !== contentType) return;
						const current = draftRef.current;
						if (current?.id === latest.id && latest.revision > current.revision) acceptServerSnapshot(latest);
					} catch {} finally {
						reading = false;
					}
				};
				const timer = setInterval(() => {
					refresh();
				}, 1200);
				return () => {
					live = false;
					clearInterval(timer);
				};
			}, [
				active,
				agentOpen,
				selectedContentId,
				contentType
			]);
			(0, react.useEffect)(() => {
				if (!active) return;
				let live = true;
				setAccountsPending(true);
				setCapabilitiesPending(true);
				api("capability").then((value) => {
					if (live) setRuntimeCapability(value);
				}).catch((cause) => {
					if (live) showError(errorMessage(cause));
				});
				api("accounts").then((rows) => {
					if (live) {
						setAccounts(rows);
						setAccountsError("");
						setAccountsPending(false);
					}
				}).catch((cause) => {
					if (live) {
						setAccounts([]);
						setAccountsError(errorMessage(cause));
						setAccountsPending(false);
					}
				});
				api("platform-capabilities").then((rows) => {
					if (live) {
						setCapabilities(rows);
						setCapabilitiesError("");
						setCapabilitiesPending(false);
					}
				}).catch((cause) => {
					if (live) {
						setCapabilities([]);
						setCapabilitiesError(errorMessage(cause));
						setCapabilitiesPending(false);
					}
				});
				return () => {
					live = false;
				};
			}, [active]);
			const update = (patch) => {
				if (!draftRef.current) return;
				const next = {
					...draftRef.current,
					...patch
				};
				pendingChanges.current = mergeContentPatches(pendingChanges.current, changedContentFields(draftRef.current, next));
				draftRef.current = next;
				dirtyRef.current = Object.keys(pendingChanges.current).length > 0;
				setDraft(next);
				setEditVersion((version) => version + 1);
			};
			const effectiveContent = (content) => contentView === "master" ? content : projectContentForPlatform(content, contentView);
			const updateVariant = (patch) => {
				const current = draftRef.current;
				if (!current || contentView === "master") return;
				update({ platformVariants: {
					...current.platformVariants,
					[contentView]: {
						...current.platformVariants?.[contentView],
						...patch
					}
				} });
			};
			const updateTextField = (field, value) => {
				if (contentView === "master") update({ [field]: value });
				else updateVariant({ [field]: value });
			};
			const resetVariantField = (field) => {
				const current = draftRef.current;
				if (!current || contentView === "master") return;
				const next = { ...current.platformVariants?.[contentView] };
				delete next[field];
				const variants = { ...current.platformVariants };
				if (Object.keys(next).length) variants[contentView] = next;
				else delete variants[contentView];
				update({ platformVariants: variants });
				if (field === "tags") setTagsInput(current.tags.join(" "));
			};
			const resetPlatformVariant = () => {
				const current = draftRef.current;
				if (!current || contentView === "master") return;
				const variants = { ...current.platformVariants };
				delete variants[contentView];
				update({ platformVariants: variants });
				pendingChanges.current = mergeContentPatches(pendingChanges.current, { platformVariants: { [contentView]: null } });
				setTagsInput(current.tags.join(" "));
			};
			const selectContentView = (view) => {
				const current = draftRef.current;
				contentViewRef.current = view;
				setContentView(view);
				setTagsInput(current ? (view === "master" ? current : projectContentForPlatform(current, view)).tags.join(" ") : "");
			};
			const changeContentView = (view) => void act(async () => {
				const current = await flush();
				if (!current) return;
				await onAgentTargetChange?.(current, view === "master" ? { kind: "main" } : {
					kind: "platform",
					platform: view
				});
				selectContentView(view);
			});
			const togglePlatformAsset = (assetId, included) => {
				const current = draftRef.current;
				if (!current || contentView === "master") return;
				const selected = effectiveContent(current);
				const order = selected.assets.map((asset) => asset.id);
				const nextOrder = included ? [...order, assetId] : order.filter((id) => id !== assetId);
				const patch = { assetOrder: nextOrder };
				if (!included && selected.coverAssetId === assetId) patch.coverAssetId = nextOrder[0] ?? null;
				if (included && current.contentType === "article" && (!selected.coverAssetId || !selected.assets.some((asset) => asset.id === selected.coverAssetId))) patch.coverAssetId = assetId;
				updateVariant(patch);
			};
			const flush = async () => {
				if (saveTask.current) await saveTask.current;
				const current = draftRef.current;
				if (!current || !dirtyRef.current) return current;
				const patch = pendingChanges.current;
				pendingChanges.current = {};
				dirtyRef.current = false;
				inFlightChanges.current = {
					id: current.id,
					patch
				};
				const task = (async () => {
					try {
						const saved = await api("content-patch", {
							id: current.id,
							revision: current.revision,
							patch
						});
						inFlightChanges.current = void 0;
						if (draftRef.current?.id === current.id) acceptServerSnapshot(saved);
						setSaveError("");
					} catch (cause) {
						inFlightChanges.current = void 0;
						pendingChanges.current = mergeContentPatches(patch, pendingChanges.current);
						dirtyRef.current = true;
						setSaveError(errorMessage(cause));
						throw cause;
					}
				})();
				saveTask.current = task;
				try {
					await task;
				} finally {
					if (saveTask.current === task) saveTask.current = void 0;
				}
				if (dirtyRef.current) return flush();
				return draftRef.current;
			};
			(0, react.useEffect)(() => {
				if (editVersion === 0) return;
				const timer = setTimeout(() => {
					flush().catch((cause) => showError(errorMessage(cause)));
				}, 800);
				return () => clearTimeout(timer);
			}, [editVersion]);
			(0, react.useEffect)(() => () => {
				if (dirtyRef.current) flush().catch(() => {});
			}, []);
			const act = async (task, propagateError = false) => {
				if (busyRef.current) return;
				busyRef.current = true;
				setBusy(true);
				clearTip();
				try {
					await task();
				} catch (cause) {
					if (propagateError) throw cause;
					showError(errorMessage(cause));
				} finally {
					busyRef.current = false;
					setBusy(false);
				}
			};
			const back = () => void act(async () => {
				await flush();
				onBack();
			});
			const duplicate = () => void act(async () => {
				const current = await flush();
				if (!current) return;
				const copy = await api("content-copy", { id: current.id });
				setServerDraft(copy);
				onSelectedContentChange?.(copy.id);
			});
			const remove = () => {
				const id = draftRef.current?.id;
				if (id) setDeleteDraftId(id);
			};
			const confirmRemove = () => {
				const id = deleteDraftId;
				if (!id) return;
				act(async () => {
					await flush();
					if (onDeleteContent) await onDeleteContent(id);
					else await api("content-delete", { id });
					setDeleteDraftId(void 0);
					setServerDraft(void 0);
					onBack();
				});
			};
			const importText = (file) => void act(async () => {
				if (!file) return;
				if (!/\.(md|txt)$/iu.test(file.name) || file.size > 2 * 1024 * 1024) throw new Error("只支持 2MB 以内的 .md/.txt 文件");
				const text = await file.text();
				const current = draftRef.current;
				if (!current) throw new Error("请先打开草稿");
				update({
					body: text,
					title: current.title || file.name.replace(/\.(md|txt)$/iu, "").slice(0, 120)
				});
				showSuccess("已导入编辑器，草稿会自动保存。");
			});
			const addImages = (files) => {
				const selected = Array.from(files ?? []);
				if (!selected.length) return;
				act(async () => {
					for (const file of selected) {
						if (file.size < 1 || file.size > 20 * 1024 * 1024) throw new Error("单张图片必须大于 0 且不超过 20MB");
						if (file.type && ![
							"image/jpeg",
							"image/png",
							"image/webp"
						].includes(file.type)) throw new Error("仅支持 JPEG、PNG、WebP 图片");
					}
					let current = await flush();
					const limit = 20;
					if (!current) throw new Error("请先打开草稿");
					if (current.assets.length + selected.length > limit) throw new Error(`当前最多支持 ${limit} 张图片`);
					let uploaded = 0;
					try {
						for (const file of selected) {
							current = await uploadAsset(current.id, contentType === "article" ? await articleUploadFile(file) : file);
							setServerDraft(current);
							uploaded += 1;
						}
					} catch (cause) {
						if (uploaded > 0) throw new Error(`已保存前 ${uploaded} 张图片，其余上传失败：${errorMessage(cause)}`);
						throw cause;
					}
				});
			};
			const removeImage = (assetId) => void act(async () => {
				const current = await flush();
				if (!current) return;
				setServerDraft(await api("content-asset-delete", {
					id: current.id,
					assetId
				}));
			});
			const openImagegenPicker = () => void act(async () => {
				const current = await flush();
				if (!current || current.contentType !== "image-note") throw new Error("请先打开图文草稿");
				if (selectedIdRef.current && selectedIdRef.current !== current.id) throw new Error("请等待指定草稿打开后再选择图片");
				setImagegenPickerDraftId(current.id);
			});
			const importImagegenImages = async (images, signal) => {
				if (busyRef.current) throw new Error("正在保存图片，请稍候");
				busyRef.current = true;
				setBusy(true);
				clearTip();
				const importedIds = [];
				try {
					const current = await flush();
					const lockedId = imagegenPickerDraftId;
					const assertDraft = () => {
						signal.throwIfAborted();
						if (!editorAlive.current || !activeRef.current || !lockedId || draftRef.current?.id !== lockedId || selectedIdRef.current && selectedIdRef.current !== lockedId) throw new Error("草稿已切换，请重新选择图片；已导入的图片仍保留在原草稿");
					};
					assertDraft();
					if (!current || current.contentType !== "image-note") throw new Error("请先打开图文草稿");
					if (current.assets.length + images.length > 20) throw new Error(`当前草稿还能添加 ${Math.max(0, 20 - current.assets.length)} 张图片`);
					for (const image of images) {
						assertDraft();
						const file = await readImagegenFile(image, signal);
						assertDraft();
						const saved = await uploadAsset(lockedId, file);
						if (saved.id !== lockedId || saved.contentType !== "image-note") throw new Error("图片保存结果与当前草稿不匹配，请重新加载后核对");
						importedIds.push(image.id);
						assertDraft();
						setServerDraft(saved);
					}
					showSuccess(`已从 e图宝导入 ${importedIds.length} 张图片，图文草稿已保存。`);
					return { importedIds };
				} catch (cause) {
					return {
						importedIds,
						error: errorMessage(cause)
					};
				} finally {
					busyRef.current = false;
					if (editorAlive.current) setBusy(false);
				}
			};
			const insertImage = (assetId, name) => {
				const current = draftRef.current;
				if (!current || contentType !== "article") return;
				const visible = effectiveContent(current);
				const textarea = bodyInputRef.current;
				const start = textarea?.selectionStart ?? visible.body.length;
				const end = textarea?.selectionEnd ?? start;
				const marker = `![${name.replace(/[\[\]\\\r\n]/gu, " ").trim().slice(0, 80) || "图片"}](ebao-asset://${assetId})`;
				const before = visible.body.slice(0, start);
				const after = visible.body.slice(end);
				const insertion = `${before && !before.endsWith("\n") ? "\n" : ""}${marker}${after && !after.startsWith("\n") ? "\n" : ""}`;
				const cursor = before.length + insertion.length;
				setPreview(false);
				updateTextField("body", before + insertion + after);
				requestAnimationFrame(() => {
					bodyInputRef.current?.focus();
					bodyInputRef.current?.setSelectionRange(cursor, cursor);
				});
			};
			const moveAsset = (assetId, target) => void act(async () => {
				const current = await flush();
				if (!current) return;
				const order = effectiveContent(current).assets.map((asset) => asset.id);
				const index = order.indexOf(assetId);
				if (index < 0 || target < 0 || target >= order.length || index === target) return;
				order.splice(index, 1);
				order.splice(target, 0, assetId);
				if (contentView !== "master") {
					updateVariant({ assetOrder: order });
					return;
				}
				acceptServerSnapshot(await api("content-patch", {
					id: current.id,
					revision: current.revision,
					patch: { assetOrder: order }
				}));
			});
			const reorder = (assetId, delta) => {
				const index = draftRef.current ? effectiveContent(draftRef.current).assets.findIndex((asset) => asset.id === assetId) : -1;
				if (index >= 0) moveAsset(assetId, index + delta);
			};
			const reloadAfterConflict = () => void act(async () => {
				const id = draftRef.current?.id;
				if (!id) return;
				try {
					if (saveTask.current) await saveTask.current;
				} catch {}
				const latest = await api(`content/${id}`);
				if (latest.contentType !== contentType) throw new Error("草稿内容类型不匹配");
				setServerDraft(latest);
				if (selectedContentId && latest.id !== selectedContentId) setHandoffRetry((value) => value + 1);
				showSuccess("已加载最新草稿。");
			});
			const accountPlatforms = accountPlatformOrder(contentType, intendedPlatforms);
			const requestedPlatforms = intendedPlatforms?.filter((platform) => accountPlatforms.includes(platform)) ?? [];
			const selectedAccounts = selectedContentAccounts(contentType, accounts, selection);
			const missingRequestedPlatforms = requestedPlatforms.filter((platform) => !selectedAccounts.some((account) => account.platform === platform));
			const visibleDraft = draft && effectiveContent(draft);
			const selectedVariant = contentView === "master" ? void 0 : draft?.platformVariants?.[contentView];
			const selectedAssetIds = new Set(visibleDraft?.assets.map((asset) => asset.id) ?? []);
			const assetsForEditor = contentView === "master" ? draft?.assets ?? [] : [...visibleDraft?.assets ?? [], ...(draft?.assets ?? []).filter((asset) => !selectedAssetIds.has(asset.id))];
			const hasOverride = (field) => selectedVariant !== void 0 && Object.prototype.hasOwnProperty.call(selectedVariant, field);
			const articleWarnings = draft && !capabilitiesPending && !capabilitiesError ? articleSubmissionWarnings(draft, selectedAccounts, capabilities) : [];
			const submissionMode = contentType === "article" && articleWarnings.length > 0 ? "draft" : mode;
			const unavailableTargets = selectedAccounts.filter((account) => !contentModeAvailable(account.platform, contentType, submissionMode, capabilities));
			const exactMismatch = Boolean(selectedContentId && draft?.id !== selectedContentId);
			const editorLocked = busy || exactMismatch || Boolean(handoffError);
			const submitReady = runtimeCapability?.supported === true && !accountsPending && !capabilitiesPending && selectedAccounts.length > 0 && missingRequestedPlatforms.length === 0 && unavailableTargets.length === 0 && !exactMismatch && !handoffError;
			const titleLimit = contentView === "master" ? 120 : capabilities.find((item) => item.platform === contentView)?.maxTitleLength?.[contentType] ?? 120;
			const titleLength = contentType === "image-note" && contentView === "wxmp" ? Array.from(visibleDraft?.title ?? "").length : visibleDraft?.title.length ?? 0;
			const manualArticleImages = contentType === "article" && (contentView === "tt" || contentView === "dy");
			const assetLimit = contentView === "master" ? 20 : capabilities.find((item) => item.platform === contentView)?.maxAssets?.[contentType] ?? 20;
			const enteredTags = [...new Set(tagsInput.split(/[,，\s]+/u).map((tag) => tag.replace(/^#+/u, "").trim()).filter(Boolean))];
			const skippedArticleTagTargets = contentType === "article" && visibleDraft?.tags.length ? selectedAccounts.filter((account) => account.platform === "wxmp" || account.platform === "bjh") : [];
			const validationError = draft && selectedAccounts.length > 0 && !capabilitiesPending && !capabilitiesError ? contentSubmissionError(draft, selectedAccounts, capabilities, submissionMode) : void 0;
			const summaryNeedsCompression = contentType === "article" && draft && selectedAccounts.some((account) => account.platform === "dy") && projectContentForPlatform(draft, "dy").summary.trim().length > 30;
			const requestConfirm = () => void act(async () => {
				const original = await flush();
				if (!original) throw new Error("请先创建草稿");
				let current = original;
				if (!editorAlive.current || !activeRef.current || draftRef.current?.id !== current.id || selectedIdRef.current && selectedIdRef.current !== current.id) return;
				if (selectedContentId && current.id !== selectedContentId || handoffError) throw new Error("指定草稿尚未打开，请先确认当前草稿");
				if (missingRequestedPlatforms.length > 0) throw new Error(`请先为本次目标平台选择账号：${missingRequestedPlatforms.map((platform) => PLATFORM_LABELS[platform]).join("、")}`);
				if (contentType === "article" && selectedAccounts.some((account) => account.platform === "dy") && projectContentForPlatform(current, "dy").summary.trim().length > 30) {
					const controller = new AbortController();
					compressionRequest.current = controller;
					setCompressingSummary(true);
					try {
						const compressed = await api("summary-compress", {
							id: current.id,
							revision: current.revision,
							platform: "dy"
						}, controller.signal);
						controller.signal.throwIfAborted();
						if (!editorAlive.current || !activeRef.current || draftRef.current?.id !== current.id || selectedIdRef.current && selectedIdRef.current !== current.id) return;
						if (!compressed || typeof compressed.summary !== "string" || !compressed.content || compressed.generated !== true || compressed.content.id !== current.id || compressed.content.contentType !== "article" || !Number.isSafeInteger(compressed.content.revision) || compressed.content.revision <= current.revision || !compressed.summary.trim() || compressed.summary.length > 30 || projectContentForPlatform(compressed.content, "dy").summary !== compressed.summary) throw new Error("压缩后的抖音摘要未通过校验，请重新检查");
						setServerDraft(compressed.content);
						current = compressed.content;
					} catch (cause) {
						if (controller.signal.aborted) return;
						throw cause;
					} finally {
						if (compressionRequest.current === controller) compressionRequest.current = void 0;
						setCompressingSummary(false);
					}
				}
				const warnings = articleSubmissionWarnings(current, selectedAccounts, capabilities);
				const confirmedMode = contentType === "article" && warnings.length > 0 ? "draft" : mode;
				const error = contentSubmissionError(current, selectedAccounts, capabilities, confirmedMode);
				if (error) throw new Error(error);
				if (confirmedMode !== mode) setMode(confirmedMode);
				const displayTitle = current.title.trim() || projectContentForPlatform(current, selectedAccounts[0].platform).title;
				setPublishOpen(false);
				setConfirm({
					contentId: current.id,
					revision: current.revision,
					title: displayTitle,
					mode: confirmedMode,
					accounts: selectedAccounts,
					warnings,
					targetTitles: Object.fromEntries(selectedAccounts.map((account) => [account.id, projectContentForPlatform(current, account.platform).title])),
					targetSummaries: Object.fromEntries(selectedAccounts.filter((account) => account.platform === "dy").map((account) => [account.id, projectContentForPlatform(current, account.platform).summary]))
				});
			});
			const submit = () => void act(async () => {
				if (!confirm) return;
				const current = await flush();
				if (!current || current.id !== confirm.contentId || selectedContentId && current.id !== selectedContentId) {
					setConfirm(void 0);
					throw new Error("草稿已切换，请重新检查后提交");
				}
				if (handoffError) {
					setConfirm(void 0);
					throw new Error("无法确认最新草稿，请重新加载后提交");
				}
				if (current.revision !== confirm.revision) {
					setConfirm(void 0);
					throw new Error("草稿已更新，请重新检查后提交");
				}
				const accepted = await api("submissions", {
					contentType,
					contentId: current.id,
					revision: current.revision,
					mode: confirm.mode,
					accountIds: confirm.accounts.map((account) => account.id)
				});
				setConfirm(void 0);
				showSuccess(accepted.submission.mode === "draft" && ((confirm.warnings?.length ?? 0) > 0 || accepted.submission.requestedMode === "publish") ? "内容已按平台要求调整并转存草稿，请到平台后台核对。" : "已提交，请稍后到平台后台确认。");
			});
			const mediaCard = draft && visibleDraft ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "pub-card",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: contentView === "master" ? contentType === "article" ? "封面图片" : "图片素材与排序" : `${PLATFORM_LABELS[contentView]} · 封面和图片顺序` }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-actions",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							size: "sm",
							variant: contentType === "image-note" && draft.assets.length === 0 ? "primary" : "outline",
							disabled: busy,
							onClick: () => imageInputRef.current?.click(),
							children: "添加图片"
						}), contentType === "image-note" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							size: "sm",
							variant: "outline",
							disabled: busy || draft.assets.length >= 20,
							onClick: openImagegenPicker,
							children: "从 e图宝选择"
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						ref: imageInputRef,
						type: "file",
						accept: "image/jpeg,image/png,image/webp",
						multiple: true,
						style: { display: "none" },
						onChange: (event) => {
							addImages(event.target.files);
							event.target.value = "";
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
						className: visibleDraft.assets.length > assetLimit ? "pub-warn" : "pub-muted",
						children: [
							visibleDraft.assets.length,
							"/",
							assetLimit,
							" 张 · 仅支持 JPEG / PNG / WebP，每张不超过 20MB。",
							contentType === "image-note" ? "可拖动排序，也可使用 ↑ ↓ 按钮。" : ""
						]
					}),
					contentView !== "master" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-muted",
						children: "图片素材由主稿统一管理。勾选此平台要使用的图片，再调整顺序和封面；新上传的素材不会自动加入已单独选图的平台版本。"
					}),
					contentType === "article" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-muted",
						children: "WebP 文章图片上传时自动转为 JPEG，可作为微信公众号封面；透明区域会变成白色。公众号正文图片提交前会尝试处理到小于 1MB，封面尝试处理到小于 10MB；处理失败会提示更换图片。头条正文插图会保留文字占位，需从发布历史打开草稿手动补图和设置封面；百家号素材可自动插入正文或设为封面。掘金、B站专栏暂只支持单张封面。导入 Markdown 时不会读取相对路径图片，请先上传素材再插入。"
					}),
					contentType === "article" && contentView !== "master" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: "pub-no-cover",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "radio",
							name: `cover-${draft.id}-${contentView}`,
							checked: !visibleDraft.coverAssetId,
							onChange: () => updateVariant({ coverAssetId: null })
						}), "此平台不使用封面"]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pub-assets",
						children: assetsForEditor.map((asset, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: `pub-asset${draggedAssetId === asset.id ? " pub-asset-dragging" : ""}`,
							draggable: contentType === "image-note" && selectedAssetIds.has(asset.id) && !editorLocked,
							onDragStart: (event) => {
								if (contentType === "image-note" && selectedAssetIds.has(asset.id) && !editorLocked) {
									event.dataTransfer.effectAllowed = "move";
									setDraggedAssetId(asset.id);
								}
							},
							onDragOver: (event) => {
								if (contentType === "image-note" && selectedAssetIds.has(asset.id) && !editorLocked && draggedAssetId) event.preventDefault();
							},
							onDrop: (event) => {
								event.preventDefault();
								if (!editorLocked && selectedAssetIds.has(asset.id) && draggedAssetId && draggedAssetId !== asset.id) moveAsset(draggedAssetId, index);
								setDraggedAssetId(void 0);
							},
							onDragEnd: () => setDraggedAssetId(void 0),
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(AssetPreviewImage, {
									src: contentAssetUrl(draft.id, asset.id),
									alt: asset.name,
									thumbnail: true
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("small", { children: [
									selectedAssetIds.has(asset.id) ? String(index + 1).padStart(2, "0") : "—",
									" · ",
									asset.name
								] }),
								contentView !== "master" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									type: "checkbox",
									"aria-label": `${asset.name}用于${PLATFORM_LABELS[contentView]}`,
									checked: selectedAssetIds.has(asset.id),
									onChange: (event) => togglePlatformAsset(asset.id, event.target.checked)
								}), "用于此平台"] }),
								contentType === "article" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									type: "radio",
									name: `cover-${draft.id}-${contentView}`,
									"aria-label": `${asset.name}设为封面`,
									disabled: !selectedAssetIds.has(asset.id),
									checked: visibleDraft.coverAssetId === asset.id,
									onChange: () => contentView === "master" ? update({ coverAssetId: asset.id }) : updateVariant({ coverAssetId: asset.id })
								}), "封面"] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pub-actions",
									children: [
										contentType === "article" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "outline",
											size: "sm",
											disabled: busy || !selectedAssetIds.has(asset.id),
											onClick: () => insertImage(asset.id, asset.name),
											children: "插入正文"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "outline",
											size: "sm",
											"aria-label": "上移图片",
											disabled: !selectedAssetIds.has(asset.id) || index === 0 || busy,
											onClick: () => reorder(asset.id, -1),
											children: "↑"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "outline",
											size: "sm",
											"aria-label": "下移图片",
											disabled: !selectedAssetIds.has(asset.id) || index === visibleDraft.assets.length - 1 || busy,
											onClick: () => reorder(asset.id, 1),
											children: "↓"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "outline",
											size: "sm",
											className: "pub-danger-action",
											disabled: busy,
											onClick: () => removeImage(asset.id),
											children: "删除"
										})
									]
								})
							]
						}, asset.id))
					}),
					contentView !== "master" && hasOverride("coverAssetId") && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "outline",
						size: "sm",
						onClick: () => resetVariantField("coverAssetId"),
						children: "封面恢复主稿"
					}),
					contentView !== "master" && hasOverride("assetOrder") && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "outline",
						size: "sm",
						onClick: () => resetVariantField("assetOrder"),
						children: "图片顺序恢复主稿"
					})
				]
			}) : null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				onBlurCapture: () => {
					if (dirtyRef.current) flush().catch((cause) => showError(errorMessage(cause)));
				},
				children: [
					runtimeCapability && !runtimeCapability.supported && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-error",
						children: [capabilityMessage(runtimeCapability), "。本地草稿仍可编辑。"]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-editor-bar",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								size: "sm",
								variant: "outline",
								className: "pub-editor-back",
								disabled: busy,
								onClick: back,
								children: [
									"返回",
									contentType === "article" ? "文章" : "图文",
									"列表"
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "pub-editor-status",
								role: "status",
								"aria-live": "polite",
								children: saveError ? "自动保存失败，请重试" : exactMismatch ? "正在打开草稿…" : dirtyRef.current || saveTask.current ? "自动保存中…" : "已保存"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pub-editor-actions",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "pub-editor-view-switch",
										role: "group",
										"aria-label": "内容视图",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-pressed": !preview,
											disabled: editorLocked || !draft,
											onClick: () => setPreview(false),
											children: "编辑"
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-pressed": preview,
											disabled: editorLocked || !draft,
											onClick: () => setPreview(true),
											children: "预览"
										})]
									}),
									onToggleAgent && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										size: "sm",
										variant: "outline",
										"aria-expanded": Boolean(agentOpen),
										"aria-controls": "pub-agent-drawer",
										disabled: editorLocked || !draft,
										onClick: () => void act(async () => {
											const current = await flush();
											if (!current) throw new Error("请先打开草稿");
											await onToggleAgent(current, contentViewRef.current === "master" ? { kind: "main" } : {
												kind: "platform",
												platform: contentViewRef.current
											});
										}),
										children: "Agent 辅助编辑"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(EditorMoreMenu, { children: [
										onOpenWritingProfile && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											size: "sm",
											variant: "outline",
											disabled: editorLocked,
											onClick: onOpenWritingProfile,
											children: "写作风格"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											size: "sm",
											variant: "outline",
											disabled: editorLocked || !draft || !dirtyRef.current,
											onClick: () => void act(async () => {
												await flush();
												showSuccess("已保存。");
											}),
											children: "保存"
										}),
										contentType === "article" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											size: "sm",
											variant: "outline",
											disabled: editorLocked || !draft,
											onClick: () => importInputRef.current?.click(),
											children: "导入 .md/.txt 到主稿"
										}),
										onRestartAgent && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											size: "sm",
											variant: "outline",
											disabled: editorLocked || !draft,
											onClick: () => setRestartAgent(true),
											children: "重新开始对话"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											size: "sm",
											variant: "outline",
											disabled: editorLocked || !draft,
											onClick: duplicate,
											children: "复制"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											size: "sm",
											variant: "outline",
											className: "pub-danger-action",
											disabled: editorLocked || !draft,
											onClick: remove,
											children: "删除"
										})
									] }),
									contentType === "article" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										ref: importInputRef,
										type: "file",
										accept: ".md,.txt,text/markdown,text/plain",
										style: { display: "none" },
										onChange: (event) => {
											importText(event.target.files?.[0]);
											event.target.value = "";
										}
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										size: "sm",
										variant: "primary",
										disabled: editorLocked || !draft,
										onClick: () => setPublishOpen(true),
										children: "发布"
									})
								]
							})
						]
					}),
					handoffError && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-error",
						role: "status",
						children: [handoffError, /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pub-actions",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								size: "sm",
								variant: "outline",
								disabled: busy,
								onClick: () => {
									setHandoffError("");
									setHandoffRetry((value) => value + 1);
								},
								children: "重试读取草稿"
							})
						})]
					}),
					saveError.includes("已在其他页面更新") && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-error",
						role: "status",
						children: ["草稿已在其他页面更新。请重新加载后继续编辑；当前未保存的修改会丢失。", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pub-actions",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								size: "sm",
								variant: "outline",
								disabled: busy,
								onClick: reloadAfterConflict,
								children: "重新加载草稿"
							})
						})]
					}),
					exactMismatch ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-empty",
						role: "status",
						children: [handoffError ? "指定草稿未能打开。可以返回列表，或恢复先前正在编辑的内容。" : "正在打开指定草稿…", handoffError && draft && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pub-actions",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								size: "sm",
								variant: "outline",
								onClick: () => onSelectedContentChange?.(draft.id),
								children: "返回先前草稿"
							})
						})]
					}) : !draft ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pub-empty",
						children: "正在打开草稿…"
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("fieldset", {
						disabled: editorLocked,
						style: {
							border: 0,
							margin: 0,
							padding: 0,
							minWidth: 0
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pub-grid pub-editor-grid",
							children: [
								!preview && contentType === "image-note" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									style: { gridColumn: "1 / -1" },
									children: mediaCard
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "pub-editor-main",
									children: preview ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "pub-card pub-editor-preview",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												className: "pub-editor-heading",
												children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "内容预览" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
													className: "pub-editor-version-picker",
													children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "编辑版本" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
														"aria-label": "编辑版本",
														value: contentView,
														onChange: (event) => changeContentView(event.target.value),
														children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
															value: "master",
															children: "主稿"
														}), accountPlatforms.map((platform) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
															value: platform,
															children: [PLATFORM_LABELS[platform], draft.platformVariants?.[platform] ? " · 已单独修改" : ""]
														}, platform))]
													})]
												})]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherContentPreview, {
												content: visibleDraft,
												platform: contentView === "master" ? void 0 : contentView
											}),
											contentType === "article" && visibleDraft.summary && contentView !== "blbl" && contentView !== "wxmp" && contentView !== "tt" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
												className: "pub-preview-summary",
												children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "独立摘要字段：" }), visibleDraft.summary]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
												className: "pub-muted",
												children: contentView === "wxmp" && contentType === "image-note" ? "公众号图片消息按当前图片顺序展示，第一张为封面；正文和标签以纯文本发布。" : contentView === "wxmp" ? "公众号正文按所选主题预览；封面和摘要是独立字段。平台后台的最终呈现请以实际草稿为准。" : contentView === "master" ? "主稿展示阅读排版；公众号会采用所选主题，其他平台的实际样式仍需在后台草稿核对。" : manualArticleImages ? `这里展示本地原图，提交到${PLATFORM_LABELS[contentView]}时正文改为图片占位，请从发布历史打开草稿手动补图并核对。` : contentView === "ks" && contentType === "image-note" ? "快手图文没有独立标题字段，适配器会把标题放在作品描述首段；草稿状态仍需在快手后台核对。" : "这里展示当前平台版本的内容结构和图片顺序；实际样式由平台编辑器决定，请在后台草稿核对。"
											})
										]
									}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(react_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "pub-card",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												className: "pub-editor-heading",
												children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: contentType === "article" ? "文章内容" : "图文内容" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
													className: "pub-editor-version-picker",
													children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "编辑版本" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
														"aria-label": "编辑版本",
														value: contentView,
														onChange: (event) => changeContentView(event.target.value),
														children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
															value: "master",
															children: "主稿"
														}), accountPlatforms.map((platform) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
															value: platform,
															children: [PLATFORM_LABELS[platform], draft.platformVariants?.[platform] ? " · 已单独修改" : ""]
														}, platform))]
													})]
												})]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												className: "pub-field",
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
														htmlFor: `pub-${contentType}-title`,
														children: [
															"标题 ",
															/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
																className: titleLength > titleLimit ? "pub-warn" : "pub-muted",
																children: [
																	"（",
																	titleLength,
																	"/",
																	titleLimit,
																	" 字）"
																]
															}),
															hasOverride("title") && " · 此平台已单独修改"
														]
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
														className: "pub-text-input",
														id: `pub-${contentType}-title`,
														maxLength: 120,
														value: visibleDraft.title,
														onChange: (event) => updateTextField("title", event.target.value)
													}),
													hasOverride("title") && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
														variant: "outline",
														size: "sm",
														onClick: () => resetVariantField("title"),
														children: "标题恢复主稿"
													})
												]
											}),
											contentType === "image-note" && contentView === "ks" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
												className: "pub-muted",
												children: "快手图文没有独立标题框，标题将放入正文第一段。"
											}),
											contentType === "image-note" && contentView === "wxmp" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
												className: "pub-muted",
												children: "公众号图片消息最多 20 张，第一张为封面。WebP 图片上传前自动转为 JPEG；正文使用纯文本。直接发布需要公众号具备发布接口权限。"
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												className: "pub-field",
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
														htmlFor: `pub-${contentType}-body`,
														children: [contentType === "article" ? "正文" : "正文 / 话题", hasOverride("body") && " · 此平台已单独修改"]
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
														ref: bodyInputRef,
														className: `pub-input ${contentType === "article" ? "pub-editor" : ""}`,
														id: `pub-${contentType}-body`,
														value: visibleDraft.body,
														onChange: (event) => updateTextField("body", event.target.value)
													}),
													hasOverride("body") && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
														variant: "outline",
														size: "sm",
														onClick: () => resetVariantField("body"),
														children: "正文恢复主稿"
													})
												]
											}),
											manualArticleImages && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
												className: "pub-muted",
												children: "正文图片和封面不自动上传，有图片的文章会转存草稿；请从发布历史打开草稿手动补图和设置封面。"
											}),
											contentType === "article" && contentView === "dy" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
												className: "pub-muted",
												children: "抖音文章正文（含内容声明）最多 20000 字；独立摘要最多 30 字。提交前会用模型压缩超长摘要，在确认页核对后提交；完整原摘要和标签仍保留在本地。"
											})
										]
									}) })
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pub-editor-sidebar",
									children: [
										!preview && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(EditorSection, {
											title: "发布信息",
											hint: enteredTags.length > 8 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "pub-warn",
												children: "标签超限"
											}) : contentView === "dy" && visibleDraft.summary.length > 30 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "pub-warn",
												children: "摘要需压缩"
											}) : contentType === "article" ? "摘要、标签与声明" : "标签与内容声明",
											children: [
												contentType === "article" && contentView !== "tt" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
													className: "pub-field",
													children: [
														/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
															htmlFor: "pub-article-summary",
															children: [
																"摘要",
																contentView === "dy" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
																	className: visibleDraft.summary.length > 30 ? "pub-warn" : "pub-muted",
																	children: [
																		"（",
																		visibleDraft.summary.length,
																		"/30 字）"
																	]
																}),
																hasOverride("summary") && " · 此平台已单独修改"
															]
														}),
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
															className: "pub-input",
															id: "pub-article-summary",
															maxLength: 2e3,
															value: visibleDraft.summary,
															onChange: (event) => updateTextField("summary", event.target.value)
														}),
														hasOverride("summary") && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
															variant: "outline",
															size: "sm",
															onClick: () => resetVariantField("summary"),
															children: "摘要恢复主稿"
														})
													]
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
													className: "pub-field",
													children: [
														/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
															htmlFor: `pub-${contentType}-tags`,
															children: [
																"标签（",
																visibleDraft.tags.length,
																"/",
																8,
																" 个，用空格或逗号分隔）",
																hasOverride("tags") && " · 此平台已单独修改"
															]
														}),
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
															className: "pub-text-input",
															id: `pub-${contentType}-tags`,
															value: tagsInput,
															onChange: (event) => {
																setTagsInput(event.target.value);
																const tags = [...new Set(event.target.value.split(/[,，\s]+/u).map((tag) => tag.replace(/^#+/u, "").trim()).filter(Boolean))].slice(0, 8);
																if (contentView === "master") update({ tags });
																else updateVariant({ tags });
															}
														}),
														hasOverride("tags") && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
															variant: "outline",
															size: "sm",
															onClick: () => resetVariantField("tags"),
															children: "标签恢复主稿"
														})
													]
												}),
												visibleDraft.tags.length > 0 && skippedArticleTagTargets.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
													className: "pub-muted",
													children: [skippedArticleTagTargets.map((account) => PLATFORM_LABELS[account.platform]).join("、"), "文章暂不写入标签；草稿标签仍保留供其他平台使用。"]
												}),
												enteredTags.length > 8 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
													className: "pub-warn",
													children: [
														"超过 ",
														8,
														" 个标签，超出的标签不会保存。"
													]
												}),
												contentView === "master" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
													className: "pub-field",
													children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
														htmlFor: `pub-${contentType}-statement`,
														children: "AI 内容声明（所有平台共用）"
													}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
														className: "pub-input",
														id: `pub-${contentType}-statement`,
														value: draft.creativeStatement,
														onChange: (event) => update({ creativeStatement: event.target.value }),
														children: CREATIVE_STATEMENTS.map((value) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
															value,
															children: STATEMENT_LABELS[value]
														}, value))
													})]
												}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
													className: "pub-muted",
													children: [
														"AI 内容声明由主稿统一设置：",
														STATEMENT_LABELS[draft.creativeStatement],
														"。"
													]
												})
											]
										}, `info-${draft.id}`),
										!preview && contentType === "article" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(EditorSection, {
											title: "封面与图片",
											hint: `${visibleDraft.assets.length} 张图片${visibleDraft.coverAssetId ? " · 已选封面" : ""}`,
											children: mediaCard
										}, `media-${draft.id}`),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(EditorSection, {
											title: "平台与排版",
											className: "pub-version-card",
											hint: contentView === "master" ? "主稿" : `${PLATFORM_LABELS[contentView]}${selectedVariant ? " · 已单独修改" : ""}`,
											children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
													className: "pub-version-tabs",
													role: "group",
													"aria-label": "内容版本",
													children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
														type: "button",
														className: "pub-version-tab",
														"aria-pressed": contentView === "master",
														onClick: () => changeContentView("master"),
														children: "主稿"
													}), accountPlatforms.map((platform) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
														type: "button",
														className: "pub-version-tab",
														"aria-pressed": contentView === platform,
														onClick: () => changeContentView(platform),
														children: [PLATFORM_LABELS[platform], draft.platformVariants?.[platform] ? " · 已单独修改" : ""]
													}, platform))]
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
													className: "pub-muted",
													children: contentView === "master" ? "这里编辑的是本地发布主稿；从 Agent 原始 MD 生成的内容不会回写原文件。平台版本默认继承主稿；对某个平台单独修改后，该字段将保留自己的内容。" : `${PLATFORM_LABELS[contentView]}版本：未单独修改的字段会跟随主稿更新。请在提交前切到每个目标平台检查。`
												}),
												contentType === "article" && (contentView === "master" || contentView === "wxmp") && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
													className: "pub-article-theme-control",
													children: [
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
															htmlFor: `pub-article-theme-${draft.id}`,
															children: "公众号排版主题"
														}),
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
															className: "pub-input",
															id: `pub-article-theme-${draft.id}`,
															value: resolveArticleTheme(draft),
															onChange: (event) => update({ articleTheme: event.target.value }),
															children: ARTICLE_THEMES.map((theme) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
																value: theme,
																children: ARTICLE_THEME_LABELS[theme]
															}, theme))
														}),
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
															className: "pub-muted",
															children: "主稿预览可比较排版；所选主题用于公众号正文，文颜灵感主题是适配版本，最终以公众号草稿为准。其他平台按各自编辑器处理。"
														})
													]
												}),
												contentView !== "master" && selectedVariant && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
													variant: "outline",
													size: "sm",
													onClick: resetPlatformVariant,
													children: "此平台全部恢复主稿"
												})
											]
										}, `version-${draft.id}`),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ProjectDirectoryInfo, { contentId: draft.id }, draft.id),
										draft.id === selectedContentId && onReturnToSource && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ArticleSourceControls, {
											contentId: draft.id,
											active,
											busy: editorLocked,
											onReturn: (sessionId) => {
												if (busyRef.current) return Promise.resolve();
												const navigation = onSourceNavigation?.();
												return act(async () => {
													const selected = selectedIdRef.current;
													await flush();
													if (!editorAlive.current || !activeRef.current || navigation?.aborted || selectedIdRef.current !== selected) return;
													await onReturnToSource(sessionId, navigation);
												});
											},
											onUpdate: (origin) => act(async () => {
												const current = await flush();
												if (!editorAlive.current || !activeRef.current || selectedIdRef.current !== origin.contentId) return;
												if (!current || current.id !== origin.contentId) throw new Error("当前发布稿已变化，请重新打开来源信息");
												const result = await articleHandoffApi("article-handoff-update", {
													sessionId: origin.source.sessionId,
													handoffId: origin.handoffId,
													expectedContentRevision: current.revision
												});
												if (!editorAlive.current || selectedIdRef.current !== current.id) return;
												if (result.content.id !== current.id) throw new Error("更新结果与当前发布稿不匹配");
												setServerDraft(result.content);
												showSuccess("已更新发布主稿的正文和配图。");
											}, true)
										}, `source-${draft.id}`)
									]
								})
							]
						})
					}),
					publishOpen && draft && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherModal, {
						open: true,
						title: "发布设置",
						closeLabel: "关闭发布设置",
						className: "pub-modal pub-publish-modal",
						contentClassName: "pub-modal-content",
						onClose: () => {
							if (!busyRef.current) setPublishOpen(false);
						},
						footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							size: "sm",
							variant: "outline",
							disabled: busy,
							onClick: () => setPublishOpen(false),
							children: "取消"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							size: "sm",
							variant: "primary",
							disabled: busy || !submitReady,
							onClick: requestConfirm,
							children: compressingSummary ? "正在压缩抖音摘要…" : "检查并提交"
						})] }),
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("fieldset", {
							disabled: editorLocked,
							className: "pub-publish-fields",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "选择平台账号" }),
								requestedPlatforms.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
									className: "pub-muted",
									role: "status",
									children: [
										"本次目标平台：",
										requestedPlatforms.map((platform) => PLATFORM_LABELS[platform]).join("、"),
										"。请逐一选择账号；也可手动添加下方其他平台。如需减少目标，请在对话中重新准备预览。"
									]
								}),
								accountPlatforms.map((platform) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									requestedPlatforms.includes(platform) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
										className: "pub-muted",
										children: ["本次目标 · ", selectedAccounts.some((account) => account.platform === platform) ? "账号已选择" : "待选择账号"]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PlatformAccountSelect, {
										idPrefix: contentType,
										platform,
										accounts,
										value: selection[platform] ?? "",
										initialFocus: platform === accountPlatforms[0],
										onChange: (id) => setSelection((current) => ({
											...current,
											[platform]: id || void 0
										}))
									}),
									!capabilitiesPending && !capabilitiesError && !contentModeAvailable(platform, contentType, submissionMode, capabilities) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
										className: "pub-muted",
										children: [
											"当前发布引擎尚未开放",
											PLATFORM_LABELS[platform],
											submissionMode === "publish" ? "立即发布" : "转存草稿",
											"能力；可继续准备本地草稿。"
										]
									})
								] }, platform)),
								accountsPending && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: "pub-muted",
									children: "正在加载平台账号…"
								}),
								accountsError ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
									className: "pub-warn",
									role: "status",
									children: ["账号加载失败：", accountsError]
								}) : !accountsPending && !accounts.some((account) => accountPlatforms.some((platform) => platform === account.platform)) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: "pub-muted",
									children: "还没有适用于当前内容类型的账号，请先到“平台账号管理”添加并登录。"
								}),
								capabilitiesPending && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: "pub-muted",
									children: "正在检查平台提交能力…"
								}),
								capabilitiesError && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
									className: "pub-warn",
									role: "status",
									children: ["平台能力加载失败：", capabilitiesError]
								}),
								selectedAccounts.map((account) => {
									return (capabilities.find((item) => item.platform === account.platform)?.requiredFields[contentType] ?? []).map((field) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "pub-field",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
											htmlFor: `pub-field-${account.platform}-${field}`,
											children: [
												PLATFORM_LABELS[account.platform],
												" · ",
												FIELD_LABELS[field] || field
											]
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
											className: "pub-text-input",
											id: `pub-field-${account.platform}-${field}`,
											value: draft.platformFields[account.platform]?.[field] ?? "",
											onChange: (event) => update({ platformFields: {
												...draft.platformFields,
												[account.platform]: {
													...draft.platformFields[account.platform],
													[field]: event.target.value
												}
											} })
										})]
									}, `${account.platform}:${field}`));
								}),
								!capabilitiesPending && !capabilitiesError && selectedAccounts.map((account) => {
									const error = contentSubmissionError(draft, [account], capabilities, submissionMode);
									const warnings = articleSubmissionWarnings(draft, [account], capabilities);
									return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [error && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
										className: "pub-warn",
										role: "status",
										children: [
											PLATFORM_LABELS[account.platform],
											"：",
											error
										]
									}), warnings.map((warning) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										className: "pub-warn",
										role: "status",
										children: warning
									}, warning))] }, `validation-${account.id}`);
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "提交方式" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pub-mode",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										type: "radio",
										name: `pub-mode-${contentType}`,
										checked: mode === "publish",
										onChange: () => setMode("publish")
									}), "立即发布"] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										type: "radio",
										name: `pub-mode-${contentType}`,
										checked: mode === "draft",
										onChange: () => setMode("draft")
									}), "转存草稿"] })]
								}),
								missingRequestedPlatforms.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
									className: "pub-warn",
									role: "status",
									children: [
										"本次目标尚未选账号：",
										missingRequestedPlatforms.map((platform) => PLATFORM_LABELS[platform]).join("、"),
										"。选择全部目标账号后才能提交。"
									]
								}),
								!capabilitiesPending && !capabilitiesError && unavailableTargets.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: "pub-warn",
									role: "status",
									children: "当前发布引擎尚未开放所选平台的提交方式；本地草稿仍会保存。若刚更新 Helper，请完全退出并重启应用后重试。"
								}) : validationError && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: "pub-warn",
									role: "status",
									children: summaryNeedsCompression && validationError.includes("摘要不能超过 30 字") ? "点击“检查并提交”后会用模型压缩抖音摘要，在确认页核对生成结果；完整原摘要保留。" : `提交前请处理：${validationError}`
								}),
								compressingSummary && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: "pub-muted",
									role: "status",
									children: "正在用当前文字模型压缩摘要，请稍候…"
								}),
								articleWarnings.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: "pub-muted",
									children: "以上调整只影响提交给平台的文章副本，原始 MD 和本地编辑稿保留；本次将转存平台草稿供核对。"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: "pub-muted",
									children: "提交只表示任务已被本机发布队列接受，不代表平台发布成功。文章/图文适配仍需实际平台验证，建议先转存草稿并到对应账号后台核对。"
								})
							]
						})
					}),
					imagegenPickerDraftId && draft?.id === imagegenPickerDraftId && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ImagegenPicker, {
						remaining: 20 - draft.assets.length,
						onCancel: () => {
							if (!busyRef.current) setImagegenPickerDraftId(void 0);
						},
						onImport: importImagegenImages
					}),
					confirm && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConfirmDialog, {
						contentType,
						title: confirm.title,
						mode: confirm.mode,
						accounts: confirm.accounts,
						targetTitles: confirm.targetTitles,
						targetSummaries: confirm.targetSummaries,
						warnings: confirm.warnings,
						busy,
						onCancel: () => {
							setConfirm(void 0);
							setPublishOpen(true);
						},
						onConfirm: submit
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherModal, {
						open: deleteDraftId !== void 0,
						title: "删除本地草稿",
						closeLabel: "关闭删除草稿确认",
						description: "将这份稿件和关联对话一起移入回收站？素材和已发布记录保留，稿件可恢复。",
						className: "pub-modal",
						onClose: () => {
							if (!busyRef.current) setDeleteDraftId(void 0);
						},
						footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							size: "sm",
							variant: "outline",
							"data-pub-initial-focus": true,
							disabled: busy,
							onClick: () => {
								if (!busyRef.current) setDeleteDraftId(void 0);
							},
							children: "取消"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							size: "sm",
							variant: "outline",
							className: "pub-danger-action",
							disabled: busy,
							onClick: confirmRemove,
							children: busy ? "正在删除…" : "删除草稿"
						})] })
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherModal, {
						open: restartAgent,
						title: "重新开始对话",
						closeLabel: "关闭重新开始对话确认",
						className: "pub-modal",
						description: "保存当前对话并开启新对话？稿件、素材和平台版本都会保留。",
						onClose: () => {
							if (!busyRef.current) setRestartAgent(false);
						},
						footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "outline",
							"data-pub-initial-focus": true,
							disabled: busy,
							onClick: () => setRestartAgent(false),
							children: "取消"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							disabled: busy,
							onClick: () => void act(async () => {
								const current = await flush();
								if (current) await onRestartAgent?.(current, contentViewRef.current === "master" ? { kind: "main" } : {
									kind: "platform",
									platform: contentViewRef.current
								});
								setRestartAgent(false);
							}),
							children: "开启新对话"
						})] })
					})
				]
			});
		}
		//#endregion
		//#region src/client/create-draft-dialog.tsx
		function CreateDraftDialog({ contentType, onCancel, onCreated }) {
			const formId = `pub-create-draft-${(0, react.useId)()}`;
			const nameId = `${formId}-name`;
			const helpId = `${formId}-help`;
			const errorId = `${formId}-error`;
			const [name, setName] = (0, react.useState)("");
			const [busy, setBusy] = (0, react.useState)(false);
			const [error, setError] = (0, react.useState)("");
			const submitting = (0, react.useRef)(false);
			const close = () => {
				if (!submitting.current) onCancel();
			};
			const submit = async (event) => {
				event.preventDefault();
				if (submitting.current) return;
				submitting.current = true;
				setBusy(true);
				setError("");
				const title = name.trim();
				try {
					onCreated(await api("contents", {
						contentType,
						...title ? { title } : {}
					}));
				} catch (cause) {
					setError(errorMessage(cause));
				} finally {
					submitting.current = false;
					setBusy(false);
				}
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherModal, {
				open: true,
				title: `新建${CONTENT_LABELS[contentType]}草稿`,
				closeLabel: "关闭新建草稿",
				className: "pub-modal",
				contentClassName: "pub-modal-content",
				onClose: close,
				footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					type: "button",
					size: "sm",
					variant: "outline",
					disabled: busy,
					onClick: close,
					children: "取消"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					type: "submit",
					form: formId,
					size: "sm",
					variant: "primary",
					disabled: busy,
					children: busy ? "正在创建…" : "创建草稿"
				})] }),
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("form", {
					id: formId,
					onSubmit: (event) => void submit(event),
					"aria-busy": busy,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pub-modal-field",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
								className: "pub-modal-label",
								htmlFor: nameId,
								children: "任务名称（可选）"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
								id: nameId,
								className: "pub-text-input",
								"data-pub-initial-focus": true,
								"data-modal-autofocus": true,
								maxLength: 120,
								value: name,
								disabled: busy,
								placeholder: "例如：重庆周末徒步攻略",
								"aria-describedby": `${helpId}${error ? ` ${errorId}` : ""}`,
								onChange: (event) => {
									setName(event.target.value);
									setError("");
								}
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							id: helpId,
							className: "pub-modal-copy",
							children: "名称用于初始标题和项目文件夹。留空将按内容类型和日期命名；创建后修改标题不会改变文件夹名称。"
						}),
						error && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
							id: errorId,
							className: "pub-error",
							role: "alert",
							children: ["创建失败：", error]
						})
					]
				})
			});
		}
		//#endregion
		//#region src/client/source-document-preview.tsx
		const markdown = new MarkdownIt({
			html: false,
			linkify: false
		});
		const allowedTags = /* @__PURE__ */ new Set([
			"p",
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
			"blockquote",
			"ul",
			"ol",
			"li",
			"em",
			"strong",
			"s",
			"a",
			"table",
			"thead",
			"tbody",
			"tr",
			"th",
			"td"
		]);
		const sourcePreviewCss = `
.pub-source-preview { box-sizing: border-box; width: 100%; max-width: 720px; margin: 0 auto; padding: 24px; border: 1px solid var(--dsw-alias-border-l2, #e4e6e9); border-radius: 12px; overflow-wrap: anywhere; }
.pub-source-preview * { box-sizing: border-box; }
.pub-source-preview > h1 { margin: 0 0 6px; font-size: 23px; line-height: 1.4; }
.pub-source-preview-file { margin: 0 0 22px; color: var(--dsw-alias-label-tertiary, #777d85); font-size: 12px; }
.pub-source-preview-unused, .pub-source-preview-gallery { margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--article-rule); }
.pub-source-preview-unused h2, .pub-source-preview-gallery h2 { margin: 0 0 12px; font-size: 14px; }
.pub-source-preview-unused figure, .pub-source-preview-gallery figure { margin: 0 0 16px; }
.pub-source-preview-unused img, .pub-source-preview-gallery img { display: block; max-width: 100%; max-height: 420px; object-fit: contain; }
.pub-source-preview-unused figcaption, .pub-source-preview-gallery figcaption { margin-top: 4px; color: var(--dsw-alias-label-tertiary, #777d85); font-size: 12px; }
`;
		function sameOriginPath(url) {
			return typeof url === "string" && url.startsWith("/") && !url.startsWith("//") && !/[\\\u0000-\u001f\u007f]/u.test(url);
		}
		function safeImageUrl(imageUrl, sourceId, imageId) {
			try {
				const url = imageUrl(sourceId, imageId);
				return sameOriginPath(url) ? url : void 0;
			} catch {
				return;
			}
		}
		function safeLinkProps(token) {
			const href = token.attrGet("href") ?? "";
			return /^(?:https?:\/\/|mailto:)/iu.test(href) ? {
				href,
				target: "_blank",
				rel: "noopener noreferrer"
			} : {};
		}
		/** Resolve only images registered in this document; never render raw Markdown URLs. */
		function imageForReference(source, reference) {
			return source.images.find((image) => image.src === reference && reference === `source-image://${image.id}`);
		}
		function renderMarkdown(source, imageUrl, imagePresentation) {
			const root = {
				tag: null,
				props: {},
				children: []
			};
			const frames = [root];
			const usedImageIds = /* @__PURE__ */ new Set();
			const orderedImages = [];
			let key = 0;
			const append = (node) => {
				frames[frames.length - 1].children.push(node);
			};
			const renderTokens = (tokens) => {
				for (const token of tokens) {
					if (token.hidden) continue;
					if (token.type === "inline") {
						renderTokens(token.children ?? []);
						continue;
					}
					if (token.type === "image") {
						const image = imageForReference(source, token.attrGet("src") ?? "");
						const url = image ? safeImageUrl(imageUrl, source.id, image.id) : void 0;
						if (image && url) {
							if (!usedImageIds.has(image.id)) orderedImages.push({
								image,
								url
							});
							usedImageIds.add(image.id);
							if (imagePresentation === "inline") append(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
								src: url,
								alt: token.content || image.name,
								loading: "lazy"
							}, key++));
						} else append(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "pub-wechat-preview-image-error",
							children: "图片引用无法预览"
						}, key++));
						continue;
					}
					if (token.type === "text" || token.type === "html_inline" || token.type === "html_block") {
						append(token.content);
						continue;
					}
					if (token.type === "code_inline") {
						append(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: token.content }, key++));
						continue;
					}
					if (token.type === "fence" || token.type === "code_block") {
						append(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: token.content }) }, key++));
						continue;
					}
					if (token.type === "hr") {
						append(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("hr", {}, key++));
						continue;
					}
					if (token.type === "hardbreak") {
						append(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("br", {}, key++));
						continue;
					}
					if (token.type === "softbreak") {
						append("\n");
						continue;
					}
					if (token.nesting === 1) {
						frames.push({
							tag: allowedTags.has(token.tag) ? token.tag : "span",
							props: token.type === "link_open" ? safeLinkProps(token) : token.type === "ordered_list_open" && token.attrGet("start") ? { start: Number(token.attrGet("start")) } : {},
							children: []
						});
						continue;
					}
					if (token.nesting === -1) {
						if (frames.length > 1) {
							const frame = frames.pop();
							append((0, react.createElement)(frame.tag, {
								key: key++,
								...frame.props
							}, ...frame.children));
						}
						continue;
					}
					if (token.content) append(token.content);
				}
			};
			renderTokens(markdown.parse(source.body, {}));
			return {
				nodes: root.children,
				usedImageIds,
				orderedImages
			};
		}
		/** Preview the source Markdown before any platform-specific publishing draft exists. */
		function SourceDocumentPreview({ source, imageUrl, showUnusedImages = true, imagePresentation = "inline" }) {
			const { nodes, usedImageIds, orderedImages } = renderMarkdown(source, imageUrl, imagePresentation);
			const unusedImages = !showUnusedImages ? [] : source.images.flatMap((image) => {
				if (usedImageIds.has(image.id)) return [];
				const url = safeImageUrl(imageUrl, source.id, image.id);
				return url ? [{
					image,
					url
				}] : [];
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "pub-source-preview ebao-article-reader",
				"aria-label": "原始文档预览",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("style", { children: [articlePreviewCss, sourcePreviewCss] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h1", { children: source.title || source.fileName }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-source-preview-file",
						children: source.fileName
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pub-wechat-markdown",
						"aria-label": "Markdown 正文预览",
						children: nodes
					}),
					imagePresentation === "gallery" && orderedImages.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "pub-source-preview-gallery",
						"aria-label": "图文图集",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "图文图集" }), orderedImages.map(({ image, url }) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
							src: url,
							alt: image.name,
							loading: "lazy"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("figcaption", { children: image.name })] }, image.id))]
					}),
					unusedImages.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "pub-source-preview-unused",
						"aria-label": "未在正文引用的图片",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "未在正文引用的图片" }), unusedImages.map(({ image, url }) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
							src: url,
							alt: image.name,
							loading: "lazy"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("figcaption", { children: image.name })] }, image.id))]
					})
				]
			});
		}
		//#endregion
		//#region src/client/conversation-preview.tsx
		const PREVIEW_KIND = "cqai-publisher-preview";
		const PREVIEW_ID = "cqai-dsh-plugin-publisher/preview";
		function sessionContentUrl(sessionId) {
			return `${API}/session-content/${encodeURIComponent(sessionId)}`;
		}
		function sessionPreviewUrl(sessionId) {
			return `${API}/session-preview/${encodeURIComponent(sessionId)}`;
		}
		function sourceImageUrl(sourceId, imageId) {
			return `${API}/source-image/${encodeURIComponent(sourceId)}/${encodeURIComponent(imageId)}`;
		}
		function sameSessionPreview(previous, next) {
			return previous?.sessionId === next.sessionId && previous.source?.id === next.source?.id && previous.source?.revision === next.source?.revision && previous.candidate?.id === next.candidate?.id;
		}
		function sameDraftRevision(previous, next) {
			return previous?.sessionId === next.sessionId && previous.contentId === next.contentId && previous.revision === next.revision;
		}
		function previewableContentId(snapshot) {
			const content = snapshot.content;
			return content && snapshot.contentId === content.id && (content.contentType === "article" || content.contentType === "image-note") ? content.id : null;
		}
		/** The source document owns discovery; a legacy Publisher draft is used only when it is absent. */
		function advanceSessionPreviewDiscovery(previous, snapshot, legacy) {
			const source = snapshot.source?.sessionId === snapshot.sessionId ? snapshot.source : null;
			const contentId = source ? `source:${source.id}` : legacy?.sessionId === snapshot.sessionId ? previewableContentId(legacy) : null;
			const prior = previous?.sessionId === snapshot.sessionId ? previous : void 0;
			const autoOpen = !!prior && prior.contentId === null && contentId !== null && !prior.autoOpened;
			const closePreview = !!prior && prior.contentId !== null && contentId === null;
			return {
				state: {
					sessionId: snapshot.sessionId,
					contentId,
					autoOpened: (prior?.autoOpened ?? contentId !== null) || autoOpen
				},
				showAction: contentId !== null,
				autoOpen,
				closePreview
			};
		}
		/** Keep a session-scoped close handle while a tab exists, including when its body is hidden. */
		var PreviewTabRegistry = class {
			bySession = /* @__PURE__ */ new Map();
			register(sessionId, tabId, signal, close) {
				if (signal.aborted) return;
				let tabs = this.bySession.get(sessionId);
				if (!tabs) {
					tabs = /* @__PURE__ */ new Map();
					this.bySession.set(sessionId, tabs);
				}
				if (tabs.get(tabId)?.signal === signal) return;
				tabs.set(tabId, {
					signal,
					close,
					closing: false
				});
				signal.addEventListener("abort", () => {
					if (tabs.get(tabId)?.signal !== signal) return;
					tabs.delete(tabId);
					if (tabs.size === 0) this.bySession.delete(sessionId);
				}, { once: true });
			}
			closeSession(sessionId) {
				for (const tab of this.bySession.get(sessionId)?.values() ?? []) {
					if (tab.closing) continue;
					tab.closing = true;
					try {
						tab.close();
					} catch {
						tab.closing = false;
					}
				}
			}
		};
		const previewTabs = new PreviewTabRegistry();
		/** A tab may retain state across session switches; only its current session can be shown or published. */
		function previewForSession(snapshot, error, sessionId) {
			const currentSnapshot = snapshot?.sessionId === sessionId ? snapshot : void 0;
			const currentError = error?.sessionId === sessionId ? error.message : "";
			const content = currentSnapshot && previewableContentId(currentSnapshot) ? currentSnapshot.content : null;
			return {
				currentSnapshot,
				currentError,
				content,
				canPublish: !!content && !currentError && (content.contentType === "article" || content.contentType === "image-note")
			};
		}
		/** A candidate belongs to one exact source revision and session. */
		function sourcePreviewForSession(snapshot, legacy, error, sessionId) {
			const currentPreview = snapshot?.sessionId === sessionId ? snapshot : void 0;
			const currentError = error?.sessionId === sessionId ? error.message : "";
			const source = currentPreview?.source?.sessionId === sessionId ? currentPreview.source : null;
			const offered = currentPreview?.candidate;
			const candidate = source && offered?.sessionId === sessionId && offered.sourceId === source.id && offered.sourceRevision === source.revision && (offered.contentType === "article" || offered.contentType === "image-note") && Array.isArray(offered.platforms) && offered.platforms.length > 0 ? offered : null;
			const fallback = !source ? previewForSession(legacy, error, sessionId) : null;
			return {
				currentPreview,
				currentError,
				source,
				candidate,
				candidateStale: !!source && !!offered && !candidate,
				content: fallback?.content ?? null,
				canPublish: !currentError && (!!candidate || !!fallback?.canPublish)
			};
		}
		async function readSessionPreview(sessionId, signal) {
			const response = await fetch(sessionPreviewUrl(sessionId), {
				signal,
				cache: "no-store"
			});
			if (!response.headers.get("content-type")?.includes("application/json")) throw new Error("平台分享预览服务暂未就绪");
			const result = await response.json();
			if (!response.ok) throw new Error(result.error || "无法读取原始文档");
			if (result.sessionId !== sessionId) throw new Error("平台分享预览与当前对话不匹配");
			return result;
		}
		async function readCurrentPreview(sessionId, signal) {
			const preview = await readSessionPreview(sessionId, signal);
			return {
				preview,
				legacy: preview.source ? void 0 : await readSessionContent(sessionId, signal).catch(() => void 0)
			};
		}
		async function openPublicationCandidate(sessionId, candidateId, signal) {
			const response = await fetch(`${API}/publication-open`, {
				method: "POST",
				headers: {
					"content-type": "application/json",
					"x-ejianbao": "1"
				},
				body: JSON.stringify({
					sessionId,
					candidateId
				}),
				signal
			});
			if (!response.headers.get("content-type")?.includes("application/json")) throw new Error("发布准备服务暂未就绪");
			const result = await response.json();
			if (!response.ok) throw new Error(result.error || "无法创建发布准备单");
			if (!result || typeof result.id !== "string" || result.contentType !== "article" && result.contentType !== "image-note") throw new Error("发布准备单响应无效");
			return result;
		}
		async function openPublicationSource(sessionId, sourceRevision, signal) {
			const response = await fetch(`${API}/publication-open-source`, {
				method: "POST",
				headers: {
					"content-type": "application/json",
					"x-ejianbao": "1"
				},
				body: JSON.stringify({
					sessionId,
					sourceRevision
				}),
				signal
			});
			if (!response.headers.get("content-type")?.includes("application/json")) throw new Error("发布准备服务暂未就绪");
			const result = await response.json();
			if (!response.ok) throw new Error(result.error || "无法创建文章草稿");
			if (!result || typeof result.id !== "string" || result.contentType !== "article") throw new Error("文章草稿响应无效");
			return result;
		}
		async function readSessionContent(sessionId, signal) {
			const response = await fetch(sessionContentUrl(sessionId), { signal });
			if (!response.headers.get("content-type")?.includes("application/json")) throw new Error("多平台发布服务暂未就绪");
			const result = await response.json();
			if (!response.ok) throw new Error(result.error || "无法读取会话草稿");
			if (result.sessionId !== sessionId) throw new Error("会话草稿与当前对话不匹配");
			return result;
		}
		const styles = `
.pub-conv-preview { height: 100%; min-height: 0; overflow: auto; padding: 14px; box-sizing: border-box; color: var(--dsw-alias-label-primary, #111318); background: var(--dsw-alias-bg-base, #fff); font: 14px/1.6 var(--dsw-font-family, inherit); }
.pub-conv-preview * { box-sizing: border-box; }
.pub-conv-controls { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }
.pub-conv-controls strong { font-size: 14px; white-space: nowrap; }
.pub-conv-actions { display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: 8px; margin-left: auto; }
.pub-conv-switch { display: inline-flex; flex: none; gap: 2px; padding: 2px; border: 1px solid var(--dsw-alias-border-l2, #d9dce1); border-radius: 11px; background: var(--dsw-alias-bg-module-platform, #f6f7f9); }
.pub-conv-views { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 12px; }
.pub-conv-preview button { cursor: pointer; border: 1px solid var(--dsw-alias-border-l2, #e4e6e9); border-radius: 8px; background: var(--dsw-alias-bg-layer-1, #fff); color: inherit; padding: 5px 9px; font: inherit; }
.pub-conv-preview button[aria-pressed=true] { background: var(--dsw-specific-sidebar-nav-item-active, #edf0f3); font-weight: 600; }
.pub-conv-preview .pub-conv-switch button { min-height: 32px; padding: 5px 12px; border: 0; border-radius: 8px; background: transparent; color: var(--dsw-alias-label-secondary, #626873); font-size: 13px; }
.pub-conv-preview .pub-conv-switch button[aria-pressed=true] { background: var(--dsw-alias-bg-layer-1, #fff); color: var(--dsw-alias-label-primary, #111318); box-shadow: 0 1px 3px #0002; font-weight: 600; }
.pub-conv-preview .pub-conv-publish { min-height: 36px; padding: 6px 12px; border-color: transparent; background: var(--dsw-alias-button-primary-fill, #0f1115); color: var(--dsw-alias-label-primary-foreground, #fff); font-size: 13px; font-weight: 600; white-space: nowrap; }
.pub-conv-preview button:disabled { cursor: not-allowed; opacity: .5; }
.pub-conv-preview button:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary, #4176e6); outline-offset: 2px; }
.pub-conv-device-scroll { overflow-x: auto; }
.pub-conv-device-scroll[data-device=mobile] .pub-source-preview { max-width: 390px; }
.pub-conv-device-scroll[data-device=pc] .pub-source-preview { width: 720px; max-width: none; }
.pub-conv-note, .pub-conv-error, .pub-conv-muted { color: var(--dsw-alias-label-tertiary, #777d85); font-size: 12px; }
.pub-conv-error { color: var(--dsw-alias-state-error-primary, #dc2626); }
${contentPreviewCss}
`;
		function ConversationPreview({ sessionId, useTabInfo, onPublish, onOpenPublisher }) {
			const { tab } = useTabInfo();
			const [device, setDevice] = (0, react.useState)("mobile");
			const [view, setView] = (0, react.useState)("source");
			const [snapshot, setSnapshot] = (0, react.useState)();
			const [legacySnapshot, setLegacySnapshot] = (0, react.useState)();
			const [error, setError] = (0, react.useState)();
			const [actionError, setActionError] = (0, react.useState)();
			const [publishing, setPublishing] = (0, react.useState)(false);
			const publishingRef = (0, react.useRef)(false);
			const openControllerRef = (0, react.useRef)();
			const activeSessionRef = (0, react.useRef)(sessionId);
			activeSessionRef.current = sessionId;
			(0, react.useEffect)(() => {
				previewTabs.register(sessionId, tab.id, tab.signal, () => tab.actions.close());
			}, [
				sessionId,
				tab.id,
				tab.signal,
				tab.actions
			]);
			(0, react.useEffect)(() => {
				setView("source");
				setActionError(void 0);
				setPublishing(false);
				publishingRef.current = false;
				return () => {
					openControllerRef.current?.abort();
				};
			}, [sessionId]);
			(0, react.useEffect)(() => {
				const abort = () => openControllerRef.current?.abort();
				tab.signal.addEventListener("abort", abort);
				return () => tab.signal.removeEventListener("abort", abort);
			}, [tab.signal]);
			(0, react.useEffect)(() => {
				if (!tab.visible) return void 0;
				const controller = new AbortController();
				let pending = false;
				const refresh = async () => {
					if (pending || document.hidden) return;
					pending = true;
					try {
						const next = await readCurrentPreview(sessionId, controller.signal);
						if (controller.signal.aborted) return;
						setSnapshot((previous) => sameSessionPreview(previous, next.preview) ? previous : next.preview);
						setLegacySnapshot((previous) => next.legacy && sameDraftRevision(previous, next.legacy) ? previous : next.legacy);
						setError(void 0);
						if (!next.preview.source && !(next.legacy && previewableContentId(next.legacy))) tab.actions.close();
					} catch (cause) {
						if (!controller.signal.aborted) setError({
							sessionId,
							message: cause instanceof Error ? cause.message : "无法读取平台分享预览"
						});
					} finally {
						pending = false;
					}
				};
				refresh();
				const interval = window.setInterval(() => {
					refresh();
				}, 3e3);
				const onVisibility = () => {
					if (!document.hidden) refresh();
				};
				document.addEventListener("visibilitychange", onVisibility);
				return () => {
					controller.abort();
					window.clearInterval(interval);
					document.removeEventListener("visibilitychange", onVisibility);
				};
			}, [
				sessionId,
				tab.visible,
				tab.actions
			]);
			const { currentPreview, currentError, source, candidate, candidateStale, content, canPublish } = sourcePreviewForSession(snapshot, legacySnapshot, error, sessionId);
			const activeView = candidate && (view === "source" || view === "master" || candidate.platforms.includes(view)) ? view : "source";
			const variant = candidate && activeView !== "source" && activeView !== "master" ? candidate.platformVariants[activeView] : void 0;
			const displaySource = source && candidate && activeView !== "source" ? {
				...source,
				title: variant?.title ?? candidate.title,
				body: variant?.body ?? candidate.body
			} : source;
			const publish = async () => {
				if (!canPublish && !(source && !currentError) || publishingRef.current) return;
				if (!source) {
					if (!content) return;
					try {
						onPublish(content);
					} catch (cause) {
						setActionError({
							sessionId,
							message: cause instanceof Error ? cause.message : "无法打开发布页面"
						});
					}
					return;
				}
				const controller = new AbortController();
				openControllerRef.current = controller;
				publishingRef.current = true;
				setPublishing(true);
				setActionError(void 0);
				try {
					const preparation = candidate ? await openPublicationCandidate(sessionId, candidate.id, controller.signal) : await openPublicationSource(sessionId, source.revision, controller.signal);
					if (!controller.signal.aborted && activeSessionRef.current === sessionId) if (candidate) onPublish(preparation, [...candidate.platforms]);
					else onPublish(preparation);
				} catch (cause) {
					if (!controller.signal.aborted && activeSessionRef.current === sessionId) setActionError({
						sessionId,
						message: cause instanceof Error ? cause.message : candidate ? "无法创建发布准备单" : "无法打开文章草稿"
					});
				} finally {
					if (openControllerRef.current === controller) {
						openControllerRef.current = void 0;
						publishingRef.current = false;
						if (activeSessionRef.current === sessionId) setPublishing(false);
					}
				}
			};
			const openPublisher = () => {
				if (publishingRef.current) return;
				if (canPublish || source && !currentError) {
					publish();
					return;
				}
				try {
					onOpenPublisher();
				} catch (cause) {
					setActionError({
						sessionId,
						message: cause instanceof Error ? cause.message : "无法打开多平台发布"
					});
				}
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "pub-conv-preview",
				"data-publisher-preview-session": sessionId,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("style", { children: styles }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-conv-controls",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "平台分享预览" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pub-conv-actions",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pub-conv-switch",
								role: "group",
								"aria-label": "预览设备",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": device === "mobile",
									onClick: () => setDevice("mobile"),
									children: "移动端"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": device === "pc",
									onClick: () => setDevice("pc"),
									children: "PC"
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "pub-conv-publish",
								disabled: publishing,
								onClick: openPublisher,
								children: publishing ? "正在准备发布…" : "多平台发布"
							})]
						})]
					}),
					currentError && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
						className: "pub-conv-error",
						role: "status",
						children: [currentError, "；稍后会自动重试。"]
					}),
					actionError?.sessionId === sessionId && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-conv-error",
						role: "status",
						children: actionError.message
					}),
					!currentPreview && !currentError && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-conv-muted",
						children: "正在读取原始文档…"
					}),
					currentPreview && !source && !content && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-conv-note",
						children: "与 Agent 完成内容后，原始 MD 会显示在这里。"
					}),
					source && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
						candidate && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pub-conv-views",
							role: "group",
							"aria-label": "发布候选预览",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": activeView === "source",
									onClick: () => setView("source"),
									children: "原稿"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": activeView === "master",
									onClick: () => setView("master"),
									children: "发布主稿"
								}),
								candidate.platforms.map((platform) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": activeView === platform,
									onClick: () => setView(platform),
									children: PLATFORM_LABELS[platform]
								}, platform))
							]
						}),
						candidateStale && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "pub-conv-error",
							role: "status",
							children: "原稿已更新，发布候选已失效。请在对话中重新准备发布预览。"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pub-conv-device-scroll",
							"data-device": device,
							"aria-label": device === "mobile" ? "移动端平台分享预览" : "PC 平台分享预览",
							children: displaySource && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SourceDocumentPreview, {
								source: displaySource,
								imageUrl: sourceImageUrl,
								showUnusedImages: activeView === "source",
								imagePresentation: candidate && activeView !== "source" && candidate.contentType === "image-note" ? "gallery" : "inline"
							})
						}),
						candidate && activeView !== "source" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pub-conv-note",
							"aria-label": "发布候选信息",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: ["内容类型：", candidate.contentType === "article" ? "文章" : "图文"] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: ["摘要：", (variant?.summary ?? candidate.summary) || "未设置"] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: ["标签：", (variant?.tags ?? candidate.tags).length ? (variant?.tags ?? candidate.tags).map((tag) => `#${tag}`).join(" ") : "未设置"] }),
								candidate.contentType === "image-note" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: "图片素材将在发布页作为图集提交；Markdown 图片语法不作为图文正文。" }),
								activeView !== "master" && (candidate.warnings?.[activeView] ?? []).map((warning, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "pub-conv-error",
									role: "status",
									children: warning
								}, `${activeView}-${index}`))
							]
						}),
						candidate ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "pub-conv-note",
							children: activeView === "source" ? "原始 MD 预览。" : "发布候选预览；各平台最终呈现请以平台后台为准。"
						}) : !candidateStale && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "pub-conv-note",
							children: "点击“多平台发布”可将当前原稿带入文章草稿；选择账号和提交方式后再发布。"
						})
					] }),
					!source && content && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pub-conv-device-scroll",
						"aria-label": device === "mobile" ? "移动端平台分享预览" : "PC 平台分享预览",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherContentPreview, {
							content,
							device
						})
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-conv-note",
						children: "这是旧会话草稿的预览；各平台实际显示以发布后的页面为准。"
					})] })
				]
			});
		}
		function ConversationPreviewAction({ sessionId, openPreview }) {
			const [availability, setAvailability] = (0, react.useState)();
			(0, react.useEffect)(() => {
				const controller = new AbortController();
				let pending = false;
				let previous;
				const discover = async () => {
					if (pending || document.hidden) return;
					pending = true;
					try {
						const snapshot = await readCurrentPreview(sessionId, controller.signal);
						if (controller.signal.aborted) return;
						const next = advanceSessionPreviewDiscovery(previous, snapshot.preview, snapshot.legacy);
						previous = next.state;
						setAvailability((current) => current?.sessionId === sessionId && current.showAction === next.showAction ? current : {
							sessionId,
							showAction: next.showAction
						});
						if (next.closePreview) previewTabs.closeSession(sessionId);
						if (next.autoOpen) openPreview();
					} catch {} finally {
						pending = false;
					}
				};
				discover();
				const interval = window.setInterval(() => {
					discover();
				}, 3500);
				const onVisibility = () => {
					if (!document.hidden) discover();
				};
				document.addEventListener("visibilitychange", onVisibility);
				return () => {
					controller.abort();
					window.clearInterval(interval);
					document.removeEventListener("visibilitychange", onVisibility);
				};
			}, [sessionId, openPreview]);
			if (availability?.sessionId !== sessionId || !availability.showAction) return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				title: "打开当前会话的平台分享预览",
				onClick: openPreview,
				style: {
					cursor: "pointer",
					border: 0,
					borderRadius: 8,
					padding: "5px 8px",
					background: "transparent",
					color: "inherit"
				},
				children: "平台分享预览"
			});
		}
		//#endregion
		//#region src/client/draft-gallery.tsx
		const emptyGallery = {
			items: [],
			nextCursor: null,
			initialized: false,
			loading: false,
			error: ""
		};
		/** A page can overlap a refreshed page when another edit changes its sort order. */
		function appendUniqueCards(previous, incoming) {
			const seen = new Set(previous.map((item) => item.id));
			return [...previous, ...incoming.filter((item) => {
				if (seen.has(item.id)) return false;
				seen.add(item.id);
				return true;
			})];
		}
		function galleryColumnCount(width) {
			return width < 380 ? 1 : width < 700 ? 2 : width < 980 ? 3 : 4;
		}
		/** Existing cards retain their column when a later page is appended. */
		function distributeGalleryCards(items, count) {
			const columns = Array.from({ length: count }, () => []);
			items.forEach((item, index) => columns[index % count].push(item));
			return columns;
		}
		function galleryCoverUrl(item) {
			return item.coverAssetId ? contentAssetUrl(item.id, item.coverAssetId) : void 0;
		}
		function videoGalleryPreviewUrl(source) {
			if (!source) return void 0;
			const id = source.kind === "work" ? source.workId : source.localVideoId;
			return `${API}/video-preview/${source.kind}/${encodeURIComponent(id)}#t=0.1`;
		}
		function updatedLabel(value) {
			const date = new Date(value);
			return Number.isNaN(date.getTime()) ? "修改时间未知" : `${date.toLocaleString()} 修改`;
		}
		const PUBLICATION_LABELS = {
			unpublished: "未发布",
			queued: "等待发布",
			publishing: "发布中",
			published: "已发布",
			"platform-draft": "已存平台草稿",
			failed: "发布失败",
			unknown: "状态未知"
		};
		/** Attach the existing range-capable preview only when the card approaches the scroll view. */
		function VideoFirstFrame({ source }) {
			const holderRef = (0, react.useRef)(null);
			const [near, setNear] = (0, react.useState)(false);
			const [ready, setReady] = (0, react.useState)(false);
			const [failed, setFailed] = (0, react.useState)(false);
			const url = videoGalleryPreviewUrl(source);
			(0, react.useEffect)(() => {
				setNear(false);
				setReady(false);
				setFailed(false);
				if (!url || !holderRef.current) return;
				if (typeof IntersectionObserver === "undefined") {
					setNear(true);
					return;
				}
				const observer = new IntersectionObserver((entries) => {
					if (entries.some((entry) => entry.isIntersecting)) {
						setNear(true);
						observer.disconnect();
					}
				}, {
					root: holderRef.current.closest(".pub"),
					rootMargin: "240px"
				});
				observer.observe(holderRef.current);
				return () => observer.disconnect();
			}, [url]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				ref: holderRef,
				className: "pub-gallery-video-frame",
				children: [
					url && near && !failed && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("video", {
						className: ready ? "pub-gallery-video-ready" : "",
						src: url,
						preload: "metadata",
						muted: true,
						playsInline: true,
						"aria-hidden": "true",
						tabIndex: -1,
						onLoadedMetadata: (event) => {
							const video = event.currentTarget;
							if (Number.isFinite(video.duration) && video.duration > 0) video.currentTime = Math.min(.1, video.duration / 2);
						},
						onLoadedData: () => setReady(true),
						onSeeked: () => setReady(true),
						onError: () => setFailed(true)
					}),
					(!ready || failed) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "pub-gallery-media-placeholder",
						"aria-hidden": "true",
						children: "视频"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "pub-gallery-play",
						"aria-hidden": "true",
						children: "▶"
					})
				]
			});
		}
		function DraftGalleryCard({ item, menuOpen, busy = false, trash = false, onRestore, onPreview, onPublish, onMenu, onOpen, onCopy, onDelete }) {
			const title = item.title.trim() || "未命名草稿";
			const article = item.contentType === "article";
			const cover = galleryCoverUrl(item);
			const [coverFailed, setCoverFailed] = (0, react.useState)(false);
			(0, react.useEffect)(() => setCoverFailed(false), [cover]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
				className: `pub-gallery-card ${article ? "pub-gallery-card-article" : "pub-gallery-card-social"}`,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "pub-gallery-open",
					disabled: busy || trash,
					onClick: onOpen,
					"aria-label": `${trash ? "已删除" : "编辑"}${CONTENT_LABELS[item.contentType]}：${title}`,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-gallery-media",
						children: [trash ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "pub-gallery-media-placeholder",
							"aria-hidden": "true",
							children: CONTENT_LABELS[item.contentType]
						}) : item.contentType === "video" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(VideoFirstFrame, { source: item.videoSource }) : cover && !coverFailed ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
							src: cover,
							alt: "",
							loading: "lazy",
							onError: () => setCoverFailed(true)
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "pub-gallery-media-placeholder",
							"aria-hidden": "true",
							children: article ? "文章" : "图文"
						}), article && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "pub-gallery-article-overlay",
							children: title
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-gallery-copy",
						children: [
							!article && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", {
								className: "pub-gallery-title",
								children: title
							}),
							item.excerpt && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: item.excerpt }),
							!trash && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "pub-gallery-publication",
								"aria-label": `发布状态：${PUBLICATION_LABELS[item.publication?.state ?? "unknown"]}`,
								children: PUBLICATION_LABELS[item.publication?.state ?? "unknown"]
							}),
							trash && item.lifecyclePending && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "pub-gallery-pending",
								role: "status",
								children: item.lifecyclePending === "trash" ? "回收尚未完成，请重试删除。" : "恢复尚未完成，请重试恢复。"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: updatedLabel(item.updatedAt) })
						]
					})]
				}), trash ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: "pub-gallery-restore",
					disabled: busy,
					onClick: item.lifecyclePending === "trash" ? onDelete : onRestore,
					"aria-label": `${item.lifecyclePending === "trash" ? "重试删除" : item.lifecyclePending === "restore" ? "重试恢复" : "恢复"}${title}`,
					children: item.lifecyclePending === "trash" ? "重试删除" : item.lifecyclePending === "restore" ? "重试恢复" : "恢复稿件"
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-gallery-quick-actions",
						children: [onPreview && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: busy,
							onClick: onPreview,
							"aria-label": `预览${title}`,
							children: "预览"
						}), onPublish && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: busy,
							onClick: onPublish,
							"aria-label": `发布${title}`,
							children: "发布"
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: "pub-gallery-more",
						"aria-label": `${title}的更多操作`,
						"aria-expanded": menuOpen,
						disabled: busy,
						onClick: onMenu,
						children: "···"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: `pub-gallery-actions${menuOpen ? " pub-gallery-actions-open" : ""}`,
						role: "group",
						"aria-label": `${title}的草稿操作`,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: busy,
								onClick: onOpen,
								children: "编辑"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: busy,
								onClick: onCopy,
								children: "复制"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: busy,
								className: "pub-gallery-delete",
								onClick: onDelete,
								children: "删除"
							})
						]
					})
				] })]
			});
		}
		function DraftGallery({ contentType, active, busy = false, trash = false, refreshKey = 0, onOpen, onPreview, onPublish, onCreate, onCopy, onDelete, onRestore }) {
			const [searchText, setSearchText] = (0, react.useState)("");
			const [query, setQuery] = (0, react.useState)("");
			const [searchRevision, setSearchRevision] = (0, react.useState)(0);
			const [state, setState] = (0, react.useState)(emptyGallery);
			const [menuId, setMenuId] = (0, react.useState)(null);
			const [columnCount, setColumnCount] = (0, react.useState)(4);
			const sentinelRef = (0, react.useRef)(null);
			const rootRef = (0, react.useRef)(null);
			const savedScrollTop = (0, react.useRef)(null);
			const generation = (0, react.useRef)(0);
			const loading = (0, react.useRef)(false);
			const activeRef = (0, react.useRef)(active);
			const searchPending = (0, react.useRef)(false);
			const previousRequest = (0, react.useRef)(null);
			const refreshTargetCount = (0, react.useRef)(null);
			const loadedFor = (0, react.useRef)("");
			const stateRef = (0, react.useRef)(state);
			activeRef.current = active;
			stateRef.current = state;
			const requestIdentity = `${contentType}\0${query}\0${refreshKey}\0${searchRevision}\0${trash}`;
			const loadPage = (0, react.useCallback)(async (cursor) => {
				if (!activeRef.current || loading.current) return;
				loading.current = true;
				const requestedGeneration = generation.current;
				setState((current) => ({
					...current,
					loading: true,
					error: ""
				}));
				try {
					const result = await api("contents-query", {
						contentType,
						query,
						...cursor ? { cursor } : {},
						...trash ? { trash: true } : {}
					});
					if (requestedGeneration !== generation.current || !activeRef.current) return;
					if (!cursor) loadedFor.current = requestIdentity;
					setState((current) => ({
						items: cursor ? appendUniqueCards(current.items, result.items) : result.items,
						nextCursor: result.nextCursor,
						initialized: true,
						loading: false,
						error: ""
					}));
				} catch (cause) {
					if (requestedGeneration !== generation.current || !activeRef.current) return;
					setState((current) => ({
						...current,
						initialized: true,
						loading: false,
						error: errorMessage(cause)
					}));
				} finally {
					if (requestedGeneration === generation.current) loading.current = false;
				}
			}, [
				contentType,
				query,
				requestIdentity
			]);
			const refreshLoadedPages = (0, react.useCallback)(async (targetCount) => {
				if (!activeRef.current || loading.current) return;
				loading.current = true;
				const requestedGeneration = generation.current;
				setState((current) => ({
					...current,
					loading: true,
					error: ""
				}));
				try {
					let cursor = null;
					let items = [];
					do {
						const result = await api("contents-query", {
							contentType,
							query,
							...cursor ? { cursor } : {},
							...trash ? { trash: true } : {}
						});
						if (requestedGeneration !== generation.current || !activeRef.current) return;
						items = appendUniqueCards(items, result.items);
						cursor = result.nextCursor;
					} while (cursor && items.length < targetCount);
					loadedFor.current = requestIdentity;
					refreshTargetCount.current = null;
					setState({
						items,
						nextCursor: cursor,
						initialized: true,
						loading: false,
						error: ""
					});
				} catch (cause) {
					if (requestedGeneration !== generation.current || !activeRef.current) return;
					setState((current) => ({
						...current,
						loading: false,
						error: errorMessage(cause)
					}));
				} finally {
					if (requestedGeneration === generation.current) loading.current = false;
				}
			}, [
				contentType,
				query,
				requestIdentity
			]);
			(0, react.useEffect)(() => {
				const previous = previousRequest.current;
				const refreshing = previous?.contentType === contentType && previous.query === query && previous.trash === trash && previous?.refreshKey !== refreshKey && stateRef.current.initialized;
				previousRequest.current = {
					contentType,
					query,
					refreshKey,
					trash
				};
				generation.current += 1;
				loading.current = false;
				if (refreshing) {
					refreshTargetCount.current = Math.max(1, stateRef.current.items.length);
					if (activeRef.current) refreshLoadedPages(refreshTargetCount.current);
				} else {
					refreshTargetCount.current = null;
					loadedFor.current = "";
					setState(emptyGallery);
					if (activeRef.current) loadPage(null);
				}
				return () => {
					generation.current += 1;
					loading.current = false;
				};
			}, [
				contentType,
				query,
				refreshKey,
				searchRevision,
				loadPage,
				refreshLoadedPages
			]);
			(0, react.useEffect)(() => {
				if (!active) {
					generation.current += 1;
					loading.current = false;
					setState((current) => ({
						...current,
						loading: false
					}));
				} else if (refreshTargetCount.current !== null && !loading.current && !state.error) refreshLoadedPages(refreshTargetCount.current);
				else if (!state.initialized && !loading.current && !state.error && searchText.trim() === query) loadPage(null);
			}, [
				active,
				state.initialized,
				state.error,
				searchText,
				query,
				loadPage,
				refreshLoadedPages
			]);
			(0, react.useEffect)(() => {
				const nextQuery = searchText.trim();
				if (nextQuery === query) return;
				const timeout = setTimeout(() => {
					searchPending.current = false;
					setQuery(nextQuery);
				}, 300);
				return () => clearTimeout(timeout);
			}, [searchText, query]);
			(0, react.useEffect)(() => {
				if (!active || !state.initialized || state.loading || state.error || !state.nextCursor || searchText.trim() !== query) return;
				const target = sentinelRef.current;
				if (!target) return;
				if (typeof IntersectionObserver === "undefined") return;
				const observer = new IntersectionObserver((entries) => {
					if (entries.some((entry) => entry.isIntersecting)) loadPage(state.nextCursor);
				}, {
					root: target.closest(".pub"),
					rootMargin: "320px"
				});
				observer.observe(target);
				return () => observer.disconnect();
			}, [
				active,
				state.initialized,
				state.loading,
				state.error,
				state.nextCursor,
				searchText,
				query,
				loadPage
			]);
			(0, react.useLayoutEffect)(() => {
				if (!active || savedScrollTop.current === null || state.loading || loadedFor.current !== requestIdentity) return;
				const scrollRoot = rootRef.current?.closest(".pub");
				if (scrollRoot) scrollRoot.scrollTop = savedScrollTop.current;
				savedScrollTop.current = null;
			}, [
				active,
				state.loading,
				state.items.length,
				requestIdentity
			]);
			(0, react.useEffect)(() => {
				if (!menuId) return;
				const close = (event) => {
					if (event.key === "Escape") setMenuId(null);
				};
				const closeOutside = (event) => {
					if (!(event.target instanceof Element) || !event.target.closest(".pub-gallery-more, .pub-gallery-actions")) setMenuId(null);
				};
				document.addEventListener("keydown", close);
				document.addEventListener("pointerdown", closeOutside);
				return () => {
					document.removeEventListener("keydown", close);
					document.removeEventListener("pointerdown", closeOutside);
				};
			}, [menuId]);
			(0, react.useEffect)(() => {
				if (contentType === "article") return;
				const gallery = rootRef.current;
				if (!gallery) return;
				const measure = () => {
					const width = gallery.getBoundingClientRect().width;
					if (width > 0) setColumnCount(galleryColumnCount(width));
				};
				measure();
				if (typeof ResizeObserver !== "undefined") {
					const observer = new ResizeObserver(measure);
					observer.observe(gallery);
					return () => observer.disconnect();
				}
				window.addEventListener("resize", measure);
				return () => window.removeEventListener("resize", measure);
			}, [contentType, active]);
			const rememberScroll = () => {
				savedScrollTop.current = rootRef.current?.closest(".pub")?.scrollTop ?? 0;
			};
			const open = (id) => {
				rememberScroll();
				setMenuId(null);
				onOpen(id);
			};
			const create = () => {
				rememberScroll();
				setMenuId(null);
				onCreate();
			};
			const copy = (id) => {
				rememberScroll();
				setMenuId(null);
				onCopy(id);
			};
			const remove = (id) => {
				setMenuId(null);
				onDelete(id);
			};
			const changeSearch = (value) => {
				if (value.trim() !== query) {
					generation.current += 1;
					loading.current = false;
					searchPending.current = true;
				} else if (searchPending.current) {
					searchPending.current = false;
					setSearchRevision((current) => current + 1);
				}
				setSearchText(value);
			};
			const searchDebouncing = searchText.trim() !== query;
			const label = CONTENT_LABELS[contentType];
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				ref: rootRef,
				className: "pub-gallery",
				"aria-label": `${label}${trash ? "回收站" : "草稿库"}`,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "pub-gallery-toolbar",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						className: "pub-input pub-gallery-search",
						type: "search",
						"aria-label": `搜索${label}草稿`,
						placeholder: `搜索${label}标题和${contentType === "article" ? "摘要" : contentType === "video" ? "简介" : "正文"}`,
						maxLength: 200,
						value: searchText,
						onChange: (event) => changeSearch(event.target.value.slice(0, 200))
					}), !trash && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "pub-gallery-create",
						disabled: busy,
						onClick: create,
						children: ["＋ 新增", label]
					})]
				}), searchDebouncing ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "pub-gallery-status",
					role: "status",
					children: "正在搜索…"
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
					state.items.length > 0 && (contentType === "article" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pub-gallery-articles",
						children: state.items.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(DraftGalleryCard, {
							item,
							menuOpen: menuId === item.id,
							busy,
							trash,
							onRestore: () => onRestore?.(item.id),
							onPreview: onPreview ? () => {
								rememberScroll();
								onPreview(item.id);
							} : void 0,
							onPublish: onPublish ? () => {
								rememberScroll();
								onPublish(item.id);
							} : void 0,
							onMenu: () => setMenuId((current) => current === item.id ? null : item.id),
							onOpen: () => open(item.id),
							onCopy: () => copy(item.id),
							onDelete: () => remove(item.id)
						}, item.id))
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: `pub-gallery-masonry pub-gallery-cols-${columnCount}`,
						children: distributeGalleryCards(state.items, columnCount).map((column, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pub-gallery-column",
							children: column.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(DraftGalleryCard, {
								item,
								menuOpen: menuId === item.id,
								busy,
								trash,
								onRestore: () => onRestore?.(item.id),
								onPreview: onPreview ? () => {
									rememberScroll();
									onPreview(item.id);
								} : void 0,
								onPublish: onPublish ? () => {
									rememberScroll();
									onPublish(item.id);
								} : void 0,
								onMenu: () => setMenuId((current) => current === item.id ? null : item.id),
								onOpen: () => open(item.id),
								onCopy: () => copy(item.id),
								onDelete: () => remove(item.id)
							}, item.id))
						}, index))
					})),
					state.loading && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-gallery-status",
						role: "status",
						children: "正在加载草稿…"
					}),
					state.error && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-gallery-status pub-gallery-load-error",
						role: "alert",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: ["加载失败：", state.error] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => refreshTargetCount.current !== null ? void refreshLoadedPages(refreshTargetCount.current) : void loadPage(state.initialized && state.items.length ? state.nextCursor : null),
							children: "重试"
						})]
					}),
					state.initialized && !state.loading && !state.error && state.items.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pub-empty",
						children: query ? "没有找到匹配的草稿，请换个关键词。" : trash ? `没有已删除的${label}稿件。` : `还没有${label}草稿，点击“新增${label}”开始创作。`
					}),
					state.initialized && !state.loading && !state.error && state.items.length > 0 && !state.nextCursor && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-gallery-status",
						role: "status",
						children: "已显示全部草稿"
					}),
					state.nextCursor && !state.error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						ref: sentinelRef,
						className: "pub-gallery-sentinel",
						"aria-hidden": "true"
					})
				] })]
			});
		}
		//#endregion
		//#region src/client/history-target.ts
		function canOpenTarget(state) {
			return state !== "queued" && state !== "running";
		}
		function openTargetNotice(kind, state, platform) {
			let message;
			switch (kind) {
				case "draft":
					message = "已打开平台草稿。";
					break;
				case "draft-list":
					message = "已打开草稿列表，请在平台内查找对应稿件。";
					break;
				case "content-list":
					message = "已打开内容列表，请在平台内查找对应稿件。";
					break;
				case "backend":
					message = "已打开创作后台；当前无法确认专用列表，请在平台内查找对应稿件。";
					break;
				case "review-window":
					if (platform === "tt") return "已打开头条稿件，请在平台内查看并补齐图片。";
					return state === "unknown" ? "已切换到待核查的发布窗口，请先确认平台结果。" : state === "completed" ? "已切换到保留的草稿窗口，请在平台内查看稿件。" : "已切换到保留的平台窗口，请核对稿件与提交结果。";
				default: throw new Error("平台打开结果无效，请刷新后重试");
			}
			if (state === "unknown") return `${message}${platform === "tt" ? "这条任务未完成，请核对平台稿件。" : "这条任务结果仍待确认，请核对平台状态。"}`;
			if (state === "failed") return `${message}这条任务执行失败，请核对平台是否留下稿件。`;
			return message;
		}
		//#endregion
		//#region src/client/history.tsx
		const PAGE_SIZE = 10;
		const STATE_TONES = {
			queued: "neutral",
			running: "info",
			unknown: "warning",
			completed: "success",
			failed: "danger"
		};
		function SubmissionHistory({ active }) {
			const { showError, showSuccess, clearTip } = usePublisherTips();
			const [rows, setRows] = (0, react.useState)([]);
			const [filter, setFilter] = (0, react.useState)("all");
			const [query, setQuery] = (0, react.useState)("");
			const [page, setPage] = (0, react.useState)(1);
			const [refreshing, setRefreshing] = (0, react.useState)(false);
			const [deleting, setDeleting] = (0, react.useState)(false);
			const [openingTarget, setOpeningTarget] = (0, react.useState)();
			const [deleteTarget, setDeleteTarget] = (0, react.useState)();
			const [acknowledgedUnknown, setAcknowledgedUnknown] = (0, react.useState)(false);
			const busyRef = (0, react.useRef)(false);
			const openingRef = (0, react.useRef)(false);
			const requestSequence = (0, react.useRef)(0);
			const focusAfterDelete = (0, react.useRef)(false);
			const refresh = async () => {
				const sequence = ++requestSequence.current;
				setRefreshing(true);
				try {
					const submissions = await api("submissions");
					if (sequence === requestSequence.current) setRows(submissions.map(projectSubmissionForDisplay));
				} catch (cause) {
					if (sequence === requestSequence.current) showError(errorMessage(cause));
				} finally {
					if (sequence === requestSequence.current) setRefreshing(false);
				}
			};
			(0, react.useEffect)(() => {
				if (active) refresh();
			}, [active]);
			(0, react.useEffect)(() => {
				if (!deleteTarget && focusAfterDelete.current) {
					focusAfterDelete.current = false;
					document.getElementById("pub-history-search")?.focus();
				}
			}, [deleteTarget, rows]);
			const search = query.trim().toLocaleLowerCase();
			const filtered = rows.filter((item) => {
				if (filter !== "all" && (item.contentType ?? "video") !== filter) return false;
				if (!search) return true;
				return [
					item.title,
					CONTENT_LABELS[item.contentType ?? "video"],
					item.mode === "publish" ? "立即发布" : "转存草稿",
					submissionStateLabel(item),
					...item.targets.flatMap((target) => [PLATFORM_LABELS[target.platform], target.accountName])
				].some((term) => term.toLocaleLowerCase().includes(search));
			});
			const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
			const currentPage = Math.min(page, pageCount);
			const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
			(0, react.useEffect)(() => {
				if (page > pageCount) setPage(pageCount);
			}, [page, pageCount]);
			const closeDelete = () => {
				if (busyRef.current) return;
				setDeleteTarget(void 0);
				setAcknowledgedUnknown(false);
			};
			const confirmDelete = async () => {
				if (!deleteTarget || busyRef.current || deleteTarget.state === "unknown" && !acknowledgedUnknown) return;
				busyRef.current = true;
				setDeleting(true);
				clearTip();
				try {
					await api("submission-delete", {
						id: deleteTarget.id,
						...deleteTarget.state === "unknown" ? { acknowledgeUnknown: true } : {}
					});
					++requestSequence.current;
					setRefreshing(false);
					setRows((current) => current.filter((item) => item.id !== deleteTarget.id));
					focusAfterDelete.current = true;
					setDeleteTarget(void 0);
					setAcknowledgedUnknown(false);
					showSuccess("本机历史记录已删除");
				} catch (cause) {
					showError(errorMessage(cause));
				} finally {
					busyRef.current = false;
					setDeleting(false);
				}
			};
			const openTarget = async (submissionId, accountId, state, listOnly = false) => {
				if (openingRef.current) return;
				openingRef.current = true;
				setOpeningTarget(`${submissionId}:${accountId}:${listOnly ? "list" : "target"}`);
				clearTip();
				try {
					const result = await api("submission-open-target", {
						submissionId,
						accountId,
						...listOnly ? { listOnly: true } : {}
					});
					const platform = rows.find((item) => item.id === submissionId)?.targets.find((target) => target.accountId === accountId)?.platform;
					showSuccess(openTargetNotice(result.kind, state, platform));
				} catch (cause) {
					showError(errorMessage(cause));
				} finally {
					openingRef.current = false;
					setOpeningTarget(void 0);
				}
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "pub-head pub-history-head",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "发布历史" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-muted",
						children: "这里只记录已经被本机队列接受的提交，不代表平台最终发布成功。"
					})] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-actions pub-history-tools",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
								id: "pub-history-search",
								className: "pub-input-wrap pub-history-search",
								type: "search",
								"aria-label": "搜索发布历史",
								placeholder: "搜索标题、平台或账号",
								value: query,
								onChange: (event) => {
									setQuery(event.target.value);
									setPage(1);
								}
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
								className: "pub-input",
								"aria-label": "筛选内容类型",
								value: filter,
								onChange: (event) => {
									setFilter(event.target.value);
									setPage(1);
								},
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "all",
										children: "全部类型"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "article",
										children: "文章"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "image-note",
										children: "图文"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "video",
										children: "视频"
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								size: "sm",
								variant: "outline",
								disabled: refreshing || deleting,
								onClick: () => void refresh(),
								children: refreshing ? "刷新中…" : "刷新记录"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pub-card",
					children: filtered.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pub-empty",
						children: rows.length === 0 ? refreshing ? "正在加载记录…" : "暂无提交记录" : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: "没有符合条件的记录" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "outline",
							size: "sm",
							onClick: () => {
								setQuery("");
								setFilter("all");
								setPage(1);
								document.getElementById("pub-history-search")?.focus();
							},
							children: "清空筛选"
						})] })
					}) : visible.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-submission",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pub-submission-head",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("strong", { children: [
									CONTENT_LABELS[item.contentType ?? "video"],
									" · ",
									item.title
								] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", {
									className: "pub-muted",
									children: new Date(item.createdAt).toLocaleString()
								})] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "outline",
									size: "sm",
									className: "pub-danger-action",
									disabled: deleting || openingTarget !== void 0 || !canOpenTarget(item.state),
									title: item.state === "queued" || item.state === "running" ? "提交仍在队列中，不能删除" : void 0,
									"aria-label": `删除记录：${item.title}，${new Date(item.createdAt).toLocaleString()}`,
									onClick: () => {
										setAcknowledgedUnknown(false);
										setDeleteTarget(item);
									},
									children: "删除"
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pub-tags",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
									tone: item.mode === "publish" ? "info" : "neutral",
									children: item.mode === "publish" ? "立即发布" : "转存草稿"
								}), item.state && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
									tone: STATE_TONES[item.state],
									children: submissionStateLabel(item)
								})]
							}),
							item.message && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "pub-history-result pub-muted",
								children: item.message
							}),
							item.requestedMode === "publish" && item.mode === "draft" && (!isToutiaoOnly(item.targets.map((target) => target.platform)) || !!item.adjustments?.length) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "pub-history-result pub-warn",
								children: "文章已按平台要求调整，本次转存草稿供核对。"
							}),
							!!item.adjustments?.length && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
								className: "pub-history-result pub-muted",
								children: item.adjustments.flatMap((adjustment) => {
									const target = item.targets.find((row) => row.accountId === adjustment.accountId);
									return adjustment.messages.map((message) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [
										target ? PLATFORM_LABELS[target.platform] : "目标平台",
										"：",
										message
									] }, `${adjustment.accountId}:${message}`));
								})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "pub-targets",
								children: item.targets.map((target) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "pub-target-group",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										variant: "outline",
										size: "sm",
										disabled: deleting || openingTarget !== void 0 || !canOpenTarget(item.state),
										title: !canOpenTarget(item.state) ? "提交仍在队列中，暂不能查看平台稿件" : void 0,
										onClick: () => void openTarget(item.id, target.accountId, item.state),
										children: [
											PLATFORM_LABELS[target.platform],
											" · ",
											target.accountName,
											" · ",
											openingTarget === `${item.id}:${target.accountId}:target` ? "正在打开…" : "查看平台稿件"
										]
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										variant: "outline",
										size: "sm",
										"aria-label": `打开${PLATFORM_LABELS[target.platform]}账号${target.accountName}的列表`,
										disabled: deleting || openingTarget !== void 0 || !canOpenTarget(item.state),
										title: !canOpenTarget(item.state) ? "提交仍在队列中，暂不能打开列表" : "列表不可用时打开创作后台",
										onClick: () => void openTarget(item.id, target.accountId, item.state, true),
										children: openingTarget === `${item.id}:${target.accountId}:list` ? "正在打开…" : "打开列表"
									})]
								}, `${item.id}:${target.accountId}`))
							})
						]
					}, item.id))
				}),
				filtered.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("nav", {
					className: "pub-history-pagination",
					"aria-label": "发布历史分页",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "pub-muted",
						"aria-live": "polite",
						children: [
							"共 ",
							filtered.length,
							" 条 · 第 ",
							currentPage,
							" / ",
							pageCount,
							" 页 · 每页 ",
							PAGE_SIZE,
							" 条"
						]
					}), pageCount > 1 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-history-page-actions",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "outline",
							size: "sm",
							disabled: currentPage <= 1,
							onClick: () => setPage(currentPage - 1),
							children: "上一页"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "outline",
							size: "sm",
							disabled: currentPage >= pageCount,
							onClick: () => setPage(currentPage + 1),
							children: "下一页"
						})]
					})]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(PublisherModal, {
					open: deleteTarget !== void 0,
					title: "删除发布历史",
					closeLabel: "关闭删除历史确认",
					description: deleteTarget ? `删除“${deleteTarget.title}”这条本机历史记录？` : "",
					className: "pub-modal",
					onClose: closeDelete,
					footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						size: "sm",
						variant: "outline",
						"data-pub-initial-focus": true,
						disabled: deleting,
						onClick: closeDelete,
						children: "取消"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						size: "sm",
						variant: "outline",
						className: "pub-danger-action",
						disabled: deleting || deleteTarget?.state === "unknown" && !acknowledgedUnknown,
						onClick: () => void confirmDelete(),
						children: deleting ? "正在删除…" : "确认删除"
					})] }),
					children: [deleteTarget?.state === "unknown" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
						className: "pub-modal-copy",
						children: [
							submissionStateLabel(deleteTarget) === "未完成" ? "这条任务未完成。" : "这条提交的结果尚未确认。",
							deleteTarget.message && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								"原因：",
								deleteTarget.message,
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("br", {})
							] }),
							"删除前请到对应平台后台核对。"
						]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: "pub-history-acknowledge",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: acknowledgedUnknown,
							onChange: (event) => setAcknowledgedUnknown(event.target.checked)
						}), "我已核对平台状态，了解删除不会撤回平台内容"]
					})] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
						className: "pub-modal-copy",
						children: [
							"删除仅移除本机记录",
							deleteTarget?.state === "unknown" ? submissionStateLabel(deleteTarget) === "未完成" ? "；这条未完成记录的内容快照会暂时保留" : "；这条待确认记录的内容快照会暂时保留" : "，并尝试清理对应快照",
							"；不会撤回平台内容，也不会删除原草稿或成片。待执行或执行中的任务不能删除。"
						]
					})]
				})
			] });
		}
		//#endregion
		//#region src/client/publisher-settings-style.ts
		const publisherSettingsCss = `
.pub-settings { max-width: 760px; }
.pub-settings h3 { margin: 0 0 5px; font-size: 17px; line-height: 1.4; }
.pub-settings > p { margin: 0 0 18px; color: var(--pub-secondary-text); font-size: 13px; }
.pub-settings-card { padding: 20px; border: 1px solid var(--pub-border); border-radius: 14px; background: var(--pub-surface); }
.pub-settings-label { display: block; margin-bottom: 9px; font-size: 13px; font-weight: 600; }
.pub-settings-path { display: flex; align-items: stretch; gap: 8px; }
.pub-settings-path input { flex: 1 1 auto; min-width: 0; min-height: 34px; padding: 6px 10px; border: 1px solid var(--pub-border); border-radius: 8px; background: var(--pub-bg); color: var(--pub-text); font: inherit; }
.pub-settings-path button, .pub-settings-save, .pub-settings-retry { min-height: 34px; padding: 6px 13px; border: 1px solid var(--pub-border); border-radius: 8px; background: var(--pub-surface); color: var(--pub-text); font: inherit; font-size: 13px; cursor: pointer; }
.pub-settings-path button:hover, .pub-settings-retry:hover { background: var(--pub-soft); }
.pub-settings-save { border-color: var(--pub-text); background: var(--pub-text); color: var(--pub-bg); }
.pub-settings-save:hover { opacity: .86; }
.pub-settings button:disabled { opacity: .48; cursor: not-allowed; }
.pub-settings-hint { margin: 11px 0 0; color: var(--pub-secondary-text); font-size: 12px; line-height: 1.6; }
.pub-settings-actions { display: flex; align-items: center; gap: 10px; margin-top: 18px; }
.pub-settings-error { margin: 13px 0 0; color: var(--dsw-alias-label-danger, #b42318); font-size: 13px; }
.pub-settings-status { margin: 13px 0 0; color: var(--pub-secondary-text); font-size: 13px; }
@container (max-width: 520px) {
  .pub-settings-card { padding: 16px; }
  .pub-settings-path { flex-wrap: wrap; }
  .pub-settings-path input { flex-basis: 100%; }
}
`;
		//#endregion
		//#region src/client/writing-profile-settings.tsx
		const MAX_INSTRUCTIONS = 12e3;
		function WritingProfileSettings({ onDirtyChange, onBusyChange }) {
			const id = `pub-writing-${(0, react.useId)().replace(/[^a-z0-9_-]/giu, "")}`;
			const [profile, setProfile] = (0, react.useState)();
			const [instructions, setInstructions] = (0, react.useState)("");
			const [enabled, setEnabled] = (0, react.useState)(true);
			const [loading, setLoading] = (0, react.useState)(true);
			const [busy, setBusy] = (0, react.useState)(false);
			const [editing, setEditing] = (0, react.useState)(false);
			const [error, setError] = (0, react.useState)("");
			const [status, setStatus] = (0, react.useState)("");
			const [confirmation, setConfirmation] = (0, react.useState)();
			const request = (0, react.useRef)(0);
			const abort = (0, react.useRef)();
			const saving = (0, react.useRef)(false);
			const onDirty = (0, react.useRef)(onDirtyChange);
			const onBusy = (0, react.useRef)(onBusyChange);
			onDirty.current = onDirtyChange;
			onBusy.current = onBusyChange;
			const dirty = profile !== void 0 && (instructions !== (profile.instructions ?? "") || enabled !== profile.enabled);
			const count = [...instructions].length;
			const tooLong = count > MAX_INSTRUCTIONS;
			const unavailable = loading || busy;
			(0, react.useEffect)(() => {
				onDirtyChange?.(dirty);
			}, [dirty, onDirtyChange]);
			(0, react.useEffect)(() => {
				onBusyChange?.(busy);
			}, [busy, onBusyChange]);
			(0, react.useEffect)(() => () => {
				request.current++;
				abort.current?.abort();
				onDirty.current?.(false);
				onBusy.current?.(false);
			}, []);
			(0, react.useEffect)(() => {
				if (!dirty) return;
				const preventUnload = (event) => {
					event.preventDefault();
					event.returnValue = "";
				};
				window.addEventListener("beforeunload", preventUnload);
				return () => window.removeEventListener("beforeunload", preventUnload);
			}, [dirty]);
			const load = (0, react.useCallback)(async () => {
				const current = ++request.current;
				abort.current?.abort();
				const controller = new AbortController();
				abort.current = controller;
				setLoading(true);
				setError("");
				setStatus("");
				try {
					const result = await api("writing-profile", void 0, controller.signal);
					if (current !== request.current) return;
					setProfile(result);
					setInstructions(result.instructions ?? "");
					setEnabled(result.enabled);
					setEditing(false);
				} catch (cause) {
					if (current === request.current && !controller.signal.aborted) setError(errorMessage(cause));
				} finally {
					if (current === request.current) setLoading(false);
				}
			}, []);
			(0, react.useEffect)(() => {
				load();
			}, [load]);
			const save = async (clear = false) => {
				if (!profile || unavailable || saving.current || !clear && (!dirty || tooLong)) return;
				const current = ++request.current;
				abort.current?.abort();
				const controller = new AbortController();
				abort.current = controller;
				saving.current = true;
				setBusy(true);
				onBusy.current?.(true);
				setError("");
				setStatus("");
				try {
					const result = await api("writing-profile", {
						expected_revision: profile.revision,
						instructions: clear ? null : instructions,
						enabled
					}, controller.signal);
					if (current !== request.current) return;
					setProfile(result);
					setInstructions(result.instructions ?? "");
					setEnabled(result.enabled);
					setEditing(false);
					setStatus(clear ? "已清除风格规则，启用状态保持不变。" : "写作风格已保存，后续创作会读取新设置。");
				} catch (cause) {
					if (current === request.current && !controller.signal.aborted) setError(errorMessage(cause));
				} finally {
					if (current === request.current) {
						saving.current = false;
						setBusy(false);
						onBusy.current?.(false);
					}
				}
			};
			const reload = () => {
				if (unavailable) return;
				if (dirty) setConfirmation("reload");
				else load();
			};
			const cancel = () => {
				if (!profile || unavailable) return;
				setInstructions(profile.instructions ?? "");
				setEnabled(profile.enabled);
				setEditing(false);
				setError("");
				setStatus("");
			};
			const submit = (event) => {
				event.preventDefault();
				save();
			};
			const state = !profile?.instructions ? "尚未设置" : profile.enabled ? "已启用" : "已停用";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "pub-writing-profile",
				"aria-labelledby": `${id}-title`,
				"aria-busy": unavailable,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("style", { children: writingProfileCss }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-writing-heading",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
							id: `${id}-title`,
							children: "写作风格"
						}), profile && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "pub-writing-state",
							children: state
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "pub-writing-description",
						children: "用于多平台发布的文章、图文和视频文案。本次明确要求优先。"
					}),
					loading && !profile ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						role: "status",
						children: "正在读取写作风格…"
					}) : !profile ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pub-writing-error",
						role: "alert",
						children: [
							error || "无法读取写作风格",
							" ",
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => void load(),
								children: "重试"
							})
						]
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("form", {
						className: "pub-writing-card",
						onSubmit: submit,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pub-writing-toolbar",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: "pub-writing-toggle",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: enabled,
										disabled: unavailable,
										onChange: (event) => {
											setEnabled(event.target.checked);
											setStatus("");
										}
									}), "使用已保存的风格"]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									type: "button",
									variant: "ghost",
									size: "sm",
									disabled: unavailable,
									onClick: reload,
									children: loading ? "正在读取…" : "刷新"
								})]
							}),
							editing ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
									className: "pub-writing-label",
									htmlFor: `${id}-instructions`,
									children: "风格规则"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
									id: `${id}-instructions`,
									className: "pub-writing-input",
									"aria-describedby": `${id}-hint ${id}-count`,
									"aria-invalid": tooLong || void 0,
									value: instructions,
									disabled: unavailable,
									rows: 8,
									placeholder: "例如：语气自然直接，多用具体例子，少用口号；段落简短，保留个人经验。",
									onChange: (event) => {
										setInstructions(event.target.value);
										setStatus("");
									}
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pub-writing-input-hints",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										id: `${id}-hint`,
										children: "可填写语气、结构、常用表达和需要避免的写法。"
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										id: `${id}-count`,
										className: tooLong ? "pub-writing-error" : "",
										children: [
											count.toLocaleString(),
											" / ",
											MAX_INSTRUCTIONS.toLocaleString(),
											" 字"
										]
									})]
								}),
								tooLong && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
									className: "pub-writing-error",
									role: "alert",
									children: [
										"风格规则最多 ",
										MAX_INSTRUCTIONS.toLocaleString(),
										" 字，请精简后保存。"
									]
								})
							] }) : profile.instructions ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "pub-writing-summary",
								children: profile.instructions
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								disabled: unavailable,
								onClick: () => setEditing(true),
								children: "查看与编辑"
							})] }) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pub-writing-empty",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "让 Agent 学习你的样文，或直接填写自己的写作偏好。" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									disabled: unavailable,
									onClick: () => setEditing(true),
									children: "设置写作风格"
								})]
							}),
							(editing || dirty) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pub-writing-actions",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										variant: "primary",
										size: "sm",
										type: "submit",
										disabled: unavailable || !dirty || tooLong,
										children: busy ? "正在保存…" : "保存风格"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										type: "button",
										variant: "ghost",
										size: "sm",
										disabled: unavailable,
										onClick: cancel,
										children: "取消修改"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pub-writing-unsaved",
										children: dirty ? "有未保存的修改" : "修改后保存生效"
									})
								]
							}),
							profile.instructions && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "pub-writing-clear",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									type: "button",
									variant: "ghost",
									size: "sm",
									disabled: unavailable,
									onClick: () => setConfirmation("clear"),
									children: "清除风格规则"
								})
							}),
							error && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pub-writing-error",
								role: "alert",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: error }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									disabled: unavailable,
									onClick: reload,
									children: "重新读取"
								})]
							}),
							status && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "pub-writing-status",
								role: "status",
								children: status
							})
						]
					}),
					confirmation && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherModal, {
						open: true,
						title: confirmation === "clear" ? "清除写作风格？" : "重新读取写作风格？",
						closeLabel: "取消",
						className: "pub-modal",
						contentClassName: "pub-modal-content",
						onClose: () => setConfirmation(void 0),
						footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							"data-pub-initial-focus": true,
							onClick: () => setConfirmation(void 0),
							children: "取消"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							type: "button",
							variant: "primary",
							size: "sm",
							onClick: () => {
								const action = confirmation;
								setConfirmation(void 0);
								if (action === "clear") save(true);
								else load();
							},
							children: confirmation === "clear" ? "确认清除" : "放弃修改并读取"
						})] }),
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: confirmation === "clear" ? "将清除已保存的风格规则和当前未保存的文字，保留当前启用状态。之后可以重新学习或设置。" : "当前修改尚未保存。重新读取会放弃这些修改，并载入最新保存的规则。" })
					})
				]
			});
		}
		const writingProfileCss = `
.pub-writing-profile { max-width: 760px; margin-bottom: 32px; color: var(--pub-text, var(--dsw-alias-label-primary, #111318)); }
.pub-writing-heading { display: flex; align-items: center; gap: 10px; }
.pub-writing-heading h3 { margin: 0; font-size: 17px; line-height: 1.4; }
.pub-writing-state { padding: 2px 7px; border-radius: 5px; background: var(--pub-soft, var(--dsw-alias-bg-module-platform, #f5f6f7)); color: var(--pub-secondary-text, var(--dsw-alias-label-secondary, #535961)); font-size: 11px; }
.pub-writing-description { margin: 6px 0 16px; color: var(--pub-secondary-text, var(--dsw-alias-label-secondary, #535961)); font-size: 13px; line-height: 1.6; }
.pub-writing-card { padding: 18px 20px; border: 1px solid var(--pub-border, var(--dsw-alias-border-l2, #e4e6e9)); border-radius: 12px; background: var(--pub-surface, var(--dsw-alias-bg-base, #fff)); }
.pub-writing-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin: -3px -5px 12px 0; }
.pub-writing-toggle { display: inline-flex; align-items: center; gap: 7px; font-size: 13px; cursor: pointer; }
.pub-writing-toggle input { margin: 0; width: 15px; height: 15px; accent-color: var(--dsw-alias-state-business-primary, #4176e6); }
.pub-writing-label { display: block; margin: 8px 0; font-size: 13px; font-weight: 500; }
.pub-writing-input { display: block; width: 100%; min-height: 180px; max-height: 52vh; resize: vertical; box-sizing: border-box; padding: 10px 12px; border: 1px solid var(--pub-border, var(--dsw-alias-border-l2, #e4e6e9)); border-radius: 8px; background: var(--pub-bg, var(--dsw-alias-bg-base, #fff)); color: inherit; font: inherit; font-size: 13px; line-height: 1.7; }
.pub-writing-input:focus-visible, .pub-writing-toggle input:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary, #4176e6); outline-offset: 2px; }
.pub-writing-input-hints { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 4px 12px; margin-top: 7px; color: var(--pub-tertiary-text, var(--dsw-alias-label-tertiary, #777d85)); font-size: 11px; line-height: 1.5; }
.pub-writing-input-hints p { margin: 0; }
.pub-writing-summary { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 4; overflow: hidden; margin: 0 0 12px; white-space: pre-wrap; overflow-wrap: anywhere; font-size: 13px; line-height: 1.7; }
.pub-writing-empty p { margin: 0 0 12px; color: var(--pub-secondary-text, var(--dsw-alias-label-secondary, #535961)); font-size: 13px; line-height: 1.6; }
.pub-writing-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.pub-writing-unsaved { color: var(--pub-tertiary-text, var(--dsw-alias-label-tertiary, #777d85)); font-size: 11px; }
.pub-writing-clear { margin: 12px 0 -4px -7px; }
.pub-writing-error { margin-top: 10px; color: var(--dsw-alias-label-danger, #b42318); font-size: 12px; line-height: 1.6; }
.pub-writing-error p { margin: 0 0 8px; }
.pub-writing-status { margin: 12px 0 0; color: var(--pub-secondary-text, var(--dsw-alias-label-secondary, #535961)); font-size: 12px; line-height: 1.6; }
@container (max-width: 520px) { .pub-writing-card { padding: 14px 16px; } }
`;
		//#endregion
		//#region src/client/publisher-settings.tsx
		const PICK_DIRECTORY = "/_dsh/desktop/pick-directory";
		async function pickProjectRoot() {
			const response = await fetch(PICK_DIRECTORY, {
				method: "POST",
				headers: { accept: "application/json" }
			});
			if (!response.ok) throw new Error("系统文件夹选择器暂不可用，请手动输入目录路径");
			const result = await response.json();
			if (!result || typeof result !== "object" || !("path" in result) || result.path !== null && typeof result.path !== "string") throw new Error("文件夹选择器返回了无效路径");
			return result.path;
		}
		function PublisherSettings({ onWritingProfileDirtyChange, onWritingProfileBusyChange }) {
			const [settings, setSettings] = (0, react.useState)();
			const [draftRoot, setDraftRoot] = (0, react.useState)("");
			const [loading, setLoading] = (0, react.useState)(true);
			const [busy, setBusy] = (0, react.useState)(false);
			const [error, setError] = (0, react.useState)("");
			const [saved, setSaved] = (0, react.useState)(false);
			const load = () => {
				setLoading(true);
				setError("");
				api("project-settings").then((result) => {
					setSettings(result);
					setDraftRoot(result.defaultRoot);
				}).catch((cause) => setError(errorMessage(cause))).finally(() => setLoading(false));
			};
			(0, react.useEffect)(load, []);
			const choose = async () => {
				if (busy) return;
				setBusy(true);
				setError("");
				setSaved(false);
				try {
					const path = await pickProjectRoot();
					if (path !== null) setDraftRoot(path);
				} catch (cause) {
					setError(errorMessage(cause));
				} finally {
					setBusy(false);
				}
			};
			const save = async (event) => {
				event.preventDefault();
				if (busy || !draftRoot.trim()) return;
				setBusy(true);
				setError("");
				setSaved(false);
				try {
					const result = await api("project-settings", { defaultRoot: draftRoot });
					setSettings(result);
					setDraftRoot(result.defaultRoot);
					setSaved(true);
				} catch (cause) {
					setError(errorMessage(cause));
				} finally {
					setBusy(false);
				}
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(WritingProfileSettings, {
				onDirtyChange: onWritingProfileDirtyChange,
				onBusyChange: onWritingProfileBusyChange
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "pub-settings",
				"aria-labelledby": "pub-settings-title",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("style", { children: publisherSettingsCss }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
						id: "pub-settings-title",
						children: "项目工作区"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "为每篇文章、每份图文和每条视频草稿建立独立的项目目录，供 Agent 存放资料和生成文件。" }),
					loading ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						role: "status",
						children: "正在读取设置…"
					}) : !settings ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						role: "alert",
						children: [
							error || "无法读取项目工作区设置",
							" ",
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "pub-settings-retry",
								onClick: load,
								children: "重试"
							})
						]
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("form", {
						className: "pub-settings-card",
						onSubmit: (event) => void save(event),
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
								className: "pub-settings-label",
								htmlFor: "pub-project-root",
								children: "默认项目根目录"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pub-settings-path",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									id: "pub-project-root",
									"aria-label": "默认项目根目录",
									value: draftRoot,
									onChange: (event) => {
										setDraftRoot(event.target.value);
										setSaved(false);
									},
									disabled: busy,
									spellCheck: false,
									autoComplete: "off"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => void choose(),
									disabled: busy,
									children: "选择文件夹"
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "pub-settings-hint",
								children: "新草稿会在此目录下按内容类型和草稿 ID 建立子目录。更改此设置不会移动已有项目；删除草稿也不会删除项目目录中的文件。"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "pub-settings-actions",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "pub-settings-save",
									disabled: busy || !draftRoot.trim() || draftRoot === settings.defaultRoot,
									children: busy ? "正在保存…" : "保存设置"
								})
							}),
							error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "pub-settings-error",
								role: "alert",
								children: error
							}),
							saved && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "pub-settings-status",
								role: "status",
								children: "已保存。后续新建项目将使用这个目录。"
							})
						]
					})
				]
			})] });
		}
		//#endregion
		//#region src/client/writing-profile-dialog.tsx
		/** Open preferences over the editor without changing its draft or Agent binding. */
		function WritingProfileDialog({ open, onClose }) {
			const [dirty, setDirty] = (0, react.useState)(false);
			const [busy, setBusy] = (0, react.useState)(false);
			const [discard, setDiscard] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				if (!open) {
					setDirty(false);
					setBusy(false);
					setDiscard(false);
				}
			}, [open]);
			const close = () => {
				if (busy) return;
				if (dirty) setDiscard(true);
				else onClose();
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [open && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("style", { children: `.pub-writing-profile-dialog { width: min(640px, calc(100vw - 32px)); max-height: min(90vh, 760px); }
      .pub-writing-profile-dialog .pub-writing-profile { margin: 0; }
      .pub-writing-profile-dialog :is(textarea, button, input):focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary, #4176e6); outline-offset: 2px; }` }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(PublisherModal, {
				open,
				title: "写作风格",
				closeLabel: "关闭写作风格",
				onClose: close,
				className: "pub-modal pub-writing-profile-dialog",
				contentClassName: "pub-modal-content",
				footer: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					size: "sm",
					variant: "outline",
					disabled: busy,
					onClick: close,
					children: "关闭"
				}),
				children: [open && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(WritingProfileSettings, {
					onDirtyChange: setDirty,
					onBusyChange: setBusy
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherModal, {
					open: open && discard,
					title: "放弃未保存的文风修改？",
					closeLabel: "继续修改文风",
					description: "这些修改尚未保存，关闭后将保留之前的写作风格。",
					className: "pub-modal",
					onClose: () => setDiscard(false),
					footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						size: "sm",
						variant: "outline",
						"data-pub-initial-focus": true,
						onClick: () => setDiscard(false),
						children: "继续修改"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						size: "sm",
						variant: "outline",
						onClick: () => {
							setDiscard(false);
							onClose();
						},
						children: "放弃修改并关闭"
					})] })
				})]
			})] });
		}
		//#endregion
		//#region src/client/session-navigation.ts
		/** Restore a content page even when the Publisher panel has not mounted. */
		function watchPublisherSession(sessions, workspaces, layout, openContent) {
			let disposed = false;
			let queued = false;
			let generation = 0;
			let selectionVersion = 0;
			let mainSignature = "";
			let lastCandidate;
			let request;
			let previousPanel = layout.panelInfo.getSnapshot().activePanelId;
			const mainReferences = () => {
				const list = sessions.list.getSnapshot();
				return list.ids.flatMap((id) => {
					const count = sessions.retainInfo(id).getSnapshot().retainedBy.mainView ?? 0;
					return count > 0 ? [{
						id,
						count,
						origin: list.byId[id]?.origin
					}] : [];
				});
			};
			const selected = () => {
				if (layout.panelInfo.getSnapshot().activePanelId !== null) return void 0;
				const workspace = workspaces.list.getSnapshot();
				if (workspace.phase !== "ready") return void 0;
				const references = mainReferences();
				if (references.length !== 1 || references[0].origin === "subagent" || workspace.archivedSessionIds.includes(references[0].id)) return void 0;
				return references[0].id;
			};
			const cancel = () => {
				generation += 1;
				request?.abort();
				request = void 0;
			};
			const check = () => {
				queued = false;
				if (disposed) return;
				const sessionId = selected();
				if (!sessionId) {
					lastCandidate = void 0;
					cancel();
					return;
				}
				const candidate = `${sessionId}:${selectionVersion}`;
				if (candidate === lastCandidate) return;
				lastCandidate = candidate;
				cancel();
				const current = generation;
				request = new AbortController();
				const signal = AbortSignal.any([request.signal, layout.beginNavigation()]);
				api(`agent-draft-content/${encodeURIComponent(sessionId)}`, void 0, signal).then((content) => {
					if (disposed || signal.aborted || current !== generation || selected() !== sessionId || candidate !== `${sessionId}:${selectionVersion}` || content?.sessionId !== sessionId || !content.contentId || ![
						"article",
						"image-note",
						"video"
					].includes(content.contentType ?? "")) return;
					openContent({
						contentId: content.contentId,
						contentType: content.contentType
					});
				}).catch(() => {});
			};
			const schedule = () => {
				if (disposed || queued) return;
				queued = true;
				queueMicrotask(check);
			};
			const sessionChanged = () => {
				const signature = mainReferences().map(({ id, count }) => `${id}:${count}`).sort().join(",");
				if (signature !== mainSignature) {
					mainSignature = signature;
					selectionVersion += 1;
					cancel();
				}
				schedule();
			};
			const panelChanged = () => {
				const panel = layout.panelInfo.getSnapshot().activePanelId;
				if (panel !== previousPanel) {
					previousPanel = panel;
					lastCandidate = void 0;
					cancel();
				}
				schedule();
			};
			const unsubscribers = [
				sessions.list.subscribe(sessionChanged),
				layout.panelInfo.subscribe(panelChanged),
				workspaces.list.subscribe(schedule)
			];
			sessionChanged();
			return () => {
				disposed = true;
				cancel();
				for (const unsubscribe of unsubscribers) unsubscribe();
			};
		}
		//#endregion
		//#region src/client/video.tsx
		function VideoSourcePlayer({ url, kind }) {
			const [failed, setFailed] = (0, react.useState)(false);
			return failed ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: "pub-content-preview-video-error",
				role: "status",
				children: kind === "local" ? "本地视频无法读取。文件可能已移动、删除或发生变化，请重新选择文件。" : "e剪宝成片无法播放，请检查作品文件或重新选择。"
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("video", {
				className: "pub-content-preview-video-player",
				"aria-label": "已选择的视频预览",
				src: url,
				controls: true,
				playsInline: true,
				preload: "metadata",
				onError: () => setFailed(true),
				children: "当前环境无法播放此视频。"
			});
		}
		function VideoPage({ active, selectedContentId, initialMode = "edit", agentOpen, onToggleAgent, onDraftReady, onRestartAgent, onDeleteContent, onSelectedContentChange, onOpenWritingProfile, onBack }) {
			const { showError, showSuccess, clearTip } = usePublisherTips();
			const [capability, setCapability] = (0, react.useState)();
			const [works, setWorks] = (0, react.useState)([]);
			const [accounts, setAccounts] = (0, react.useState)([]);
			const [draft, setDraft] = (0, react.useState)();
			const draftRef = (0, react.useRef)();
			const serverDraftRef = (0, react.useRef)();
			const activeDraftRef = (0, react.useRef)({
				selectedContentId,
				active,
				generation: 0
			});
			if (activeDraftRef.current.selectedContentId !== selectedContentId || activeDraftRef.current.active !== active) activeDraftRef.current = {
				selectedContentId,
				active,
				generation: activeDraftRef.current.generation + 1
			};
			const dirtyRef = (0, react.useRef)(false);
			const pendingChanges = (0, react.useRef)({});
			const inFlightChanges = (0, react.useRef)();
			const saveTask = (0, react.useRef)();
			const [editVersion, setEditVersion] = (0, react.useState)(0);
			const [tagsInput, setTagsInput] = (0, react.useState)("");
			const [saveError, setSaveError] = (0, react.useState)("");
			const [mode, setMode] = (0, react.useState)("draft");
			const [preview, setPreview] = (0, react.useState)(false);
			const [selection, setSelection] = (0, react.useState)({});
			const [busy, setBusy] = (0, react.useState)(false);
			const busyRef = (0, react.useRef)(false);
			const [publishOpen, setPublishOpen] = (0, react.useState)(false);
			const [confirm, setConfirm] = (0, react.useState)();
			const [deleteDraftId, setDeleteDraftId] = (0, react.useState)();
			const [restartAgent, setRestartAgent] = (0, react.useState)(false);
			const [loadError, setLoadError] = (0, react.useState)("");
			const [loadRetry, setLoadRetry] = (0, react.useState)(0);
			(0, react.useEffect)(() => {
				setConfirm(void 0);
				setPublishOpen(false);
			}, [selectedContentId, active]);
			(0, react.useEffect)(() => {
				setPreview(initialMode === "preview");
			}, [selectedContentId, initialMode]);
			(0, react.useEffect)(() => {
				if (active && draft?.id === selectedContentId && initialMode === "publish") setPublishOpen(true);
			}, [
				active,
				draft?.id,
				selectedContentId,
				initialMode
			]);
			const grouped = (0, react.useMemo)(() => Object.fromEntries(VIDEO_PLATFORMS.map((platform) => [platform, accounts.filter((account) => account.platform === platform)])), [accounts]);
			const selectedAccounts = VIDEO_PLATFORMS.flatMap((platform) => {
				const id = selection[platform];
				return id ? accounts.filter((account) => account.id === id) : [];
			});
			const setServerDraft = (value) => {
				const previous = serverDraftRef.current;
				if (value?.id === previous?.id && value && previous && previous.revision > value.revision) value = previous;
				serverDraftRef.current = value;
				draftRef.current = value;
				dirtyRef.current = false;
				pendingChanges.current = {};
				inFlightChanges.current = void 0;
				setSaveError("");
				setDraft(value);
				setTagsInput(value?.tags.join(" ") ?? "");
			};
			const acceptServerSnapshot = (value) => {
				const previous = serverDraftRef.current;
				const latest = previous?.id === value.id && previous.revision > value.revision ? previous : value;
				serverDraftRef.current = latest;
				const local = inFlightChanges.current?.id === latest.id ? mergeContentPatches(inFlightChanges.current.patch, pendingChanges.current) : pendingChanges.current;
				const merged = applyContentPatch(latest, local);
				draftRef.current = merged;
				setDraft(merged);
				if (!Object.hasOwn(local, "tags")) setTagsInput(merged.tags.join(" "));
			};
			(0, react.useEffect)(() => {
				if (active && draft?.id === selectedContentId) onDraftReady?.(draft);
			}, [
				active,
				draft?.id,
				selectedContentId,
				onDraftReady
			]);
			(0, react.useEffect)(() => {
				if (!active || !selectedContentId) return;
				let live = true;
				setLoadError("");
				(async () => {
					const needsDraft = draftRef.current?.id !== selectedContentId;
					if (needsDraft && (dirtyRef.current || saveTask.current)) await flush();
					const [value, availableWorks, selected] = await Promise.all([
						api("capability"),
						api("works"),
						needsDraft ? api(`content/${selectedContentId}`) : Promise.resolve(void 0)
					]);
					if (!live) return;
					setCapability(value);
					setWorks(availableWorks);
					if (selected) {
						if (selected.contentType !== "video") throw new Error("草稿内容类型不匹配");
						setServerDraft(selected);
					}
					if (value.supported) {
						const accountRows = await api("accounts");
						if (live) {
							setAccounts(accountRows);
							setSelection((current) => Object.fromEntries(Object.entries(current).filter(([, id]) => accountRows.some((account) => account.id === id))));
						}
					} else setAccounts([]);
				})().catch((cause) => {
					if (live) {
						setLoadError(errorMessage(cause));
						showError(errorMessage(cause));
					}
				});
				return () => {
					live = false;
				};
			}, [
				active,
				selectedContentId,
				loadRetry
			]);
			const update = (patch) => {
				if (!draftRef.current) return;
				const next = {
					...draftRef.current,
					...patch
				};
				pendingChanges.current = mergeContentPatches(pendingChanges.current, changedContentFields(draftRef.current, next));
				draftRef.current = next;
				dirtyRef.current = Object.keys(pendingChanges.current).length > 0;
				setDraft(next);
				setEditVersion((version) => version + 1);
			};
			const flush = async () => {
				if (saveTask.current) await saveTask.current;
				const current = draftRef.current;
				if (!current || !dirtyRef.current) return current;
				const patch = pendingChanges.current;
				pendingChanges.current = {};
				dirtyRef.current = false;
				inFlightChanges.current = {
					id: current.id,
					patch
				};
				const task = (async () => {
					try {
						const saved = await api("content-patch", {
							id: current.id,
							revision: current.revision,
							patch
						});
						inFlightChanges.current = void 0;
						if (draftRef.current?.id === current.id) acceptServerSnapshot(saved);
						setSaveError("");
					} catch (cause) {
						inFlightChanges.current = void 0;
						pendingChanges.current = mergeContentPatches(patch, pendingChanges.current);
						dirtyRef.current = true;
						setSaveError(errorMessage(cause));
						throw cause;
					}
				})();
				saveTask.current = task;
				try {
					await task;
				} finally {
					if (saveTask.current === task) saveTask.current = void 0;
				}
				if (dirtyRef.current) return flush();
				return draftRef.current;
			};
			(0, react.useEffect)(() => {
				if (editVersion === 0) return;
				const timer = setTimeout(() => {
					flush().catch((cause) => showError(errorMessage(cause)));
				}, 800);
				return () => clearTimeout(timer);
			}, [editVersion]);
			(0, react.useEffect)(() => {
				if (!active || !agentOpen || !selectedContentId) return;
				let live = true;
				let reading = false;
				const refresh = async () => {
					if (reading || busyRef.current) return;
					reading = true;
					try {
						if (saveTask.current) try {
							await saveTask.current;
						} catch {}
						const latest = await api(`content/${selectedContentId}`);
						if (!live || busyRef.current || latest.contentType !== "video") return;
						const current = draftRef.current;
						if (current?.id === latest.id && latest.revision > current.revision) {
							acceptServerSnapshot(latest);
							if (latest.videoSource?.kind === "work") try {
								const availableWorks = await api("works");
								if (live) setWorks(availableWorks);
							} catch {}
						}
					} catch {} finally {
						reading = false;
					}
				};
				const timer = setInterval(() => {
					refresh();
				}, 1200);
				return () => {
					live = false;
					clearInterval(timer);
				};
			}, [
				active,
				agentOpen,
				selectedContentId
			]);
			(0, react.useEffect)(() => () => {
				if (dirtyRef.current) flush().catch(() => {});
			}, []);
			const act = async (task) => {
				if (busyRef.current) return;
				busyRef.current = true;
				setBusy(true);
				clearTip();
				try {
					await task();
				} catch (cause) {
					showError(errorMessage(cause));
				} finally {
					busyRef.current = false;
					setBusy(false);
				}
			};
			const back = () => void act(async () => {
				await flush();
				onBack();
			});
			const duplicate = () => void act(async () => {
				const current = await flush();
				if (!current) return;
				const copy = await api("content-copy", { id: current.id });
				setServerDraft(copy);
				onSelectedContentChange(copy.id);
			});
			const reloadAfterConflict = () => void act(async () => {
				const id = draftRef.current?.id;
				const generation = activeDraftRef.current.generation;
				const stillCurrent = () => activeDraftRef.current.active && activeDraftRef.current.selectedContentId === id && activeDraftRef.current.generation === generation && draftRef.current?.id === id;
				if (!id || !stillCurrent()) return;
				try {
					if (saveTask.current) await saveTask.current;
				} catch {}
				if (!stillCurrent()) return;
				const latest = await api(`content/${id}`);
				if (!stillCurrent()) return;
				if (latest.contentType !== "video") throw new Error("草稿内容类型不匹配");
				setServerDraft(latest);
				if (latest.videoSource?.kind === "work") try {
					const availableWorks = await api("works");
					if (!stillCurrent()) return;
					setWorks(availableWorks);
				} catch {}
				if (stillCurrent()) showSuccess("已加载最新草稿。");
			});
			const remove = () => {
				const id = draftRef.current?.id;
				if (id) setDeleteDraftId(id);
			};
			const confirmRemove = () => {
				const id = deleteDraftId;
				if (!id) return;
				act(async () => {
					await flush();
					if (onDeleteContent) await onDeleteContent(id);
					else await api("content-delete", { id });
					setDeleteDraftId(void 0);
					setServerDraft(void 0);
					onBack();
				});
			};
			const chooseWork = (work) => {
				update({
					videoSource: {
						kind: "work",
						workId: work.id
					},
					title: work.title,
					description: work.description,
					shortTitle: "",
					tags: work.tags,
					creativeStatement: work.aiGeneratedDisclosure ? "ai_generated" : "none"
				});
				setTagsInput(work.tags.join(" "));
				clearTip();
			};
			const chooseLocalVideo = () => void act(async () => {
				const selected = await api("local-video-select", {});
				if (!selected) return;
				update({
					videoSource: {
						kind: "local",
						localVideoId: selected.id,
						fileName: selected.fileName,
						bytes: selected.bytes
					},
					title: selected.title,
					description: "",
					shortTitle: "",
					tags: [],
					creativeStatement: "none"
				});
				setTagsInput("");
			});
			const requestConfirm = () => void act(async () => {
				const current = await flush();
				if (!current?.videoSource) throw new Error("请先选择一条 e剪宝成片或一个本地视频");
				if (!current.title.trim()) throw new Error("请填写标题");
				if (selectedAccounts.length === 0) throw new Error("请至少选择一个发布账号");
				const videoSource = current.videoSource;
				setPublishOpen(false);
				setConfirm({
					contentId: current.id,
					title: current.title,
					mode,
					accounts: selectedAccounts,
					sourceName: videoSource.kind === "local" ? videoSource.fileName : works.find((work) => work.id === videoSource.workId)?.title
				});
			});
			const submit = () => void act(async () => {
				if (!confirm) return;
				const current = await flush();
				if (!current || current.id !== confirm.contentId) throw new Error("草稿已切换，请重新检查后提交");
				await api("submissions", {
					contentType: "video",
					contentId: current.id,
					revision: current.revision,
					mode: confirm.mode,
					accountIds: confirm.accounts.map((account) => account.id)
				});
				setConfirm(void 0);
				showSuccess("已提交，请稍后到平台后台确认。");
			});
			const source = draft?.videoSource;
			const videoPreviewUrl = source && `/api/cqai-publisher/video-preview/${source.kind}/${encodeURIComponent(source.kind === "work" ? source.workId : source.localVideoId)}`;
			const videoSourceName = source?.kind === "local" ? source.fileName : source?.kind === "work" ? works.find((work) => work.id === source.workId)?.title ?? "e剪宝成片" : void 0;
			const unavailable = capabilityMessage(capability);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
				unavailable && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pub-error",
					children: unavailable
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "pub-editor-bar",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							size: "sm",
							variant: "outline",
							className: "pub-editor-back",
							disabled: busy,
							onClick: back,
							children: "← 返回视频列表"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: saveError ? "pub-warn pub-editor-status" : "pub-muted pub-editor-status",
							role: "status",
							"aria-live": "polite",
							children: saveError ? "自动保存失败，请继续编辑以重试" : dirtyRef.current || inFlightChanges.current ? "自动保存中…" : "已保存"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pub-editor-actions",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pub-editor-view-switch",
									role: "group",
									"aria-label": "内容视图",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-pressed": !preview,
										disabled: busy || !draft,
										onClick: () => setPreview(false),
										children: "编辑"
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-pressed": preview,
										disabled: busy || !draft,
										onClick: () => setPreview(true),
										children: "预览"
									})]
								}),
								onToggleAgent && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									size: "sm",
									variant: "outline",
									"aria-expanded": Boolean(agentOpen),
									"aria-controls": "pub-agent-drawer",
									disabled: busy || !draft || draft.id !== selectedContentId,
									onClick: () => void act(async () => {
										const current = await flush();
										if (!current) throw new Error("请先打开视频草稿");
										await onToggleAgent(current);
									}),
									children: "Agent 辅助编辑"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(EditorMoreMenu, { children: [
									onOpenWritingProfile && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										size: "sm",
										variant: "outline",
										disabled: busy,
										onClick: onOpenWritingProfile,
										children: "写作风格"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										size: "sm",
										variant: "outline",
										disabled: busy || !draft || !dirtyRef.current,
										onClick: () => void act(async () => {
											await flush();
											showSuccess("已保存。");
										}),
										children: "保存"
									}),
									onRestartAgent && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										size: "sm",
										variant: "outline",
										disabled: busy || !draft,
										onClick: () => setRestartAgent(true),
										children: "重新开始对话"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										size: "sm",
										variant: "outline",
										disabled: busy || !draft,
										onClick: duplicate,
										children: "复制"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										size: "sm",
										variant: "outline",
										className: "pub-danger-action",
										disabled: busy || !draft,
										onClick: remove,
										children: "删除"
									})
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									size: "sm",
									variant: "primary",
									disabled: busy || draft?.id !== selectedContentId,
									onClick: () => setPublishOpen(true),
									children: "发布"
								})
							]
						})
					]
				}),
				loadError && draft?.id !== selectedContentId && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "pub-error",
					role: "status",
					children: [
						"打开草稿失败：",
						loadError,
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pub-actions",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								size: "sm",
								variant: "outline",
								onClick: () => setLoadRetry((value) => value + 1),
								children: "重试读取草稿"
							})
						})
					]
				}),
				saveError.includes("草稿已在其他页面更新") && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "pub-error",
					role: "status",
					children: ["草稿已在其他页面更新。请重新加载后继续编辑；当前未保存的修改会丢失。", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pub-actions",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							size: "sm",
							variant: "outline",
							disabled: busy,
							onClick: reloadAfterConflict,
							children: "重新加载草稿"
						})
					})]
				}),
				draft?.id !== selectedContentId ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pub-empty",
					role: "status",
					children: "正在打开视频草稿…"
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "pub-grid pub-editor-grid pub-video-editor-main",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pub-editor-main",
						children: preview ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pub-card pub-editor-preview",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "平台分享预览" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherContentPreview, {
								content: draft,
								videoSourceName,
								videoPreviewUrl
							})]
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pub-card",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "视频素材" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "pub-field",
									"aria-label": "视频素材预览",
									children: source && videoPreviewUrl ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
											className: "pub-muted",
											children: ["当前视频：", videoSourceName]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(VideoSourcePlayer, {
											url: videoPreviewUrl,
											kind: source.kind
										}, videoPreviewUrl),
										source.kind === "local" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("small", {
											className: "pub-muted",
											children: [(source.bytes / 1048576).toFixed(1), " MB · 本地文件"]
										})
									] }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										className: "pub-muted",
										role: "status",
										children: "选择 e剪宝成片或本地视频后，可在这里预览。"
									})
								}),
								source?.kind === "work" && !works.some((work) => work.id === source.workId) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: "pub-warn",
									children: "原 e剪宝成片已不可用，请重新选择。"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(EditorSection, {
									title: source ? "更换视频" : "选择视频素材",
									hint: source ? "e剪宝成片 / 本地文件" : "选择已有成片或 MP4",
									defaultOpen: !source,
									className: "pub-video-source-picker",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "e剪宝成片" }),
										works.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
											className: "pub-muted",
											children: "暂无 e剪宝成片，也可以直接选择本地视频。"
										}) : works.map((work) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "pub-work",
											disabled: busy,
											"aria-pressed": source?.kind === "work" && source.workId === work.id,
											onClick: () => chooseWork(work),
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: work.title }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("small", { children: [
												new Date(work.createdAt).toLocaleString(),
												" · ",
												(work.bytes / 1048576).toFixed(1),
												" MB"
											] })]
										}, work.id)),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "本地视频" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											size: "sm",
											variant: "outline",
											disabled: busy || capability?.supported !== true,
											onClick: chooseLocalVideo,
											children: "选择本地文件…"
										}),
										source?.kind === "local" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "pub-work",
											"aria-label": "已选择的本地视频",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: source.fileName }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("small", { children: [(source.bytes / 1048576).toFixed(1), " MB · 已选择"] })]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
											className: "pub-muted",
											children: "目前支持 MP4；本地草稿只保存文件引用，不复制视频。提交后请保留原文件，直到平台后台确认。"
										})
									]
								}, `${draft.id}-${videoPreviewUrl ?? "empty"}`)
							]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pub-card",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "发布内容" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pub-field",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
										htmlFor: "pub-title",
										children: "标题"
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
										id: "pub-title",
										className: "pub-text-input",
										maxLength: 120,
										value: draft.title,
										onChange: (event) => update({ title: event.target.value })
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pub-field",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
										htmlFor: "pub-description",
										children: "简介"
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
										id: "pub-description",
										className: "pub-input",
										maxLength: DESCRIPTION_MAX,
										value: draft.description ?? "",
										onChange: (event) => update({ description: event.target.value })
									})]
								})
							]
						})] })
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("aside", {
						className: "pub-editor-sidebar",
						"aria-label": "视频发布设置",
						children: [!preview && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(EditorSection, {
							title: "发布信息",
							hint: "话题、短标题与内容声明",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pub-field",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										htmlFor: "pub-tags",
										children: [
											"话题（最多 ",
											8,
											" 个）"
										]
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
										id: "pub-tags",
										className: "pub-text-input",
										value: tagsInput,
										onChange: (event) => {
											setTagsInput(event.target.value);
											update({ tags: [...new Set(event.target.value.split(/[,，\s]+/u).map((tag) => tag.replace(/^#+/u, "").trim()).filter(Boolean))].slice(0, 8) });
										},
										placeholder: "用空格或逗号分隔"
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pub-field",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
										htmlFor: "pub-short-title",
										children: "视频号短标题"
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
										id: "pub-short-title",
										className: "pub-text-input",
										maxLength: 32,
										value: draft.shortTitle ?? "",
										onChange: (event) => update({ shortTitle: event.target.value })
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pub-field",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
										htmlFor: "pub-statement",
										children: "内容声明"
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
										id: "pub-statement",
										className: "pub-input",
										value: draft.creativeStatement,
										onChange: (event) => update({ creativeStatement: event.target.value }),
										children: CREATIVE_STATEMENTS.map((value) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value,
											children: STATEMENT_LABELS[value]
										}, value))
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: "pub-muted",
									children: "一期不会自动上传视频封面。"
								})
							]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ProjectDirectoryInfo, { contentId: draft.id }, draft.id)]
					})]
				}),
				publishOpen && draft?.id === selectedContentId && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherModal, {
					open: true,
					title: "发布设置",
					closeLabel: "关闭发布设置",
					className: "pub-modal pub-publish-modal",
					contentClassName: "pub-modal-content",
					onClose: () => {
						if (!busyRef.current) setPublishOpen(false);
					},
					footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						size: "sm",
						variant: "outline",
						disabled: busy,
						onClick: () => setPublishOpen(false),
						children: "取消"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						size: "sm",
						variant: "primary",
						disabled: busy || capability?.supported !== true,
						onClick: requestConfirm,
						children: "检查并提交"
					})] }),
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("fieldset", {
						disabled: busy,
						className: "pub-publish-fields",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "选择平台账号" }),
							VIDEO_PLATFORMS.map((platform) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pub-platform",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
									htmlFor: `pub-target-${platform}`,
									children: PLATFORM_LABELS[platform]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
									id: `pub-target-${platform}`,
									className: "pub-input",
									"data-pub-initial-focus": platform === VIDEO_PLATFORMS[0] ? "" : void 0,
									value: selection[platform] ?? "",
									onChange: (event) => setSelection((current) => ({
										...current,
										[platform]: event.target.value || void 0
									})),
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "",
										children: "不发布"
									}), grouped[platform].map((account) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
										value: account.id,
										children: [account.displayName, account.loginState === "logged-in" ? "" : "（需检查登录）"]
									}, account.id))]
								})]
							}, platform)),
							accounts.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "pub-muted",
								children: "请先到“平台账号管理”添加并登录账号。"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "提交方式" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pub-mode",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									type: "radio",
									name: "pub-mode",
									checked: mode === "publish",
									onChange: () => setMode("publish")
								}), "立即发布"] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									type: "radio",
									name: "pub-mode",
									checked: mode === "draft",
									onChange: () => setMode("draft")
								}), "转存草稿"] })]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "pub-muted",
								children: "提交前会同步检查全部账号登录状态；任一目标无效则整单拒绝。"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "pub-muted",
								children: "提交只表示任务已被本机发布队列接受，不代表平台发布成功。"
							})
						]
					})
				}),
				confirm && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConfirmDialog, {
					contentType: "video",
					title: confirm.title,
					sourceName: confirm.sourceName,
					mode: confirm.mode,
					accounts: confirm.accounts,
					busy,
					onCancel: () => {
						setConfirm(void 0);
						setPublishOpen(true);
					},
					onConfirm: submit
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherModal, {
					open: restartAgent,
					title: "重新开始对话",
					closeLabel: "关闭重新开始对话确认",
					description: "保存当前对话并开启新对话？稿件、素材和平台版本都会保留。",
					className: "pub-modal",
					onClose: () => {
						if (!busyRef.current) setRestartAgent(false);
					},
					footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "outline",
						"data-pub-initial-focus": true,
						disabled: busy,
						onClick: () => setRestartAgent(false),
						children: "取消"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						disabled: busy,
						onClick: () => void act(async () => {
							const current = await flush();
							if (current) await onRestartAgent?.(current);
							setRestartAgent(false);
						}),
						children: "开启新对话"
					})] })
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherModal, {
					open: deleteDraftId !== void 0,
					title: "删除本地视频草稿",
					closeLabel: "关闭删除视频草稿确认",
					description: "将这份稿件和关联对话一起移入回收站？素材保留，稿件可恢复，已发布记录也会保留。",
					className: "pub-modal",
					onClose: () => {
						if (!busyRef.current) setDeleteDraftId(void 0);
					},
					footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						size: "sm",
						variant: "outline",
						"data-pub-initial-focus": true,
						disabled: busy,
						onClick: () => {
							if (!busyRef.current) setDeleteDraftId(void 0);
						},
						children: "取消"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						size: "sm",
						variant: "outline",
						className: "pub-danger-action",
						disabled: busy,
						onClick: confirmRemove,
						children: busy ? "正在删除…" : "删除草稿"
					})] })
				})
			] });
		}
		//#endregion
		//#region src/client/index.tsx
		const inject = [
			"slots",
			"layout",
			"sidebarRight",
			"sidebarRightTabs",
			"sessions",
			"workspaces",
			"uiWorkspace"
		];
		const PUBLISHER_PANEL = "cqai-publisher";
		function waitForArchiveSnapshot(workspaces) {
			if (workspaces.list.getSnapshot().phase === "ready") return Promise.resolve();
			return new Promise((resolve, reject) => {
				let unsubscribe = () => {};
				const timeout = setTimeout(() => {
					unsubscribe();
					reject(/* @__PURE__ */ new Error("Agent 对话归档状态尚未就绪，请稍后重试"));
				}, 8e3);
				const check = () => {
					if (workspaces.list.getSnapshot().phase !== "ready") return;
					clearTimeout(timeout);
					unsubscribe();
					resolve();
				};
				unsubscribe = workspaces.list.subscribe(check);
				check();
			});
		}
		function workspaceContainsSession(workspaces, sessionId, workspaceId) {
			return workspaces.list.getSnapshot().items.some((workspace) => workspace.workspaceId === workspaceId && workspace.sessionIds.includes(sessionId));
		}
		function isPublisherSession(sessions, sessionId) {
			return (sessions.retainInfo(sessionId).getSnapshot().retainedBy["publisherView"] ?? 0) > 0;
		}
		/** Keep a Publisher-owned archive from revealing the ordinary Conversation. */
		async function keepPublisherDuringArchive(layout, workspaces, sessionId, operation) {
			if (!sessionId || layout.panelInfo.getSnapshot().activePanelId !== PUBLISHER_PANEL) return operation();
			let preserve = true;
			const unsubscribe = layout.panelInfo.subscribe(() => {
				if (!preserve) return;
				const panel = layout.panelInfo.getSnapshot().activePanelId;
				if (panel === PUBLISHER_PANEL) return;
				if (panel === null && workspaces.list.getSnapshot().archivedSessionIds.includes(sessionId)) {
					preserve = false;
					layout.selectPanel(PUBLISHER_PANEL);
				} else preserve = false;
			});
			try {
				return await operation();
			} finally {
				unsubscribe();
			}
		}
		function waitForWorkspaceSession(workspaces, workspaceId, sessionId) {
			return new Promise((resolve, reject) => {
				let unsubscribe = () => {};
				const timeout = setTimeout(() => {
					unsubscribe();
					reject(/* @__PURE__ */ new Error("Agent 工作区尚未关联新对话，请稍后重试"));
				}, 8e3);
				const check = () => {
					if (!workspaces.list.getSnapshot().items.find((item) => item.workspaceId === workspaceId)?.sessionIds.includes(sessionId)) return;
					clearTimeout(timeout);
					unsubscribe();
					resolve();
				};
				unsubscribe = workspaces.list.subscribe(check);
				check();
			});
		}
		function PublishIcon({ size = 20 }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
				className: "cqai-plugin-panel-icon",
				src: plugin_icon_default,
				width: size,
				height: size,
				alt: "",
				draggable: false
			});
		}
		function handleTabKeyDown(event) {
			const tabs = Array.from(event.currentTarget.querySelectorAll("[role=\"tab\"]"));
			const current = tabs.indexOf(event.target);
			if (current < 0) return;
			const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : event.key === "ArrowRight" ? (current + 1) % tabs.length : event.key === "ArrowLeft" ? (current - 1 + tabs.length) % tabs.length : -1;
			if (next < 0) return;
			event.preventDefault();
			tabs[next]?.focus();
			tabs[next]?.click();
		}
		function PublisherPage({ sessions, workspaces, layout, uiWorkspace, agentRenderer }) {
			const surfaceRef = (0, react.useRef)(null);
			const [tab, setTab] = (0, react.useState)("publish");
			const [writingProfileOpen, setWritingProfileOpen] = (0, react.useState)(false);
			const settingsDirtyRef = (0, react.useRef)(false);
			const settingsBusyRef = (0, react.useRef)(false);
			const [pendingSettingsNavigation, setPendingSettingsNavigation] = (0, react.useState)();
			const markSettingsDirty = (0, react.useCallback)((dirty) => {
				settingsDirtyRef.current = dirty;
			}, []);
			const markSettingsBusy = (0, react.useCallback)((busy) => {
				settingsBusyRef.current = busy;
			}, []);
			const pageTitleRef = (0, react.useRef)(null);
			const [editingIds, setEditingIds] = (0, react.useState)(() => {
				const handoff = readPublisherHandoff();
				return handoff ? { [handoff.contentType]: handoff.contentId } : {};
			});
			const [galleryRefresh, setGalleryRefresh] = (0, react.useState)({
				article: 0,
				"image-note": 0,
				video: 0
			});
			const [editorMode, setEditorMode] = (0, react.useState)(() => readPublisherHandoff()?.initialMode ?? "edit");
			const [galleryBusy, setGalleryBusy] = (0, react.useState)(false);
			const galleryBusyRef = (0, react.useRef)(false);
			const [galleryError, setGalleryError] = (0, react.useState)();
			const [createTarget, setCreateTarget] = (0, react.useState)();
			const [deleteTarget, setDeleteTarget] = (0, react.useState)();
			const [deleteError, setDeleteError] = (0, react.useState)("");
			const [agentDrawer, setAgentDrawer] = (0, react.useState)();
			const agentDrawerRef = (0, react.useRef)();
			const retiredAgentReferences = (0, react.useRef)(/* @__PURE__ */ new Set());
			const [retireRevision, setRetireRevision] = (0, react.useState)(0);
			const pendingAgentReferenceRef = (0, react.useRef)();
			const agentRequestGenerationRef = (0, react.useRef)(0);
			const activeContentRef = (0, react.useRef)();
			const releasePendingAgent = () => {
				pendingAgentReferenceRef.current?.release();
				pendingAgentReferenceRef.current = void 0;
			};
			const navigatePage = (next) => {
				if (tab === next || settingsBusyRef.current) return;
				const navigate = () => {
					settingsDirtyRef.current = false;
					releasePendingAgent();
					agentRequestGenerationRef.current += 1;
					setTab(next);
					if (next === "publish") pageTitleRef.current?.focus();
				};
				if (tab === "settings" && settingsDirtyRef.current) setPendingSettingsNavigation(() => navigate);
				else navigate();
			};
			const [agentError, setAgentError] = (0, react.useState)("");
			const autoOpenedRef = (0, react.useRef)();
			const agentTargetsRef = (0, react.useRef)({});
			const agentSessionIdsRef = (0, react.useRef)({});
			const delegationStarts = (0, react.useRef)(/* @__PURE__ */ new Set());
			const closeAgent = (0, react.useCallback)(async () => {
				agentRequestGenerationRef.current += 1;
				pendingAgentReferenceRef.current?.release();
				pendingAgentReferenceRef.current = void 0;
				const open = agentDrawerRef.current;
				agentDrawerRef.current = void 0;
				if (open) retiredAgentReferences.current.add(open.reference);
				setAgentDrawer(void 0);
				if (!open) return;
				setRetireRevision((value) => value + 1);
				try {
					await api("agent-draft-bind", {
						sessionId: open.sessionId,
						contentId: null,
						bindingToken: open.bindingToken
					});
				} catch (cause) {
					if (!agentDrawerRef.current) setAgentError(`无法解除 Agent 与草稿的关联：${errorMessage(cause)}`);
				}
			}, []);
			(0, react.useEffect)(() => {
				for (const reference of retiredAgentReferences.current) {
					if (reference === agentDrawer?.reference) continue;
					retiredAgentReferences.current.delete(reference);
					reference.release();
				}
			}, [agentDrawer, retireRevision]);
			const returnToSource = async (sessionId, navigation = layout.beginNavigation()) => {
				const selected = activeContentRef.current?.id;
				if (!selected || navigation.aborted) return;
				const origin = await api(`article-origin/${selected}`);
				if (navigation.aborted || selected !== activeContentRef.current?.id) return;
				if (!origin || origin.source.sessionId !== sessionId || !origin.sourceSessionAvailable) throw new Error("来源对话已删除或归档，发布草稿仍可继续编辑");
				await closeAgent();
				if (!navigation.aborted && selected === activeContentRef.current?.id) uiWorkspace.openSession(sessionId);
			};
			(0, react.useEffect)(() => () => {
				agentRequestGenerationRef.current += 1;
				pendingAgentReferenceRef.current?.release();
				pendingAgentReferenceRef.current = void 0;
				const open = agentDrawerRef.current;
				agentDrawerRef.current = void 0;
				for (const reference of retiredAgentReferences.current) reference.release();
				retiredAgentReferences.current.clear();
				if (!open) return;
				open.reference.release();
				api("agent-draft-bind", {
					sessionId: open.sessionId,
					contentId: null,
					bindingToken: open.bindingToken
				}).catch(() => {});
			}, []);
			(0, react.useEffect)(() => sessions.list.subscribe(() => {
				const open = agentDrawerRef.current;
				if (!open) return;
				const list = sessions.list.getSnapshot();
				if (!isPublisherSession(sessions, open.sessionId) || list.phase === "ready" && !list.ids.includes(open.sessionId)) closeAgent();
			}), [sessions, closeAgent]);
			(0, react.useEffect)(() => workspaces.list.subscribe(() => {
				const open = agentDrawerRef.current;
				if (!open) return;
				const snapshot = workspaces.list.getSnapshot();
				if (snapshot.archivedSessionIds.includes(open.sessionId) || snapshot.phase === "ready" && !workspaceContainsSession(workspaces, open.sessionId, open.workspaceId)) closeAgent();
			}), [workspaces, closeAgent]);
			const [intendedPlatforms, setIntendedPlatforms] = (0, react.useState)(() => {
				const handoff = readPublisherHandoff();
				return handoff?.platforms ? {
					contentId: handoff.contentId,
					platforms: handoff.platforms
				} : void 0;
			});
			const [contentType, setContentType] = (0, react.useState)(() => {
				const handoff = readPublisherHandoff();
				if (handoff) return handoff.contentType;
				try {
					const saved = localStorage.getItem("cqai-publisher-content-type");
					return saved === "article" || saved === "image-note" || saved === "video" ? saved : "video";
				} catch {
					return "video";
				}
			});
			const contentTypeRef = (0, react.useRef)(contentType);
			const handoffGenerationRef = (0, react.useRef)(0);
			contentTypeRef.current = contentType;
			activeContentRef.current = tab === "publish" && editingIds[contentType] ? {
				id: editingIds[contentType],
				type: contentType
			} : void 0;
			(0, react.useEffect)(() => {
				const open = agentDrawerRef.current;
				if (open && (tab !== "publish" || contentType !== open.contentType || editingIds[contentType] !== open.contentId)) closeAgent();
			}, [
				tab,
				contentType,
				editingIds,
				closeAgent
			]);
			const startPublisherDelegation = async (content, bound) => {
				const current = () => agentDrawerRef.current?.bindingToken === bound.bindingToken && agentDrawerRef.current?.sessionId === bound.sessionId && activeContentRef.current?.id === content.id && agentDrawerRef.current?.target.kind === "main";
				if (!current()) return;
				try {
					const task = await api(`publisher-delegation-for-content/${encodeURIComponent(content.id)}`);
					if (!current() || !task || task.status !== "queued" || task.contentId !== content.id || task.publisherSessionId !== bound.sessionId || delegationStarts.current.has(task.taskId)) return;
					delegationStarts.current.add(task.taskId);
					try {
						await api("publisher-delegation-start", {
							taskId: task.taskId,
							sessionId: bound.sessionId,
							bindingToken: bound.bindingToken,
							...typeof content.revision === "number" ? { expectedContentRevision: content.revision } : {}
						});
					} catch (cause) {
						delegationStarts.current.delete(task.taskId);
						throw cause;
					}
				} catch (cause) {
					if (current()) setAgentError(`发布任务暂时无法开始：${errorMessage(cause)}。稿件和当前对话会保留。`);
				}
			};
			const openAgent = async (content, requestedTarget) => {
				if (content.contentType !== contentType) throw new Error("当前草稿内容类型不匹配");
				if (requestedTarget) agentTargetsRef.current[content.id] = requestedTarget;
				if (agentDrawerRef.current?.contentId === content.id && agentDrawerRef.current.contentType === content.contentType) {
					const desired = agentTargetsRef.current[content.id] ?? agentDrawerRef.current.target;
					if (JSON.stringify(desired) !== JSON.stringify(agentDrawerRef.current.target)) await changeAgentTarget(content, desired);
					return;
				}
				if (agentDrawerRef.current || pendingAgentReferenceRef.current) await closeAgent();
				const generation = ++agentRequestGenerationRef.current;
				const stillCurrent = () => generation === agentRequestGenerationRef.current && activeContentRef.current?.id === content.id && activeContentRef.current.type === content.contentType;
				setAgentError("");
				const linked = await api("agent-draft-session", { contentId: content.id });
				refreshPublisherWorkspaceVisibility();
				if (!stillCurrent()) return;
				const sessionId = linked.sessionId;
				agentSessionIdsRef.current[content.id] = sessionId;
				await sessions.refresh();
				if (!stillCurrent()) return;
				await waitForArchiveSnapshot(workspaces);
				if (!stillCurrent()) return;
				await waitForWorkspaceSession(workspaces, linked.workspaceId, sessionId);
				if (!stillCurrent()) return;
				const reference = sessions.retain(sessionId, { source: PUBLISHER_AGENT_REFERENCE_SOURCE });
				pendingAgentReferenceRef.current = reference;
				let installed = false;
				try {
					await reference.ready;
					if (!stillCurrent()) return;
					let target = agentTargetsRef.current[content.id] ?? { kind: "main" };
					let binding;
					for (;;) {
						binding = await api("agent-draft-bind", {
							sessionId,
							contentId: content.id,
							target
						});
						if (!stillCurrent() || !isPublisherSession(sessions, sessionId)) {
							await api("agent-draft-bind", {
								sessionId,
								contentId: null,
								bindingToken: binding.bindingToken
							});
							return;
						}
						const desired = agentTargetsRef.current[content.id] ?? { kind: "main" };
						if (JSON.stringify(desired) === JSON.stringify(target)) break;
						await api("agent-draft-bind", {
							sessionId,
							contentId: null,
							bindingToken: binding.bindingToken
						});
						if (!stillCurrent()) return;
						target = desired;
					}
					agentDrawerRef.current = {
						...binding,
						contentType: content.contentType,
						workspaceId: linked.workspaceId,
						target,
						reference
					};
					installed = true;
					setAgentDrawer(agentDrawerRef.current);
					startPublisherDelegation(content, agentDrawerRef.current);
				} catch (cause) {
					if (stillCurrent()) throw cause;
				} finally {
					if (pendingAgentReferenceRef.current === reference) pendingAgentReferenceRef.current = void 0;
					if (!installed) reference.release();
				}
			};
			const toggleAgent = async (content, target) => {
				if (agentDrawerRef.current?.contentId === content.id) await closeAgent();
				else await openAgent(content, target);
			};
			const draftReady = (content, target = { kind: "main" }) => {
				if (activeContentRef.current?.id !== content.id || autoOpenedRef.current === content.id) return;
				autoOpenedRef.current = content.id;
				agentTargetsRef.current[content.id] = target;
				openAgent(content).catch((cause) => setAgentError(`Agent 对话暂时无法打开：${errorMessage(cause)}。可使用“Agent 辅助编辑”重试。`));
			};
			const changeAgentTarget = async (content, target) => {
				agentTargetsRef.current[content.id] = target;
				const open = agentDrawerRef.current;
				if (!open || open.contentId !== content.id || JSON.stringify(open.target) === JSON.stringify(target)) return;
				const generation = ++agentRequestGenerationRef.current;
				const binding = await api("agent-draft-bind", {
					sessionId: open.sessionId,
					contentId: content.id,
					target
				});
				if (generation !== agentRequestGenerationRef.current || agentDrawerRef.current?.contentId !== content.id) {
					await api("agent-draft-bind", {
						sessionId: open.sessionId,
						contentId: null,
						bindingToken: binding.bindingToken
					});
					return;
				}
				agentDrawerRef.current = {
					...open,
					...binding,
					target
				};
				setAgentDrawer(agentDrawerRef.current);
				if (target.kind === "main") startPublisherDelegation(content, agentDrawerRef.current);
			};
			const restartAgent = async (content, target) => {
				const sessionId = agentSessionIdsRef.current[content.id];
				await closeAgent();
				await keepPublisherDuringArchive(layout, workspaces, sessionId, () => api("agent-draft-session-delete", { contentId: content.id }));
				await openAgent(content, target);
			};
			const deleteEditorContent = async (id) => {
				const sessionId = agentSessionIdsRef.current[id];
				await closeAgent();
				await keepPublisherDuringArchive(layout, workspaces, sessionId, () => api("content-delete", { id }));
			};
			(0, react.useEffect)(() => subscribePublisherHandoff((handoff) => {
				releasePendingAgent();
				agentRequestGenerationRef.current += 1;
				handoffGenerationRef.current += 1;
				autoOpenedRef.current = void 0;
				setTab("publish");
				setEditorMode(handoff.initialMode ?? "edit");
				contentTypeRef.current = handoff.contentType;
				setContentType(handoff.contentType);
				setEditingIds((current) => ({
					...current,
					[handoff.contentType]: handoff.contentId
				}));
				setIntendedPlatforms(handoff.platforms ? {
					contentId: handoff.contentId,
					platforms: handoff.platforms
				} : void 0);
				try {
					localStorage.setItem("cqai-publisher-content-type", handoff.contentType);
				} catch {}
			}), []);
			const chooseContentType = (value) => {
				if (value !== contentTypeRef.current) {
					releasePendingAgent();
					agentRequestGenerationRef.current += 1;
					clearPublisherHandoff();
				}
				contentTypeRef.current = value;
				setContentType(value);
				setGalleryError(void 0);
				try {
					localStorage.setItem("cqai-publisher-content-type", value);
				} catch {}
			};
			const renderGeneration = handoffGenerationRef.current;
			const selected = (type, id) => {
				if (renderGeneration !== handoffGenerationRef.current) return;
				releasePendingAgent();
				agentRequestGenerationRef.current += 1;
				autoOpenedRef.current = void 0;
				setEditorMode("edit");
				setEditingIds((current) => ({
					...current,
					[type]: id
				}));
				if (intendedPlatforms && intendedPlatforms.contentId !== id) setIntendedPlatforms(void 0);
				const handoff = readPublisherHandoff();
				if (handoff?.contentType === type && handoff.contentId !== id) clearPublisherHandoff();
			};
			const returnToGallery = (type) => {
				releasePendingAgent();
				agentRequestGenerationRef.current += 1;
				autoOpenedRef.current = void 0;
				const id = editingIds[type];
				setEditingIds((current) => ({
					...current,
					[type]: void 0
				}));
				setGalleryRefresh((current) => ({
					...current,
					[type]: current[type] + 1
				}));
				if (intendedPlatforms?.contentId === id) setIntendedPlatforms(void 0);
				const handoff = readPublisherHandoff();
				if (handoff?.contentType === type && handoff.contentId === id) clearPublisherHandoff();
			};
			const runGalleryAction = async (type, task) => {
				if (galleryBusyRef.current) return;
				galleryBusyRef.current = true;
				setGalleryBusy(true);
				setGalleryError(void 0);
				try {
					await task();
				} catch (cause) {
					setGalleryError({
						contentType: type,
						message: errorMessage(cause)
					});
				} finally {
					galleryBusyRef.current = false;
					setGalleryBusy(false);
				}
			};
			const createDraft = (type) => {
				if (galleryBusyRef.current) return;
				setGalleryError(void 0);
				setCreateTarget(type);
			};
			const copyDraft = (type, id) => void runGalleryAction(type, async () => {
				const copy = await api("content-copy", { id });
				if (copy.contentType !== type) throw new Error("草稿内容类型不匹配");
				autoOpenedRef.current = void 0;
				setEditorMode("edit");
				setEditingIds((current) => ({
					...current,
					[type]: copy.id
				}));
			});
			const restoreDraft = (type, id) => void runGalleryAction(type, async () => {
				try {
					await api("content-restore", { id });
				} finally {
					setGalleryRefresh((current) => ({
						...current,
						[type]: current[type] + 1
					}));
				}
			});
			const retryTrashDeletion = (type, id) => void runGalleryAction(type, async () => {
				try {
					await deleteEditorContent(id);
				} finally {
					setGalleryRefresh((current) => ({
						...current,
						[type]: current[type] + 1
					}));
				}
			});
			const confirmDelete = () => {
				if (!deleteTarget) return;
				const { contentType: type, id } = deleteTarget;
				runGalleryAction(type, async () => {
					try {
						await deleteEditorContent(id);
					} catch (cause) {
						setDeleteError(errorMessage(cause));
						setGalleryRefresh((current) => ({
							...current,
							[type]: current[type] + 1
						}));
						throw cause;
					}
					setDeleteTarget(void 0);
					setDeleteError("");
					setGalleryRefresh((current) => ({
						...current,
						[type]: current[type] + 1
					}));
				});
			};
			const renderTypePanel = (type) => {
				const editingId = editingIds[type];
				const active = tab === "publish" && contentType === type;
				const openEditor = (id, mode) => {
					autoOpenedRef.current = void 0;
					setGalleryError(void 0);
					setEditorMode(mode);
					setEditingIds((current) => ({
						...current,
						[type]: id
					}));
				};
				return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						hidden: !!editingId,
						children: [galleryError?.contentType === type && active && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pub-error",
							role: "alert",
							children: galleryError.message
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(DraftGallery, {
							contentType: type,
							active: active && !editingId,
							busy: galleryBusy,
							refreshKey: galleryRefresh[type],
							onOpen: (id) => openEditor(id, "edit"),
							onPreview: (id) => openEditor(id, "preview"),
							onPublish: (id) => openEditor(id, "publish"),
							onCreate: () => createDraft(type),
							onCopy: (id) => copyDraft(type, id),
							onDelete: (id) => {
								setGalleryError(void 0);
								setDeleteError("");
								setDeleteTarget({
									contentType: type,
									id
								});
							}
						})]
					}),
					type === contentType && agentError && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pub-error",
						role: "alert",
						children: agentError
					}),
					editingId && (type === "video" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(VideoPage, {
						active,
						selectedContentId: editingId,
						initialMode: editorMode,
						agentOpen: agentDrawer?.contentId === editingId && agentDrawer.contentType === type,
						onToggleAgent: toggleAgent,
						onDraftReady: draftReady,
						onRestartAgent: restartAgent,
						onDeleteContent: deleteEditorContent,
						onOpenWritingProfile: () => setWritingProfileOpen(true),
						onSelectedContentChange: (id) => selected(type, id),
						onBack: () => returnToGallery(type)
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ContentEditor, {
						contentType: type,
						active,
						selectedContentId: editingId,
						initialMode: editorMode,
						intendedPlatforms: intendedPlatforms?.contentId === editingId ? intendedPlatforms.platforms : void 0,
						handoffGeneration: handoffGenerationRef.current,
						agentOpen: agentDrawer?.contentId === editingId && agentDrawer.contentType === type,
						onToggleAgent: toggleAgent,
						onDraftReady: draftReady,
						onAgentTargetChange: changeAgentTarget,
						onRestartAgent: restartAgent,
						onDeleteContent: deleteEditorContent,
						onOpenWritingProfile: () => setWritingProfileOpen(true),
						onReturnToSource: returnToSource,
						onSourceNavigation: () => layout.beginNavigation(),
						onSelectedContentChange: (id) => selected(type, id),
						onBack: () => returnToGallery(type)
					}))
				] });
			};
			const editing = tab === "publish" && Boolean(editingIds[contentType]);
			const visibleAgent = editing && agentDrawer && agentDrawer.contentId === editingIds[contentType] && agentDrawer.contentType === contentType ? agentDrawer : void 0;
			const agentResize = usePublisherAgentResize(surfaceRef, Boolean(visibleAgent));
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherTipsProvider, { children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				ref: surfaceRef,
				className: "pub-surface",
				"data-agent-open": visibleAgent ? "true" : void 0,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("style", { children: [css, agentSplitterCss] }),
					visibleAgent && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("aside", {
						id: "pub-agent-drawer",
						className: "pub-agent-panel",
						"aria-label": "Agent 辅助编辑",
						"data-session-id": visibleAgent.sessionId,
						"data-content-id": visibleAgent.contentId,
						style: { "--pub-agent-width": agentResize.width === void 0 ? void 0 : `${agentResize.width}px` },
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
							className: "pub-agent-header",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: ["Agent · ", contentType === "article" ? "文章" : contentType === "image-note" ? "图文" : "视频"] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "收起 Agent",
								onClick: () => void closeAgent(),
								children: "×"
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pub-agent-conversation",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(agentRenderer.SessionProvider, {
								session: visibleAgent.reference,
								children: agentRenderer.renderSlot("publisher.agent", { contentType: visibleAgent.contentType })
							})
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherAgentSplitter, { ...agentResize.splitterProps })] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("section", {
						className: "pub",
						"data-editor-open": editing ? "true" : void 0,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pub-wrap",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
									className: "pub-head",
									hidden: editing,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
										ref: pageTitleRef,
										tabIndex: -1,
										children: "多平台发布"
									}) }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("nav", {
										className: "pub-page-nav",
										"aria-label": "多平台发布页面导航",
										children: [
											tab !== "publish" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: "pub-page-link",
												"aria-controls": "pub-panel-publish",
												onClick: () => navigatePage("publish"),
												children: "返回发布内容"
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: "pub-page-link",
												"aria-controls": "pub-panel-history",
												"aria-current": tab === "history" ? "page" : void 0,
												onClick: () => navigatePage("history"),
												children: "发布历史"
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: "pub-page-link",
												"aria-controls": "pub-panel-accounts",
												"aria-current": tab === "accounts" ? "page" : void 0,
												onClick: () => navigatePage("accounts"),
												children: "平台账号管理"
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: "pub-page-link",
												"aria-controls": "pub-panel-settings",
												"aria-current": tab === "settings" ? "page" : void 0,
												onClick: () => navigatePage("settings"),
												children: "设置"
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: "pub-page-link",
												"aria-controls": "pub-panel-trash",
												"aria-current": tab === "trash" ? "page" : void 0,
												onClick: () => navigatePage("trash"),
												children: "回收站"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									id: "pub-panel-publish",
									hidden: tab !== "publish",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "pub-layout",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("nav", {
											className: "pub-type-nav",
											hidden: editing,
											role: "tablist",
											"aria-label": "内容类型",
											onKeyDown: handleTabKeyDown,
											children: [
												["article", "文章"],
												["image-note", "图文"],
												["video", "视频"]
											].map(([value, label]) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												className: "pub-type",
												id: `pub-type-${value}`,
												role: "tab",
												"aria-controls": `pub-content-${value}`,
												"aria-selected": contentType === value,
												tabIndex: contentType === value ? 0 : -1,
												onClick: () => chooseContentType(value),
												children: label
											}, value))
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "pub-content-panels",
											children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
													id: "pub-content-article",
													role: "tabpanel",
													"aria-labelledby": "pub-type-article",
													hidden: contentType !== "article",
													children: renderTypePanel("article")
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
													id: "pub-content-image-note",
													role: "tabpanel",
													"aria-labelledby": "pub-type-image-note",
													hidden: contentType !== "image-note",
													children: renderTypePanel("image-note")
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
													id: "pub-content-video",
													role: "tabpanel",
													"aria-labelledby": "pub-type-video",
													hidden: contentType !== "video",
													children: renderTypePanel("video")
												})
											]
										})]
									})
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									id: "pub-panel-trash",
									hidden: tab !== "trash",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "回收站" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
											className: "pub-muted",
											children: "稿件和素材会保留。恢复后再次打开稿件，将继续或新建它的编辑对话。"
										}),
										tab === "trash" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("nav", {
												className: "pub-type-nav",
												role: "tablist",
												"aria-label": "回收站内容类型",
												onKeyDown: handleTabKeyDown,
												children: [
													["article", "文章"],
													["image-note", "图文"],
													["video", "视频"]
												].map(([value, label]) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
													role: "tab",
													"aria-selected": contentType === value,
													tabIndex: contentType === value ? 0 : -1,
													className: "pub-type",
													onClick: () => chooseContentType(value),
													children: label
												}, value))
											}),
											galleryError?.contentType === contentType && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
												className: "pub-error",
												role: "alert",
												children: galleryError.message
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(DraftGallery, {
												contentType,
												active: true,
												busy: galleryBusy,
												trash: true,
												refreshKey: galleryRefresh[contentType],
												onOpen: () => {},
												onCreate: () => {},
												onCopy: () => {},
												onDelete: (id) => retryTrashDeletion(contentType, id),
												onRestore: (id) => restoreDraft(contentType, id)
											})
										] })
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									id: "pub-panel-history",
									hidden: tab !== "history",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SubmissionHistory, { active: tab === "history" })
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									id: "pub-panel-accounts",
									hidden: tab !== "accounts",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AccountsPage, { active: tab === "accounts" })
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									id: "pub-panel-settings",
									hidden: tab !== "settings",
									children: tab === "settings" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherSettings, {
										onWritingProfileDirtyChange: markSettingsDirty,
										onWritingProfileBusyChange: markSettingsBusy
									})
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(WritingProfileDialog, {
									open: writingProfileOpen,
									onClose: () => setWritingProfileOpen(false)
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherModal, {
									open: pendingSettingsNavigation !== void 0,
									title: "离开写作风格设置？",
									closeLabel: "继续修改文风",
									description: "写作风格还有未保存的修改，离开后将保留之前的设置。",
									className: "pub-modal",
									onClose: () => setPendingSettingsNavigation(void 0),
									footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										size: "sm",
										variant: "outline",
										"data-pub-initial-focus": true,
										onClick: () => setPendingSettingsNavigation(void 0),
										children: "继续修改"
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										size: "sm",
										variant: "outline",
										onClick: () => {
											pendingSettingsNavigation?.();
											setPendingSettingsNavigation(void 0);
										},
										children: "放弃修改并离开"
									})] })
								}),
								createTarget && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CreateDraftDialog, {
									contentType: createTarget,
									onCancel: () => setCreateTarget(void 0),
									onCreated: (created) => {
										autoOpenedRef.current = void 0;
										setEditorMode("edit");
										setEditingIds((current) => ({
											...current,
											[created.contentType]: created.id
										}));
										setCreateTarget(void 0);
									}
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherModal, {
									open: deleteTarget !== void 0,
									title: "删除本地草稿",
									closeLabel: "关闭删除草稿确认",
									description: deleteError ? `删除失败：${deleteError}` : "将这份稿件和关联对话一起移入回收站？素材保留，稿件可恢复，已发布记录也会保留。",
									className: "pub-modal",
									onClose: () => {
										if (!galleryBusyRef.current) {
											setDeleteTarget(void 0);
											setDeleteError("");
										}
									},
									footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										size: "sm",
										variant: "outline",
										"data-pub-initial-focus": true,
										disabled: galleryBusy,
										onClick: () => {
											setDeleteTarget(void 0);
											setDeleteError("");
										},
										children: "取消"
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										size: "sm",
										variant: "outline",
										className: "pub-danger-action",
										disabled: galleryBusy,
										onClick: confirmDelete,
										children: galleryBusy ? "正在删除…" : "删除草稿"
									})] })
								})
							]
						})
					})
				]
			}) });
		}
		function apply(ctx) {
			ctx.slots.inject("conversation.chat.turnTail", () => ctx.slots.register({
				name: "conversation.chat.turnTail",
				id: "cqai-publisher-publication-confirmation",
				order: 10
			}, AgentPublicationTurnTail));
			ctx.slots.inject("tool.call.toolview", () => ctx.slots.register({
				name: "tool.call.toolview",
				key: "publisher_request_publication"
			}, AgentPublicationToolView));
			const { sessions, workspaces, uiWorkspace } = ctx;
			const openTransferredArticle = (result) => {
				if (result.content.contentType !== "article" && result.content.contentType !== "image-note") return;
				requestPublisherHandoff({
					contentId: result.content.id,
					contentType: result.content.contentType,
					initialMode: "edit",
					...result.handoff.platforms.length ? { platforms: result.handoff.platforms } : {}
				});
				ctx.layout.selectPanel(PUBLISHER_PANEL);
			};
			ctx.slots.inject("conversation.chat.turnTail", () => ctx.slots.register({
				name: "conversation.chat.turnTail",
				id: "cqai-publisher-article-handoff",
				order: 11
			}, (props) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ArticleHandoffTurnTail, {
				...props,
				beginNavigation: () => ctx.layout.beginNavigation(),
				onOpen: openTransferredArticle
			})));
			ctx.slots.inject("tool.call.toolview", () => ctx.slots.register({
				name: "tool.call.toolview",
				key: "handoff_to_publisher"
			}, ArticleHandoffToolView));
			ctx.effect(() => registerPublisherWorkspaceVisibility(ctx));
			ctx.effect(() => watchAutomaticPublisherHandoffs(sessions, ctx.layout, openTransferredArticle));
			ctx.effect(() => registerPublisherNewConversationGuard(ctx, {
				sessions,
				workspaces,
				uiWorkspace
			}));
			registerPublisherAgent(ctx);
			ctx.slots.inject("main", () => ctx.slots.register({
				name: "main",
				key: PUBLISHER_PANEL,
				children: { [PUBLISHER_AGENT_SLOT]: {
					kind: "single",
					scope: "session"
				} }
			}, (props) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublisherPage, {
				sessions,
				workspaces,
				layout: ctx.layout,
				uiWorkspace,
				agentRenderer: props
			})));
			ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
				name: "sidebar.panellist",
				id: PUBLISHER_PANEL,
				order: 42,
				label: "多平台发布"
			}, ({ size }) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublishIcon, { size })));
			ctx.effect(() => watchPublisherSession(sessions, workspaces, ctx.layout, (content) => {
				requestPublisherHandoff({
					...content,
					initialMode: "edit"
				});
				ctx.layout.selectPanel(PUBLISHER_PANEL);
			}));
			ctx.effect(() => ctx.sidebarRightTabs.register({
				id: PREVIEW_ID,
				kind: PREVIEW_KIND,
				title: () => "预览"
			}), "publisher: conversation preview tab");
			const openPreview = () => {
				if (ctx.sidebarRight.active() === void 0) ctx.sidebarRight.openTab("files");
				ctx.sidebarRight.openTab(PREVIEW_KIND);
			};
			ctx.slots.inject("conversation.session.header.utilities", () => ctx.slots.register({
				name: "conversation.session.header.utilities",
				id: "cqai-publisher-preview",
				order: -5
			}, (props) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConversationPreviewAction, {
				...props,
				openPreview
			})));
			ctx.slots.inject("sidebar.right.pane.tab", () => ctx.slots.register({
				name: "sidebar.right.pane.tab",
				key: PREVIEW_ID
			}, (props) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConversationPreview, {
				...props,
				onOpenPublisher: () => ctx.layout.selectPanel(PUBLISHER_PANEL),
				onPublish: (preparation, platforms) => {
					if (preparation.contentType !== "article" && preparation.contentType !== "image-note") return;
					requestPublisherHandoff({
						contentId: preparation.id,
						contentType: preparation.contentType,
						...platforms ? { platforms } : {}
					});
					ctx.layout.selectPanel(PUBLISHER_PANEL);
				}
			})));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
