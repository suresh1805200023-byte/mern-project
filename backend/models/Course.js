import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    image: String,

    
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // ✅ COURSE DETAILS
    whatYouWillLearn: [String],
    courseIncludes: [String],
    requirements: [String],

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);