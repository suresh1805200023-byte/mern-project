import express from "express";
import { downloadCertificate } from "../controllers/certificateController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:courseId", protect, downloadCertificate);

export default router;