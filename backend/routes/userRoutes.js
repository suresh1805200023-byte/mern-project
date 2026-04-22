import express from "express";
import { changePassword } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

//  CHANGE PASSWORD
router.put("/change-password", protect, changePassword);

export default router;