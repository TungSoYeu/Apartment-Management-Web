const Apartment = require("../models/Apartment");
const User = require("../models/User");
const { maskPhone } = require("../utils/masking");

class ApartmentService {
  // 1. TẠO CĂN HỘ
  async createApartment(data) {
    return this.handleSave(data, "CREATE");
  }

  // 2. CẬP NHẬT CĂN HỘ (Đã nâng cấp)
  async updateApartment(id, data) {
    return this.handleSave(data, "UPDATE", id);
  }

  // --- HÀM XỬ LÝ CHUNG (Logic cốt lõi) ---
  async handleSave(data, type, id = null) {
    const { code, block, floor, area, status, ownerInfo, contractInfo } = data;

    // Nếu là tạo mới -> check trùng mã
    if (type === "CREATE") {
      const exists = await Apartment.findOne({ code });
      if (exists) throw new Error(`Căn hộ ${code} đã tồn tại!`);
    }

    let updatePayload = { code, block, floor, area, status };

    // LOGIC: Nếu chuyển sang "Trống" -> Xóa chủ hộ và hợp đồng
    if (status === "VACANT") {
      updatePayload.owner = null;
      updatePayload.contract = {};
    }
    // LOGIC: Nếu chuyển sang "Có người" và có thông tin chủ mới -> Tạo User
    else if (status === "OCCUPIED" && ownerInfo) {
      // Check email
      const userExists = await User.findOne({ email: ownerInfo.email });
      if (userExists) throw new Error(`Email ${ownerInfo.email} đã tồn tại!`);

      const newUser = await User.create({
        fullname: ownerInfo.fullname,
        email: ownerInfo.email,
        phone: ownerInfo.phone,
        identityCard: ownerInfo.identityCard || "",
        password: ownerInfo.password || "123456",
        role: "RESIDENT",
        isActive: true,
      });

      updatePayload.owner = newUser._id;
      updatePayload.contract = contractInfo || {};
    }

    // Thực hiện lưu DB
    if (type === "CREATE") {
      const newApt = await Apartment.create(updatePayload);
      if (updatePayload.owner)
        await User.findByIdAndUpdate(updatePayload.owner, {
          currentApartment: newApt._id,
        });
      return newApt;
    } else {
      const updatedApt = await Apartment.findByIdAndUpdate(id, updatePayload, {
        new: true,
      });
      if (updatePayload.owner)
        await User.findByIdAndUpdate(updatePayload.owner, {
          currentApartment: updatedApt._id,
        });
      return updatedApt;
    }
  }

  // ... (Giữ nguyên phần getAll và delete) ...
  async getAllApartments(query, user) {
    const { block, floor, status } = query;
    const filter = {};
    if (user.role === "RESIDENT") {
      filter.owner = user._id;
    } else {
      if (block) filter.block = block;
      if (floor) filter.floor = floor;
      if (status) filter.status = status;
    }

    const apartments = await Apartment.find(filter)
      .populate("owner", "fullname phone email")
      .lean();

    if (user.role === "ADMIN") {
      return apartments;
    }

    return apartments.map((apt) => ({
      ...apt,
      owner: apt.owner
        ? { ...apt.owner, phone: maskPhone(apt.owner.phone) }
        : null,
    }));
  }

  async deleteApartment(id) {
    return await Apartment.findByIdAndDelete(id);
  }
}

module.exports = new ApartmentService();
