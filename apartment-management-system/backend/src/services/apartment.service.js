const Apartment = require("../models/Apartment");
const User = require("../models/User");
const { maskPhone } = require("../utils/masking");

class ApartmentService {
  // 1. TẠO CĂN HỘ
  async createApartment(data) {
    return this.handleSave(data, "CREATE");
  }

  // 2. CẬP NHẬT CĂN HỘ
  async updateApartment(id, data) {
    return this.handleSave(data, "UPDATE", id);
  }

  // --- HÀM XỬ LÝ CHUNG ---
  async handleSave(data, type, id = null) {
    const { code, block, floor, area, status, ownerInfo, contractInfo } = data;

    // Nếu là tạo mới -> check trùng mã
    if (type === "CREATE") {
      const exists = await Apartment.findOne({ code });
      if (exists) throw new Error(`Căn hộ ${code} đã tồn tại!`);
    }

    let updatePayload = { code, block, floor, area, status };

    // Nếu chuyển sang "Trống" -> Xóa chủ hộ
    if (status === "VACANT") {
      updatePayload.owner = null;
      updatePayload.contract = {};
    }
    // Nếu chuyển sang "Có người" và có thông tin chủ mới
    else if (status === "OCCUPIED" && ownerInfo) {
      // Check email tồn tại chưa
      let user = await User.findOne({ email: ownerInfo.email });

      if (!user) {
        // Tạo user mới nếu chưa có
        user = await User.create({
          fullname: ownerInfo.fullname,
          email: ownerInfo.email,
          phone: ownerInfo.phone,
          identityCard: ownerInfo.identityCard || "", // Lưu CCCD
          password: ownerInfo.password || "123456",
          role: "RESIDENT",
          isActive: true,
        });
      } else {
        // Nếu user đã có, update lại thông tin CCCD nếu chưa có
        if (ownerInfo.identityCard && !user.identityCard) {
          user.identityCard = ownerInfo.identityCard;
          await user.save();
        }
      }

      updatePayload.owner = user._id;
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

  // --- LẤY DANH SÁCH (SỬA LỖI KHÔNG HIỆN CCCD TẠI ĐÂY) ---
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

    // QUAN TRỌNG: Đã thêm 'identityCard' vào populate
    const apartments = await Apartment.find(filter)
      .populate("owner", "fullname phone email identityCard")
      .populate("residents", "fullname phone")
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
