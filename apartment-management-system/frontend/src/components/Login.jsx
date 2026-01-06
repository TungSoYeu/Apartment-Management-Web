import { useState } from "react";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:3000/api/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("❌ Không thể kết nối đến Server");
    }
  };

  return (
    /* Lớp nền trong suốt kèm hiệu ứng mờ để Card đăng nhập nổi bật trên bg.jpg */
    <div className="fixed inset-0 flex justify-center items-center bg-slate-900/20 backdrop-blur-sm p-4">
      <div className="bg-white/95 p-8 rounded-2xl shadow-2xl w-full max-w-[380px] border border-white/20 animate-fadeIn">
        {/* Đổi tiêu đề thành Đăng nhập */}
        <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-700 tracking-tight">
          Đăng nhập
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">
              Email
            </label>
            <input
              className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 text-sm transition-all"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">
              Mật khẩu
            </label>
            <input
              className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 text-sm transition-all"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button className="bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 mt-2 active:scale-[0.98]">
            Vào hệ thống
          </button>
        </form>

        {error && (
          <div className="text-red-600 mt-5 text-center text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-100 animate-pulse">
            {error}
          </div>
        )}

        <p className="text-center text-slate-400 text-[11px] mt-8">
          Hệ thống Quản lý Chung cư Blue Moon
        </p>
      </div>
    </div>
  );
};

export default Login;
