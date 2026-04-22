import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

//  ADMIN ONLY
router.post("/", protect, authorizeRoles("admin"), createCategory);
router.put("/:id", protect, authorizeRoles("admin"), updateCategory);
router.delete("/:id", protect, authorizeRoles("admin"), deleteCategory);

//  PUBLIC
router.get("/", getCategories);

export default router;