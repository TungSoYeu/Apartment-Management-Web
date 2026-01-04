const User = require("../models/User");
const Apartment = require("../models/Apartment");
const ResidentHistory = require("../models/ResidentHistory");

class UserService {
  async registerResident(data) {
    const { fullname, email, password, phone, apartmentCode } = data;
    const userExists = await User.findOne({ email });
    if (userExists) throw new Error("User already exists");

    const apartment = await Apartment.findOne({ code: apartmentCode });
    if (!apartment) throw new Error("Apartment Code not found");

    return await User.create({
      fullname,
      email,
      password,
      phone,
      role: "RESIDENT",
      isActive: false,
      currentApartment: apartment._id,
    });
  }

  async approveResident(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.isActive = true;
    await user.save();

    await Apartment.findByIdAndUpdate(user.currentApartment, {
      $addToSet: { residents: user._id },
      status: "OCCUPIED",
    });

    await ResidentHistory.create({
      apartmentId: user.currentApartment,
      userId: user._id,
      moveInDate: new Date(),
      note: "Admin approved",
    });
    return user;
  }
}
module.exports = new UserService();
