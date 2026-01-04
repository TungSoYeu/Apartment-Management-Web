const billService = require("../services/bill.service");

exports.generateBills = async (req, res, next) => {
  try {
    const { month, year } = req.body;
    const result = await billService.generateMonthlyBills(month, year);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.payBill = async (req, res, next) => {
  try {
    const result = await billService.processPayment(req.params.id, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const bills = await billService.getAllBills(req.query, req.user);
    res.status(200).json({ success: true, count: bills.length, data: bills });
  } catch (err) {
    next(err);
  }
};
