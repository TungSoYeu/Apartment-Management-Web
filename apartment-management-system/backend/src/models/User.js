const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
});

const UserSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    identityCard: { type: String, default: "" },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["ADMIN", "ACCOUNTANT", "RESIDENT"],
      default: "RESIDENT",
    },
    currentApartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Apartment",
    },
    isActive: { type: Boolean, default: true },
    members: [MemberSchema],
  },
  { timestamps: true },
);

// Bỏ chữ 'next' trong ngoặc và bỏ các dòng gọi next()
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
