import {
  HiCheckCircle,
  HiXCircle,
  HiInformationCircle,
  HiXMark,
} from "react-icons/hi2";
import { useEffect } from "react"; // Ensure useEffect is imported

const Alert = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) { // Only set timer if there's a message to display
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const alertStyles = {
    success: {
      bgColor: "bg-green-100",
      borderColor: "border-green-400",
      textColor: "text-green-700",
      icon: <HiCheckCircle className="h-5 w-5 text-green-500" />,
    },
    error: {
      bgColor: "bg-red-100",
      borderColor: "border-red-400",
      textColor: "text-red-700",
      icon: <HiXCircle className="h-5 w-5 text-red-500" />,
    },
    info: {
      bgColor: "bg-indigo-100",
      borderColor: "border-indigo-400",
      textColor: "text-indigo-700",
      icon: <HiInformationCircle className="h-5 w-5 text-indigo-500" />,
    },
  };

  const style = alertStyles[type] || alertStyles.info;

  return (
    <div
      className={`rounded-md ${style.bgColor} p-4 border ${style.borderColor} mb-6`}
    >
      <div className="flex">
        <div className="flex-shrink-0">{style.icon}</div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${style.textColor}`}>{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={onClose}
              type="button"
              className={`inline-flex rounded-md ${style.bgColor} p-1.5 ${style.textColor} hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50`}
            >
              <span className="sr-only">Đóng</span>
              <HiXMark className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
