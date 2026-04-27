// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import API from "../api";
import { FaEnvelope, FaHeart, FaLightbulb, FaSearch, FaShoppingCart } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [categories, setCategories] = useState([]);
  const [showExplore, setShowExplore] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [search, setSearch] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const exploreRef = useRef();
  const userRef = useRef();
  const notificationRef = useRef();

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories");
        setCategories(res.data);
      } catch (err) { console.error(err); }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const syncWishlistCount = () => {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlistCount(wishlist.length);
    };
    syncWishlistCount();
    window.addEventListener("wishlistUpdate", syncWishlistCount);
    return () => window.removeEventListener("wishlistUpdate", syncWishlistCount);
  }, []);

  useEffect(() => {
    const syncCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };
    syncCartCount();
    window.addEventListener("cartUpdate", syncCartCount);
    return () => window.removeEventListener("cartUpdate", syncCartCount);
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications/my");
        setNotifications(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target)) setShowExplore(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
      if (notificationRef.current && !notificationRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter") navigate(`/courses?search=${encodeURIComponent(search.trim())}`);
  };

  const unreadCount = notifications.filter((item) => !item.read).length;

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await API.put(`/notifications/${notification._id}/read`);
        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notification._id ? { ...item, read: true } : item
          )
        );
      }
      if (notification.link) navigate(notification.link);
      setShowNotifications(false);
    } catch (err) {
      console.error("Failed to open notification:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.put("/notifications/read-all");
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="flex justify-between items-center px-10 py-4 shadow border-b bg-white sticky top-0 z-50">

     
      <div className="flex items-center gap-6">

      
        <Link to="/" className="flex items-center gap-2 mr-2">
          <FaLightbulb className="text-green-600 text-2xl" />
          <span className="text-xl font-bold text-green-700">
            UpSkill<span className="text-black">Hub</span>
          </span>
        </Link>

       
        <div className="relative" ref={exploreRef}>
          <button
            onClick={() => setShowExplore(!showExplore)}
            className="text-gray-700 font-medium hover:text-green-600 transition-colors"
          >
            Explore ▾
          </button>

          {showExplore && (
            <div className="absolute top-10 left-0 w-60 bg-white rounded-xl shadow-xl z-50 border border-gray-100 overflow-hidden">
              <div
                onClick={() => { navigate("/courses"); setShowExplore(false); }}
                className="px-4 py-3 font-semibold hover:bg-gray-50 cursor-pointer border-b border-gray-50"
              >
                All Courses
              </div>
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  onClick={() => {
                    navigate(`/courses?category=${cat._id}`);
                    setShowExplore(false);
                  }}
                  className="px-4 py-2.5 hover:bg-green-50 hover:text-green-700 cursor-pointer transition-colors"
                >
                  {cat.name}
                </div>
              ))}
            </div>
          )}
        </div>

       
        <div className="flex items-center gap-5">
         
          <Link 
            to="/contact" 
            className="text-gray-700 font-medium hover:text-green-600 transition-colors"
          >
            Contact
          </Link>
        </div>

        
        <div className="flex items-center border rounded-full bg-gray-50 px-4 py-1.5 shadow-sm w-64 focus-within:border-green-400 focus-within:bg-white transition-all">
          <FaSearch className="text-gray-400 text-sm mr-2" />
          <input
            type="text"
            placeholder="Search courses..."
            className="outline-none text-sm w-full bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </div>

      
      <div className="flex items-center gap-5 text-gray-800">
        {user && (
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Notifications"
            >
              <FaEnvelope className="text-gray-600 text-lg" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-85 max-h-105 overflow-y-auto bg-white rounded-xl shadow-2xl z-50 border border-gray-100">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <p className="font-bold text-gray-900 text-sm">Notifications</p>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] text-blue-600 font-semibold hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-400">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                        notification.read ? "bg-white" : "bg-blue-50/40"
                      }`}
                    >
                      <p className="text-xs font-bold text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-2">
                        {formatTime(notification.createdAt)}
                      </p>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}
        
      
        <button
          onClick={() => navigate("/cart")}
          className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="Cart"
        >
          <FaShoppingCart className="text-gray-600 text-xl" />
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] font-bold">
              {cartCount}
            </span>
          )}
        </button>

     
        <button
          onClick={() => navigate("/wishlist")}
          className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="Wishlist"
        >
          <FaHeart className="text-red-500 text-xl" />
          {wishlistCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
              {wishlistCount}
            </span>
          )}
        </button>

      
        {user && user.role !== "teacher" && user.role !== "admin" && (
          <button
            onClick={() => navigate("/apply-teacher")}
            className="bg-green-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-green-700 transition-all shadow-md shadow-green-100"
          >
            Become a Teacher
          </button>
        )}

        {!user ? (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-700 font-medium hover:text-green-600">Login</Link>
            <Link to="/register" className="bg-black text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-all">Sign Up</Link>
          </div>
        ) : (
          <div className="relative" ref={userRef}>
            <div
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center cursor-pointer font-bold shadow-md hover:scale-105 transition-transform"
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 py-2">
                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Signed in as</p>
                  <p className="font-bold text-gray-900 truncate">{user.name}</p>
                </div>
                <div onClick={() => { navigate(user.role === "admin" ? "/admin" : user.role === "teacher" ? "/teacher" : "/student"); setShowUserMenu(false); }} className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm">Dashboard</div>
                <div onClick={() => { navigate("/settings"); setShowUserMenu(false); }} className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm">Settings</div>
                <div onClick={() => { navigate("/help"); setShowUserMenu(false); }} className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-50">Help Center</div>
                <div onClick={logout} className="px-4 py-2 text-red-500 hover:bg-red-50 cursor-pointer text-sm font-semibold">Logout</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}