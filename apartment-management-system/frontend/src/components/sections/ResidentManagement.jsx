import { useState, useEffect } from "react";
import ContractModal from "../ContractModal";
import { HiFolder, HiDocumentText } from "react-icons/hi2";
import MemberModal from "../MemberModal";

// Nhận thêm props userRole và currentUserId từ App.jsx
const ResidentManagement = ({ token, showToast, userRole, currentUserId }) => {
  const API_URL = "http://127.0.0.1:3000/api/v1";
  const [users, setUsers] = useState([]);
  const [selectedApt, setSelectedApt] = useState(null);
  const [selectedResident, setSelectedResident] = useState(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  useEffect(() => {
    loadResidents();
  }, []);

  const loadResidents = async () => {
    try {
      let url = `${API_URL}/users`;
      
      // Nếu là cư dân, chỉ gọi API lấy thông tin của chính mình
      if (userRole === "RESIDENT" && currentUserId) {
        url = `${API_URL}/users/${currentUserId}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        if (userRole === "RESIDENT") {
          // API trả về object đơn lẻ -> Chuyển thành mảng để hiển thị
          setUsers([data.data]);
        } else {
          // Admin: Lọc lấy danh sách resident
          const filteredUsers = data.data.filter(
            (user) =>
              user.role === "RESIDENT" && user.isActive && user.currentApartment,
          );
          setUsers(filteredUsers);
        }
      } else {
        showToast(data.message, "error");
      }
    } catch (err) {
      showToast("Lỗi tải dữ liệu cư dân", "error");
    }
  };

  const handleOpenMemberModal = (resident) => {
    setSelectedResident(resident);
    setIsMemberModalOpen(true);
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-3">
          <HiFolder className="text-indigo-600" /> 
          {userRole === "ADMIN" ? "Hồ Sơ Cư Dân" : "Thông Tin Hộ Gia Đình"}
        </h2>
        {userRole === "ADMIN" && (
          <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-bold border border-indigo-200">
            Tổng số: {users.length} hộ
          </span>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg shadow-sm border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Chủ Hộ
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
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Thành viên
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-slate-50/70 transition duration-150 group transform hover:scale-[1.005] relative z-0"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-slate-900">
                    {user.fullname}
                  </div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                    {user.identityCard || "---"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                    {user.currentApartment ? user.currentApartment.code : "Chưa gán"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setSelectedApt(user.currentApartment)}
                    disabled={!user.currentApartment}
                    className="text-xs font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 px-3 py-1.5 rounded-md transition-colors shadow-sm transform hover:scale-105 active:scale-95 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HiDocumentText /> Xem HĐ
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                  {user.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  <button
                    onClick={() => handleOpenMemberModal(user)}
                    className="text-xs font-bold text-blue-600 bg-blue-100 border border-blue-200 hover:bg-blue-200 px-3 py-1.5 rounded-md transition-colors shadow-sm transform hover:scale-105 active:scale-95"
                  >
                    Xem ({user.members ? user.members.length : 0})
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-slate-400 italic"
                >
                  {userRole === "RESIDENT" ? "Đang tải thông tin hộ gia đình..." : "Chưa có dữ liệu cư dân."}
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

      {isMemberModalOpen && (
        <MemberModal
          isOpen={isMemberModalOpen}
          onClose={() => setIsMemberModalOpen(false)}
          token={token}
          showToast={showToast}
          resident={selectedResident}
          loadResidents={loadResidents}
          // Chỉ cho phép chỉnh sửa nếu là Admin hoặc là chính chủ hộ
          canEdit={userRole === "ADMIN" || (userRole === "RESIDENT" && currentUserId === selectedResident._id)}
        />
      )}
    </div>
  );
};
export default ResidentManagement;