---
version: 1.0.0
last_updated: 2026-03-12
maintainer: Codex
---

# AGENTS.md

> ChatFile Demo 的 AI 协作入口文档。

## 项目信息
- 项目名称：ChatFile Demo
- 项目目标：验证 AI 自驱动方式完成一个面向 IC 工程师的单文档 PDF 问答前端 Demo
- 当前阶段：项目初始化与 MVP 实现
- 技术栈：Next.js 15 App Router + TypeScript + Tailwind + Shadcn/UI + Zustand

## 核心规则

### 技术约束
- 使用 TypeScript 严格模式。
- 状态管理统一以 Zustand 为全局状态入口，组件短期状态优先局部化。
- 样式统一使用 Tailwind 和 `docs/DESIGN.md` 中的 design tokens。
- 页面和组件禁止直接请求外部接口，统一走 `src/shared/api` 或 Next.js Route Handlers。
- 本项目以前端为主，后端能力使用 BFF mock 和静态数据模拟。

### 质量门槛
- 提交前必须通过：`pnpm lint`、`pnpm typecheck`、`pnpm test`。
- 涉及核心交互流程变更时必须运行 `pnpm test:e2e`。
- 自测必须包含浏览器截图留档，不能只看命令行结果。
- 引入新模式时同步更新对应文档。

### 架构边界
- 遵循 [docs/ARCHITECTURE.md](/c:/workspace/vibecoding/ChatFileDemo_codex/docs/ARCHITECTURE.md) 的分层规则。
- 共享层禁止依赖业务层。
- `generated/` 目录若后续创建，默认禁止手改。

## 默认流程
1. 先阅读本文件、[CLAUDE.md](/c:/workspace/vibecoding/ChatFileDemo_codex/CLAUDE.md) 和 [docs/PLANS.md](/c:/workspace/vibecoding/ChatFileDemo_codex/docs/PLANS.md)。
2. 按任务类型补读 `ARCHITECTURE`、`FRONTEND`、`DESIGN`、`QUALITY`。
3. 优先复用现有模式，做最小必要改动。
4. 完成后运行校验和必要截图验证。
5. 过程性问题和机制改进记录到 [改进意见.md](/c:/workspace/vibecoding/ChatFileDemo_codex/改进意见.md)。

## 常用命令
```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

## 文档地图

### 必读文档
- `CLAUDE.md`
- `docs/PLANS.md`
- `docs/ARCHITECTURE.md`
- `docs/FRONTEND.md`
- `docs/QUALITY.md`

### 按需阅读
- `docs/DESIGN.md`
- `docs/frontend/components.md`
- `docs/frontend/state.md`
- `docs/frontend/api.md`
- `docs/frontend/styling.md`
- `docs/refer/*`

## 多 Agent 协作规则

### 何时并行
- UI 视觉优化、组件封装、mock 数据整理可以并行。
- 共享状态结构、目录结构和基础样式令牌优先串行确定。
- 同一文件禁止并行修改。

### 契约定义要求
- 类型契约优先于实现。
- 共享 store、mock API、实体类型由一个 Agent 集中维护。
- 新增共享组件前先确认 props 和变体范围。

### 集成验证
- 功能合并前必须过 `lint + typecheck + test`。
- 关键流程必须跑 e2e 或浏览器自动化截图验证。

## 禁止事项
- 不要重复启动开发服务；先检查现有服务是否已运行。
- 不要跳过明显报错继续声称“自测通过”。
- 不要为了赶进度省略异常态、禁用态和空状态。
- 不要让回答内容脱离当前文档上下文。
