import Stripe from "stripe";
import Course from "../models/Course.js";
import dotenv from "dotenv";
import Enrollment from "../models/Enrollment.js";
import Transaction from "../models/Transaction.js";
import Notification from "../models/Notification.js";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { courseId, courseIds } = req.body;
    const requestedCourseIds = Array.isArray(courseIds)
      ? courseIds
      : courseId
      ? [courseId]
      : [];

    if (requestedCourseIds.length === 0) {
      return res.status(400).json({ message: "No course selected for checkout" });
    }

    const uniqueCourseIds = [...new Set(requestedCourseIds)];
    const courses = await Course.find({ _id: { $in: uniqueCourseIds } });

    if (!courses.length) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrolledRecords = await Enrollment.find({
      user: req.user.id,
      course: { $in: uniqueCourseIds },
    }).select("course");

    const enrolledIds = new Set(enrolledRecords.map((item) => item.course.toString()));
    const purchasableCourses = courses.filter((course) => !enrolledIds.has(course._id.toString()));

    if (!purchasableCourses.length) {
      return res.status(400).json({ message: "All selected courses are already enrolled" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: purchasableCourses.map((course) => ({
          price_data: {
            currency: "inr",
            product_data: {
              name: course.title,
            },
            unit_amount: course.price * 100,
          },
          quantity: 1,
        })),

      mode: "payment",

      success_url: `${process.env.CLIENT_URL}/success?courseIds=${purchasableCourses
        .map((course) => course._id.toString())
        .join(",")}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({ url: session.url });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const paymentSuccess = async (req, res) => {
  try {
    const { courseId, courseIds } = req.body;
    const requestedCourseIds = Array.isArray(courseIds)
      ? courseIds
      : courseId
      ? [courseId]
      : [];

    if (requestedCourseIds.length === 0) {
      return res.status(400).json({ message: "No course selected for enrollment" });
    }

    const uniqueCourseIds = [...new Set(requestedCourseIds)];
    const courses = await Course.find({ _id: { $in: uniqueCourseIds } });

    if (!courses.length) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrolledRecords = await Enrollment.find({
      user: req.user.id,
      course: { $in: uniqueCourseIds },
    }).select("course");

    const enrolledIds = new Set(enrolledRecords.map((item) => item.course.toString()));
    const coursesToEnroll = courses.filter((course) => !enrolledIds.has(course._id.toString()));

    if (!coursesToEnroll.length) {
      return res.json({ message: "Already enrolled", enrolledCount: 0 });
    }

    for (const course of coursesToEnroll) {
      // Create enrollment and transaction per purchased course.
      await Enrollment.create({
        user: req.user.id,
        course: course._id,
      });

      const commissionRate = 0.1;
      const adminRevenue = course.price * commissionRate;
      const teacherEarning = course.price - adminRevenue;

      await Transaction.create({
        course: course._id,
        student: req.user.id,
        teacher: course.teacher,
        amount: course.price,
        adminRevenue,
        teacherEarning,
      });

      await Notification.create({
        recipient: req.user.id,
        type: "purchase_success",
        title: "Course purchased successfully",
        message: `You purchased "${course.title}" successfully.`,
        link: `/learn/${course._id}`,
      });

      await Notification.create({
        recipient: course.teacher,
        type: "payment_received",
        title: "Course payment received",
        message: `You received a payment for "${course.title}".`,
        link: "/teacher",
      });
    }

    res.json({
      message: "Payment success & enrolled",
      enrolledCount: coursesToEnroll.length,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};