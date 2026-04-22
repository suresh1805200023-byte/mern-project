import mongoose from "mongoose";

const teacherApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  website: String,
  linkedin: { type: String, required: true },
  github: { type: String, required: true },
  experience: String,
  projects: String,

  resume: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.model("TeacherApplication", teacherApplicationSchema);