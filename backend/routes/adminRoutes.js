import express from "express";
import {
  getRevenue,
  getAllUsers,
  toggleBanUser,
getTopTeachers,
  getTopCourses,
  getTeacherRanking,
  getCourseRanking,
} from "../controllers/adminController.js";


import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

//  GET ADMIN REVENUE
router.get(
  "/revenue",
  protect,
  authorizeRoles("admin"),
  getRevenue
);

//  GET ALL USERS
router.get(
  "/users",
  protect,
  authorizeRoles("admin"),
  getAllUsers
);

//  BAN / UNBAN USER
router.put(
  "/ban/:id",
  protect,
  authorizeRoles("admin"),
  toggleBanUser
);


//  Top Teachers
router.get(
  "/top-teachers",
  protect,
  authorizeRoles("admin"),
  getTopTeachers
);

//  Top Courses
router.get(
  "/top-courses",
  protect,
  authorizeRoles("admin"),
  getTopCourses
);

//  Teacher Ranking
router.get(
  "/teacher-ranking",
  protect,
  authorizeRoles("admin"),
  getTeacherRanking
);

//  Course Ranking
router.get(
  "/course-ranking",
  protect,
  authorizeRoles("admin"),
  getCourseRanking
);
export default router;