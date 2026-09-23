# NovaCommerce — E-Commerce Microservices Frontend

Ứng dụng Frontend xây dựng bằng **Next.js (App Router, TypeScript)** và **Material UI (MUI)**, kết nối toàn bộ hệ thống E-Commerce Microservices thông qua **Spring Cloud API Gateway**.

---

## 🛠️ Tech Stack & Thiết kế

- **Framework:** Next.js 14+ (App Router), React 18, TypeScript
- **Giao diện:** Material UI (MUI v5), Emotion CSS SSR cache
- **Phong cách:** Thiết kế phẳng, tối giản, thanh lịch, chuẩn mực enterprise (`borderRadius: 4px`), không lạm dụng bo tròn.
- **HTTP Client:** Axios với Request Interceptor (tự động gắn JWT Bearer token) & Response Interceptor (xử lý 401 token refresh queue).
- **Kiến trúc:** Layered architecture phân tách rõ ràng:
  - `src/types/`: Typescript types mô phỏng 100% các Java DTOs / Records của Backend.
  - `src/config/`: Cấu hình tập trung (API Gateway URL, storage keys, page sizes).
  - `src/api/`: Quản lý endpoints tập trung và cấu hình Axios instance.
  - `src/services/`: Tầng gọi API thuần túy (Data Access Layer).
  - `src/hooks/`: Custom hooks (`useAuth`, `useNotification`, `useDebounce`).
  - `src/theme/`: Cấu hình theme MUI & ThemeRegistry SSR.
  - `src/components/`: Tái sử dụng components (Navbar, PageHeader, Dialogs, ProtectedRoute).
  - `src/app/`: Next.js App Router (Dashboard, Login, Register, Profile/Avatar, Products, Categories, Search).

---

## 🔗 Bản đồ kết nối Microservices APIs

| Tính năng Frontend | Backend Microservice | Endpoint qua API Gateway (9191) |
|---|---|---|
| Đăng nhập | `user-service` | `POST /api/v1/auth/login` |
| Đăng xuất (xóa Redis blacklist) | `user-service` | `POST /api/v1/auth/logout` |
| Cấp mới Token (Refresh Token) | `user-service` | `POST /api/v1/auth/refresh-token` |
| Đăng ký người dùng | `user-service` | `POST /api/v1/users` |
| Lấy hồ sơ cá nhân | `user-service` | `GET /api/v1/users/my-info` |
| Cập nhật Avatar (Lesson 11.2) | `user-service` ↔ `media-service` | `PATCH /api/v1/users/avatar` |
| CRUD Danh mục sản phẩm | `product-service` | `/api/v1/categories/**` |
| CRUD & Lọc Sản phẩm (JPA) | `product-service` | `/api/v1/products/**` |
| Tìm kiếm thông minh | `search-service` (Elasticsearch) | `GET /api/v1/search/products` |
| Tải ảnh sản phẩm (AWS S3) | `media-service` | `POST /api/v1/s3/upload` |

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy

### 1. Cài đặt Dependencies
Trong thư mục `frontend-microservices`:
```bash
npm install
```

### 2. Cấu hình Môi trường
File `.env.local` đã được cấu hình sẵn trỏ về API Gateway:
```env
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:9191
```

### 3. Chạy ở môi trường Development
```bash
npm run dev
```
Truy cập ứng dụng tại: [http://localhost:3000](http://localhost:3000)

### 4. Build Production
```bash
npm run build
npm start
```
