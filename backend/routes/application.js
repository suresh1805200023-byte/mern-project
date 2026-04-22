import express from "express";
import {
    applyForTeacher,
  getApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin routes
router.get("/", protect, authorizeRoles("admin"), getApplications);
router.post("/apply",protect,applyForTeacher);
router.put("/:id", protect, authorizeRoles("admin"), updateApplicationStatus);

export default router;