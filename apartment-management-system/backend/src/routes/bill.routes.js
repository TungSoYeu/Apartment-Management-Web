const express = require("express");
const router = express.Router();
const billController = require("../controllers/bill.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

// Lấy danh sách (GET /api/v1/bills)
router.get("/", protect, billController.getAllBills);

// Tạo hóa đơn tháng (POST /api/v1/bills/generate) - Chỉ Admin/Kế toán
router.post(
  "/generate",
  protect,
  authorize("ADMIN", "ACCOUNTANT"),
  billController.generateMonthlyBills,
);

// Cập nhật hóa đơn (PUT /api/v1/bills/:id) - Chỉ Admin/Kế toán
router.put(
  "/:id",
  protect,
  authorize("ADMIN", "ACCOUNTANT"),
  billController.updateBill,
);

// Thanh toán nhanh (POST /api/v1/bills/:id/pay)
router.post("/:id/pay", protect, billController.payBill);

module.exports = router;
