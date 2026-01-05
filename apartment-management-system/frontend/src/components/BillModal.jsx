const BillModal = ({ isOpen, onClose, bill }) => {
  if (!isOpen || !bill) return null;

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-4">
      <div className="bg-white rounded-xl w-full max-w-[350px] shadow-2xl overflow-hidden relative animate-fadeIn border border-slate-200">
        {/* Nút đóng góc phải */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-white/70 hover:text-white text-xl z-10"
        >
          &times;
        </button>

        <div className="bg-indigo-600 p-3 text-white text-center">
          <h2 className="text-lg font-bold uppercase tracking-tight">
            Chi Tiết Hóa Đơn
          </h2>
          <p className="text-[10px] opacity-80">
            Căn hộ: {bill.apartmentSnapshot.code}
          </p>
        </div>

        <div className="p-4 space-y-3 text-[13px] max-h-[70vh] overflow-y-auto">
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500">Chủ hộ:</span>
            <strong className="text-slate-800">
              {bill.apartmentSnapshot.ownerName}
            </strong>
          </div>

          {/* Dịch vụ */}
          <div className="space-y-1.5">
            {bill.services.map((svc, idx) => (
              <p key={idx} className="flex justify-between text-slate-600">
                <span>{svc.name}:</span> <span>{formatMoney(svc.amount)}</span>
              </p>
            ))}
          </div>

          {/* Điện Nước */}
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
            <p className="flex justify-between text-[12px]">
              <span className="text-amber-700 font-medium">
                ⚡ Điện ({bill.electricity.usage} kWh):
              </span>
              <span className="font-mono">
                {formatMoney(bill.electricity.amount)}
              </span>
            </p>
            <p className="flex justify-between text-[12px]">
              <span className="text-blue-700 font-medium">
                💧 Nước ({bill.water.usage} m³):
              </span>
              <span className="font-mono">
                {formatMoney(bill.water.amount)}
              </span>
            </p>
          </div>

          <div className="border-t pt-2 mt-2">
            <p className="flex justify-between text-lg font-extrabold text-indigo-700">
              <span>Tổng cộng:</span>
              <span>{formatMoney(bill.totalAmount)}</span>
            </p>
            <p className="text-right text-[10px] text-red-500 font-bold mt-1">
              Hạn chót: {new Date(bill.deadline).toLocaleDateString("vi-VN")}
            </p>
          </div>

          <div className="flex flex-col items-center pt-2">
            <img
              src="/QR.jpg"
              alt="QR Code"
              className="w-32 h-32 object-contain border rounded-lg p-1 bg-white"
            />
            <p className="text-[9px] text-slate-400 mt-1 italic uppercase">
              Quét mã thanh toán nhanh
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border-t">
          <button
            onClick={onClose}
            className="w-full py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillModal;
