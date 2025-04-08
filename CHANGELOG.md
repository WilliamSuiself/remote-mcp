# Changelog

所有项目的显著更改都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)，
并且该项目遵循 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)。

## [0.3.0] - 2024-04-08

### 添加
- 实现了Cloudflare Durable Objects支持
- 添加了完整的类型定义
- 美化了主页UI

### 改变
- 重构目录结构，优化导入方式
- 更新配置文件，添加API路径配置
- 添加了nodejs_compat兼容性标志

### 修复
- 修复了模块导入路径问题，添加.js扩展名
- 修复了DurableObject类型定义

## [0.2.0] - 2024-04-08

### 添加
- 重构 MyMCP 类以使用 @remote-mcp/server 的 McpServer 类
- 为所有工具添加详细的参数定义和描述
- 改进了工具处理逻辑，使用 addTool 方法定义工具

### 改变
- 更新了 README.md 文件，添加详细的项目说明和使用指南
- 修改了 OAuth 处理流程以适应新的 MCP 服务器架构
- 优化了错误处理逻辑

### 修复
- 修复了类型错误，确保类型安全
- 重构路由处理逻辑，提高代码可维护性

## [0.1.0] - 2024-04-07

### 添加
- 初始项目设置
- 创建基本的 MCP 服务器结构
- 添加 Google 服务集成（Gmail 和 Calendar）
- 实现简单的数学计算工具
- 添加 OAuth 认证支持

### 修复
- 修复环境变量配置问题