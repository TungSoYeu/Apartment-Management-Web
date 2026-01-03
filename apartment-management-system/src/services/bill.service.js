const Bill = require("../models/Bill");
const Apartment = require("../models/Apartment");
const { calculateAmount } = require("../utils/currency");

const FEES = { SERVICE: 7000, MGMT: 50000, ELEC: 3000 };

class BillService {
  async generateMonthlyBills(month, year) {
    const billingCycle = `${month}-${year}`;
    const apartments = await Apartment.find({
      status: { $in: ["OCCUPIED"] },
    }).populate("owner");

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

          // Tính phí
          const svc = calculateAmount(apt.area, FEES.SERVICE);
          services.push({ name: "Service Fee", amount: svc });
          total += svc;

          const ele = calculateAmount(
            Math.floor(Math.random() * 200),
            FEES.ELEC,
          );
          services.push({ name: "Electric", amount: ele });
          total += ele;

          await Bill.create({
            title: `Bill ${billingCycle}`,
            apartmentId: apt._id,
            billingCycle,
            dueDate: new Date(year, month, 10),
            apartmentSnapshot: {
              code: apt.code,
              ownerName: apt.owner?.fullname,
              area: apt.area,
            },
            services,
            totalAmount: total,
            status: "UNPAID",
          });
          results.created++;
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
}
module.exports = new BillService();
