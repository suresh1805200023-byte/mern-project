// controllers/applicationController.js

import User from "../models/User.js";
import TeacherApplication from "../models/TeacherApplication.js";


// APPLY FOR TEACHER 
export const applyForTeacher = async (req, res) => {
  try {
    // 🛡️ Safe body fallback (important with multer)
    const body = req.body || {};

    const { website, linkedin, github, experience, projects } = body;

    //  Check existing application  any status
    const existing = await TeacherApplication.findOne({
      user: req.user.id,
    });

    if (existing) {
      return res.status(400).json({
        message: "You have already applied",
      });
    }

    // Validation
    if (!linkedin || !github) {
      return res.status(400).json({
        message: "LinkedIn and GitHub are required",
      });
    }

    //  Create application
    const application = await TeacherApplication.create({
      user: req.user.id,
      website: website || "",
      linkedin,
      github,
      experience: experience || "",
      projects: projects || "",
      resume: req.file ? req.file.filename : "",
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });

  } catch (error) {
    console.error("Apply Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


//  GET MY APPLICATION 
export const getMyApplication = async (req, res) => {
  try {
    const application = await TeacherApplication.findOne({
      user: req.user.id,
    }).populate("user", "name email");

    if (!application) {
      return res.status(404).json({
        message: "No application found",
      });
    }

    res.json(application);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ADMIN: GET ALL 
export const getApplications = async (req, res) => {
  try {
    const apps = await TeacherApplication.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.json(apps);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ADMIN: UPDATE STATUS
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    //  Validate status
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const app = await TeacherApplication.findById(req.params.id);

    if (!app) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    //  Update status
    app.status = status;
    await app.save();

    //  If approved → make user teacher
    if (status === "approved") {
      await User.findByIdAndUpdate(app.user, {
        role: "teacher",
      });
    }

    res.json({
      success: true,
      message: `Application ${status}`,
    });

  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ error: error.message });
  }
};


// ADMIN: DELETE 
export const deleteApplication = async (req, res) => {
  try {
    const app = await TeacherApplication.findById(req.params.id);

    if (!app) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    await app.deleteOne();

    res.json({
      success: true,
      message: "Application deleted",
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};