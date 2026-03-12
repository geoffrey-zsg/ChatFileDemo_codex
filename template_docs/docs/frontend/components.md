# 组件开发规范

> 当组件复杂度增加时，从 FRONTEND.md 拆分到此文件。

## 组件分类

### 基础组件（Shared UI）
- 位置：`src/shared/ui`
- 职责：通用、无业务逻辑的 UI 组件
- 示例：Button、Input、Modal、Table

### 业务组件（Feature Components）
- 位置：`src/features/<模块>/components`
- 职责：包含业务逻辑的复合组件
- 示例：OrderFilter、RefundPanel

### 页面组件（Page Components）
- 位置：`src/features/<模块>/pages`
- 职责：布局、数据装配、状态组合
- 原则：尽量薄，逻辑下沉到 hooks 或 service

## 开发原则

- **复用优先**：先找现有组件，再考虑新建
- **单一职责**：一个组件只做一件事
- **Props 明确**：用 TypeScript 明确定义接口
- **逻辑分离**：复杂逻辑抽到 hooks

## 命名规范

- 组件文件：PascalCase（如 `UserProfile.tsx`）
- 组件目录：kebab-case（如 `user-profile/`）
- Props 类型：`<ComponentName>Props`

## 示例

```tsx
// ✅ 好的组件
interface UserCardProps {
  user: User
  onEdit: (id: string) => void
}

export function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <Card>
      <CardHeader>{user.name}</CardHeader>
      <CardActions>
        <Button onClick={() => onEdit(user.id)}>编辑</Button>
      </CardActions>
    </Card>
  )
}

// ❌ 避免：组件内直接请求
export function UserCard({ userId }: { userId: string }) {
  const [user, setUser] = useState()
  useEffect(() => {
    fetch(`/api/users/${userId}`).then(/* ... */) // 不要这样做
  }, [userId])
}
```
