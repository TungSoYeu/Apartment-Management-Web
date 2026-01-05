require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB...");
  } catch (error) {
    console.error("❌ Connection Error:", error);
    process.exit(1);
  }
};

const addAdmin = async () => {
  await connectDB();

  const [fullname, email, password, phone] = process.argv.slice(2);

  if (process.argv.length < 6) { // node src/add-admin.js <fullname> <email> <password> <phone>
    console.error("❌ Usage: node src/add-admin.js <fullname> <email> <password> <phone>");
    process.exit(1);
  }

  try {
    const admin = await User.create({
      fullname,
      email,
      password,
      phone,
      role: "ADMIN",
      isActive: true,
    });

    console.log("✅ New admin created!");
    console.log(`👉 Admin: ${email} / ${password}`);

    process.exit();
  } catch (err) {
    if (err.code === 11000) { // Duplicate key error
        console.error("❌ Error: Admin with this email already exists.");
    } else {
        console.error(err);
    }
    process.exit(1);
  }
};

addAdmin();
