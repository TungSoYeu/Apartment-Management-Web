const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    apartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Apartment",
      required: true,
    },
    billingCycle: { type: String, required: true },

    apartmentSnapshot: {
      code: String,
      ownerName: String,
      area: Number,
      residents: { type: Number, default: 1 }
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

BillSchema.index({ apartmentId: 1, billingCycle: 1 }, { unique: true });

module.exports = mongoose.model("Bill", BillSchema);
