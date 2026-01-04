import { useState, useEffect } from "react";
import BillModal from "../BillModal";

const FeeManagement = ({ token, userRole, showToast }) => {
  const API_URL = "http://127.0.0.1:3000/api/v1";
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      const res = await fetch(`${API_URL}/bills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBills(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const generateBills = async () => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    try {
      const res = await fetch(`${API_URL}/bills/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ month, year }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã tạo ${data.data.created} hóa đơn.`, "success");
        loadBills();
      } else showToast(data.message, "error");
    } catch (e) {
      showToast("Lỗi kết nối", "error");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-indigo-700">
          💰 Quản Lý Thu Phí
        </h2>
        {userRole === "ADMIN" && (
          <button
            onClick={generateBills}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-600 shadow"
          >
            + Tạo Hóa Đơn Tháng Này
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {bills.map((bill) => (
          <div
            key={bill._id}
            className={`bg-white rounded-xl p-5 shadow border-l-4 ${bill.status === "PAID" ? "border-emerald-500" : bill.status === "OVERDUE" ? "border-amber-500" : "border-red-500"} hover:-translate-y-1 transition`}
          >
            <h3 className="text-xl font-bold text-gray-800">
              {bill.apartmentSnapshot.code}
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              {bill.apartmentSnapshot.ownerName}
            </p>

            <div className="text-3xl font-bold text-indigo-600 my-3 text-center">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(bill.totalAmount)}
            </div>

            <div className="text-sm space-y-1">
              <p className="flex justify-between">
                <span>Trạng thái:</span>{" "}
                <strong
                  className={
                    bill.status === "PAID" ? "text-emerald-600" : "text-red-500"
                  }
                >
                  {bill.status}
                </strong>
              </p>
              <p className="flex justify-between">
                <span>Hạn chót:</span>{" "}
                <span>{new Date(bill.deadline).toLocaleDateString()}</span>
              </p>
            </div>

            <button
              onClick={() => setSelectedBill(bill)}
              className="mt-4 w-full bg-blue-100 text-blue-700 py-2 rounded font-bold hover:bg-blue-200"
            >
              Xem Chi Tiết & QR
            </button>
          </div>
        ))}
        {bills.length === 0 && (
          <p className="col-span-full text-center text-gray-400">
            Chưa có hóa đơn nào.
          </p>
        )}
      </div>

      <BillModal
        isOpen={!!selectedBill}
        onClose={() => setSelectedBill(null)}
        bill={selectedBill}
      />
    </div>
  );
};
export default FeeManagement;
