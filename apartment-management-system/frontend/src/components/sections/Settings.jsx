import { useState } from "react";
import { HiCog, HiLockClosed } from "react-icons/hi2";

const Settings = ({ token, showToast }) => {
  const API_URL = "http://127.0.0.1:3000/api/v1";
  const [passData, setPassData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  // Xử lý khi nhập liệu
  const handleChange = (e) => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
  };

  // Xử lý đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validate cơ bản
    if (passData.newPassword.length < 6) {
      return showToast("Mật khẩu mới phải có ít nhất 6 ký tự!", "error");
    }
    if (passData.newPassword !== passData.confirmPassword) {
      return showToast("Mật khẩu xác nhận không khớp!", "error");
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: passData.oldPassword,
          newPassword: passData.newPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        showToast("Đổi mật khẩu thành công!", "success");
        // Reset form
        setPassData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        showToast(data.message || "Mật khẩu cũ không đúng", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Lỗi kết nối Server", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl mx-auto animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 uppercase tracking-wide border-b pb-2 flex items-center gap-2">
        <HiCog /> Cài Đặt Hệ Thống
      </h2>

      <div className="space-y-8">
        {/* Form Đổi Mật Khẩu */}
        <div>
          <h3 className="text-lg font-bold text-indigo-700 mb-4 flex items-center gap-2">
            <HiLockClosed /> Đổi Mật Khẩu
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                name="oldPassword"
                value={passData.oldPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu cũ..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Mật khẩu mới
              </label>
              <input
                type="password"
                name="newPassword"
                value={passData.newPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu mới (min 6 ký tự)..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu mới..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition duration-200 
                    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"}
                  `}
            >
              {loading ? "Đang xử lý..." : "Cập Nhật Mật Khẩu"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
