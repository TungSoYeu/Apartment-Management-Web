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
    const apts = await apartmentService.getAllApartments(req.query);
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
