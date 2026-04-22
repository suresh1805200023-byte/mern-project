import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video"
    });

    //  Delete local file after upload
    fs.unlinkSync(req.file.path);

    res.json({
      message: "Upload success",
      url: result.secure_url
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};