# AI 协作开发文档体系

> 适合小型团队的企业级前端项目 AI 协作文档规范。

## 仓库结构

```txt
.
├── README.md
├── reference/          # 参考材料原文
├── guides/             # 核心理念与实战指南
│   ├── reference总结.md
│   ├── 项目初始化流程.md
│   ├── 反馈闭环建设指南.md
│   └── 多Agent协作模式.md
└── templates/          # 可直接复制的模板
    ├── root/           # 项目根目录文档（保持大写）
    │   ├── AGENTS.template.md
    │   ├── CLAUDE.template.md
    │   └── CHANGELOG.template.md
    ├── docs/           # docs 目录文档（小写）
    │   ├── architecture.template.md
    │   ├── frontend.template.md
    │   ├── design.template.md
    │   ├── quality.template.md
    │   ├── collaboration.template.md
    │   └── frontend/   # 前端详细规范（按需创建）
    │       ├── components.md
    │       ├── state.md
    │       ├── api.md
    │       └── styling.md
    └── skills/         # 技能模板（小写）
        ├── skill.template.md
        └── project-init.md
```

## 快速开始

### 1. 复制模板到项目

```bash
# 根目录文档
cp templates/root/AGENTS.template.md your-project/AGENTS.md
cp templates/root/CLAUDE.template.md your-project/CLAUDE.md
cp templates/root/CHANGELOG.template.md your-project/CHANGELOG.md

# docs 目录文档
mkdir -p your-project/docs
cp templates/docs/architecture.template.md your-project/docs/ARCHITECTURE.md
cp templates/docs/frontend.template.md your-project/docs/FRONTEND.md
cp templates/docs/design.template.md your-project/docs/DESIGN.md
cp templates/docs/quality.template.md your-project/docs/QUALITY.md

# 前端详细规范（按需）
mkdir -p your-project/docs/frontend
cp templates/docs/frontend/*.md your-project/docs/frontend/
```

### 2. 填充文档内容

使用 AI 根据你的技术栈填充模板内容：
- 项目信息、技术栈、核心约束
- 目录结构、分层规则
- 质量标准、验收门槛

详见：[guides/项目初始化流程.md](guides/项目初始化流程.md)

### 3. 建立反馈闭环

- TypeScript 严格模式
- ESLint + Prettier
- 测试框架（Vitest + Playwright）
- CI 自动检查

详见：[guides/反馈闭环建设指南.md](guides/反馈闭环建设指南.md)

## 核心原则

- **由少到多**：不要一开始定太多规则，给 AI 充分发挥空间
- **契约先行**：多 Agent 并行的前提是清晰的类型和接口契约
- **反馈闭环**：让 AI 能自己验证、自己修复，而非依赖人工
- **机制优于规则**：用 lint、test、CI 强制约束，而非纯文字

## 推荐阅读顺序

1. **先读总结**：[guides/reference总结.md](guides/reference总结.md) - 理解 AI 协作核心理念
2. **实战指南**：
   - [guides/反馈闭环建设指南.md](guides/反馈闭环建设指南.md)
   - [guides/多Agent协作模式.md](guides/多Agent协作模式.md)
3. **使用模板**：直接复制 `templates/` 下的模板到项目中使用

## 常见问题

**Q: 是否需要创建所有模板文档？**
A: 不需要。小团队初期只需 AGENTS.md + CLAUDE.md + FRONTEND.md 即可。

**Q: 什么时候拆分 frontend/ 子目录？**
A: 当 FRONTEND.md 超过 200 行，或某个主题需要详细说明时。

**Q: 如何判断是否需要多 Agent 并行？**
A: 任务之间无强依赖、有清晰契约时可并行。优先串行，确认瓶颈后再并行。

**Q: 文档多久更新一次？**
A: 引入新模式时立即更新。每月 review 一次有效性。

## 版本管理

建议在每个文档顶部添加版本信息：

```markdown
---
version: 1.0.0
last_updated: 2026-03-12
maintainer: @team
---
```

## 贡献

欢迎提交 Issue 和 PR 改进这套文档体系。
