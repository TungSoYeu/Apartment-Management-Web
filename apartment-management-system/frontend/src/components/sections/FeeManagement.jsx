import { useState, useEffect } from "react";
import BillModal from "../BillModal";
import {
  HiCurrencyDollar,
  HiPlus,
  HiXMark,
  HiInformationCircle,
  HiPencil,
  HiQrCode,
} from "react-icons/hi2";
import { BsLightningFill, BsDropletFill } from "react-icons/bs";

const FeeManagement = ({ token, userRole, showToast, showConfirmation }) => {
  const API_URL = "http://127.0.0.1:3000/api/v1";
  const [bills, setBills] = useState([]);

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

  const executeDeleteBill = async (billId) => {
    try {
      const res = await fetch(`${API_URL}/bills/${billId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast("Đã xóa hóa đơn thành công!", "success");
        loadBills();
      } else {
        showToast(data.message || "Lỗi khi xóa", "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối server", "error");
    }
  };

  const handleDeleteBill = (billId, code) => {
    showConfirmation(
      "Xác nhận xóa hóa đơn",
      `Bạn có chắc chắn muốn xóa hóa đơn của căn hộ ${code}? Hành động này không thể hoàn tác!`,
      () => executeDeleteBill(billId)
    );
  };

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-wrap justify-between items-center mb-6 border-b border-slate-200 pb-4 gap-4">
        <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-3">
          <HiCurrencyDollar className="text-indigo-600" />
          Quản Lý Thu Phí
        </h2>

        <div className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
          <span className="font-bold text-slate-500 text-sm">Kỳ thu:</span>
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
              className="ml-3 bg-indigo-600 text-white px-3 py-1.5 rounded-md font-bold hover:bg-indigo-700 shadow-sm text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <HiPlus /> Tạo Hóa Đơn
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bills.map((bill) => (
          <div
            key={bill._id}
            className={`bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 group hover:shadow-xl hover:scale-[1.02] ${bill.status === "PAID" ? "border-l-4 border-green-500" : "border-l-4 border-red-500"}`}
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold text-slate-800">
                  {bill.apartmentSnapshot.code}
                </h3>
                <span
                  className={`text-[11px] font-bold uppercase px-2 py-1 rounded-full ${bill.status === "PAID" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {bill.status === "PAID" ? "Đã Thanh Toán" : "Chưa Thanh Toán"}
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-4 font-medium">
                {bill.apartmentSnapshot.ownerName}
              </p>

              <div className="bg-slate-50 p-3 rounded-lg mb-4 space-y-2">
                <div className="flex justify-between text-xs text-slate-600 items-center">
                  <span className="flex items-center gap-1.5"><BsLightningFill className="text-yellow-500" /> Điện ({bill.electricity.usage} số)</span>
                  <span className="font-mono font-semibold text-slate-700">
                    {formatMoney(bill.electricity.amount)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-600 items-center">
                  <span className="flex items-center gap-1.5"><BsDropletFill className="text-indigo-500" /> Nước ({bill.water.usage} m³)</span>
                  <span className="font-mono font-semibold text-slate-700">
                    {formatMoney(bill.water.amount)}
                  </span>
                </div>
                <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Tổng cộng
                  </span>
                  <span className="text-lg font-bold text-indigo-700">
                    {formatMoney(bill.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => setViewBill(bill)}
                  className="flex-1 flex items-center justify-center gap-1 bg-white border border-slate-300 text-slate-600 py-2 rounded-md font-bold text-xs hover:bg-slate-50 transition-colors transform hover:scale-105 active:scale-95"
                >
                  <HiQrCode /> QR
                </button>
                {userRole === "ADMIN" && (
                  <>
                    <button
                      onClick={() => setEditBill(bill)}
                      className="flex-1 flex items-center justify-center gap-1 bg-slate-700 text-white py-2 rounded-md font-bold text-xs hover:bg-slate-800 transition-colors transform hover:scale-105 active:scale-95"
                    >
                      <HiPencil /> Sửa
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteBill(bill._id, bill.apartmentSnapshot.code)
                      }
                      className="bg-red-100 text-red-700 p-2 rounded-md font-bold text-xs hover:bg-red-200 transition-colors transform hover:scale-105 active:scale-95 flex items-center justify-center"
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
          <p className="col-span-full text-center text-slate-400 py-16">
            Chưa có hóa đơn nào cho tháng này.
          </p>
        )}
      </div>

      <BillModal
        isOpen={!!viewBill}
        onClose={() => setViewBill(null)}
        bill={viewBill}
      />

      {editBill && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden p-6 relative">
            <button
              onClick={() => setEditBill(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-800"
            >
              <HiXMark className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-1 text-slate-800">
              Cập Nhật Hóa Đơn
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Căn hộ:{" "}
              <span className="font-bold text-indigo-600">
                {editBill.apartmentSnapshot.code}
              </span>
            </p>

            <form onSubmit={handleUpdateBill} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Trạng thái
                </label>
                <select
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
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
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Số Điện (kWh)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
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
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Số Nước (m³)
                  </label>
                   <input
                    type="number"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    value={editBill.water.usage}
                    onChange={(e) =>
                      setEditBill({
                        ...editBill,
                        water: { ...editBill.water, usage: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 flex gap-3 items-center">
                <HiInformationCircle className="text-indigo-500 h-5 w-5 flex-shrink-0" />
                <p className="text-xs text-indigo-800 leading-5">
                  Hệ thống sẽ tự động nhân đơn giá và cộng phí dịch vụ khi bạn bấm Lưu.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditBill(null)}
                  className="flex-1 py-3 bg-slate-100 rounded-lg text-slate-600 font-bold hover:bg-slate-200 transition-colors transform active:scale-95"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-105 active:scale-95 hover:shadow-indigo-500/30"
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
