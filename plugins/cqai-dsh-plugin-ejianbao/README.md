# e剪宝独立插件套件

GitHub 仓库：[wangpeng668866/ebao-plugins](https://github.com/wangpeng668866/ebao-plugins)，目录为 `plugins/cqai-dsh-plugin-ejianbao`。

e剪宝将数字人视频、短视频和口播视频集中到同一个 DSH 工作区。根包 `cqai-dsh-plugin-ejianbao` 内置三个制作引擎、两个共享库和 CQAI Club 账号代码，通过一个安装入口提供视频功能。

本仓库从 e宝工坊源提交 `67a206fda2fbc61f98aee8b4ddcd3105cd8da6a3` 抽离。e宝桌面不再预置 e剪宝，安装本包后才启用制作页面；主项目保留自己的 CQAI Club 账号服务。来源和范围见 [PROVENANCE.md](PROVENANCE.md)。

## 功能与模块

| 位置 | 职责 |
| --- | --- |
| 根 `src/` | 聚合页面、公共设置和环境准备入口 |
| `packages/cqai-dsh-plugin-video/` | 数字人、已有口播和动效视频制作 |
| `packages/cqai-dsh-plugin-short-video/` | 文案、素材、配音、字幕和短视频制作 |
| `packages/cqai-dsh-plugin-talkcraft/` | 分阶段口播视频制作及多轨工作台 |
| `packages/cqai-dsh-media-settings/` | 公共画幅、音色和素材服务凭据 |
| `packages/cqai-dsh-plugin-media-runtime/` | 公共 Node、uv、Python、FFmpeg 和 ffprobe 准备 |
| `packages/cqai-dsh-plugin-account/` | 实际包名 `@cqaiclub/dsn-account`；未有账号服务的 DSH 可单独配置 |

根插件通过公共 `ejianbao.workspace` 插槽组合三个制作页面。共享库是普通依赖，不作为 DSH bundle 加载。

## 安装与账号

普通 DSH 的官方 CLI 可安装本地归档（示例 Profile 为 web，应换成自己的实际 Profile，并使用对应 DSH_HOME）：

```powershell
dsh plugin --profile web add "E:/workspace/project/cqai-club/dsh-plugin-ejianbao/artifacts/cqai-dsh-plugin-ejianbao-0.1.0.tgz"
```

CLI 需要宿主的 dsh 命令和 PATH 中的 pnpm。更新后的 e宝桌面可在当前 Profile 的 **DSH Terminal** 中执行：

```powershell
dsh plugin add "E:/workspace/project/cqai-club/dsh-plugin-ejianbao/artifacts/cqai-dsh-plugin-ejianbao-0.1.0.tgz"
```

桌面终端自动沿用当前 Profile 和 DSH_HOME；安装完成后重启桌面以载入新插件。不要使用另一个普通 DSH 的默认 web Profile 代替桌面 Profile。桌面需包含独立套件的 Profile 迁移和嵌套依赖解析更新，旧版桌面未验证。

公开 npm 包为 [`cqai-dsh-plugin-ejianbao`](https://www.npmjs.com/package/cqai-dsh-plugin-ejianbao)。在 CQAI Club Plugin Market 搜索“e剪宝”，安装根套件即可；也可在当前 Profile 的 DSH Terminal 执行 `dsh plugin add cqai-dsh-plugin-ejianbao@0.1.0`。市场条目配置保存在 [market/ejianbao.json](market/ejianbao.json)。Market 的在线 npm 安装与上面的本地归档 CLI 安装分别使用对应入口。

### 从 GitHub 安装

本仓库可直接作为固定 GitHub 依赖安装。将 `<commit>` 替换为仓库的 40 位 commit SHA：

```powershell
dsh plugin add "github:wangpeng668866/ebao-plugins#<commit>&path:/plugins/cqai-dsh-plugin-ejianbao"
```

只启用根 `cqai-dsh-plugin-ejianbao` bundle。默认 patch 加载三个制作引擎和聚合入口共四个 Host，复用宿主已经提供的 `dsnAccount` 服务，不重新加载或配置账号。

e宝桌面已有 `@cqaiclub/dsn-account`，直接使用原登录和模型配置。安装包里的账号代码不会自动成为第二个账号实例。不要同时启用三个内置引擎的独立 bundle，也不要在已有账号的宿主添加下面的账号 patch。

普通 DSH 需要标准 Web、credentials、authorization、connection、llm、agentDefaultModel 服务。若该 Profile 尚未配置 CQAI Club 账号，把下面这一项添加到当前 Profile 的 `cordis.patch.yml`；已有其他 patch 时保留它们。根包已经内置所需账号代码，不需要再下载账号包。此配置只添加一次；普通依赖的安装不会自动激活账号。

```yaml
- insert:
    - id: cqaiclub-dsn-account
      name: '@cqaiclub/dsn-account'
      config:
        issuer: 'https://auth.cqaiclub.asia/oidc'
        clientId: '8hm6gea0xg6gb2syles6v'
        resource: 'https://account.cqaiclub.asia'
        accountServiceUrl: 'https://account.cqaiclub.asia'
        clubPortalResource: 'https://cqaiclub.asia/'
        clubPortalUrl: 'https://cqaiclub.asia'
        scopes: [openid, offline_access, profile, email, 'ai:invoke', 'activity:publish']
```

账号使用 Native app 的 Authorization Code + PKCE 和本机回环回调。安装本包不创建登录态；使用 CQAI 模型和数字人服务前仍需登录并满足额度要求。默认 bundle 不修改已有账号的 issuer、clientId、Token 或模型设置。TalkCraft 的制作 Agent、preset 和默认模型服务由宿主管理。

兼容目标为 DSH `0.2.0-rc.2`，当前分发包面向 Windows x64，内置该平台的 uv 启动工具；其他系统和架构未验收。分发标记 `dsh.ejianbao = { distribution: 'external', version: 1 }` 供桌面区分独立安装和旧预置组合；不能根据 peer 版本范围推定其他宿主已通过验收。

## 原任务与素材

重新安装仍使用当前宿主的同一个 `DSH_HOME`：

| 数据 | 相对目录或凭据标识 |
| --- | --- |
| 数字人/动效任务 | `ejianbao/jobs` |
| 短视频任务、素材和背景音乐 | `short-video/jobs`、`short-video/storage` |
| TalkCraft 任务与私有运行时 | `talkcraft` |
| 公共视频设置 | `media-settings/settings.json` |
| CQAI Club 账号凭据 | `cqaiclub-dsn-account / primary` |
| 公共视频服务凭据 | `cqai-dsh-media-settings / services` |

切换到另一个 Profile 或另一个数据目录会使用对应宿主的存储。安装本包不搬移或删除原任务、素材和凭据，也不自动准备全部制作环境。

## 开发与打包

使用 Node.js 24 和 Corepack Yarn `4.18.0`。根工作区仅包含 `packages/*`，采用 `nodeLinker: node-modules` 并共享宿主 SDK。TalkCraft 的 React 19 / Remotion 私有运行时不加入根 Yarn 工作区，DSH Client 使用 React 18。

```powershell
corepack yarn install --immutable
corepack yarn build
corepack yarn typecheck
corepack yarn test
corepack yarn check
corepack yarn package:plugin
corepack yarn verify:package
```

`package:plugin` 通过 `bundledDependencies` 内置六个自有包和普通运行依赖，处理同名多版本的嵌套依赖。DSH / Cordis / React 由宿主提供。`verify:package` 离线检查归档、普通依赖版本、Client 模块、官方 Profile / Loader，以及继承宿主账号和显式账号配置两种场景。该夹具使用官方 rc2 解析器；e宝桌面的自有解析器接纳单 tgz 由主项目单独验证。

## 制作环境与验证边界

安装后在“制作环境”准备公共工具和各引擎专属依赖。Python 包、Remotion、无头浏览器和识别模型可能需要联网下载。固定版本和完整性检查不代表安装包包含全部运行环境。详细配置见各 `packages/*/README.md`。

根构建和离线验包不会下载浏览器、识别模型，不创建付费云任务，也不生成视频。构建、单元测试、真实 Loader、UI、媒体安装和渲染是不同验证层；实际执行记录见 [VALIDATION.md](VALIDATION.md)。

## 许可证

根聚合代码和各模块按各自许可证分发；根 [LICENSE](LICENSE) 不重新许可内置第三方内容。TalkCraft 使用 PolyForm Noncommercial 1.0.0，上游声明商业使用需先取得作者授权。完整条款保留在各模块中，来源见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
