import Support from "../models/Support.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const createTicket = async (req, res) => {
  try {
    const ticket = await Support.create({
      user: req.user.id,
      category: req.body.category,
      priority: req.body.priority,
      message: req.body.message,
    });

    const admins = await User.find({ role: "admin" }).select("_id");
    if (admins.length > 0) {
      await Notification.insertMany(
        admins.map((admin) => ({
          recipient: admin._id,
          type: "help_center_message",
          title: "New help center message",
          message: `A new support message was submitted by ${req.user.name || "a user"}.`,
          link: "/admin",
        }))
      );
    }

    res.json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADMIN VIEW
export const getTickets = async (req, res) => {
  try {
    const tickets = await Support.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updateTicket = async (req, res) => {
  try {
    const ticket = await Support.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.reply = req.body.reply || ticket.reply;
    ticket.status = req.body.status || ticket.status;

    await ticket.save();

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  USER / TEACHER TICKETS
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Support.find({
      user: req.user.id, //  IMPORTANT
    }).sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};