import express from "express";
import {
  enrollCourse,
  getMyCourses,
} from "../controllers/enrollmentController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student enroll
router.post(
  "/:courseId",
  protect,
  authorizeRoles("user"), // student
  enrollCourse
);

// Get enrolled courses
router.get(
  "/my-courses",
  protect,
  authorizeRoles("user"),
  getMyCourses
);

export default router;