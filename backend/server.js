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

// Load env FIRST
dotenv.config();

// Connect DB AFTER env loads
connectDb();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use("/uploads", express.static("uploads"));

// Routes
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

// Root route (fixes "Not Found")
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// PORT (IMPORTANT for Render)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});