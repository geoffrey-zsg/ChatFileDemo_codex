# CLAUDE.md

> Claude 在本项目中的执行手册。

## 指令优先级

当存在冲突时，按以下优先级执行：

1. **项目规范文档**（最高优先级）
   - `AGENTS.md`、`CLAUDE.md`
   - `docs/ARCHITECTURE.md`、`docs/FRONTEND.md`、`docs/QUALITY.md` 等

2. **项目自定义 Skills**
   - `.claude/skills/` 下的项目专属 Skill

3. **第三方 Skills**
   - 如 `vercel-react-best-practices`、`web-design-guidelines` 等

4. **AI 默认知识**（最低优先级）

**示例**：如果 `vercel-react-best-practices` 推荐使用 SWR，但 `FRONTEND.md` 规定使用 TanStack Query，必须使用 TanStack Query。

**遇到冲突时**：优先遵循项目规范，如有疑问，询问而不是猜测。

---

## 开始前先读
1. 阅读 `AGENTS.md` 了解项目全貌
2. 阅读 `docs/PLANS.md` 了解当前任务
3. 根据任务类型选择性阅读：
   - UI 开发 → `docs/FRONTEND.md` + `docs/DESIGN.md`
   - 架构调整 → `docs/ARCHITECTURE.md`
   - 数据流改动 → `docs/ARCHITECTURE.md` + `docs/frontend/state.md`

## 默认工作原则
- **最小改动**：只改必须改的，不做无关重构
- **复用优先**：先找现有组件/hooks/工具，再考虑新建
- **类型边界**：在模块边界处明确类型，避免 any 扩散
- **修复根因**：不要用临时补丁掩盖问题
- **自主决策**：在明确边界内自主决策，不阻塞等待

## 问题记录机制

当发现以下情况需要人工决策时，记录到 `CHANGELOG.md` 的"⚠️ 需要人工决策"章节，然后继续工作：

### 需要记录的情况
- **破坏性变更**：影响现有 API 契约、数据结构、用户行为
- **需求冲突**：产品文档与技术约束冲突
- **架构疑问**：不确定的架构决策（如技术选型、分层调整）
- **规范缺失**：规范文档未覆盖的场景

### 记录格式
```markdown
- [ ] **问题类型**：简短描述
  - 发现时间：YYYY-MM-DD HH:mm
  - 影响范围：具体说明
  - AI 建议：[可选的解决方案]
  - 决策人：@角色
```

### 不需要记录的情况
- 常规 bug 修复
- 明确规范内的技术实现
- 代码优化和重构（不影响行为）

## 文件修改规则

### 允许修改
- 任务相关的业务代码
- 对应的测试文件
- 相关文档

### 禁止修改
- 生成文件（通常在 `src/generated` 或带 `AUTO-GENERATED` 标记）
- 与任务无关的模块
- 全局配置（除非任务明确要求）

### 新增模式时
- 同步更新 `docs/ARCHITECTURE.md` 或 `docs/FRONTEND.md`
- 在代码中添加注释说明设计意图
- 如果是高频模式，考虑沉淀为 Skill

## 校验要求

### UI 改动
```bash
pnpm lint && pnpm typecheck
```

### 逻辑改动
```bash
pnpm lint && pnpm typecheck && pnpm test
```

### 跨页面流程改动
```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e
```

## 常见坑位

### 示例（根据项目填写）
- `src/shared/api/generated` 由 OpenAPI 生成，不要手改，应修改 schema 后重新生成
- 表格筛选状态统一放 URL query，不要新建本地状态副本
- 全局路由配置在 `src/app/router.tsx`，非必要不调整结构

---

## 输出风格
- 说明变更时，先说用户可感知的影响，再说实现细节
- 如果未运行测试，明确说明原因
- 遇到不确定的架构决策，先询问而不是猜测 
