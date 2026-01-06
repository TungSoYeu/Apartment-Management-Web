/* frontend/src/components/ApartmentModal.jsx */
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
    }
  }, [isOpen, isEditing, initialData]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl w-full max-w-[420px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-fadeIn">
        <div className="bg-slate-50 p-3 border-b flex justify-between items-center font-bold">
          <h2>{isEditing ? "✏️ Sửa Căn Hộ & HĐ" : "✨ Thêm Căn Hộ & HĐ"}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="flex border-b text-[11px] font-bold bg-slate-50/50">
          <div
            className={`flex-1 py-2 text-center ${step === 1 ? "text-indigo-600 border-b-2 border-indigo-600 bg-white" : "text-slate-400"}`}
            onClick={() => setStep(1)}
          >
            1. Phòng
          </div>
          <div
            className={`flex-1 py-2 text-center ${step === 2 ? "text-indigo-600 border-b-2 border-indigo-600 bg-white" : "text-slate-400"}`}
            onClick={() => setStep(2)}
          >
            2. Chủ hộ & Hợp đồng
          </div>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {step === 1 ? (
            <div className="space-y-3">
              <input
                placeholder="Mã căn hộ"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Khu"
                  value={formData.block}
                  onChange={(e) =>
                    setFormData({ ...formData, block: e.target.value })
                  }
                  className="p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Diện tích"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                  className="p-2 border rounded"
                />
              </div>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full p-2 border rounded"
              >
                <option value="VACANT">Còn trống</option>
                <option value="OCCUPIED">Đang ở</option>
              </select>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-indigo-50/50 p-3 rounded border border-indigo-100 space-y-2">
                <input
                  placeholder="Họ tên chủ hộ"
                  value={formData.ownerFullname}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerFullname: e.target.value })
                  }
                  className="w-full p-2 text-sm border rounded"
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
                  className="w-full p-2 text-sm border rounded"
                />
                <input
                  placeholder="Số điện thoại"
                  value={formData.ownerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerPhone: e.target.value })
                  }
                  className="w-full p-2 text-sm border rounded"
                />
                <input
                  placeholder="Email"
                  value={formData.ownerEmail}
                  disabled={isEditing}
                  className="w-full p-2 text-sm border rounded bg-slate-100"
                />
              </div>
              <div className="bg-amber-50/50 p-3 rounded border border-amber-100 space-y-2">
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
                    className="p-2 text-sm border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Thời hạn (tháng)"
                    value={formData.contractDuration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contractDuration: e.target.value,
                      })
                    }
                    className="p-2 text-sm border rounded"
                  />
                </div>
                <textarea
                  placeholder="Ghi chú điều khoản..."
                  value={formData.contractTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, contractTerms: e.target.value })
                  }
                  className="w-full p-2 text-sm border rounded"
                  rows="2"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-50 border-t flex gap-2">
          {step === 1 ? (
            <button
              type="button"
              onClick={() => setStep(2)}
              className="ml-auto bg-indigo-600 text-white px-6 py-2 rounded font-bold"
            >
              Kế tiếp
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-white border px-4 py-2 rounded font-bold"
              >
                Quay lại
              </button>
              <button
                onClick={() => onSave(formData)}
                className="flex-1 bg-indigo-600 text-white py-2 rounded font-bold"
              >
                Lưu dữ liệu
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default ApartmentModal;
