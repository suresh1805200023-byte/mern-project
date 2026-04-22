import mongoose from "mongoose";

const supportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category: String,
    priority: String,
    message: String,
    status: {
      type: String,
      default: "open",
    }, reply: String,
  },
  { timestamps: true }
);

export default mongoose.model("Support", supportSchema);