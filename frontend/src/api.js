import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log("🔥 BASE URL:", BASE_URL);

if (!BASE_URL) {
  throw new Error("❌ VITE_API_BASE_URL is missing in environment variables");
}

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;