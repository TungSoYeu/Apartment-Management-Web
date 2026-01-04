import { useState, useEffect } from "react";
import ContractModal from "../ContractModal"; // Import Modal mới

const ResidentManagement = ({ token, showToast }) => {
  const API_URL = "http://127.0.0.1:3000/api/v1";
  const [residents, setResidents] = useState([]);
  const [selectedApt, setSelectedApt] = useState(null); // State lưu căn hộ đang xem hợp đồng

  useEffect(() => {
    loadResidents();
  }, []);

  const loadResidents = async () => {
    try {
      const res = await fetch(`${API_URL}/apartments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Lọc các phòng có người ở và có thông tin chủ hộ
      const occupied = (data.data || []).filter(
        (apt) => apt.status === "OCCUPIED" && apt.owner,
      );
      setResidents(occupied);
    } catch (err) {
      showToast("Lỗi tải dữ liệu cư dân", "error");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm animate-fadeIn">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-indigo-700 uppercase tracking-wide">
          📂 Hồ Sơ Cư Dân
        </h2>
        <span className="bg-indigo-50 text-indigo-700 px-4 py-1 rounded-full text-sm font-bold border border-indigo-100">
          Tổng số: {residents.length} hộ
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Họ và Tên
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                CCCD / CMND
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Căn hộ
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Hợp đồng
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Liên hệ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {residents.map((apt) => (
              <tr
                key={apt._id}
                className="hover:bg-indigo-50 transition duration-150 group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">
                    {apt.owner.fullname}
                  </div>
                  <div className="text-xs text-gray-500">{apt.owner.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                    {apt.owner.identityCard || "---"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                    {apt.code}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* Nút Xem Hợp Đồng */}
                  <button
                    onClick={() => setSelectedApt(apt)}
                    className="text-xs font-bold text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 rounded transition shadow-sm flex items-center gap-1"
                  >
                    <span>📄</span> Xem HĐ
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {apt.owner.phone}
                </td>
              </tr>
            ))}
            {residents.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-gray-400 italic"
                >
                  Chưa có dữ liệu cư dân.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Hiển thị Modal Hợp Đồng khi có selectedApt */}
      <ContractModal
        isOpen={!!selectedApt}
        onClose={() => setSelectedApt(null)}
        data={selectedApt}
      />
    </div>
  );
};
export default ResidentManagement;
