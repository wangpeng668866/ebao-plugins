# cqai-dsh-plugin-shared-whiteboard

e宝工坊“共享白板”的独立 DeepSeek Harness 插件。白板数据默认保存于 `DSH_HOME/cqai-shared-whiteboard/boards.json`。

功能：白板列表、新建、便签拖动与编辑、保存、共享令牌、API 导入/读取。共享链接指向当前 DSH Host；若需要跨电脑访问，需让该 Host 通过受控的局域网或反向代理可访问，不会自动把数据上传到第三方云端。

安装：

```bash
dsh plugin add "github:wangpeng668866/ebao-plugins#<40位提交SHA>&path:/plugins/cqai-dsh-plugin-shared-whiteboard"
```
