/* frontend/src/components/Header.jsx */
import {
  HiBuildingOffice,
  HiUsers,
  HiCreditCard,
  HiChatBubbleLeftRight,
  HiCog,
  HiArrowLeftOnRectangle,
} from "react-icons/hi2";

const Header = ({ activeSection, onNavigate, onLogout }) => {
  const menuItems = [
    { id: "apartment", label: "Căn hộ", icon: <HiBuildingOffice /> },
    { id: "resident", label: "Cư dân", icon: <HiUsers /> },
    { id: "fee", label: "Thu phí", icon: <HiCreditCard /> },
    { id: "feedback", label: "Phản hồi", icon: <HiChatBubbleLeftRight /> },
    { id: "settings", label: "Cài đặt", icon: <HiCog /> },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo Area: Sử dụng thẻ img trống */}
        <div
          className="flex-shrink-0 cursor-pointer"
          onClick={() => onNavigate("apartment")}
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="h-20 w-auto object-contain rounded"
          />
        </div>

        <nav className="hidden md:flex space-x-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeSection === item.id
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-slate-600 hover:bg-indigo-50"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 font-bold hover:text-red-600 transition-all"
        >
          <HiArrowLeftOnRectangle /> Đăng xuất
        </button>
      </div>
    </header>
  );
};
export default Header;
