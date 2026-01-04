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

  const handleChange = (e) => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

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
    <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 max-w-2xl mx-auto animate-fadeIn">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b-2 border-slate-100 pb-4 flex items-center gap-3">
        <HiCog className="text-indigo-600" /> Cài Đặt Hệ Thống
      </h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
            <HiLockClosed className="text-slate-400" /> Đổi Mật Khẩu
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                name="oldPassword"
                value={passData.oldPassword}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">
                Mật khẩu mới
              </label>
              <input
                type="password"
                name="newPassword"
                value={passData.newPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu mới (min 6 ký tự)..."
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">
                Xác nhận mật khẩu mới
              </label>
              <input
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-2 rounded-lg font-bold text-white shadow-lg transition-all duration-200 transform
                    ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-105 active:scale-95"}
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
