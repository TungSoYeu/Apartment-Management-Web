const Bill = require("../models/Bill");
const Apartment = require("../models/Apartment");
const { calculateAmount } = require("../utils/currency");
const notificationService = require("./notification.service");
const { mockUploadFile } = require("../utils/mockUpload");

const FEES = { SERVICE: 200000, WATER: 15000, ELEC: 3000 };

class BillService {
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

          let total = 0;
          const services = [];
          const additionalCharges = [];

          // Service charge
          const serviceCharge = calculateAmount(apt.residents.length, FEES.SERVICE);
          services.push({ name: "Service Fee", amount: serviceCharge });
          total += serviceCharge;

          // Water
          const waterUsage = Math.floor(Math.random() * 50);
          const waterAmount = calculateAmount(waterUsage, FEES.WATER);
          const water = { usage: waterUsage, amount: waterAmount };
          total += waterAmount;
          
          // Electricity
          const electricityUsage = Math.floor(Math.random() * 200);
          const electricityAmount = calculateAmount(electricityUsage, FEES.ELEC);
          const electricity = { usage: electricityUsage, amount: electricityAmount };
          total += electricityAmount;


          const dueDate = new Date(year, month, 10);
          const deadline = new Date(dueDate);
          deadline.setDate(dueDate.getDate() + 15);

          const newBill = await Bill.create({
            title: `Bill ${billingCycle}`,
            apartmentId: apt._id,
            billingCycle,
            dueDate,
            deadline,
            apartmentSnapshot: {
              code: apt.code,
              ownerName: apt.owner?.fullname,
              area: apt.area,
              residents: apt.residents.length
            },
            services,
            water,
            electricity,
            additionalCharges,
            totalAmount: total,
            status: "UNPAID",
            qrCode: mockUploadFile(`qr-code-${apt.code}-${billingCycle}.png`),
          });
          results.created++;
          notificationService.sendNotification(apt.owner, `Your bill for ${billingCycle} has been generated.`);
        } catch (e) {
          results.skipped++;
        }
      }),
    );
    return results;
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

  async getAllBills(query, user) {
    const { status, billingCycle } = query;
    const filter = {};
    if (user.role === 'RESIDENT') {
      const apartment = await Apartment.findOne({ owner: user._id });
      if (apartment) {
        filter.apartmentId = apartment._id;
      } else {
        return [];
      }
    }
    if (status) filter.status = status;
    if (billingCycle) filter.billingCycle = billingCycle;

    return await Bill.find(filter).sort({ createdAt: -1 });
  }
}
module.exports = new BillService();
