import { useState, useEffect } from "react";
import Login from "./components/Login";
import ApartmentManagement from "./components/sections/ApartmentManagement";
import FeeManagement from "./components/sections/FeeManagement";
import FeedbackManagement from "./components/sections/FeedbackManagement";
import Toast from "./components/Toast";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));

  const [activeSection, setActiveSection] = useState("apartment");
  const [toast, setToast] = useState(null);

  const handleLogin = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("userId", data.user._id);
    setToken(data.token);
    setRole(data.user.role);
    setUserId(data.user._id);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const showToast = (message, type = "info") => setToast({ message, type });

  // Render Component dựa trên Menu đang chọn
  const renderSection = () => {
    switch (activeSection) {
      case "apartment":
        return (
          <ApartmentManagement
            token={token}
            userRole={role}
            showToast={showToast}
          />
        );
      case "fee":
        return (
          <FeeManagement token={token} userRole={role} showToast={showToast} />
        );
      case "feedback":
        return (
          <FeedbackManagement
            token={token}
            userRole={role}
            currentUserId={userId}
            showToast={showToast}
          />
        );
      default:
        return null;
    }
  };

  if (!token)
    return (
      <>
        <Login onLogin={handleLogin} showToast={showToast} />
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </>
    );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans p-6">
      <div className="max-w-7xl mx-auto">
        {/* Menu Chính */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex justify-between items-center">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveSection("apartment")}
              className={`px-5 py-2.5 rounded-lg font-bold transition ${activeSection === "apartment" ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
            >
              🏢 Cư Dân
            </button>
            <button
              onClick={() => setActiveSection("fee")}
              className={`px-5 py-2.5 rounded-lg font-bold transition ${activeSection === "fee" ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
            >
              💰 Thu Phí
            </button>
            <button
              onClick={() => setActiveSection("feedback")}
              className={`px-5 py-2.5 rounded-lg font-bold transition ${activeSection === "feedback" ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
            >
              💬 Phản Hồi
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-500 font-bold px-4 py-2 hover:bg-red-50 rounded-lg"
          >
            Thoát
          </button>
        </div>

        {/* Nội dung chính */}
        {renderSection()}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
