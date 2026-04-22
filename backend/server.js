import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import application from "./routes/application.js";
import authRoutes from "./routes/authRoutes.js";
import connectDb from "./config/db.js";
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







dotenv.config();
connectDb();
const app=express();
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/application",application);
app.use("/api/courses",courseRoutes);
app.use("/api/lessons",lessonRoutes);
app.use("/api/enrollments",enrollmentRoutes);
app.use("/api/progress",progressRoutes);
app.use("/api/certificate",certificateRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/payment", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(process.env.PORT,()=>
{
    console.log(`server is running on port ${process.env.PORT}`);
});
