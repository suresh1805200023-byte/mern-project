import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Review from "../models/Review.js";
import Enrollment from "../models/Enrollment.js";


//  GET REVENUE
export const getRevenue = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("student", "name email")
      .populate("teacher", "name email")
      .populate("course", "title");

    const totalRevenue = transactions.reduce(
      (acc, t) => acc + t.adminRevenue,
      0
    );

    const totalSales = transactions.reduce(
      (acc, t) => acc + t.amount,
      0
    );

    res.json({
      success: true,
      totalRevenue,
      totalSales,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//  GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// BAN / UNBAN USER
export const toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({
      success: true,
      message: user.isBanned
        ? "User banned successfully 🚫"
        : "User unbanned successfully ✅",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// TOP TEACHERS (RANKING BASED ON SALES + RATING)
export const getTopTeachers = async (req, res) => {
  try {
    const teachers = await Enrollment.aggregate([
      //  Count total enrollments per teacher
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "courseData",
        },
      },
      { $unwind: "$courseData" },

      {
        $group: {
          _id: "$courseData.teacher",
          totalSales: { $sum: 1 },
        },
      },

      //  Get ratings
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "teacher",
          as: "reviews",
        },
      },

      {
        $addFields: {
          avgRating: { $avg: "$reviews.rating" },
        },
      },

      // 👤 Get teacher details
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "teacher",
        },
      },
      { $unwind: "$teacher" },

      //  Score formula
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: ["$totalSales", 2] },
              { $multiply: [{ $ifNull: ["$avgRating", 0] }, 10] },
            ],
          },
        },
      },

      { $sort: { score: -1 } },

      {
        $project: {
          name: "$teacher.name",
          email: "$teacher.email",
          totalSales: 1,
          avgRating: { $round: ["$avgRating", 1] },
          score: 1,
        },
      },
    ]);

    //  Add rank
    const rankedTeachers = teachers.map((t, index) => ({
      rank: index + 1,
      ...t,
    }));

    res.json({
      success: true,
      teachers: rankedTeachers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//TOP COURSES (MOST BOUGHT)
export const getTopCourses = async (req, res) => {
  try {
    const courses = await Enrollment.aggregate([
      {
        $group: {
          _id: "$course",
          totalEnrollments: { $sum: 1 },
        },
      },

      { $sort: { totalEnrollments: -1 } },

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
        $project: {
          title: "$course.title",
          totalEnrollments: 1,
        },
      },
    ]);

    //  Add rank
    const rankedCourses = courses.map((c, index) => ({
      rank: index + 1,
      ...c,
    }));

    res.json({
      success: true,
      courses: rankedCourses,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// COURSE RANKING (SIMPLE VERSION)
export const getCourseRanking = async (req, res) => {
  try {
    const courses = await Enrollment.aggregate([
      {
        $group: {
          _id: "$course",
          total: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const ranked = courses.map((c, index) => ({
      rank: index + 1,
      courseId: c._id,
      totalEnrollments: c.total,
    }));

    res.json({
      success: true,
      ranking: ranked,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTeacherRanking = async (req, res) => {
  try {
    // Get all teachers
    const teachers = await User.find({ role: "teacher" });

    let results = [];

    for (let teacher of teachers) {
      // 2️ Get teacher courses
      const courses = await Course.find({ teacher: teacher._id });

      const courseIds = courses.map((c) => c._id);

      // 3️ Total enrollments (sales)
      const totalSales = await Enrollment.countDocuments({
        course: { $in: courseIds },
      });

      // 4️ Get reviews
      const reviews = await Review.find({
        course: { $in: courseIds },
      });

      // 5️ Calculate avg rating
      let avgRating = 0;
      if (reviews.length > 0) {
        avgRating =
          reviews.reduce((acc, r) => acc + r.rating, 0) /
          reviews.length;
      }

      // 6️ Score formula (you can tweak)
      const score = totalSales * 2 + avgRating * 10;

      results.push({
        teacherId: teacher._id,
        name: teacher.name,
        email: teacher.email,
        totalSales,
        avgRating: avgRating.toFixed(1),
        score,
      });
    }

    // 7️ Sort by score
    results.sort((a, b) => b.score - a.score);

    // 8️ Add rank
    const rankedTeachers = results.map((t, index) => ({
      rank: index + 1,
      ...t,
    }));

    res.json({
      success: true,
      teachers: rankedTeachers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



// BAN USER
export const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❌ prevent admin banning themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        message: "You cannot ban yourself",
      });
    }

    user.isBanned = true;
    await user.save();

    res.json({
      success: true,
      message: "User banned successfully 🚫",
      user,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//  UNBAN USER
export const unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBanned = false;
    await user.save();

    res.json({
      success: true,
      message: "User unbanned successfully ✅",
      user,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
