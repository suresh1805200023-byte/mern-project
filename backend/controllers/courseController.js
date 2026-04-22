import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Review from "../models/Review.js";


//
// CREATE COURSE (UPDATED)
// 
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      whatYouWillLearn,
      courseIncludes,
      requirements,
      category, 
    } = req.body;

    const course = await Course.create({
      title,
      description,
      price,
      image: req.file ? req.file.filename : null,
      teacher: req.user.id,
      category, 

      whatYouWillLearn: JSON.parse(whatYouWillLearn || "[]"),
      courseIncludes: JSON.parse(courseIncludes || "[]"),
      requirements: JSON.parse(requirements || "[]"),
    });

    res.json({ message: "Course created", course });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



//  GET ALL COURSES

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("teacher", "name profilePic")
      .populate("category", "name"); // ✅

    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



//  GET SINGLE COURSE

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("teacher", "name email profilePic about")
      .populate("category", "name"); // ✅

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const reviews = await Review.find({ course: course._id })
      .populate("user", "name");

    const avgRating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + r.rating, 0) /
            reviews.length
          ).toFixed(1)
        : 0;

    res.json({
      course,
      reviews,
      avgRating,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// UPDATE COURSE

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your course" });
    }

    const {
      title,
      description,
      price,
      whatYouWillLearn,
      courseIncludes,
      requirements,
    } = req.body;

    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price || course.price;

    if (whatYouWillLearn)
      course.whatYouWillLearn = JSON.parse(whatYouWillLearn);

    if (courseIncludes)
      course.courseIncludes = JSON.parse(courseIncludes);

    if (requirements)
      course.requirements = JSON.parse(requirements);

    if (req.file) {
      course.image = req.file.filename;
    }

    await course.save();

    res.json({ message: "Course updated", course });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



//  DELETE COURSE

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your course" });
    }

    await course.deleteOne();

    res.json({ message: "Course deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



//  MY COURSES

export const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      teacher: req.user.id,
    }).populate("teacher", "name email profilePic");

    res.json(courses);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// TRENDING COURSES
export const getTrendingCourses = async (req, res) => {
  try {
    const courses = await Enrollment.aggregate([
      {
        $group: {
          _id: "$course",
          totalEnrollments: { $sum: 1 },
        },
      },
      { $sort: { totalEnrollments: -1 } },
      { $limit: 6 },

      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },

      {
        $lookup: {
          from: "users",
          localField: "course.teacher",
          foreignField: "_id",
          as: "teacher",
        },
      },
      { $unwind: "$teacher" },

      {
        $project: {
          _id: "$course._id",
          title: "$course.title",
          description: "$course.description",
          image: "$course.image",
          price: "$course.price",
          totalEnrollments: 1,
          teacher: {
            name: "$teacher.name",
            profilePic: "$teacher.profilePic",
          },
        },
      },
    ]);

    res.json(courses);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



//  TOP RATED COURSES

export const getTopRatedCourses = async (req, res) => {
  try {
    const courses = await Review.aggregate([
      {
        $group: {
          _id: "$course",
          avgRating: { $avg: "$rating" },
        },
      },
      { $sort: { avgRating: -1 } },
      { $limit: 6 },

      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },

      {
        $lookup: {
          from: "users",
          localField: "course.teacher",
          foreignField: "_id",
          as: "teacher",
        },
      },
      { $unwind: "$teacher" },

      {
        $project: {
          _id: "$course._id",
          title: "$course.title",
          description: "$course.description",
          image: "$course.image",
          price: "$course.price",
          avgRating: { $round: ["$avgRating", 1] },
          teacher: {
            name: "$teacher.name",
            profilePic: "$teacher.profilePic",
          },
        },
      },
    ]);

    res.json(courses);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};