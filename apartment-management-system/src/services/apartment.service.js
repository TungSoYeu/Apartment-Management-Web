const Apartment = require("../models/Apartment");
const { maskPhone } = require("../utils/masking");

class ApartmentService {
  async createApartment(data) {
    const exists = await Apartment.findOne({ code: data.code });
    if (exists) throw new Error("Code exists");
    return await Apartment.create(data);
  }

  async getAllApartments(query) {
    const { block, floor } = query;
    const filter = {};
    if (block) filter.block = block;
    if (floor) filter.floor = floor;

    const apartments = await Apartment.find(filter)
      .populate("owner", "fullname phone")
      .lean();

    return apartments.map((apt) => ({
      ...apt,
      owner: apt.owner
        ? { ...apt.owner, phone: maskPhone(apt.owner.phone) }
        : null,
    }));
  }

  async updateApartment(id, data, fileUrl) {
    if (fileUrl) data.documentUrl = fileUrl;
    return await Apartment.findByIdAndUpdate(id, data, { new: true });
  }
}
module.exports = new ApartmentService();
