import { HiXMark } from "react-icons/hi2";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-800"
        >
          <HiXMark className="h-6 w-6" />
        </button>

        <div className="p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
          <p className="text-sm text-slate-600 mb-6">{message}</p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 rounded-lg text-slate-600 font-bold hover:bg-slate-200 transition-colors transform active:scale-95"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors transform active:scale-95"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;