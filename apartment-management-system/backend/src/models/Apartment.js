const mongoose = require("mongoose");

const apartmentSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Mã căn hộ là bắt buộc"],
      unique: true,
    },
    block: {
      type: String,
      required: [true, "Block là bắt buộc"],
    },
    floor: {
      type: Number,
      required: [true, "Tầng là bắt buộc"],
    },
    area: {
      type: Number,
      required: [true, "Diện tích là bắt buộc"],
    },
    status: {
      type: String,
      enum: ["VACANT", "OCCUPIED", "MAINTENANCE"],
      default: "VACANT",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    residents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],

    contract: {
      number: { type: String, default: "" }, 
      startDate: { type: Date, default: Date.now }, 
      duration: { type: Number, default: 12 }, 
      terms: { type: String, default: "Thuê dài hạn" }, 
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Apartment", apartmentSchema);
