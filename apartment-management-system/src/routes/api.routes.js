const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth.middleware");
const userCtrl = require("../controllers/user.controller");
const aptCtrl = require("../controllers/apartment.controller");
const billCtrl = require("../controllers/bill.controller");

// --- User ---
router.post("/users/login", userCtrl.login);
router.post("/residents/register", userCtrl.register);
router.patch(
  "/residents/:id/approve",
  protect,
  authorize("ADMIN"),
  userCtrl.approve,
);

// --- Apartment ---
router.get("/apartments", protect, aptCtrl.findAll);
router.post("/apartments", protect, authorize("ADMIN"), aptCtrl.create);
router.put("/apartments/:id", protect, authorize("ADMIN"), aptCtrl.update);

// --- Finance ---
router.post(
  "/bills/generate",
  protect,
  authorize("ADMIN", "ACCOUNTANT"),
  billCtrl.generateBills,
);
router.post("/bills/:id/pay", protect, billCtrl.payBill);

module.exports = router;
