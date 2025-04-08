# 更改日志

所有项目的显著变更都将记录在此文件中。

格式基于[Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且该项目遵循[语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 添加
- 创建了详细的README.md文档
- 添加了CHANGELOG.md用于记录变更历史
- 改进了构建脚本，添加了更好的错误处理和路径检查

### 修复
- 修复了TypeScript类型错误，确保工具定义符合类型要求
- 修改了`src/index.ts`中的导入语句和类结构，使其与`@remote-mcp/server`库兼容
- 更新了OAuth处理逻辑，确保正确的授权流程
- 修复了构建脚本，确保正确生成dist/index.js文件
- 更新了wrangler配置，指定正确的入口文件路径
- 修复了TypeScript配置中的`noEmit: true`设置，将其改为`false`以允许生成编译后的JS文件

### 更改
- 将McpAgent替换为McpServer作为MyMCP类的父类
- 更新了工具定义的方法，使用更简洁的`addTool`方法
- 改进了代码结构和错误处理
- 更新了构建流程，在部署前确保运行构建命令

## [0.1.0] - 2023-初始版本

### 添加
- 创建初始项目结构和工具实现
- 添加Google服务集成（Gmail和Calendar）
- 实现OAuth2认证流程
- 开发基于Cloudflare Workers的部署功能