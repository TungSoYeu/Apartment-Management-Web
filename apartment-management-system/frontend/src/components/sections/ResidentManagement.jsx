import { useState, useEffect } from "react";
import ContractModal from "../ContractModal";
import { HiFolder, HiDocumentText } from "react-icons/hi2";
import MemberModal from "../MemberModal";

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
      if (userRole === "RESIDENT" && currentUserId) {
        url = `${API_URL}/users/${currentUserId}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        if (userRole === "RESIDENT") {
          setUsers([data.data]);
        } else {
          const filteredUsers = data.data.filter(
            (user) => user.role === "RESIDENT" && user.isActive,
          );
          setUsers(filteredUsers);
        }
      }
    } catch (err) {
      showToast("Lỗi tải dữ liệu cư dân", "error");
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-3">
          <HiFolder className="text-indigo-600" />
          {userRole === "ADMIN" ? "Hồ Sơ Cư Dân" : "Thông Tin Hộ Gia Đình"}
        </h2>
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
                className="hover:bg-slate-50/70 transition duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-slate-900">
                    {user.fullname}
                  </div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded border">
                    {user.identityCard || "---"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                    {user.currentApartment
                      ? user.currentApartment.code
                      : "Chưa gán"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                   
                    onClick={() =>
                      setSelectedApt({ ...user.currentApartment, owner: user })
                    }
                    disabled={!user.currentApartment}
                    className="text-xs font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 px-3 py-1.5 rounded-md transition-all shadow-sm transform active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <HiDocumentText /> Xem HĐ
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                  {user.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {
                      setSelectedResident(user);
                      setIsMemberModalOpen(true);
                    }}
                    className="text-xs font-bold text-blue-600 bg-blue-100 border border-blue-200 hover:bg-blue-200 px-3 py-1.5 rounded-md transition-all"
                  >
                    Xem ({user.members ? user.members.length : 0})
                  </button>
                </td>
              </tr>
            ))}
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
        />
      )}
    </div>
  );
};
export default ResidentManagement;
