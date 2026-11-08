# e宝工坊插件

这里集中发布可供 e宝工坊 / DeepSeek Harness（DSH）安装的插件：

- `e剪宝`：`plugins/cqai-dsh-plugin-ejianbao`
- `e研宝`：`plugins/cqai-dsh-plugin-eyanbao`
- `多平台发布`：`plugins/cqai-dsh-plugin-publisher`
- `知识库`：`plugins/cqai-dsh-plugin-knowledge-base`
- `共享白板`：`plugins/cqai-dsh-plugin-shared-whiteboard`

## 通过 DSH Terminal 安装

在 e宝工坊的 DSH Terminal 中执行以下命令（把 `COMMIT_SHA` 替换为仓库目标提交的完整 SHA）：

```bash
dsh plugin add "github:wangpeng668866/ebao-plugins#COMMIT_SHA&path:/plugins/cqai-dsh-plugin-ejianbao"
dsh plugin add "github:wangpeng668866/ebao-plugins#COMMIT_SHA&path:/plugins/cqai-dsh-plugin-eyanbao"
dsh plugin add "github:wangpeng668866/ebao-plugins#COMMIT_SHA&path:/plugins/cqai-dsh-plugin-publisher"
dsh plugin add "github:wangpeng668866/ebao-plugins#COMMIT_SHA&path:/plugins/cqai-dsh-plugin-knowledge-base"
dsh plugin add "github:wangpeng668866/ebao-plugins#COMMIT_SHA&path:/plugins/cqai-dsh-plugin-shared-whiteboard"
```

也可以固定到 `main` 分支（不建议用于生产环境）：

```bash
dsh plugin add "github:wangpeng668866/ebao-plugins#main&path:/plugins/cqai-dsh-plugin-ejianbao"
dsh plugin add "github:wangpeng668866/ebao-plugins#main&path:/plugins/cqai-dsh-plugin-eyanbao"
dsh plugin add "github:wangpeng668866/ebao-plugins#main&path:/plugins/cqai-dsh-plugin-publisher"
dsh plugin add "github:wangpeng668866/ebao-plugins#main&path:/plugins/cqai-dsh-plugin-knowledge-base"
dsh plugin add "github:wangpeng668866/ebao-plugins#main&path:/plugins/cqai-dsh-plugin-shared-whiteboard"
```

两个插件目录都包含 `package.json` 和 `cordis.patch.yml`，可作为独立 DSH 插件源使用。
