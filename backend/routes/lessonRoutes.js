// routes/lessonRoutes.js

import express from "express";
import { addLesson,getLessonsByCourse } from "../controllers/lessonController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import uploadImage from "../middleware/uploadImage.js";
import { createCourse } from "../controllers/courseController.js";
const router = express.Router();

// Add lesson (only teacher)
router.post(
  "/:courseId",
  protect,
  authorizeRoles("teacher"),
  upload.single("video"), //  THIS FIXES YOUR ERROR
  addLesson
);

router.get(
  "/:courseId",
  protect,
  authorizeRoles("user", "teacher", "admin"), // all can view
  getLessonsByCourse
);




export default router;