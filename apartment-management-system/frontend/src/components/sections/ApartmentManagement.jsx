import { useState, useEffect } from "react";
import {
  HiBuildingOffice2,
  HiTrash,
  HiPencil,
  HiPlus,
} from "react-icons/hi2";
import ApartmentModal from "../ApartmentModal";

const ApartmentManagement = ({ token, userRole, showToast }) => {
  const API_URL = "http://127.0.0.1:3000/api/v1";
  const [apartments, setApartments] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApt, setEditingApt] = useState(null);

  useEffect(() => {
    loadApartments();
  }, []);

  const loadApartments = async () => {
    try {
      const res = await fetch(`${API_URL}/apartments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setApartments(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, code) => {
    if (!confirm(`Xóa căn hộ ${code}?`)) return;
    try {
      await fetch(`${API_URL}/apartments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      loadApartments();
      showToast("Đã xóa thành công", "success");
    } catch (err) {
      showToast("Lỗi khi xóa", "error");
    }
  };

  const handleSave = async (formData) => {
    const payload = {
      code: formData.code,
      block: formData.block,
      floor: formData.floor,
      area: formData.area,
      status: formData.status,
    };
    if (formData.status === "OCCUPIED" && formData.ownerEmail) {
      payload.ownerInfo = {
        fullname: formData.ownerFullname,
        identityCard: formData.ownerIdentityCard,
        email: formData.ownerEmail,
        phone: formData.ownerPhone,
        password: "123456",
      };
      payload.contractInfo = {
        number: formData.contractNumber,
        startDate: formData.contractDate,
        duration: formData.contractDuration,
      };
    }
    const url = editingApt
      ? `${API_URL}/apartments/${editingApt._id}`
      : `${API_URL}/apartments`;
    try {
      const res = await fetch(url, {
        method: editingApt ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Lưu thành công!", "success");
        setIsModalOpen(false);
        loadApartments();
      } else showToast(data.message, "error");
    } catch (e) {
      showToast("Lỗi kết nối", "error");
    }
  };

  const filteredApts = apartments.filter(
    (apt) =>
      (apt.code.toLowerCase().includes(filterText.toLowerCase()) ||
        apt.owner?.fullname.toLowerCase().includes(filterText.toLowerCase())) &&
      (filterStatus === "" || apt.status === filterStatus),
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
          <HiBuildingOffice2 /> Danh Sách Căn Hộ
        </h2>
        {userRole === "ADMIN" && (
          <button
            onClick={() => {
              setEditingApt(null);
              setIsModalOpen(true);
            }}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-600 shadow flex items-center gap-2"
          >
            <HiPlus /> Thêm Căn Hộ
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4 flex-wrap">
        <input
          className="flex-1 p-2 border rounded"
          placeholder="🔍 Tìm mã phòng, tên chủ..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <select
          className="flex-1 p-2 border rounded"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="OCCUPIED">Đã có người</option>
          <option value="VACANT">Phòng trống</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredApts.map((apt) => (
          <div
            key={apt._id}
            className={`bg-white rounded-xl p-5 shadow border-l-4 ${apt.status === "OCCUPIED" ? "border-emerald-500" : "border-gray-400"} hover:-translate-y-1 transition`}
          >
            <div className="flex justify-between mb-2">
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${apt.status === "OCCUPIED" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100"}`}
              >
                {apt.status === "OCCUPIED" ? "Đã có người" : "Trống"}
              </span>
              {userRole === "ADMIN" && (
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditingApt(apt);
                      setIsModalOpen(true);
                    }}
                    className="bg-amber-100 text-amber-600 p-1 rounded hover:bg-amber-200"
                  >
                    <HiPencil />
                  </button>
                  <button
                    onClick={() => handleDelete(apt._id, apt.code)}
                    className="bg-red-100 text-red-600 p-1 rounded hover:bg-red-200"
                  >
                    <HiTrash />
                  </button>
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold text-indigo-600">{apt.code}</h3>
            <div className="text-sm text-gray-500 mt-2 space-y-1">
              <p className="flex justify-between border-b border-dashed pb-1">
                <span>Vị trí:</span>{" "}
                <b>
                  {apt.block} - T{apt.floor}
                </b>
              </p>
              <p className="flex justify-between border-b border-dashed pb-1">
                <span>Diện tích:</span> <b>{apt.area} m²</b>
              </p>
              <p className="flex justify-between items-center">
                <span>Chủ hộ:</span>{" "}
                <span className="text-indigo-600 font-bold">
                  {apt.owner ? apt.owner.fullname : "---"}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <ApartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditing={!!editingApt}
        initialData={editingApt}
        onSave={handleSave}
      />
    </div>
  );
};
export default ApartmentManagement;
