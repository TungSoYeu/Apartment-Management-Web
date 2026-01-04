import { useState } from "react";
import Login from "./components/Login";
import Header from "./components/Header"; // Import Header mới
import ApartmentManagement from "./components/sections/ApartmentManagement";
import FeeManagement from "./components/sections/FeeManagement";
import FeedbackManagement from "./components/sections/FeedbackManagement";
import ResidentManagement from "./components/sections/ResidentManagement"; // Import mục Cư dân
import Settings from "./components/sections/Settings"; // Import mục Cài đặt
import Alert from "./components/Alert";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));

  const [activeSection, setActiveSection] = useState("apartment");
  const [alert, setAlert] = useState(null);

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

  const showAlert = (message, type = "info") => setAlert({ message, type });

  const renderSection = () => {
    switch (activeSection) {
      case "apartment":
        return (
          <ApartmentManagement
            token={token}
            userRole={role}
            showToast={showAlert}
          />
        );
      case "resident":
        return <ResidentManagement token={token} showToast={showAlert} />; // Render mục Cư dân
      case "fee":
        return (
          <FeeManagement token={token} userRole={role} showToast={showAlert} />
        );
      case "feedback":
        return (
          <FeedbackManagement
            token={token}
            userRole={role}
            currentUserId={userId}
            showToast={showAlert}
          />
        );
      case "settings":
        return <Settings token={token} showToast={showAlert} />; // Render mục Cài đặt
      default:
        return null;
    }
  };

  if (!token)
    return (
      <div className="app-overlay flex items-center justify-center">
        <Login onLogin={handleLogin} showToast={showAlert} />
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
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

      <main className="max-w-7xl mx-auto p-6">
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}
        {renderSection()}
      </main>
    </div>
  );
}

export default App;
