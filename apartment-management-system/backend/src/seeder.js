require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Apartment = require("./models/Apartment");
const Bill = require("./models/Bill");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB...");
  } catch (error) {
    console.error("❌ Connection Error:", error);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    // 1. Xóa sạch dữ liệu cũ
    await User.deleteMany();
    await Apartment.deleteMany();
    await Bill.deleteMany();
    console.log("🧹 Data cleared...");

    // 2. Tạo User (Admin & Cư dân)
    const admin = await User.create({
      fullname: "Nguyễn Quản Trị",
      email: "admin@test.com",
      password: "123456",
      phone: "0901234567",
      role: "ADMIN",
      isActive: true,
    });

    const resident = await User.create({
      fullname: "Trần Văn Cư Dân",
      email: "cudan@test.com",
      password: "123456",
      phone: "0918888999",
      role: "RESIDENT",
      isActive: true,
    });

    // 3. Tạo Căn hộ (GÁN LUÔN CHỦ HỘ VÀO ĐÂY)
    await Apartment.create({
      code: "A101",
      block: "A",
      floor: 1,
      area: 80,
      status: "OCCUPIED",
      owner: admin._id, // <--- MẤU CHỐT LÀ DÒNG NÀY (Gán Admin làm chủ nhà)
    });

    await Apartment.create({
      code: "B202",
      block: "B",
      floor: 2,
      area: 100,
      status: "OCCUPIED",
      owner: resident._id, // <--- Gán ông Cư dân làm chủ nhà căn này
    });

    console.log("✅ Data Imported!");
    console.log("👉 Admin: admin@test.com / 123456");
    console.log("👉 Căn A101 đã có chủ là Admin.");
    console.log("👉 Căn B202 đã có chủ là Cư Dân.");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
