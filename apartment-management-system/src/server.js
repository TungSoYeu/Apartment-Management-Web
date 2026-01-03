const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // Thư viện cho phép Web truy cập
const connectDB = require("./config/db"); // Đường dẫn đến file kết nối DB
const apiRoutes = require("./routes/api.routes"); // Đường dẫn đến file quản lý Routes

// 1. Nạp biến môi trường từ file .env
dotenv.config();

// 2. Kết nối Database
connectDB();

const app = express();

// 3. Cấu hình Middleware (Quan trọng)
app.use(cors()); // <--- DÒNG NÀY SỬA LỖI KHÔNG HIỆN PHÒNG
app.use(express.json()); // Cho phép Server hiểu dữ liệu JSON gửi lên

// 4. Định nghĩa đường dẫn API
// Mọi request bắt đầu bằng /api/v1 sẽ chạy vào file api.routes.js
app.use("/api/v1", apiRoutes);

// 5. Khởi động Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server đang chạy ở chế độ ${process.env.NODE_ENV} trên cổng ${PORT}`,
  );
  console.log(`🔗 Link API: http://localhost:${PORT}/api/v1`);
});
