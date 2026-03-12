# API 请求层规范

> 当 API 调用复杂度增加时，从 FRONTEND.md 拆分到此文件。

## 架构原则

- **统一入口**：所有请求通过共享 API 客户端
- **类型安全**：接口类型从契约生成（OpenAPI/GraphQL）
- **错误处理**：统一拦截器处理错误
- **三态处理**：loading、error、empty 必须完整

## 目录结构

```
src/shared/api/
├── client.ts          # 统一 API 客户端
├── interceptors.ts    # 请求/响应拦截器
└── types.ts           # 公共类型

src/generated/api/     # 自动生成，禁止手改
└── ...

src/features/<模块>/api/
└── orders.ts          # 业务模块的 API 封装
```

## 请求封装示例

```tsx
// src/shared/api/client.ts
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

// 请求拦截器：添加 token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：统一错误处理
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 跳转登录
    }
    return Promise.reject(error)
  }
)
```

## 业务 API 封装

```tsx
// src/features/orders/api/orders.ts
import { apiClient } from '@/shared/api/client'
import type { Order, OrderListParams } from '@/generated/api'

export const ordersApi = {
  list: (params: OrderListParams) =>
    apiClient.get<Order[]>('/orders', { params }),

  getById: (id: string) =>
    apiClient.get<Order>(`/orders/${id}`),

  create: (data: CreateOrderDto) =>
    apiClient.post<Order>('/orders', data)
}
```

## 在组件中使用

```tsx
// ✅ 使用 TanStack Query
import { useQuery } from '@tanstack/react-query'
import { ordersApi } from '../api/orders'

function OrderList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.list({})
  })

  if (isLoading) return <Loading />
  if (error) return <Error message={error.message} />
  if (!data?.length) return <Empty />

  return <Table data={data} />
}

// ❌ 避免：直接在组件中 fetch
function OrderList() {
  const [orders, setOrders] = useState([])
  useEffect(() => {
    fetch('/api/orders').then(/* ... */) // 不要这样做
  }, [])
}
```
