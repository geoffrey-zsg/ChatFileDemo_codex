---
version: 1.0.0
last_updated: 2026-03-12
maintainer: Codex
---

# components.md

## 基础组件边界
- `shared/ui` 放按钮、输入、卡片、滚动区域、分隔线、标签、toast 等基础组件。
- 业务组件放各自 feature，禁止业务文案下沉到基础层。

## 组件拆分建议
- 上传区：拖拽空态、进度态、解析步骤态、错误态分组件。
- 对话区：欢迎态、消息列表、AI 气泡、用户气泡、反馈面板、输入栏分组件。
- 预览区：头部工具栏、目录面板、页码控制、文档画布、高亮覆盖层分组件。

## 交互规范
- 所有按钮都要处理 disabled、loading、hover、focus-visible。
- 图标按钮必须配合 tooltip 或 aria-label。
- 引用卡片、推荐问题、反馈标签都要保持可点击目标足够大。
