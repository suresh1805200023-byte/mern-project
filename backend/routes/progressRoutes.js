import express from "express";
import {
  markLessonComplete,
  checkCompletion,
  getProgress
} from "../controllers/progressController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Mark lesson complete
router.post("/:courseId/:lessonId", protect, markLessonComplete);

//  DIFFERENT ROUTES (FIX)
router.get("/:courseId/progress", protect, getProgress);
router.get("/:courseId/completion", protect, checkCompletion);

export default router;