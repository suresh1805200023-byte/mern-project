import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String, required: true
  },
  email: {
    type: String, required: true, unique: true
  },
  password: {
    type: String, required: true
  },
  role: {
    type: String,
    enum: ["user","admin","teacher"],
    default: "user"
  },

  //  ADD THESE
  profilePic: {
    type: String,
    default: ""
  },
  about: {
    type: String,
    default: ""
  },
  isBanned: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.model("User", userSchema);