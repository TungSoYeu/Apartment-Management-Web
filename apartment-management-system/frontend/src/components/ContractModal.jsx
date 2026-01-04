const ContractModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const { contract, owner, code } = data;

  const formatDate = (dateString) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Tính ngày hết hạn
  const startDate = new Date(contract?.startDate || Date.now());
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + (contract?.duration || 12));

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-black text-2xl"
        >
          &times;
        </button>

        <div className="bg-indigo-600 p-4 text-white text-center">
          <h2 className="text-xl font-bold uppercase tracking-wide">
            Hợp Đồng Thuê Căn Hộ
          </h2>
          <p className="text-indigo-100 text-sm mt-1">
            Mã căn: <strong>{code}</strong>
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Thông tin 2 bên */}
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                Bên Thuê (Cư Dân)
              </p>
              <p className="text-lg font-bold text-gray-800">
                {owner?.fullname}
              </p>
              <p className="text-sm text-gray-600 font-mono">
                CCCD: {owner?.identityCard || "---"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                Số Hợp Đồng
              </p>
              <p className="text-lg font-bold text-indigo-700 font-mono">
                {contract?.number || "---"}
              </p>
            </div>
          </div>

          {/* Chi tiết thời hạn */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">
                Ngày ký
              </p>
              <p className="font-medium text-gray-800">
                {formatDate(contract?.startDate)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">
                Thời hạn
              </p>
              <p className="font-medium text-gray-800">
                {contract?.duration || 12} tháng
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">
                Ngày hết hạn
              </p>
              <p className="font-bold text-indigo-600">{formatDate(endDate)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">
                Trạng thái
              </p>
              <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded font-bold">
                Đang hiệu lực
              </span>
            </div>
          </div>

          {/* Điều khoản */}
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
              Điều khoản / Ghi chú
            </p>
            <div className="bg-white border border-gray-200 p-3 rounded-lg text-sm text-gray-600 h-24 overflow-y-auto italic">
              {contract?.terms || "Không có ghi chú bổ sung."}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractModal;
