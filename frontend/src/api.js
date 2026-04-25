import axios from "axios";

// ✅ USE ENV VARIABLE (NOT localhost)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 ADD TOKEN
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    console.log("🌐 API:", import.meta.env.VITE_API_BASE_URL);
    console.log("👉 Request:", req.method.toUpperCase(), req.url);

    return req;
  },
  (error) => Promise.reject(error)
);

// ❌ HANDLE ERRORS
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;