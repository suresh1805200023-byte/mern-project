import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amount: Number,
    adminRevenue: Number,
    teacherEarning: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);