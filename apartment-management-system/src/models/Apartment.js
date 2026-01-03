const mongoose = require("mongoose");

const ApartmentSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    block: { type: String, required: true },
    floor: { type: Number, required: true },
    area: { type: Number, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    residents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["VACANT", "OCCUPIED", "MAINTENANCE"],
      default: "VACANT",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Apartment", ApartmentSchema);
