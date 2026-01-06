import { useState, useEffect } from "react";
import { HiXMark, HiUserPlus, HiTrash } from "react-icons/hi2";

const MemberModal = ({
  isOpen,
  onClose,
  token,
  showToast,
  resident,
  loadResidents,
}) => {
  const API_URL = "http://127.0.0.1:3000/api/v1";
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: "", phone: "" });

  useEffect(() => {
    if (resident) setMembers(resident.members || []);
  }, [resident]);

  if (!isOpen) return null;

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.phone)
      return showToast("Vui lòng nhập đủ thông tin", "error");
    try {
      const res = await fetch(`${API_URL}/users/${resident._id}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMember),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Thêm thành công!", "success");
        setNewMember({ name: "", phone: "" });
        loadResidents(); // Tải lại để cập nhật số lượng ở bảng ngoài
        setMembers(data.data.members); // Cập nhật danh sách tại chỗ
      } else showToast(data.message, "error");
    } catch (err) {
      showToast("Lỗi kết nối", "error");
    }
  };

  const handleRemove = async (mid) => {
    if (!window.confirm("Xóa thành viên này?")) return;
    try {
      const res = await fetch(
        `${API_URL}/users/${resident._id}/members/${mid}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.success) {
        showToast("Đã xóa", "success");
        loadResidents();
        setMembers(members.filter((m) => m._id !== mid));
      }
    } catch (err) {
      showToast("Lỗi kết nối", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl w-full max-w-[380px] shadow-2xl overflow-hidden relative animate-fadeIn border border-slate-100">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-slate-400 hover:text-red-500"
        >
          <HiXMark className="h-6 w-6" />
        </button>

        <div className="bg-indigo-600 p-4 text-white text-center">
          <h2 className="text-lg font-bold">Thành Viên Gia Đình</h2>
          <p className="text-[10px] opacity-80 uppercase tracking-widest">
            Căn hộ: {resident?.currentApartment?.code}
          </p>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 space-y-2">
            <h3 className="text-xs font-bold text-indigo-700 flex items-center gap-1">
              <HiUserPlus /> Thêm người mới
            </h3>
            <input
              value={newMember.name}
              onChange={(e) =>
                setNewMember({ ...newMember, name: e.target.value })
              }
              placeholder="Họ tên..."
              className="w-full p-2 text-sm border rounded-md"
            />
            <input
              value={newMember.phone}
              onChange={(e) =>
                setNewMember({ ...newMember, phone: e.target.value })
              }
              placeholder="Số điện thoại..."
              className="w-full p-2 text-sm border rounded-md"
            />
            <button
              onClick={handleAddMember}
              className="w-full py-2 bg-indigo-600 text-white rounded-md text-xs font-bold hover:bg-indigo-700 transition-colors"
            >
              Thêm vào hộ
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-tight">
              Danh sách ({members.length})
            </h3>
            {members.map((m) => (
              <div
                key={m._id}
                className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 group"
              >
                <div>
                  <p className="text-sm font-bold text-slate-800">{m.name}</p>
                  <p className="text-[11px] text-slate-500">{m.phone}</p>
                </div>
                <button
                  onClick={() => handleRemove(m._id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 transition-all"
                >
                  <HiTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-slate-50 border-t">
          <button
            onClick={onClose}
            className="w-full py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberModal;
