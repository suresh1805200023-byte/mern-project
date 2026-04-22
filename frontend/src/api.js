import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 ADD TOKEN TO EVERY REQUEST
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    // 🔍 DEBUG LOG (optional)
    console.log("👉 Request:", req.method.toUpperCase(), req.url);
    console.log("🔐 Token:", token);

    return req; // ✅ IMPORTANT (you already did this 👍)
  },
  (error) => Promise.reject(error)
);

// ❌ HANDLE GLOBAL ERRORS (VERY IMPORTANT 🔥)
API.interceptors.response.use(
  (res) => res,
  (error) => {
    // 🔒 Auto logout if token expired
    if (error.response?.status === 401) {
      console.log("⚠️ Token expired. Logging out...");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;