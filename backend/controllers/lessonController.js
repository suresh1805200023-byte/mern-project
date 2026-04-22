// controllers/lessonController.js
import Enrollment from "../models/Enrollment.js";
import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js"; 
import Notification from "../models/Notification.js";

export const addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your course" });
    }

    const lesson = await Lesson.create({
      title: req.body.title,
      content: req.body.content,
      video: req.file ? req.file.filename : null, 
      course: req.params.courseId,
    });

    const enrollments = await Enrollment.find({ course: req.params.courseId }).select("user");
    const studentNotifications = enrollments.map((enrollment) => ({
      recipient: enrollment.user,
      type: "new_lesson",
      title: "New lesson uploaded",
      message: `Your teacher uploaded a new lesson in "${course.title}".`,
      link: `/learn/${course._id}`,
    }));

    if (studentNotifications.length > 0) {
      await Notification.insertMany(studentNotifications);
    }

    res.json({ message: "Lesson added", lesson });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const getLessonsByCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

   
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    
    if (course.teacher.toString() !== req.user.id) {

      
      const enrolled = await Enrollment.findOne({
        user: req.user.id,
        course: req.params.courseId,
      });

      if (!enrolled) {
        return res.status(403).json({ message: "Enroll first" });
      }
    }

    
    const lessons = await Lesson.find({
      course: req.params.courseId,
    });

    res.json(lessons);

  } catch (error) {
    console.log("🔥 ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};