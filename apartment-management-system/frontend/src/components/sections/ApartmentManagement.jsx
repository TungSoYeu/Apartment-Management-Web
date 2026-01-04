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
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-3">
          <HiBuildingOffice2 className="text-indigo-600" />
          Danh Sách Căn Hộ
        </h2>
        {userRole === "ADMIN" && (
          <button
            onClick={() => {
              setEditingApt(null);
              setIsModalOpen(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <HiPlus /> Thêm Căn Hộ
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex gap-4 flex-wrap">
        <input
          className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          placeholder="🔍 Tìm mã phòng, tên chủ..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <select
          className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="OCCUPIED">Đã có người</option>
          <option value="VACANT">Phòng trống</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredApts.map((apt) => (
          <div
            key={apt._id}
            className={`bg-white rounded-lg p-5 shadow-md border-l-4 ${apt.status === "OCCUPIED" ? "border-green-500" : "border-slate-400"} transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-indigo-500`}
          >
            <div className="flex justify-between items-center mb-3">
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${apt.status === "OCCUPIED" ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"}`}
              >
                {apt.status === "OCCUPIED" ? "Đã có người" : "Trống"}
              </span>
              {userRole === "ADMIN" && (
                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      setEditingApt(apt);
                      setIsModalOpen(true);
                    }}
                    className="bg-amber-100 text-amber-700 p-1.5 rounded-md hover:bg-amber-200 transition-all duration-200 transform hover:scale-110 active:scale-90"
                  >
                    <HiPencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(apt._id, apt.code)}
                    className="bg-red-100 text-red-700 p-1.5 rounded-md hover:bg-red-200 transition-all duration-200 transform hover:scale-110 active:scale-90"
                  >
                    <HiTrash className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{apt.code}</h3>
            <div className="text-sm text-slate-600 mt-3 space-y-2">
              <p className="flex justify-between border-b border-dashed pb-1.5">
                <span className="text-slate-500">Vị trí:</span>{" "}
                <b className="text-slate-700">
                  {apt.block} - T{apt.floor}
                </b>
              </p>
              <p className="flex justify-between border-b border-dashed pb-1.5">
                <span className="text-slate-500">Diện tích:</span> <b className="text-slate-700">{apt.area} m²</b>
              </p>
              <p className="flex justify-between items-center">
                <span className="text-slate-500">Chủ hộ:</span>{" "}
                <span className="text-indigo-700 font-bold">
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
