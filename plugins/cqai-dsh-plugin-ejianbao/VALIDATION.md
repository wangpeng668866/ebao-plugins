# 独立安装验收记录

日期：2026-10-12。项目位置：`E:/workspace/project/cqai-club/dsh-plugin-ejianbao`。

环境为 Windows x64、Node.js 24.16.0、Corepack Yarn 4.18.0、项目内 DSH 0.2.0-rc.2 SDK；不依赖原 ebao-studio 的安装目录。

## 开发校验

抽离后的 `corepack yarn install --immutable` 和 `corepack yarn check` 已通过：7 个模块构建、类型检查，46 个测试文件的 236 项测试。宿主 SDK 共享一份 Cordis 类型实例；本地 workspace 与上游 SDK 仍有 peer 提示。

测试明细：共享设置 16、媒体运行时 10、账号 73、数字人 30、短视频 43、TalkCraft 47、聚合入口 17。

本轮修改安装 patch、分发标记、文档和验包脚本；媒体引擎及账号业务源码未改变。归档检查使用最终 tarball：

- 内置六个自有依赖及其普通运行依赖，发布元数据无 workspace 路径；同名不同版本按实际 consumer 嵌套。
- 普通依赖 SemVer 范围、内置 npm CLI、5 个 Host 导入与5 个 Client factory 解析。
- 根 patch 只有三个引擎与聚合入口共4行，不含账号配置。
- `dsh.ejianbao={distribution:external,version:1}` 标记存在于分发清单。

## 两种账号场景

| 场景 | suite 默认 Host | 实际 Loader Host / Client 图 | 账号来源 |
| --- | --- | --- | --- |
| `host-account` | 4 | 4 / 4 | 测试 Host 预先挂载真实账号插件；suite 复用同一个服务对象 |
| `explicit-account` | 4 | 5 / 5 | 普通 DSH 通过 Profile user patch 单独配置一次账号 |

两个场景均使用官方 Profile / Loader / ClientModuleRegistry 和隔离 DSH_HOME，分别确认账号仅挂载一次、4 个只读回环路由可用。默认 suite 不增加账号 Loader 行，不重配已有账号。

每个场景放入三个原目录任务记录、已有素材和背景音乐、公共设置文件，重装加载后三个任务重新出现在列表，六个文件字节保持一致；实际 `cqaiclub-dsn-account/primary` 键的模拟登录凭据保持原对象和序列化值，并且账号从该凭据恢复 signed-in 状态。没有数据搬移或清理操作。

账号单元测试另用模拟 OAuth 服务与真实本机回调验证无 desktopRuntime 时的登录流程。本轮归档验包不注入 desktopRuntime，也不登录真实服务。

## 验证边界

Loader 的标准 DSH 依赖使用服务替身，账号插件和视频 Host 来自归档。该检查证明归档内容、bundle 组合、账号复用和注入契约；未证明真实桌面 UI 或媒体生成。夹具使用官方 rc2 createRuntimeResolution；e宝桌面自有 Loader / Client 解析器接纳 suite/node_modules 的单 tgz 嵌套布局由主项目另行验证。

没有启动图形界面、访问真实云账号、安装制作环境、下载浏览器或识别模型、调用付费服务或生成视频。其他系统和 DSH 版本没有验收。桌面的首次撤下旧入口与保留数据由主项目的 Profile 迁移测试单独验证。

官方 DSH CLI 的本地 tarball 语法和桌面 DSH Terminal 的当前 Profile 参数补全已从锁定的 rc2 与桌面源码核对；本轮没有修改运行中的 Profile，也没有运行安装命令。2026-10-12 验收时尚未发布 npm 包或 Market 条目；当前安装入口见 README。

## 可复查记录

- `artifacts/check.log`：开发校验输出。
- `artifacts/verify-package.log`：当前归档检查输出。
- `artifacts/package.json`：分发包 SHA-256、大小与依赖清单。
- `artifacts/verification.json`：当前两个账号场景的实际结果及限制。
- `SOURCE.lock.json` / `EXTRACTION_REPORT.json`：原1188个来源文件的完整性与独立适配范围。
