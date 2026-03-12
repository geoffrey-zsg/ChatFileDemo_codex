---
version: 1.0.0
last_updated: 2026-03-12
maintainer: Codex
---

# FRONTEND.md

## 技术栈
- 框架：Next.js 15 App Router
- 语言：TypeScript 5.x
- 样式方案：Tailwind CSS 4 风格 tokens + CSS variables
- 状态管理：Zustand
- 组件体系：Shadcn/UI 定制化扩展
- 表单方案：React Hook Form + Zod
- 测试方案：Vitest + Testing Library + Playwright

## 核心约束

### 组件开发
- 页面组件只负责组合，复杂逻辑抽到 `features/*/hooks` 或 `shared/lib`。
- 通用基础组件放 `shared/ui`，业务组件放对应 `features/*/components`。
- 一个组件只表达一个主要职责，避免超级组件。

### 样式规则
- 统一使用 CSS variables 和 Tailwind token class，不在业务组件里散落硬编码视觉值。
- 保持企业级工具产品气质，允许比默认 Shadcn 更有辨识度，但不能偏离需求说明。
- PC 优先，兼容平板与移动端。

### 状态管理
- 输入框、hover、开关等短时状态留在组件内。
- 当前文档、消息列表、解析阶段、预览联动使用 Zustand。
- 可分享的页码、布局模式可考虑映射到 URL 或 query。

### 数据请求
- 前端只调用本地 Route Handlers 或共享 API 客户端。
- 不在页面里直接 `fetch('/api/...')`。
- 所有请求处理 loading、error、empty 三态。
- SSE/流式能力优先在 BFF 层转成前端友好流。

### 表单规则
- 上传、提问、反馈都要有显式禁用态和错误提示。
- 发送问题前做空白字符和长度校验。
- 反馈补充说明限制 200 字。

## 禁止事项
- 禁止组件内直接写 mock 数据常量。
- 禁止复制一份 UI 再手工改出第二套风格。
- 禁止只做 happy path，不做失败态和中断态。

## 详细规范
- [components.md](/c:/workspace/vibecoding/ChatFileDemo_codex/docs/frontend/components.md)
- [state.md](/c:/workspace/vibecoding/ChatFileDemo_codex/docs/frontend/state.md)
- [api.md](/c:/workspace/vibecoding/ChatFileDemo_codex/docs/frontend/api.md)
- [styling.md](/c:/workspace/vibecoding/ChatFileDemo_codex/docs/frontend/styling.md)
