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
    ownerIdentityCard: "",
    contractNumber: "",
    contractDuration: 12,
    contractDate: new Date().toISOString().split("T")[0],
    contractTerms: "Thuê dài hạn",
  });

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        ...initialData,
        ownerFullname: initialData.owner?.fullname || "",
        ownerEmail: initialData.owner?.email || "",
        ownerPhone: initialData.owner?.phone || "",
        ownerIdentityCard: initialData.owner?.identityCard || "",
        contractNumber: initialData.contract?.number || "",
        contractDuration: initialData.contract?.duration || 12,
        contractTerms: initialData.contract?.terms || "Thuê dài hạn",
        contractDate: initialData.contract?.startDate
          ? new Date(initialData.contract.startDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    } else {
      setFormData({
        code: "",
        block: "",
        floor: "",
        area: "",
        status: "VACANT",
        ownerFullname: "",
        ownerEmail: "",
        ownerPhone: "",
        ownerIdentityCard: "",
        contractNumber: "",
        contractDuration: 12,
        contractTerms: "Thuê dài hạn",
        contractDate: new Date().toISOString().split("T")[0],
      });
    }
    setStep(1);
  }, [isOpen, isEditing, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-4">
      <div className="bg-white rounded-xl w-full max-w-[420px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-200 animate-fadeIn text-slate-900">
        <div className="bg-slate-50 p-3 border-b flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-800">
            {isEditing ? "✏️ Sửa Căn Hộ & HĐ" : "✨ Thêm Căn Hộ & HĐ"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 text-xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Chỉ hiện Wizard nếu trạng thái là OCCUPIED */}
        {formData.status === "OCCUPIED" && (
          <div className="flex border-b text-[11px] font-bold bg-slate-50/50">
            <div
              className={`flex-1 text-center py-2 ${step === 1 ? "text-indigo-600 border-b-2 border-indigo-600 bg-white" : "text-slate-400 cursor-pointer"}`}
              onClick={() => setStep(1)}
            >
              1. Phòng
            </div>
            <div
              className={`flex-1 text-center py-2 ${step === 2 ? "text-indigo-600 border-b-2 border-indigo-600 bg-white" : "text-slate-400 cursor-pointer"}`}
              onClick={() => setStep(2)}
            >
              2. Chủ hộ & HĐ
            </div>
          </div>
        )}

        <div className="p-5 overflow-y-auto space-y-4">
          {step === 1 ? (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Mã căn hộ
                </label>
                <input
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="VD: A101"
                  className="w-full p-2 border rounded-md text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Khu / Block
                  </label>
                  <input
                    value={formData.block}
                    onChange={(e) =>
                      setFormData({ ...formData, block: e.target.value })
                    }
                    placeholder="Khu"
                    className="w-full p-2 border rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Số Tầng
                  </label>
                  <input
                    type="number"
                    value={formData.floor}
                    onChange={(e) =>
                      setFormData({ ...formData, floor: e.target.value })
                    }
                    placeholder="Tầng"
                    className="w-full p-2 border rounded-md text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Diện tích (m²)
                </label>
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                  placeholder="m2"
                  className="w-full p-2 border rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Trạng thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value,
                      step: 1,
                    })
                  }
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="VACANT">Còn trống</option>
                  <option value="OCCUPIED">Đang ở</option>
                  <option value="MAINTENANCE">Bảo trì</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 space-y-2">
                <h3 className="font-bold text-indigo-700 text-xs mb-1">
                  👤 Thông Tin Chủ Hộ
                </h3>
                <input
                  placeholder="Họ và tên"
                  value={formData.ownerFullname}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerFullname: e.target.value })
                  }
                  className="w-full p-2 border rounded-md text-sm"
                />
                <input
                  placeholder="Số CCCD"
                  value={formData.ownerIdentityCard}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ownerIdentityCard: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-md text-sm"
                />
                <input
                  placeholder="Số điện thoại"
                  value={formData.ownerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerPhone: e.target.value })
                  }
                  className="w-full p-2 border rounded-md text-sm"
                />
                <input
                  placeholder="Email"
                  type="email"
                  value={formData.ownerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerEmail: e.target.value })
                  }
                  className="w-full p-2 border rounded-md text-sm bg-slate-50"
                  disabled={isEditing}
                />
              </div>

              <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100 space-y-2">
                <h3 className="font-bold text-amber-700 text-xs mb-1">
                  📄 Chi Tiết Hợp Đồng
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="Số HĐ"
                    value={formData.contractNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contractNumber: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-md text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Tháng"
                    value={formData.contractDuration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contractDuration: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-md text-sm"
                  />
                </div>
                <input
                  type="date"
                  value={formData.contractDate}
                  onChange={(e) =>
                    setFormData({ ...formData, contractDate: e.target.value })
                  }
                  className="w-full p-2 border rounded-md text-sm"
                />
                <textarea
                  placeholder="Ghi chú / Điều khoản..."
                  value={formData.contractTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, contractTerms: e.target.value })
                  }
                  className="w-full p-2 border rounded-md text-sm"
                  rows="2"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t bg-slate-50 flex gap-2">
          {/* Logic Nút Bấm Thông Minh */}
          {formData.status === "OCCUPIED" ? (
            step === 1 ? (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="ml-auto bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-indigo-700 transition-all"
              >
                Kế tiếp ➝
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-white text-slate-600 border border-slate-300 px-4 py-2 rounded-md text-sm font-bold"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-md text-sm font-bold hover:bg-indigo-700 shadow-md"
                >
                  Lưu dữ liệu
                </button>
              </>
            )
          ) : (
            <button
              onClick={handleSubmit}
              className="w-full bg-emerald-600 text-white py-2 rounded-md text-sm font-bold hover:bg-emerald-700 shadow-md"
            >
              Lưu căn hộ
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApartmentModal;
