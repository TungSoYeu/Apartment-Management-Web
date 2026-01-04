const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth.middleware");

// Import Controllers
const userCtrl = require("../controllers/user.controller");
const aptCtrl = require("../controllers/apartment.controller");

// Import Routes con
const billRoutes = require("./bill.routes");
const notificationRoutes = require("./notification.routes");
const feedbackRoutes = require("./feedback.routes");

// =======================
// 1. USER & RESIDENT ROUTES
// =======================
router.post("/users/login", userCtrl.login);
router.post("/residents/register", userCtrl.register);

// Đổi mật khẩu (Mới thêm)
// Đảm bảo bạn đã thêm hàm changePassword vào user.controller.js
router.post("/users/change-password", protect, userCtrl.changePassword);

router.patch(
  "/residents/:id/approve",
  protect,
  authorize("ADMIN"),
  userCtrl.approve,
);
router.put("/users/:id", protect, authorize("ADMIN"), userCtrl.update);

// =======================
// 2. APARTMENT ROUTES
// =======================
router.get("/apartments", protect, aptCtrl.findAll);
router.post("/apartments", protect, authorize("ADMIN"), aptCtrl.create);
router.put("/apartments/:id", protect, authorize("ADMIN"), aptCtrl.update);
router.delete("/apartments/:id", protect, authorize("ADMIN"), aptCtrl.delete);

// =======================
// 3. FINANCE ROUTES (BILLS)
// =======================
// Sử dụng file route riêng đã tạo ở trên
router.use("/bills", billRoutes);

// =======================
// 4. OTHER ROUTES
// =======================
router.use("/notifications", notificationRoutes);
router.use("/feedback", feedbackRoutes);

module.exports = router;
