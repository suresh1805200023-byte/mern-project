import express from "express";
import { createTicket, getTickets, updateTicket,getMyTickets} from "../controllers/supportController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTicket);
router.get("/my", protect, getMyTickets);
router.get("/", protect, authorizeRoles("admin"), getTickets);


router.put("/:id", protect, authorizeRoles("admin"), updateTicket);

export default router;