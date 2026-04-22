import PDFDocument from "pdfkit";
import Progress from "../models/Progress.js";
import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

export const downloadCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;

    const progress = await Progress.findOne({
      user: req.user.id,
      course: courseId,
    });

    const totalLessons = await Lesson.countDocuments({
      course: courseId,
    });

    if (!progress || (progress.completedLessons?.length || 0) < totalLessons) {
      return res.status(400).json({ message: "Complete course first" });
    }

    const user = await User.findById(req.user.id);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ message: "User or Course not found" });
    }

    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${course.title}-certificate.pdf`
    );

    doc.pipe(res);

    //  DESIGN
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();

    doc.font("Helvetica-Bold").fontSize(40).text("CERTIFICATE", {
      align: "center",
    });

    doc.moveDown(0.5);

    doc.fontSize(20).text("OF COMPLETION", { align: "center" });

    doc.moveDown(2);

    doc.font("Helvetica").fontSize(18).text("This is to certify that", {
      align: "center",
    });

    doc.moveDown();

    doc.font("Helvetica-Bold").fontSize(30).text(user.name, {
      align: "center",
    });

    doc.moveDown();

    doc.font("Helvetica").fontSize(18).text(
      "has successfully completed the course",
      { align: "center" }
    );

    doc.moveDown();

    doc.font("Helvetica-Bold").fontSize(24).text(course.title, {
      align: "center",
    });

    doc.moveDown(2);

    doc.fontSize(14).text(`Date: ${new Date().toDateString()}`, {
      align: "center",
    });

    doc.moveDown(4);

    doc.text("_______________________", 150, 450);
    doc.text("Instructor Signature", 150, 470);

    doc.text("_______________________", 600, 450);
    doc.text("Authorized Signature", 600, 470);

    doc.end();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};