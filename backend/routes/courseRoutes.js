// routes/courseRoutes.js

import express from "express";
import {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
  getMyCourses,
  getTrendingCourses,
  getTopRatedCourses,
   //  ADD THIS
} from "../controllers/courseController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import uploadImage from "../middleware/uploadImage.js";
import { getCourseById } from "../controllers/courseController.js";

 //  MUST ADD
const router = express.Router();


//  GET ALL COURSES
router.get("/", getAllCourses);


//  CREATE COURSE (teacher only)
router.post(
  "/create",
  protect,
  authorizeRoles("teacher"),
  uploadImage.single("image"),
  createCourse
);


// 👨 MY COURSES (REMOVE uploadImage )
router.get(
  "/my-courses",
  protect,
  authorizeRoles("teacher"),
  getMyCourses
);


//  UPDATE COURSE
router.put(
  "/:id",
  protect,
  authorizeRoles("teacher"),
  uploadImage.single("image"), //  allow image update
  updateCourse
);


//  DELETE COURSE
router.delete(
  "/:id",
  protect,
  authorizeRoles("teacher"),
  deleteCourse
);


// TRENDING / FEATURED

router.get("/trending",getTrendingCourses);

//  TOP RATED
router.get("/featured", getTopRatedCourses); // 


router.get("/:id", getCourseById);


export default router;