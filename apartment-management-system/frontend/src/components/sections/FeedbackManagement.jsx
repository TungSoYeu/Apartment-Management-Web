import { useState, useEffect } from "react";

const FeedbackManagement = ({ token, userRole, currentUserId, showToast }) => {
  const API_URL = "http://127.0.0.1:3000/api/v1";
  const [activeTab, setActiveTab] = useState("notifications"); // 'notifications', 'send', 'feedback'
  const [items, setItems] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (activeTab === "notifications") loadData("notifications");
    if (activeTab === "feedback") loadData("feedback");
  }, [activeTab]);

  const loadData = async (type) => {
    try {
      const res = await fetch(`${API_URL}/${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Nếu là feedback và không phải admin, chỉ hiện feedback của mình
      if (type === "feedback" && userRole !== "ADMIN") {
        setItems(data.data.filter((fb) => fb.user._id === currentUserId));
      } else {
        setItems(data.data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSend = async () => {
    if (!content) return showToast("Nội dung trống!", "error");
    const endpoint = activeTab === "send" ? "notifications" : "feedback";
    const body =
      activeTab === "send"
        ? { title: "Thông báo từ BQL", content }
        : { content };

    try {
      const res = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Gửi thành công!", "success");
        setContent("");
        if (activeTab === "send") setActiveTab("notifications");
        else loadData("feedback");
      } else showToast(data.message, "error");
    } catch (e) {
      showToast("Lỗi kết nối", "error");
    }
  };

  const handleDelete = async (id, type) => {
    if (!confirm("Xóa mục này?")) return;
    try {
      await fetch(`${API_URL}/${type}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Đã xóa", "success");
      loadData(type);
    } catch (e) {
      showToast("Lỗi", "error");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">
        💬 Thông báo & Phản hồi
      </h2>

      {/* Sub-menu Tabs */}
      <div className="flex gap-2 mb-6 bg-white p-2 rounded-lg shadow w-fit">
        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 rounded ${activeTab === "notifications" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
        >
          🔔 Thông báo
        </button>
        {userRole === "ADMIN" && (
          <button
            onClick={() => setActiveTab("send")}
            className={`px-4 py-2 rounded ${activeTab === "send" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
          >
            ✉️ Gửi TB (Admin)
          </button>
        )}
        <button
          onClick={() => setActiveTab("feedback")}
          className={`px-4 py-2 rounded ${activeTab === "feedback" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
        >
          📝 Phản hồi Cư dân
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white p-6 rounded-xl shadow min-h-[400px]">
        {/* Tab: Gửi (Admin) hoặc Viết Phản hồi */}
        {(activeTab === "send" ||
          (activeTab === "feedback" && userRole !== "ADMIN")) && (
          <div className="mb-8 border-b pb-6">
            <h3 className="font-bold text-lg mb-2">
              {activeTab === "send"
                ? "Soạn Thông Báo Mới"
                : "Gửi Phản Hồi cho BQL"}
            </h3>
            <textarea
              className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-indigo-200 outline-none"
              rows="4"
              placeholder="Nhập nội dung..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <button
              onClick={handleSend}
              className="bg-indigo-600 text-white px-6 py-2 rounded font-bold hover:bg-indigo-700"
            >
              Gửi Đi 🚀
            </button>
          </div>
        )}

        {/* Tab: Danh sách */}
        {activeTab !== "send" && (
          <div className="space-y-4">
            {items.length === 0 && (
              <p className="text-gray-400 text-center">Trống.</p>
            )}
            {items.map((item) => (
              <div
                key={item._id}
                className="border p-4 rounded-lg hover:bg-gray-50 flex justify-between items-start"
              >
                <div>
                  <h4 className="font-bold text-indigo-700">
                    {item.title ||
                      `Phản hồi từ ${item.user?.fullname || "Ẩn danh"}`}
                  </h4>
                  <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                    {item.content}
                  </p>
                  <small className="text-gray-400">
                    {new Date(item.date).toLocaleDateString()}
                  </small>
                </div>
                {(userRole === "ADMIN" || item.user?._id === currentUserId) && (
                  <button
                    onClick={() =>
                      handleDelete(
                        item._id,
                        activeTab === "notifications"
                          ? "notifications"
                          : "feedback",
                      )
                    }
                    className="text-red-400 hover:text-red-600 text-sm font-bold ml-4"
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default FeedbackManagement;
