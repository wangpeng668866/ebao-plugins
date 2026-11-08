# cqai-dsh-plugin-knowledge-base

e宝工坊“知识库”的独立 DeepSeek Harness 插件。数据默认保存在 `DSH_HOME/cqai-knowledge-base/documents.json`，不会写入仓库。

功能：文档新建、编辑、删除、标签、标题/标签筛选；Host API 还提供全文检索和 `/context?q=...` 上下文提取接口，便于自动化任务读取资料。

安装：

```bash
dsh plugin add "github:wangpeng668866/ebao-plugins#<40位提交SHA>&path:/plugins/cqai-dsh-plugin-knowledge-base"
```
