// controllers/progressController.js

import Progress from "../models/Progress.js";
import Lesson from "../models/Lesson.js";
import Notification from "../models/Notification.js";
import Course from "../models/Course.js";


export const markLessonComplete = async (req, res) => {
  try {
    let progress = await Progress.findOne({
      user: req.user.id,
      course: req.params.courseId,
    });


    if (!progress) {
      progress = await Progress.create({
        user: req.user.id,
        course: req.params.courseId,
        completedLessons: [],
      });
    }

    
    const alreadyCompleted = progress.completedLessons.some(
      (id) => id.toString() === req.params.lessonId
    );

    if (!alreadyCompleted) {
      progress.completedLessons.push(req.params.lessonId);
      await progress.save();

      const totalLessons = await Lesson.countDocuments({
        course: req.params.courseId,
      });
      const completedCount = progress.completedLessons.length;

      if (totalLessons > 0 && completedCount === totalLessons) {
        const existingNotification = await Notification.findOne({
          recipient: req.user.id,
          type: "course_completed",
          link: "/student",
        });

        if (!existingNotification) {
          const course = await Course.findById(req.params.courseId).select("title");
          await Notification.create({
            recipient: req.user.id,
            type: "course_completed",
            title: "Course completed",
            message: `You finished "${course?.title || "your course"}". You can now download your certificate.`,
            link: "/student",
          });
        }
      }
    }

    res.json({ message: "Lesson marked complete", progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getProgress = async (req, res) => {
  try {
    const totalLessons = await Lesson.countDocuments({
      course: req.params.courseId,
    });

    const progress = await Progress.findOne({
      user: req.user.id,
      course: req.params.courseId,
    });

    const completedLessons = progress?.completedLessons || [];

    const percentage =
      totalLessons === 0
        ? 0
        : Math.round((completedLessons.length / totalLessons) * 100);

    res.json({
      completedLessons, 
      totalLessons,
      percentage,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const checkCompletion = async (req, res) => {
  try {
    const totalLessons = await Lesson.countDocuments({
      course: req.params.courseId,
    });

    const progress = await Progress.findOne({
      user: req.user.id,
      course: req.params.courseId,
    });

    const completed = progress?.completedLessons.length || 0;

    res.json({ completed: completed === totalLessons });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};