import { useState, useEffect } from "react";

const ApartmentModal = ({
  isOpen,
  onClose,
  isEditing,
  initialData,
  onSave,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    code: "",
    block: "",
    floor: "",
    area: "",
    status: "VACANT",
    ownerFullname: "",
    ownerEmail: "",
    ownerPhone: "",
    contractNumber: "",
    contractDuration: 12,
    contractDate: new Date().toISOString().split("T")[0],
  });

  // Load dữ liệu khi bấm nút Sửa
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        ...initialData,
        // Reset phần chủ hộ để nhập mới (hoặc map dữ liệu cũ nếu muốn)
        ownerFullname: "",
        ownerEmail: "",
        ownerPhone: "",
        contractNumber: "",
        contractDuration: 12,
        contractDate: new Date().toISOString().split("T")[0],
      });
    } else {
      // Reset form khi Thêm mới
      setFormData({
        code: "",
        block: "",
        floor: "",
        area: "",
        status: "VACANT",
        ownerFullname: "",
        ownerEmail: "",
        ownerPhone: "",
        contractNumber: "",
        contractDuration: 12,
        contractDate: new Date().toISOString().split("T")[0],
      });
    }
    setStep(1);
  }, [isOpen, isEditing, initialData]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = () => {
    if (!formData.code) return alert("⚠️ Vui lòng nhập Mã căn hộ!");
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? "✏️ Cập Nhật Căn Hộ" : "✨ Thêm Căn Hộ Mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Wizard Steps */}
        <div className="flex border-b">
          <div
            className={`flex-1 text-center py-3 font-semibold text-sm transition-colors ${step === 1 ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50" : "text-gray-400"}`}
          >
            1. Thông tin Phòng
          </div>
          <div
            className={`flex-1 text-center py-3 font-semibold text-sm transition-colors ${step === 2 ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50" : "text-gray-400"}`}
          >
            2. Chủ hộ & Hợp đồng
          </div>
        </div>

        {/* Body Form */}
        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} id="aptForm">
            {step === 1 ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã căn hộ
                  </label>
                  <input
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="VD: B505"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Block
                    </label>
                    <input
                      name="block"
                      value={formData.block}
                      onChange={handleChange}
                      placeholder="Block"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tầng
                    </label>
                    <input
                      name="floor"
                      value={formData.floor}
                      onChange={handleChange}
                      placeholder="Tầng"
                      type="number"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diện tích (m²)
                  </label>
                  <input
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="100"
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition cursor-pointer"
                  >
                    <option value="VACANT">Trống</option>
                    <option value="OCCUPIED">Đang ở</option>
                    <option value="MAINTENANCE">Bảo trì</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                  <h3 className="font-bold text-indigo-700 mb-3 flex items-center gap-2">
                    👤 Thông Tin Chủ Hộ
                  </h3>
                  <input
                    name="ownerFullname"
                    value={formData.ownerFullname}
                    onChange={handleChange}
                    placeholder="Họ và tên"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <input
                    name="ownerEmail"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    placeholder="Email đăng nhập"
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <input
                    name="ownerPhone"
                    value={formData.ownerPhone}
                    onChange={handleChange}
                    placeholder="Số điện thoại"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <h3 className="font-bold text-amber-700 mb-3 flex items-center gap-2">
                    📄 Hợp Đồng
                  </h3>
                  <div className="flex gap-3 mb-3">
                    <input
                      name="contractNumber"
                      value={formData.contractNumber}
                      onChange={handleChange}
                      placeholder="Số HĐ"
                      className="p-3 border border-gray-300 rounded-lg flex-1 focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                    <input
                      name="contractDuration"
                      value={formData.contractDuration}
                      onChange={handleChange}
                      placeholder="Tháng"
                      type="number"
                      className="p-3 border border-gray-300 rounded-lg w-24 text-center focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <input
                    name="contractDate"
                    value={formData.contractDate}
                    onChange={handleChange}
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-gray-50 flex gap-3">
          {step === 1 ? (
            <>
              <div className="flex-1"></div>
              {formData.status === "OCCUPIED" ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                >
                  Tiếp theo ➝
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-200"
                >
                  Lưu Căn Hộ
                </button>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-white text-gray-600 border border-gray-300 px-6 py-2.5 rounded-lg font-bold hover:bg-gray-50 transition"
              >
                ⬅ Quay lại
              </button>
              <button
                onClick={handleSubmit}
                className="bg-indigo-600 text-white flex-1 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
              >
                Lưu Tất Cả
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApartmentModal;
