const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, default: "PENDING" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Request", RequestSchema);
