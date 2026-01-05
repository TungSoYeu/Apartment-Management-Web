const Bill = require("../models/Bill");
const Apartment = require("../models/Apartment");
// Lưu ý: Đã xóa import notificationService
const { mockUploadFile } = require("../utils/mockUpload");

const FEES = {
  SERVICE: 200000,
  WATER: 15000,
  ELEC: 5000,
};

class BillService {
  // 1. Tạo hóa đơn hàng loạt
  async generateMonthlyBills(month, year) {
    const m = parseInt(month);
    const y = parseInt(year);
    const billingCycle = `${m}-${y}`;
    const endOfBillingMonth = new Date(y, m, 0);

    const apartments = await Apartment.find({
      status: { $in: ["OCCUPIED"] },
    }).populate("owner residents");

    // Đã xóa dòng notificationService.deleteNotifications(...)

    const results = { created: 0, skipped: 0 };

    await Promise.all(
      apartments.map(async (apt) => {
        try {
          const contractStart =
            apt.contract && apt.contract.startDate
              ? new Date(apt.contract.startDate)
              : new Date();

          // Logic: Nếu chưa đến ngày ở -> Không tạo bill
          if (contractStart > endOfBillingMonth) {
            results.skipped++;
            return;
          }

          const exists = await Bill.exists({
            apartmentId: apt._id,
            month: m,
            year: y,
          });
          if (exists) {
            results.skipped++;
            return;
          }

          let total = 0;
          const services = [];
          const additionalCharges = [];

          const serviceCharge = FEES.SERVICE;
          services.push({ name: "Phí Quản Lý", amount: serviceCharge });
          total += serviceCharge;

          // Logic: Random điện nước
          const minTotal = 700000;
          const maxTotal = 2000000;
          const randomTotalElecWater =
            Math.floor(Math.random() * (maxTotal - minTotal + 1)) + minTotal;
          const elecRatio = 0.6 + Math.random() * 0.15;

          const elecAmountRaw = Math.floor(randomTotalElecWater * elecRatio);
          const waterAmountRaw = randomTotalElecWater - elecAmountRaw;

          const elecUsage = Math.round(elecAmountRaw / FEES.ELEC);
          const finalElecAmount = elecUsage * FEES.ELEC;

          const waterUsage = Math.round(waterAmountRaw / FEES.WATER);
          const finalWaterAmount = waterUsage * FEES.WATER;

          const electricity = { usage: elecUsage, amount: finalElecAmount };
          const water = { usage: waterUsage, amount: finalWaterAmount };

          total += electricity.amount + water.amount;

          const dueDate = new Date(y, m - 1, 10);
          const deadline = new Date(dueDate);
          deadline.setDate(dueDate.getDate() + 15);

          await Bill.create({
            title: `Hóa đơn tháng ${m}/${y}`,
            apartmentId: apt._id,
            month: m,
            year: y,
            billingCycle,
            dueDate,
            deadline,
            apartmentSnapshot: {
              code: apt.code,
              ownerName: apt.owner?.fullname || "Unknown",
              area: apt.area,
              residents: apt.residents.length,
            },
            services,
            water,
            electricity,
            additionalCharges,
            totalAmount: total,
            status: "UNPAID",
            qrCode: mockUploadFile(`qr-${apt.code}-${billingCycle}.png`),
          });

          results.created++;
          // Đã xóa hoàn toàn khối if (apt.owner) tạo thông báo tại đây
        } catch (e) {
          console.error(`Lỗi tạo bill căn ${apt.code}:`, e);
          results.skipped++;
        }
      }),
    );
    return results;
  }

  // 2. Lấy danh sách
  async getAllBills(query, user) {
    const { status, month, year } = query;
    const filter = {};

    if (user.role === "RESIDENT") {
      const apartment = await Apartment.findOne({ owner: user._id });
      if (apartment) {
        filter.apartmentId = apartment._id;
      } else {
        return [];
      }
    }

    if (status) filter.status = status;
    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);

    return await Bill.find(filter).sort({ createdAt: -1 });
  }

  // 3. Cập nhật hóa đơn
  async updateBill(id, data) {
    const bill = await Bill.findById(id);
    if (!bill) throw new Error("Không tìm thấy hóa đơn");

    const { status, electricity, water } = data;

    if (status) bill.status = status;

    if (electricity && electricity.usage !== undefined) {
      bill.electricity.usage = Number(electricity.usage);
      bill.electricity.amount = bill.electricity.usage * FEES.ELEC;
    }

    if (water && water.usage !== undefined) {
      bill.water.usage = Number(water.usage);
      bill.water.amount = bill.water.usage * FEES.WATER;
    }

    const servicesTotal = bill.services.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    const chargesTotal = bill.additionalCharges.reduce(
      (sum, item) => sum + item.amount,
      0,
    );

    bill.totalAmount =
      servicesTotal +
      bill.electricity.amount +
      bill.water.amount +
      chargesTotal;

    return await bill.save();
  }

  // 4. Xóa hóa đơn
  async deleteBill(id) {
    const deletedBill = await Bill.findByIdAndDelete(id);
    if (!deletedBill) throw new Error("Không tìm thấy hóa đơn cần xóa");
    return deletedBill;
  }

  async processPayment(billId, paymentData) {
    const bill = await Bill.findOneAndUpdate(
      { _id: billId, status: { $ne: "PAID" } },
      {
        $set: {
          status: "PAID",
          payment: { ...paymentData, paidAt: new Date() },
        },
      },
      { new: true },
    );
    if (!bill) throw new Error("Bill not found or already paid");
    return bill;
  }
}

module.exports = new BillService();