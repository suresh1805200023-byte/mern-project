import express from "express";
import upload from "../middleware/upload.js";
import { uploadVideo } from "../controllers/uploadController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/video",
  protect,
  authorizeRoles("teacher"),
  upload.single("video"),
  uploadVideo
);


router.post(
  "/apply",
  protect,
  upload.single("resume"),
  applyForTeacher
);
export default router;