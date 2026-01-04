import { useState, useEffect } from "react";
import BillModal from "../BillModal";
import {
  HiCurrencyDollar,
  HiPlus,
  HiXMark,
  HiInformationCircle,
  HiCheckCircle,
  HiExclamationCircle,
} from "react-icons/hi2";
import { BsLightningFill, BsDropletFill } from "react-icons/bs";

const FeeManagement = ({ token, userRole, showToast }) => {
  const API_URL = "http://127.0.0.1:3000/api/v1";
  const [bills, setBills] = useState([]);

  // Bộ lọc thời gian
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [viewBill, setViewBill] = useState(null);
  const [editBill, setEditBill] = useState(null);

  useEffect(() => {
    loadBills();
  }, [selectedMonth, selectedYear]);

  const loadBills = async () => {
    try {
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
        showToast(`Đã tạo ${data.data.created} hóa đơn mới.`, "success");
        loadBills();
      } else showToast(data.message, "error");
    } catch (e) {
      showToast("Lỗi kết nối", "error");
    }
  };

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
        showToast("Cập nhật & Tính tiền thành công!", "success");
        setEditBill(null);
        loadBills();
      } else showToast("Lỗi cập nhật", "error");
    } catch (err) {
      showToast("Lỗi server", "error");
    }
  };

  // [MỚI] Hàm xóa hóa đơn
  const handleDeleteBill = async (billId, code) => {
    if (
      !window.confirm(
        `Bạn có chắc muốn XÓA hóa đơn căn ${code}? Hành động này không thể hoàn tác!`,
      )
    )
      return;

    try {
      const res = await fetch(`${API_URL}/bills/${billId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast("Đã xóa hóa đơn thành công!", "success");
        loadBills(); // Load lại danh sách
      } else {
        showToast(data.message || "Lỗi khi xóa", "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối server", "error");
    }
  };

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 border-b pb-4 gap-4">
        <h2 className="text-2xl font-bold text-indigo-700 uppercase tracking-wide flex items-center gap-2">
          <HiCurrencyDollar /> Quản Lý Thu Phí
        </h2>

        <div className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg border border-gray-200">
          <span className="font-bold text-gray-500 text-sm">Kỳ thu:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="p-1 border-none bg-transparent font-bold text-indigo-600 focus:ring-0 cursor-pointer"
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
            className="p-1 border-none bg-transparent font-bold text-indigo-600 focus:ring-0 cursor-pointer"
          >
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>

          {userRole === "ADMIN" && (
            <button
              onClick={generateBills}
              className="ml-3 bg-emerald-500 text-white px-4 py-1.5 rounded font-bold hover:bg-emerald-600 shadow-sm text-sm transition flex items-center gap-2"
            >
              <HiPlus /> Tạo Hóa Đơn
            </button>
          )}
        </div>
      </div>

      {/* Danh sách Bill */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bills.map((bill) => (
          <div
            key={bill._id}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group ${bill.status === "PAID" ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-red-500"}`}
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold text-gray-800">
                  {bill.apartmentSnapshot.code}
                </h3>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded tracking-wider ${bill.status === "PAID" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                >
                  {bill.status === "PAID" ? "Đã Thanh Toán" : "Chưa Thanh Toán"}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4 font-medium">
                {bill.apartmentSnapshot.ownerName}
              </p>

              <div className="bg-gray-50 p-3 rounded-lg mb-3 space-y-1">
                <div className="flex justify-between text-xs text-gray-500 items-center">
                  <span className="flex items-center gap-1"><BsLightningFill className="text-yellow-500" /> Điện ({bill.electricity.usage} số):</span>
                  <span className="font-mono">
                    {formatMoney(bill.electricity.amount)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 items-center">
                  <span className="flex items-center gap-1"><BsDropletFill className="text-blue-500" /> Nước ({bill.water.usage} m³):</span>
                  <span className="font-mono">
                    {formatMoney(bill.water.amount)}
                  </span>
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-600">
                    TỔNG CỘNG:
                  </span>
                  <span className="text-lg font-bold text-indigo-700">
                    {formatMoney(bill.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => setViewBill(bill)}
                  className="flex-1 bg-white border border-gray-300 text-gray-600 py-2 rounded font-bold text-xs hover:bg-gray-50"
                >
                  QR
                </button>
                {userRole === "ADMIN" && (
                  <>
                    <button
                      onClick={() => setEditBill(bill)}
                      className="flex-1 bg-indigo-600 text-white py-2 rounded font-bold text-xs hover:bg-indigo-700"
                    >
                      Sửa
                    </button>
                    {/* [MỚI] Nút Xóa */}
                    <button
                      onClick={() =>
                        handleDeleteBill(bill._id, bill.apartmentSnapshot.code)
                      }
                      className="bg-red-50 text-red-600 border border-red-200 px-2 py-2 rounded font-bold text-xs hover:bg-red-100 hover:border-red-300 flex items-center justify-center"
                      title="Xóa hóa đơn này"
                    >
                      <HiXMark />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {bills.length === 0 && (
          <p className="col-span-full text-center text-gray-400 py-12">
            Chưa có hóa đơn nào cho tháng này.
          </p>
        )}
      </div>

      {/* Modal Xem QR (Giữ nguyên) */}
      <BillModal
        isOpen={!!viewBill}
        onClose={() => setViewBill(null)}
        bill={viewBill}
      />

      {/* Modal Sửa Hóa Đơn (Giữ nguyên) */}
      {editBill && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden p-6 relative">
            <button
              onClick={() => setEditBill(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              <HiXMark />
            </button>
            <h2 className="text-xl font-bold mb-1 text-gray-800">
              Cập Nhật Hóa Đơn
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Căn hộ:{" "}
              <span className="font-bold text-indigo-600">
                {editBill.apartmentSnapshot.code}
              </span>
            </p>

            <form onSubmit={handleUpdateBill} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Trạng thái thanh toán
                </label>
                <select
                  className="w-full p-2.5 border border-gray-300 rounded-lg font-bold text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                  value={editBill.status}
                  onChange={(e) =>
                    setEditBill({ ...editBill, status: e.target.value })
                  }
                >
                  <option value="UNPAID">Chưa thanh toán</option>
                  <option value="PAID">Đã thanh toán</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Số Điện (kWh)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 pl-3"
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
                    <span className="absolute right-8 top-2.5 text-xs text-gray-400">
                      x 5k
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Số Nước (m³)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 pl-3"
                      value={editBill.water.usage}
                      onChange={(e) =>
                        setEditBill({
                          ...editBill,
                          water: { ...editBill.water, usage: e.target.value },
                        })
                      }
                    />
                    <span className="absolute right-8 top-2.5 text-xs text-gray-400">
                      x 15k
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex gap-2">
                <span className="text-yellow-600"><HiInformationCircle /></span>
                <p className="text-xs text-yellow-800 leading-5">
                  Hệ thống sẽ tự động nhân đơn giá (Điện: 5.000đ, Nước: 15.000đ)
                  và cộng phí dịch vụ khi bạn bấm Lưu.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditBill(null)}
                  className="flex-1 py-2.5 bg-gray-100 rounded-lg text-gray-600 font-bold hover:bg-gray-200 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition"
                >
                  Lưu & Tính Tiền
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
