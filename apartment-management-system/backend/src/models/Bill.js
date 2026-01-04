const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    apartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Apartment",
      required: true,
    },
    // --- THÊM 2 TRƯỜNG NÀY ĐỂ LỌC LỊCH SỬ ---
    month: { type: Number, required: true },
    year: { type: Number, required: true },

    billingCycle: { type: String, required: true }, // Vẫn giữ để hiển thị (VD: "1-2026")

    apartmentSnapshot: {
      code: String,
      ownerName: String,
      area: Number,
      residents: { type: Number, default: 1 },
    },

    services: [
      {
        name: String,
        amount: Number,
        unit: String,
        usageIndex: Number,
      },
    ],
    electricity: {
      usage: { type: Number, default: 0 },
      amount: { type: Number, default: 0 },
    },
    water: {
      usage: { type: Number, default: 0 },
      amount: { type: Number, default: 0 },
    },
    additionalCharges: [
      {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ["UNPAID", "PENDING", "PAID", "OVERDUE"],
      default: "UNPAID",
    },
    payment: {
      method: String,
      transactionId: String,
      paidAt: Date,
    },
    qrCode: { type: String },
  },
  { timestamps: true },
);

// Đảm bảo mỗi căn hộ chỉ có 1 bill trong 1 tháng/năm cụ thể
BillSchema.index({ apartmentId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Bill", BillSchema);
