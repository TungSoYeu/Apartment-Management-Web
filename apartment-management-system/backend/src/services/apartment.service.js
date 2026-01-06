/* backend/src/services/apartment.service.js */
const Apartment = require("../models/Apartment");
const User = require("../models/User");
const { maskPhone } = require("../utils/masking");

class ApartmentService {
  async createApartment(data) {
    return this.handleSave(data, "CREATE");
  }
  async updateApartment(id, data) {
    return this.handleSave(data, "UPDATE", id);
  }

  async handleSave(data, type, id = null) {
    const { code, block, floor, area, status, ownerInfo, contractInfo } = data;

    if (type === "CREATE") {
      const exists = await Apartment.findOne({ code });
      if (exists) throw new Error(`Căn hộ ${code} đã tồn tại!`);
    }

    let updatePayload = { code, block, floor, area, status };

    if (status === "VACANT") {
      updatePayload.owner = null;
      updatePayload.contract = { number: "", terms: "Chưa có" };
    } else if (status === "OCCUPIED" && ownerInfo) {
      let user = await User.findOne({ email: ownerInfo.email });
      if (!user) {
        user = await User.create({
          fullname: ownerInfo.fullname,
          email: ownerInfo.email,
          phone: ownerInfo.phone,
          identityCard: ownerInfo.identityCard || "",
          password: "123456",
          role: "RESIDENT",
          isActive: true,
        });
      } else {
        // CẬP NHẬT: Lưu mọi thay đổi của chủ hộ khi sửa
        user.fullname = ownerInfo.fullname || user.fullname;
        user.phone = ownerInfo.phone || user.phone;
        user.identityCard = ownerInfo.identityCard || user.identityCard;
        await user.save();
      }
      updatePayload.owner = user._id;
      updatePayload.contract = {
        number: contractInfo?.number || "",
        startDate: contractInfo?.startDate || new Date(),
        duration: Number(contractInfo?.duration) || 12,
        terms: contractInfo?.terms || "Thuê dài hạn",
      };
    }

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

  async getAllApartments(query, user) {
    const filter = {};
    if (user.role === "RESIDENT") filter.owner = user._id;
    else {
      if (query.block) filter.block = query.block;
      if (query.status) filter.status = query.status;
    }
    const apartments = await Apartment.find(filter)
      .populate("owner", "fullname phone email identityCard members") // Thêm 'members'
      .populate("residents", "fullname phone members") // Thêm 'members'
      .lean();
    if (user.role === "ADMIN") return apartments;
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
