import Review from "../models/Review.js";
import Course from "../models/Course.js";
import Notification from "../models/Notification.js";


export const addReview = async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;

    // prevent duplicate
    const existing = await Review.findOne({
      user: req.user.id,
      course: courseId,
    });

    if (existing) {
      return res.status(400).json({ message: "Already reviewed" });
    }

    const review = await Review.create({
      user: req.user.id,
      course: courseId,
      rating,
      comment,
    });

    const course = await Course.findById(courseId).select("title teacher");
    if (course?.teacher) {
      await Notification.create({
        recipient: course.teacher,
        type: "new_review",
        title: "New comment and rating",
        message: `${req.user.name || "A student"} left a ${rating}-star review on "${course.title}".`,
        link: `/course/${courseId}`,
      });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      course: req.params.courseId,
    }).populate("user", "name");

    const avgRating =
      reviews.length === 0
        ? 0
        : (
            reviews.reduce((acc, r) => acc + r.rating, 0) /
            reviews.length
          ).toFixed(1);

    res.json({
      reviews,
      avgRating,
      total: reviews.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};