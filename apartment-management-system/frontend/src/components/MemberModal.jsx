import { useState, useEffect } from "react";

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
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberPhone, setNewMemberPhone] = useState("");
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    if (resident) setMembers(resident.members || []);
  }, [resident]);

  if (!isOpen) return null;

  const handleAddMember = async () => {
    if (!newMemberName || !newMemberPhone)
      return showToast("Vui lòng nhập đầy đủ thông tin.", "warning");
    try {
      const res = await fetch(`${API_URL}/users/${resident._id}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newMemberName, phone: newMemberPhone }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Thêm thành viên thành công!", "success");
        setNewMemberName("");
        setNewMemberPhone("");
        loadResidents();
        onClose();
      }
    } catch (err) {
      showToast("Lỗi kết nối!", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100]">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          Thành viên hộ {resident?.currentApartment?.code}
        </h2>
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Họ và tên"
              className="border p-2 rounded w-full"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              className="border p-2 rounded w-full"
              value={newMemberPhone}
              onChange={(e) => setNewMemberPhone(e.target.value)}
            />
            <button
              onClick={handleAddMember}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Thêm
            </button>
          </div>
        </div>
        <button onClick={onClose} className="mt-4 text-gray-500">
          Đóng
        </button>
      </div>
    </div>
  );
};

export default MemberModal;
