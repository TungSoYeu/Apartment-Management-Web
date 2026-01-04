import { useState, useEffect } from "react";

const ResidentManagement = ({ token, showToast }) => {
  const API_URL = "http://127.0.0.1:3000/api/v1";
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    loadResidents();
  }, []);

  const loadResidents = async () => {
    try {
      const res = await fetch(`${API_URL}/apartments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Lấy những phòng có chủ hộ
      const occupied = (data.data || []).filter(
        (apt) => apt.status === "OCCUPIED" && apt.owner,
      );
      setResidents(occupied);
    } catch (err) {
      showToast("Lỗi tải dữ liệu", "error");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm animate-fadeIn">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
          📂 Hồ Sơ Cư Dân
        </h2>
        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-bold">
          Tổng: {residents.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                Họ và Tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                CCCD / CMND
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                Căn hộ
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                Liên hệ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {residents.map((apt) => (
              <tr key={apt._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">
                    {apt.owner.fullname}
                  </div>
                  <div className="text-xs text-gray-500">{apt.owner.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                  {apt.owner.identityCard || "---"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-indigo-100 text-indigo-800">
                    {apt.code}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {apt.owner.phone}
                </td>
              </tr>
            ))}
            {residents.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                  Chưa có dữ liệu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ResidentManagement;
