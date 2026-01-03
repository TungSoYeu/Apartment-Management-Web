require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Apartment = require("./models/Apartment");
const Bill = require("./models/Bill");

mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
  try {
    await User.deleteMany();
    await Apartment.deleteMany();
    await Bill.deleteMany();

    console.log("🧹 Data cleared");

    await User.create({
      fullname: "Super Admin",
      email: "admin@test.com",
      password: "123456",
      phone: "0900000000",
      role: "ADMIN",
      isActive: true,
    });

    await Apartment.create({
      code: "A101",
      block: "A",
      floor: 1,
      area: 80,
      status: "OCCUPIED",
    });

    console.log("✅ Admin & Apartment Created");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
