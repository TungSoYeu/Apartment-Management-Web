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
*   **Backend:** Node.js, Express.js
*   **Cơ sở dữ liệu:** MongoDB (sử dụng Mongoose ODM)
*   **Bảo mật:** `bcryptjs` (băm mật khẩu), `jsonwebtoken` (xác thực JWT), `cookie-parser` (quản lý cookie)
*   **Môi trường:** `dotenv` (quản lý biến môi trường)
*   **Công cụ khác:** `morgan` (ghi log HTTP), `slugify` (tạo slug), `nodemailer` (gửi email), `colors` (tạo màu cho console log)
*   **Phát triển:** `nodemon` (tự động khởi động lại server)
*   **Xử lý lỗi bất đồng bộ:** `express-async-handler`

## Cấu trúc dự án
```
.
├── apartment-management-system/
│   ├── .env                       # Biến môi trường
│   ├── package.json               # Thông tin và dependencies của dự án
│   ├── server.js                  # Điểm khởi chạy ứng dụng
│   └── src/
│       ├── admin.html             # Giao diện quản trị (nếu có)
│       ├── app.js                 # Cấu hình ứng dụng Express
│       ├── index.html             # Trang chủ (nếu có)
│       ├── config/                # Cấu hình cơ sở dữ liệu
│       │   └── database.js
│       ├── controllers/           # Xử lý logic nghiệp vụ cho các route
│       ├── middlewares/           # Các middleware xác thực, xử lý lỗi
│       │   ├── auth.middleware.js
│       │   └── error.middleware.js
│       ├── models/                # Định nghĩa schema MongoDB
│       ├── routes/                # Định nghĩa các tuyến API
│       │   ├── api.routes.js
│       │   ├── feedback.routes.js
│       │   └── notification.routes.js
│       ├── services/              # Logic nghiệp vụ tách biệt khỏi controller
│       └── utils/                 # Các tiện ích chung
```

## Cài đặt
1.  **Clone repository:**
    ```bash
    git clone <URL_CUA_REPOSITORY_CUA_BAN>
    cd apartment-management-system
    ```
2.  **Cài đặt các gói phụ thuộc:**
    ```bash
    npm install
    ```
3.  **Tạo file .env:**
    Tạo một file `.env` trong thư mục gốc của dự án và thêm các biến môi trường cần thiết. Dưới đây là một ví dụ:
    ```
    NODE_ENV=development
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/apartmentdb
    JWT_SECRET=supersecretkey
    JWT_EXPIRE=30d
    COOKIE_EXPIRE=30
    ```
    *Lưu ý: Thay đổi `MONGO_URI` và `JWT_SECRET` bằng giá trị của bạn.*

## Cách chạy ứng dụng
### Chế độ phát triển (Development)
```bash
npm run dev
```
Ứng dụng sẽ chạy trên `http://localhost:5000` (hoặc cổng bạn đã cấu hình trong `.env`).

### Chế độ sản phẩm (Production)
```bash
npm start
```

## Cấu trúc API
Các tuyến API chính được định nghĩa trong `/src/routes`.

### Người dùng (User) - `/api/v1/users`
*   `POST /api/v1/users/login`: Đăng nhập người dùng.
*   `POST /api/v1/residents/register`: Đăng ký cư dân mới.
*   `PATCH /api/v1/residents/:id/approve`: Phê duyệt cư dân (yêu cầu quyền ADMIN).
*   `PUT /api/v1/users/:id`: Cập nhật thông tin người dùng (yêu cầu quyền ADMIN).

### Căn hộ (Apartment) - `/api/v1/apartments`
*   `GET /api/v1/apartments`: Lấy tất cả các căn hộ (yêu cầu xác thực).
*   `POST /api/v1/apartments`: Tạo căn hộ mới (yêu cầu quyền ADMIN).
*   `PUT /api/v1/apartments/:id`: Cập nhật thông tin căn hộ (yêu cầu quyền ADMIN).
*   `DELETE /api/v1/apartments/:id`: Xóa căn hộ (yêu cầu quyền ADMIN).

### Hóa đơn (Bill) - `/api/v1/bills`
*   `POST /api/v1/bills/generate`: Tạo hóa đơn (yêu cầu quyền ADMIN, ACCOUNTANT).
*   `POST /api/v1/bills/:id/pay`: Thanh toán hóa đơn (yêu cầu xác thực).
*   `GET /api/v1/bills`: Lấy tất cả các hóa đơn (yêu cầu xác thực).

### Phản hồi (Feedback) - `/api/v1/feedback`
*   `POST /api/v1/feedback`: Tạo phản hồi mới (yêu cầu xác thực).
*   `GET /api/v1/feedback`: Lấy tất cả phản hồi (yêu cầu xác thực).
*   `PUT /api/v1/feedback/:id`: Cập nhật phản hồi (yêu cầu xác thực).
*   `DELETE /api/v1/feedback/:id`: Xóa phản hồi (yêu cầu quyền ADMIN).

### Thông báo (Notification) - `/api/v1/notifications`
*   `POST /api/v1/notifications`: Tạo thông báo mới (yêu cầu quyền ADMIN).
*   `GET /api/v1/notifications`: Lấy tất cả thông báo (yêu cầu xác thực).
*   `DELETE /api/v1/notifications/:id`: Xóa thông báo (yêu cầu quyền ADMIN).

## Đóng góp
Chúng tôi chào đón mọi sự đóng góp! Vui lòng fork repository và tạo pull request.

## Giấy phép
Dự án này được cấp phép dưới <TÊN_GIẤY_PHÉP_CỦA_BAN_VÍ_DỤ_MIT>.