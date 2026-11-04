# 来源与抽离记录

- 抽离日期：2026-10-12。
- 主项目：e宝工坊，抽离时路径 `E:/workspace/project/cqai-club/ebao-studio`。
- 来源 HEAD：`67a206fda2fbc61f98aee8b4ddcd3105cd8da6a3`（简称 `67a206fda2`）。
- 独立项目目标：`E:/workspace/project/cqai-club/dsh-plugin-ejianbao`。
- 抽离模式：复制现有模块并建立独立构建与分发边界。独立包通过安装启用视频套件；主项目负责移除桌面预置视频组合并保留宿主账号。

以上 HEAD 是来源基线，不表示独立仓库的后续适配与该提交逐字相同。

## 源目录映射

| 主项目 `cqai-dsh-plugins/` 下来源 | 独立仓库位置 |
| --- | --- |
| `cqai-dsh-plugin-ejianbao/` | 根目录 |
| `cqai-dsh-plugin-video/` | `packages/cqai-dsh-plugin-video/` |
| `cqai-dsh-plugin-short-video/` | `packages/cqai-dsh-plugin-short-video/` |
| `cqai-dsh-plugin-talkcraft/` | `packages/cqai-dsh-plugin-talkcraft/` |
| `cqai-dsh-media-settings/` | `packages/cqai-dsh-media-settings/` |
| `cqai-dsh-plugin-media-runtime/` | `packages/cqai-dsh-plugin-media-runtime/` |
| `cqai-dsh-plugin-account/` | `packages/cqai-dsh-plugin-account/` |

独立适配包括工作区与依赖组合、构建/测试/打包脚本、移动后的相对路径和随包 bundle 组合。Desktop 首页呈现的集成测试归主项目；独立测试只依赖本仓库模块。Electron 壳、Publisher、桌面主题、Community Market 和 pinned DeepSeek Harness 子模块不属于本次抽离范围。

## 上游来源

| 内容 | 记录的上游基线 | 本地来源说明 |
| --- | --- | --- |
| 数字人/动效流水线 | `wangpeng668866/dsh-shortvideo-pipeline`，`d547174b65271e67932cdedd4f8b10c20be72ef8` | `packages/cqai-dsh-plugin-video/UPSTREAM.md` |
| 短视频流水线 | MoneyPrinterTurbo `1.3.7`，`3d5f4e4` | `packages/cqai-dsh-plugin-short-video/README.md` 和 `UPSTREAM_LICENSE` |
| 口播流水线与工作台 | `Vincentwei1021/video-talkcraft`，`914103688cdec20ea35699f73b08e357a817c37a` | `packages/cqai-dsh-plugin-talkcraft/UPSTREAM.md` |
| CQAI Club 账号 | `cqai-club/cqaiclub-dsh-plugin`，`3bad8bed59be26573e3b2881bd9f105576e53532` | `packages/cqai-dsh-plugin-account/README.md` |
| InferFlow 客户端及辅助文件 | 原插件记录为 2026-09-15 本机 `inferflow-codex` skill 副本 | `packages/cqai-dsh-plugin-video/runtime/inferflow/NOTICE.md` |

保留模块的 `UPSTREAM.md`、许可证、第三方声明、固定运行时清单和必要源码。开发机器的 `node_modules`、Python 虚拟环境、下载模型、任务和私人配置不作为来源资源复制。

## 验证记录原则

来源记录不是通过记录。构建、类型检查、单元测试、tarball、真实 Loader、UI 和渲染分别记录实际结果；云端制作和付费模型调用单独验收。本文件不声明已执行或通过任何测试。

## 文件完整性

`SOURCE.lock.json` 记录原始 1188 个文件的路径、大小和 SHA-256。`EXTRACTION_REPORT.json` 列出逐字保留的 1175 个文件，以及独立适配与移出的文件。账号的 `desktopRuntime` 已改为可选服务，保留有桌面时的原行为，并新增无桌面宿主的登录回调测试。

## 独立安装与宿主账号

根 bundle 仅插入三个引擎和聚合入口。账号代码仍内置，默认复用已有 dsnAccount，不替换宿主账号配置或凭据。没有账号的普通 DSH 在 Profile 的 user patch 显式配置一次。分发标记 dsh.ejianbao={distribution:external,version:1} 用于桌面识别独立安装。

任务、素材、私有环境和设置继续使用原 DSH_HOME 内的 ejianbao、short-video、talkcraft、media-settings 路径；账号及视频服务的 credential scope/id 不变。适配没有数据搬移或清理逻辑。

独立媒体 parser 集成测试在非 Windows 上自行恢复 uv 执行权限，因为根 Yarn 工作区禁用依赖安装脚本。Git attributes 保留引入源文件的原始字节，避免 Windows checkout 改写来源哈希。

短视频 Host 测试比较两端的物理规范路径，兼容 Windows runner 的 8.3 TEMP 路径别名；原生产路径边界与拒绝目录链接的断言保持不变。
