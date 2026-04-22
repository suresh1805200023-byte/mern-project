// models/Lesson.js

import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String, // text / video URL
    },

       video: {
      type: String, //  ADD THIS
      required: false,
    },
    
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", lessonSchema);