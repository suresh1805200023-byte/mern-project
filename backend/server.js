import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import application from "./routes/application.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// DB
import connectDb from "./config/db.js";

// =======================
// ✅ LOAD ENV & CONNECT DB
// =======================
dotenv.config();
connectDb();

const app = express();

// =======================
// ✅ DYNAMIC CORS CONFIG
// =======================
const allowedOrigins = [
  "http://localhost:5173",
  "https://skillhub1front.onrender.com",
  "https://skillhubfrontend.onrender.com",
  "https://mern-project-2em3.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // 1. Allow requests with no origin (like Postman or mobile apps)
    if (!origin) return callback(null, true);

    // 2. Allow if origin is in list OR if it ends with .onrender.com
    const isAllowed = allowedOrigins.includes(origin) || origin.endsWith(".onrender.com");

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

// =======================
// ✅ MIDDLEWARE
// =======================
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Added for better form handling
app.use("/uploads", express.static("uploads"));

// =======================
// ✅ ROUTES
// =======================
// Ensure these routes match exactly what your frontend is calling
app.use("/api/auth", authRoutes);
app.use("/api/application", application);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/certificate", certificateRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/notifications", notificationRoutes);

// =======================
// ✅ ROOT ROUTE (To test if backend is alive)
// =======================
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully");
});

// =======================
// ✅ 404 HANDLER
// =======================
app.use((req, res) => {
  console.log(`⚠️ 404 - Route Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ message: `Route ${req.url} not found on this server.` });
});

// =======================
// ✅ ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS Error: Origin not allowed" });
  }
  
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

// =======================
// ✅ START SERVER
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});