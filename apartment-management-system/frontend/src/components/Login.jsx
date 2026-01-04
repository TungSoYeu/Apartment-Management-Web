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
        onLogin(data); // Truyền cả object data (chứa token, user)
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("❌ Không thể kết nối đến Server");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">
          Cổng Quản Trị
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
          />
          <button className="bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
            Đăng Nhập
          </button>
        </form>
        {error && (
          <p className="text-red-500 mt-4 text-center text-sm bg-red-50 p-2 rounded">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
