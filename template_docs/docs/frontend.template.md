# FRONTEND.md

> 前端开发规范总纲。初期项目只需本文件，复杂后可按需拆分详细规范到 `frontend/` 子目录。

## 技术栈

- 框架：
- 语言：
- 构建工具：
- 样式方案：
- 状态管理：
- 表单方案：
- 测试方案：

## 核心约束

### 组件开发
- 优先复用现有组件，不重复造基础组件
- 基础组件放共享层，业务组件放业务模块内
- 一个组件一个职责，复杂逻辑抽到 hooks

### 样式规则
- 统一使用设计令牌（Design Tokens）
- 禁止硬编码颜色、间距、字号
- 不混用多套样式方案

### 状态管理
- UI 局部状态放组件内
- 跨页面共享状态放全局状态层
- 筛选/分页/排序等可分享状态优先放 URL

### 数据请求
- 请求统一通过共享 API 客户端（如 `src/shared/api`）
- 接口类型优先从契约生成（OpenAPI/GraphQL）
- 页面不直接拼接请求路径
- 所有请求处理 loading、error、empty 三态

### 表单规则
- 使用统一表单库和 schema 校验
- 表单提交态、禁用态、错误提示必须完整
- 不允许无反馈的异步提交

## 禁止事项
- 禁止组件内直接请求后端
- 禁止复制粘贴已有组件后另起一套
- 禁止跳过类型错误直接提交

## 详细规范（按需创建）

当项目复杂度增加时，可将详细规范拆分到：
- `frontend/components.md` - 组件开发详细规范
- `frontend/state.md` - 状态管理详细规范
- `frontend/api.md` - API 请求层详细规范
- `frontend/styling.md` - 样式开发详细规范

---

## 示例：React + TypeScript 项目

```markdown
## 技术栈
- 框架：React 19
- 语言：TypeScript 5.x
- 构建工具：Vite
- 样式方案：Tailwind CSS + Design Tokens
- 状态管理：Zustand
- 表单方案：React Hook Form + Zod
- 测试方案：Vitest + Playwright

## 核心约束
- API 封装统一位于 `src/shared/api`
- OpenAPI 类型生成输出到 `src/generated/api`
- 基础 UI 组件统一放 `src/shared/ui`
- 业务组件放 `src/features/<模块>/components`
```
