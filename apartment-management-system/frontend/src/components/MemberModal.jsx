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
    if (resident) {
      setMembers(resident.members || []);
    }
  }, [resident]);

  if (!isOpen) return null;

  const handleAddMember = async () => {
    if (!newMemberName || !newMemberPhone) {
      showToast("Vui lòng nhập đầy đủ thông tin.", "warning");
      return;
    }
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
        loadResidents(); // Tải lại danh sách cư dân để cập nhật
        onClose();
      } else {
        showToast(data.message, "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối!", "error");
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Bạn có chắc muốn xóa thành viên này?")) return;
    try {
      const res = await fetch(
        `${API_URL}/users/${resident._id}/members/${memberId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.success) {
        showToast("Xóa thành viên thành công!", "success");
        loadResidents();
        onClose();
      } else {
        showToast(data.message, "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối!", "error");
    }
  };

  const handleUpdateMember = async () => {
    if (!editingMember) return;
    try {
      const res = await fetch(
        `${API_URL}/users/${resident._id}/members/${editingMember._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editingMember.name,
            phone: editingMember.phone,
          }),
        },
      );
      const data = await res.json();
      if (data.success) {
        showToast("Cập nhật thành công!", "success");
        setEditingMember(null);
        loadResidents();
        onClose();
      } else {
        showToast(data.message, "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối!", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          Thành viên hộ {resident?.currentApartment?.code}
        </h2>

        {/* Form thêm mới */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Thêm thành viên mới</h3>
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

        {/* Danh sách thành viên */}
        <div>
          <h3 className="font-semibold mb-2">Danh sách thành viên</h3>
          {members.length > 0 ? (
            <ul className="space-y-2">
              {members.map((member) => (
                <li
                  key={member._id}
                  className="flex justify-between items-center"
                >
                  {editingMember?._id === member._id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingMember.name}
                        onChange={(e) =>
                          setEditingMember({
                            ...editingMember,
                            name: e.target.value,
                          })
                        }
                        className="border p-2 rounded"
                      />
                      <input
                        type="text"
                        value={editingMember.phone}
                        onChange={(e) =>
                          setEditingMember({
                            ...editingMember,
                            phone: e.target.value,
                          })
                        }
                        className="border p-2 rounded"
                      />
                    </div>
                  ) : (
                    <span>
                      {member.name} - {member.phone}
                    </span>
                  )}

                  <div className="flex gap-2">
                    {editingMember?._id === member._id ? (
                      <button
                        onClick={handleUpdateMember}
                        className="text-green-500"
                      >
                        Lưu
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingMember(member)}
                        className="text-blue-500"
                      >
                        Sửa
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      className="text-red-500"
                    >
                      Xóa
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Chưa có thành viên nào.</p>
          )}
        </div>

        <button onClick={onClose} className="mt-4 text-gray-500">
          Đóng
        </button>
      </div>
    </div>
  );
};

export default MemberModal;
