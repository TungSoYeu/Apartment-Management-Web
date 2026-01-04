const mongoose = require("mongoose");

const ResidentHistorySchema = new mongoose.Schema(
  {
    apartmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Apartment" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, default: "TENANT" },
    moveInDate: { type: Date, default: Date.now },
    moveOutDate: { type: Date },
    note: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("ResidentHistory", ResidentHistorySchema);
