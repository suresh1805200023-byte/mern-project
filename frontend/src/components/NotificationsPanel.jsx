import { useEffect, useMemo, useState } from "react";
import API from "../api";

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/notifications/my");
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  const markAllAsRead = async () => {
    try {
      await API.put("/notifications/read-all");
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const markOneAsRead = async (notificationId) => {
    try {
      await API.put(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notificationId ? { ...item, read: true } : item
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Notifications</h1>
          <p className="text-slate-500 mt-1">
            {notifications.length} total, {unreadCount} unread
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchNotifications}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-100 transition-colors"
          >
            Refresh
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 text-slate-400">
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-100 text-center text-slate-500">
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`bg-white rounded-2xl border p-5 ${
                notification.read
                  ? "border-slate-100"
                  : "border-blue-200 bg-blue-50/40"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{notification.title}</p>
                  <p className="text-slate-600 text-sm mt-1">{notification.message}</p>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => markOneAsRead(notification._id)}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
