const billService = require("../services/bill.service");

// 1. Tạo hóa đơn
exports.generateMonthlyBills = async (req, res) => {
  try {
    const { month, year } = req.body;
    const results = await billService.generateMonthlyBills(month, year);

    res.json({
      success: true,
      data: results,
      message: `Đã tạo ${results.created} hóa đơn. Bỏ qua ${results.skipped}.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Lấy danh sách
exports.getAllBills = async (req, res) => {
  try {
    const bills = await billService.getAllBills(req.query, req.user);
    res.json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Cập nhật hóa đơn
exports.updateBill = async (req, res) => {
  try {
    const updatedBill = await billService.updateBill(req.params.id, req.body);
    res.json({
      success: true,
      data: updatedBill,
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. [MỚI] Xóa hóa đơn
exports.deleteBill = async (req, res) => {
  try {
    await billService.deleteBill(req.params.id);
    res.json({ success: true, message: "Đã xóa hóa đơn thành công!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Thanh toán
exports.payBill = async (req, res) => {
  try {
    const bill = await billService.processPayment(req.params.id, req.body);
    res.json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
