# Hệ thống Quản lý Căn hộ

## Giới thiệu
Đây là một hệ thống quản lý căn hộ đơn giản, được xây dựng để hỗ trợ quản lý các hoạt động liên quan đến căn hộ như quản lý người dùng, căn hộ, hóa đơn, phản hồi và thông báo.

## Tính năng chính
*   **Quản lý người dùng:** Đăng ký, đăng nhập, phê duyệt cư dân, cập nhật thông tin người dùng.
*   **Quản lý căn hộ:** Xem danh sách, tạo mới, cập nhật, xóa căn hộ.
*   **Quản lý hóa đơn:** Tạo hóa đơn tự động, thanh toán hóa đơn, xem danh sách hóa đơn.
*   **Quản lý phản hồi:** Tạo, xem, cập nhật và xóa các phản hồi từ cư dân.
*   **Quản lý thông báo:** Tạo, xem và xóa các thông báo quan trọng.
*   **Bảo mật:** Xác thực người dùng (JWT) và phân quyền (Admin, Accountant, Resident).

## Công nghệ sử dụng
### Backend
*   **Framework:** Node.js, Express.js
*   **Cơ sở dữ liệu:** MongoDB (với Mongoose ODM)
*   **Bảo mật:** `bcryptjs` (băm mật khẩu), `jsonwebtoken` (xác thực JWT)
*   **Môi trường:** `dotenv` (quản lý biến môi trường)
*   **Middleware:** `cors`, `helmet`, `morgan` (ghi log HTTP)

### Frontend
*   **Framework:** React (với Vite)
*   **Styling:** Tailwind CSS
*   **UI Components:** `react-icons`

## Cấu trúc dự án
```
.
├── apartment-management-system/
│   ├── backend/
│   │   ├── .env
│   │   ├── package.json
│   │   ├── server.js
│   │   └── src/
│   │       ├── app.js
│   │       ├── config/
│   │       ├── controllers/
│   │       ├── middlewares/
│   │       ├── models/
│   │       ├── routes/
│   │       ├── services/
│   │       └── utils/
│   └── frontend/
│       ├── public/
│       ├── src/
│       ├── index.html
│       ├── package.json
│       └── ...
└── ...
```

## Cài đặt
1.  **Clone repository:**
    ```bash
    git clone <URL_REPOSITORY_CUA_BẠN>
    cd apartment-management-system
    ```
2.  **Cài đặt các gói phụ thuộc cho backend:**
    ```bash
    cd backend
    npm install
    ```
3.  **Cài đặt các gói phụ thuộc cho frontend:**
    ```bash
    cd ../frontend
    npm install
    ```
4.  **Tạo file .env:**
    Trong thư mục `backend`, tạo một file `.env` và thêm các biến môi trường cần thiết. Dưới đây là một ví dụ:
    ```
    NODE_ENV=development
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/apartmentdb
    JWT_SECRET=supersecretkey
    JWT_EXPIRE=30d
    COOKIE_EXPIRE=30
    ```
    *Lưu ý: Thay đổi `MONGO_URI` và `JWT_SECRET` bằng giá trị của bạn.*

## Cách chạy ứng dụng
### Chế độ phát triển (Development)
1.  **Chạy backend:**
    ```bash
    cd backend
    npm run dev
    ```
2.  **Chạy frontend:**
    ```bash
    cd frontend
    npm run dev
    ```
Ứng dụng sẽ chạy trên `http://localhost:5173` (hoặc cổng được cấu hình trong Vite). Backend sẽ chạy trên `http://localhost:3000` (hoặc cổng bạn đã cấu hình trong `.env`).

### Chế độ sản phẩm (Production)
1.  **Build frontend:**
    ```bash
    cd frontend
    npm run build
    ```
2.  **Chạy backend:**
    ```bash
    cd backend
    npm start
    ```

## Cấu trúc API
Các tuyến API chính được định nghĩa trong `/backend/src/routes`.

### Người dùng (User) - `/api/v1/users`
*   `POST /login`: Đăng nhập người dùng.
*   `POST /residents/register`: Đăng ký cư dân mới.
*   `PATCH /residents/:id/approve`: Phê duyệt cư dân (yêu cầu quyền ADMIN).
*   `PUT /:id`: Cập nhật thông tin người dùng (yêu cầu quyền ADMIN).

### Căn hộ (Apartment) - `/api/v1/apartments`
*   `GET /`: Lấy tất cả các căn hộ (yêu cầu xác thực).
*   `POST /`: Tạo căn hộ mới (yêu cầu quyền ADMIN).
*   `PUT /:id`: Cập nhật thông tin căn hộ (yêu cầu quyền ADMIN).
*   `DELETE /:id`: Xóa căn hộ (yêu cầu quyền ADMIN).

### Hóa đơn (Bill) - `/api/v1/bills`
*   `GET /`: Lấy tất cả các hóa đơn (yêu cầu xác thực).
*   `POST /generate`: Tạo hóa đơn (yêu cầu quyền ADMIN, ACCOUNTANT).
*   `POST /:id/pay`: Thanh toán hóa đơn (yêu cầu xác thực).
*   `DELETE /:id`: Xóa hóa đơn (yêu cầu quyền ADMIN).

### Phản hồi (Feedback) - `/api/v1/feedback`
*   `GET /`: Lấy tất cả phản hồi (yêu cầu xác thực).
*   `POST /`: Tạo phản hồi mới (yêu cầu xác thực).
*   `PUT /:id`: Cập nhật phản hồi (yêu cầu xác thực).
*   `DELETE /:id`: Xóa phản hồi (yêu cầu quyền ADMIN).

### Thông báo (Notification) - `/api/v1/notifications`
*   `GET /`: Lấy tất cả thông báo (yêu cầu xác thực).
*   `POST /`: Tạo thông báo mới (yêu cầu quyền ADMIN).
*   `DELETE /:id`: Xóa thông báo (yêu cầu quyền ADMIN).

## Đóng góp
Chúng tôi chào đón mọi sự đóng góp! Vui lòng fork repository và tạo pull request.

## Giấy phép
Dự án này được cấp phép dưới <TÊN_GIẤY_PHÉP_CỦA_BẠN_VÍ_DỤ_MIT>.