const BillModal = ({ isOpen, onClose, bill }) => {
  if (!isOpen || !bill) return null;

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-black text-2xl"
        >
          &times;
        </button>

        <div className="bg-indigo-600 p-4 text-white text-center">
          <h2 className="text-xl font-bold">Thanh Toán Hóa Đơn</h2>
        </div>

        <div className="p-6 space-y-3 text-sm">
          <p className="flex justify-between border-b pb-2">
            <span>Căn hộ:</span> <strong>{bill.apartmentSnapshot.code}</strong>
          </p>
          <p className="flex justify-between border-b pb-2">
            <span>Chủ hộ:</span>{" "}
            <strong>{bill.apartmentSnapshot.ownerName}</strong>
          </p>

          {/* Dịch vụ cơ bản */}
          {bill.services.map((svc, idx) => (
            <p key={idx} className="flex justify-between text-gray-600">
              <span>{svc.name}:</span> <span>{formatMoney(svc.amount)}</span>
            </p>
          ))}

          {/* Điện Nước */}
          <div className="bg-gray-50 p-2 rounded">
            <p className="flex justify-between">
              <span>⚡ Điện ({bill.electricity.usage} kWh):</span>{" "}
              <span>{formatMoney(bill.electricity.amount)}</span>
            </p>
            <p className="flex justify-between">
              <span>💧 Nước ({bill.water.usage} m³):</span>{" "}
              <span>{formatMoney(bill.water.amount)}</span>
            </p>
          </div>

          {/* Phụ phí */}
          {bill.additionalCharges?.map((ch, idx) => (
            <p key={idx} className="flex justify-between text-amber-600">
              <span>{ch.name}:</span> <span>{formatMoney(ch.amount)}</span>
            </p>
          ))}

          <div className="border-t pt-2 mt-2">
            <p className="flex justify-between text-lg font-bold text-indigo-700">
              <span>Tổng cộng:</span>{" "}
              <span>{formatMoney(bill.totalAmount)}</span>
            </p>
            <p className="text-right text-xs text-red-500 mt-1">
              Hạn chót: {new Date(bill.deadline).toLocaleDateString()}
            </p>
          </div>

          <div className="flex justify-center mt-4">
            <img
              src={bill.qrCode}
              alt="QR Code"
              className="w-48 h-48 object-contain border rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillModal;
