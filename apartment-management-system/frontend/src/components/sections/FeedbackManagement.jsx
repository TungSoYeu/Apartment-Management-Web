import { useState, useEffect } from "react";
import {
  HiChatBubbleLeftRight,
  HiBell,
  HiEnvelope,
  HiPencilSquare,
  HiPaperAirplane,
} from "react-icons/hi2";

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

  const tabBaseStyle = "flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 font-semibold text-sm transform hover:scale-105 active:scale-95";
  const activeTabStyle = "bg-white text-slate-800 shadow-sm";
  const inactiveTabStyle = "text-slate-500 hover:bg-white/60";

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold text-slate-200 mb-4 flex items-center gap-3">
        <HiChatBubbleLeftRight className="text-indigo-600" /> Thông báo & Phản hồi
      </h2>

      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg border border-slate-200 w-fit">
        <button
          onClick={() => setActiveTab("notifications")}
          className={`${tabBaseStyle} ${activeTab === "notifications" ? activeTabStyle : inactiveTabStyle}`}
        >
          <HiBell /> Thông báo
        </button>
        {userRole === "ADMIN" && (
          <button
            onClick={() => setActiveTab("send")}
            className={`${tabBaseStyle} ${activeTab === "send" ? activeTabStyle : inactiveTabStyle}`}
          >
            <HiEnvelope /> Gửi TB (Admin)
          </button>
        )}
        <button
          onClick={() => setActiveTab("feedback")}
          className={`${tabBaseStyle} ${activeTab === "feedback" ? activeTabStyle : inactiveTabStyle}`}
        >
          <HiPencilSquare /> Phản hồi Cư dân
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm min-h-[400px]">
        {(activeTab === "send" || (activeTab === "feedback" && userRole !== "ADMIN")) && (
          <div className="mb-8 border-b border-slate-200 pb-6">
            <h3 className="font-bold text-lg mb-3 text-slate-700">
              {activeTab === "send" ? "Soạn Thông Báo Mới" : "Gửi Phản Hồi cho BQL"}
            </h3>
            <textarea
              className="w-full p-3 border border-slate-300 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              rows="4"
              placeholder="Nhập nội dung..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <button
              onClick={handleSend}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2 transition-colors transform active:scale-95"
            >
              Gửi Đi <HiPaperAirplane />
            </button>
          </div>
        )}

        {activeTab !== "send" && (
          <div className="space-y-1">
            {items.length === 0 && (
              <p className="text-slate-400 text-center py-10">Trống.</p>
            )}
            {items.map((item) => (
              <div
                key={item._id}
                className="border-b border-slate-100 p-4 flex justify-between items-start last:border-b-0 transform hover:scale-[1.005] hover:shadow-md transition-all duration-200"
              >
                <div>
                  <h4 className="font-bold text-slate-800">
                    {item.title || `Phản hồi từ ${item.user?.fullname || "Ẩn danh"}`}
                  </h4>
                  <p className="text-slate-600 mt-1 whitespace-pre-wrap">
                    {item.content}
                  </p>
                  <small className="text-slate-400 mt-2 block">
                    {new Date(item.date).toLocaleDateString()}
                  </small>
                </div>
                {(userRole === "ADMIN" || item.user?._id === currentUserId) && (
                  <button
                    onClick={() =>
                      handleDelete(
                        item._id,
                        activeTab === "notifications" ? "notifications" : "feedback",
                      )
                    }
                    className="text-slate-400 hover:text-red-600 text-sm font-bold ml-4 transition-colors"
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
