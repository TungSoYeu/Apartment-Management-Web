import { useState, useEffect } from "react";
import ContractModal from "../ContractModal"; // Import Modal mới
import { HiFolder, HiDocumentText } from "react-icons/hi2";

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
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-3">
          <HiFolder className="text-indigo-600" /> Hồ Sơ Cư Dân
        </h2>
        <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-bold border border-indigo-200">
          Tổng số: {residents.length} hộ
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-sm border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Họ và Tên
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                CCCD / CMND
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Căn hộ
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Hợp đồng
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Liên hệ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {residents.map((apt) => (
              <tr
                key={apt._id}
                className="hover:bg-slate-50/70 transition duration-150 group transform hover:scale-[1.005] relative z-0"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-slate-900">
                    {apt.owner.fullname}
                  </div>
                  <div className="text-xs text-slate-500">{apt.owner.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                    {apt.owner.identityCard || "---"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                    {apt.code}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setSelectedApt(apt)}
                    className="text-xs font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 px-3 py-1.5 rounded-md transition-colors shadow-sm transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
                  >
                    <HiDocumentText /> Xem HĐ
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                  {apt.owner.phone}
                </td>
              </tr>
            ))}
            {residents.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-slate-400 italic"
                >
                  Chưa có dữ liệu cư dân.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ContractModal
        isOpen={!!selectedApt}
        onClose={() => setSelectedApt(null)}
        data={selectedApt}
      />
    </div>
  );
};
export default ResidentManagement;
