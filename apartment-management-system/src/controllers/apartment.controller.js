const apartmentService = require("../services/apartment.service");

exports.create = async (req, res, next) => {
  try {
    const apt = await apartmentService.createApartment(req.body);
    res.status(201).json({ success: true, data: apt });
  } catch (err) {
    next(err);
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const apts = await apartmentService.getAllApartments(req.query, req.user);
    res.status(200).json({ success: true, count: apts.length, data: apts });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const apt = await apartmentService.updateApartment(
      req.params.id,
      req.body,
      null,
    );
    res.status(200).json({ success: true, data: apt });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await apartmentService.deleteApartment(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Đã xóa căn hộ thành công" });
  } catch (err) {
    next(err);
  }
};
