import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    //  Prevent teacher from enrolling in their own course
    if (course.teacher.toString() === userId) {
      return res.status(400).json({ 
        message: "You cannot enroll in a course you created." 
      });
    }

    //  Logic check for existing enrollment
    const existing = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    if (existing) {
      return res.status(400).json({ message: "You are already enrolled." });
    }

    //  Create the enrollment
    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
    });

    res.status(201).json({ 
      message: "Enrolled successfully", 
      enrollment 
    });

  } catch (error) {
    //  Database safety: Handle duplicate key error (code 11000)
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Enrollment already exists for this course." 
      });
    }

    res.status(500).json({ error: error.message });
  }
};

export const getMyCourses = async (req, res) => {
  try {
    // We use .lean() for performance since we're just reading data
    const courses = await Enrollment.find({ user: req.user.id })
      .populate({
        path: "course",
        populate: {
          path: "teacher",
          select: "name",
        },
      })
      .lean();

    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};