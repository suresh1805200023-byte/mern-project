import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Review from "../models/Review.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";


//  GET PROFILE
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//  UPDATE PROFILE 
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
// About update
    if (req.body.about !== undefined) {
      user.about = req.body.about;
    }

    //  Profile Pic update
    if (req.file) {
      user.profilePic = req.file.filename;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//  INSTRUCTOR DASHBOARD 
export const getInstructorDashboard = async (req, res) => {
  try {
    const teacherId = req.user.id;

    
    const courses = await Course.find({ teacher: teacherId }).lean();
    const courseIds = courses.map((c) => c._id);

    
    const totalStudents = await Enrollment.countDocuments({
      course: { $in: courseIds },
    });

    
    const reviews = await Review.find({
      course: { $in: courseIds },
    }).lean();

    let avgRating = 0;

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((acc, r) => acc + r.rating, 0);
      avgRating = totalRating / reviews.length;
    }

   
    const transactions = await Transaction.find({
      course: { $in: courseIds },
    }).lean();

    const totalRevenue = transactions.length
      ? transactions.reduce((acc, t) => acc + (t.amount || 0), 0)
      : 0;

    const teacherEarnings = transactions.length
      ? transactions.reduce((acc, t) => acc + (t.teacherEarning || 0), 0)
      : 0;

   
    res.status(200).json({
      success: true,
      stats: {
        totalCourses: courses.length,
        totalStudents,
        avgRating: avgRating.toFixed(1),
        totalRevenue,
        teacherEarnings,
      },
    });

  } catch (error) {
    console.error("Instructor Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
      error: error.message,
    });
  }
};