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
// ✅ LOAD ENV
// =======================
dotenv.config();

// =======================
// ✅ CONNECT DATABASE
// =======================
connectDb();

// =======================
// ✅ INIT APP
// =======================
const app = express();

// =======================
// ✅ CORS CONFIG (SAFE)
// =======================
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL, // set in Render
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// =======================
// ✅ MIDDLEWARE
// =======================
app.use(express.json());

// Static folder
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
  console.error("🔥 ERROR:", err.message);
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