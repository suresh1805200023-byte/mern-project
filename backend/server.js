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
// ✅ ROBUST CORS CONFIG
// =======================
const allowedOrigins = [
  "http://localhost:5173",
  "https://skillhubfrontend.onrender.com",
  "https://mern-project-2em3.onrender.com", // Added the one from your logs
  process.env.CLIENT_URL,
].filter(Boolean); // Removes undefined values if CLIENT_URL isn't set

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);

      // Check if the origin is in our allowed list
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        console.log("❌ Blocked by CORS Origin:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

// =======================
// ✅ MIDDLEWARE
// =======================
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// =======================
// ✅ ROUTES
// =======================
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
// ✅ ROOT ROUTE
// =======================
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully");
});

// =======================
// ✅ 404 HANDLER
// =======================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// =======================
// ✅ ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
  // Catch CORS errors specifically
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS Error: Origin not allowed" });
  }
  
  console.error("🔥 ERROR:", err.stack);
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