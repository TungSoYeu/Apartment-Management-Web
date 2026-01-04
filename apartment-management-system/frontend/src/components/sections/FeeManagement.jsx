import { useState, useEffect } from "react";
import BillModal from "../BillModal";

const FeeManagement = ({ token, userRole, showToast }) => {
  const API_URL = "http://127.0.0.1:3000/api/v1";
  const [bills, setBills] = useState([]);

  // State cho bộ lọc (Lịch sử giao dịch)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [viewBill, setViewBill] = useState(null); // Modal xem QR
  const [editBill, setEditBill] = useState(null); // Modal sửa

  useEffect(() => {
    loadBills();
  }, [selectedMonth, selectedYear]);

  // Load bills theo tháng/năm đã chọn
  const loadBills = async () => {
    try {
      // Backend cần hỗ trợ query string: ?month=...&year=...
      // Nếu backend bạn chưa làm filter này, hãy sửa backend hàm getAllBills để nhận req.query
      const res = await fetch(
        `${API_URL}/bills?month=${selectedMonth}&year=${selectedYear}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      setBills(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const generateBills = async () => {
    try {
      const res = await fetch(`${API_URL}/bills/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ month: selectedMonth, year: selectedYear }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          `Đã tạo ${data.data.created} hóa đơn cho tháng ${selectedMonth}/${selectedYear}.`,
          "success",
        );
        loadBills();
      } else showToast(data.message, "error");
    } catch (e) {
      showToast("Lỗi kết nối", "error");
    }
  };

  // Xử lý lưu sau khi sửa
  const handleUpdateBill = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/bills/${editBill._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: editBill.status,
          electricity: { usage: Number(editBill.electricity.usage) },
          water: { usage: Number(editBill.water.usage) },
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Cập nhật thành công!", "success");
        setEditBill(null);
        loadBills();
      } else showToast("Lỗi cập nhật", "error");
    } catch (err) {
      showToast("Lỗi server", "error");
    }
  };

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm animate-fadeIn">
      {/* Header & Bộ Lọc Lịch Sử */}
      <div className="flex flex-wrap justify-between items-center mb-6 border-b pb-4 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 uppercase">
          💰 Quản Lý Thu Phí
        </h2>

        <div className="flex gap-2 items-center">
          <span className="font-bold text-gray-500">Kỳ thu:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="p-2 border rounded font-bold"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="p-2 border rounded font-bold"
          >
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>

          {userRole === "ADMIN" && (
            <button
              onClick={generateBills}
              className="ml-2 bg-emerald-600 text-white px-4 py-2 rounded font-medium hover:bg-emerald-700 shadow-sm"
            >
              + Tạo Hóa Đơn
            </button>
          )}
        </div>
      </div>

      {/* Danh sách hóa đơn */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bills.map((bill) => (
          <div
            key={bill._id}
            className={`bg-white rounded-xl shadow-sm border-l-4 ${bill.status === "PAID" ? "border-emerald-500" : "border-red-500"} p-5 hover:shadow-md transition relative group`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl font-bold text-gray-800">
                {bill.apartmentSnapshot.code}
              </h3>
              <span
                className={`text-xs font-bold px-2 py-1 rounded ${bill.status === "PAID" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
              >
                {bill.status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {bill.apartmentSnapshot.ownerName}
            </p>

            <div className="flex justify-between items-center bg-gray-50 p-2 rounded mb-3">
              <div className="text-xs text-gray-500">
                <div>⚡ Điện: {bill.electricity.usage} số</div>
                <div>💧 Nước: {bill.water.usage} m³</div>
              </div>
              <div className="text-xl font-bold text-indigo-700">
                {formatMoney(bill.totalAmount)}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewBill(bill)}
                className="flex-1 bg-blue-50 text-blue-600 py-2 rounded font-bold text-sm hover:bg-blue-100"
              >
                Xem QR
              </button>
              {userRole === "ADMIN" && (
                <button
                  onClick={() => setEditBill(bill)}
                  className="flex-1 bg-amber-50 text-amber-600 py-2 rounded font-bold text-sm hover:bg-amber-100"
                >
                  Sửa / Thu
                </button>
              )}
            </div>
          </div>
        ))}
        {bills.length === 0 && (
          <p className="col-span-full text-center text-gray-400 py-10">
            Không có dữ liệu cho tháng này.
          </p>
        )}
      </div>

      {/* Modal Xem QR */}
      <BillModal
        isOpen={!!viewBill}
        onClose={() => setViewBill(null)}
        bill={viewBill}
      />

      {/* Modal Sửa Hóa Đơn (Edit) */}
      {editBill && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden p-6">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              Chỉnh Sửa Hóa Đơn ({editBill.apartmentSnapshot.code})
            </h2>
            <form onSubmit={handleUpdateBill} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Trạng thái thanh toán
                </label>
                <select
                  className="w-full p-2 border rounded mt-1 outline-none"
                  value={editBill.status}
                  onChange={(e) =>
                    setEditBill({ ...editBill, status: e.target.value })
                  }
                >
                  <option value="UNPAID">Chưa thanh toán</option>
                  <option value="PAID">Đã thanh toán</option>
                  <option value="OVERDUE">Quá hạn</option>
                </select>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700">
                    Số Điện (kWh)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded mt-1 outline-none"
                    value={editBill.electricity.usage}
                    onChange={(e) =>
                      setEditBill({
                        ...editBill,
                        electricity: {
                          ...editBill.electricity,
                          usage: e.target.value,
                        },
                      })
                    }
                  />
                  <small className="text-gray-400">x 3.000đ</small>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700">
                    Số Nước (m³)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded mt-1 outline-none"
                    value={editBill.water.usage}
                    onChange={(e) =>
                      setEditBill({
                        ...editBill,
                        water: { ...editBill.water, usage: e.target.value },
                      })
                    }
                  />
                  <small className="text-gray-400">x 15.000đ</small>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800">
                ℹ️ Tổng tiền sẽ được tự động tính lại sau khi lưu.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditBill(null)}
                  className="flex-1 py-2 bg-gray-100 rounded text-gray-600 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default FeeManagement;
