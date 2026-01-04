const Bill = require("../models/Bill");
const Apartment = require("../models/Apartment");
const { calculateAmount } = require("../utils/currency");
const notificationService = require("./notification.service");
const { mockUploadFile } = require("../utils/mockUpload");

const FEES = { SERVICE: 200000, WATER: 15000, ELEC: 3000 };

class BillService {
  // 1. Tạo hóa đơn hàng loạt
  async generateMonthlyBills(month, year) {
    const billingCycle = `${month}-${year}`;
    const apartments = await Apartment.find({
      status: { $in: ["OCCUPIED"] },
    }).populate("owner residents");

    const results = { created: 0, skipped: 0 };

    await Promise.all(
      apartments.map(async (apt) => {
        try {
          if (await Bill.exists({ apartmentId: apt._id, billingCycle })) {
            results.skipped++;
            return;
          }

          // Mặc định tạo hóa đơn với chỉ số 0 để Admin nhập sau
          let total = 0;
          const services = [];
          const additionalCharges = [];

          // Phí dịch vụ cố định
          const serviceCharge = calculateAmount(1, FEES.SERVICE); // Tính theo hộ hoặc theo người
          services.push({ name: "Phí Dịch Vụ", amount: serviceCharge });
          total += serviceCharge;

          // Điện - Nước (Mặc định 0)
          const water = { usage: 0, amount: 0 };
          const electricity = { usage: 0, amount: 0 };

          const dueDate = new Date(year, month - 1, 10); // Lưu ý: Month trong Date bắt đầu từ 0
          const deadline = new Date(dueDate);
          deadline.setDate(dueDate.getDate() + 15);

          await Bill.create({
            title: `Hóa đơn tháng ${month}/${year}`,
            apartmentId: apt._id,
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

          if (apt.owner) {
            notificationService.createNotification({
              title: "Hóa đơn mới",
              content: `Hóa đơn tháng ${month}/${year} đã được tạo.`,
              // user: apt.owner._id // Nếu cần gửi riêng
            });
          }
        } catch (e) {
          console.error("Lỗi tạo bill cho căn " + apt.code, e);
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

    // Nếu là Cư dân, chỉ xem của mình
    if (user.role === "RESIDENT") {
      const apartment = await Apartment.findOne({ owner: user._id });
      if (apartment) {
        filter.apartmentId = apartment._id;
      } else {
        return [];
      }
    }

    if (status) filter.status = status;
    if (month && year) filter.billingCycle = `${month}-${year}`;

    return await Bill.find(filter).sort({ createdAt: -1 });
  }

  // 3. Cập nhật hóa đơn (Tính lại tiền)
  async updateBill(id, data) {
    const bill = await Bill.findById(id);
    if (!bill) throw new Error("Không tìm thấy hóa đơn");

    const { status, electricity, water } = data;

    if (status) bill.status = status;

    // Cập nhật điện
    if (electricity && electricity.usage !== undefined) {
      bill.electricity.usage = Number(electricity.usage);
      bill.electricity.amount = bill.electricity.usage * FEES.ELEC;
    }

    // Cập nhật nước
    if (water && water.usage !== undefined) {
      bill.water.usage = Number(water.usage);
      bill.water.amount = bill.water.usage * FEES.WATER;
    }

    // Tính lại Tổng tiền
    const servicesTotal = bill.services.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    const chargesTotal = bill.additionalCharges.reduce(
      (sum, item) => sum + item.amount,
      0,
    );

    bill.totalAmount =
      bill.electricity.amount +
      bill.water.amount +
      servicesTotal +
      chargesTotal;

    return await bill.save();
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
