import { useState } from "react";
import Login from "./components/Login";
import Header from "./components/Header"; // Import Header mới
import ApartmentManagement from "./components/sections/ApartmentManagement";
import FeeManagement from "./components/sections/FeeManagement";
import FeedbackManagement from "./components/sections/FeedbackManagement";
import ResidentManagement from "./components/sections/ResidentManagement"; // Import mục Cư dân
import Settings from "./components/sections/Settings"; // Import mục Cài đặt
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
    setToken(null);
    setRole(null);
    window.location.reload();
  };

  const showToast = (message, type = "info") => setToast({ message, type });

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
      case "resident":
        return <ResidentManagement token={token} showToast={showToast} />; // Render mục Cư dân
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
      case "settings":
        return <Settings token={token} showToast={showToast} />; // Render mục Cài đặt
      default:
        return null;
    }
  };

  if (!token)
    return (
      <div className="app-overlay flex items-center justify-center">
        <Login onLogin={handleLogin} showToast={showToast} />
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    );

  return (
    <div className="app-overlay min-h-screen text-gray-800 font-sans">
      {/* Sử dụng Header mới */}
      <Header
        activeSection={activeSection}
        onNavigate={setActiveSection}
        onLogout={handleLogout}
        userRole={role}
      />

      <main className="max-w-7xl mx-auto p-6">{renderSection()}</main>

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
