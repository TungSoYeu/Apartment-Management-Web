const Header = ({ activeSection, onNavigate, onLogout, userRole }) => {
  const menuItems = [
    { id: "apartment", label: "Căn hộ" },
    { id: "resident", label: "Cư dân" }, // Mục mới
    { id: "fee", label: "Thu phí" },
    { id: "feedback", label: "Phản hồi" },
    { id: "settings", label: "Cài đặt" }, // Mục mới
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Area */}
          <div
            className="flex-shrink-0 flex items-center cursor-pointer"
            onClick={() => onNavigate("apartment")}
          >
            {/* Bạn có thể thay thẻ img vào đây nếu có logo ảnh */}
            <div className="bg-indigo-600 text-white font-bold text-xl px-3 py-1 rounded uppercase tracking-wider">
              KTPM ADMIN
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="ml-4 px-4 py-2 border border-red-500 text-red-500 rounded text-sm font-bold hover:bg-red-50 transition"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
