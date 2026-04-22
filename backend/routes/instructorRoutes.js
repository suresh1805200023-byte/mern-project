import express from "express";
import {
  getInstructorDashboard,
  getMyProfile,
  updateProfile,
} from "../controllers/instructorController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

//  multer config
const upload = multer({ dest: "uploads/" });

// DASHBOARD
router.get(
  "/dashboard",
  protect,
  authorizeRoles("teacher"),
  getInstructorDashboard
);

//  GET PROFILE   FIX FOR 404
router.get(
  "/me",
  protect,
  authorizeRoles("teacher"),
  getMyProfile
);

//  UPDATE PROFILE
router.put(
  "/profile",
  protect,
  authorizeRoles("teacher"),
  upload.single("profilePic"),
  updateProfile
);

export default router;