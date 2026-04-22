import express from "express";
import { createCheckoutSession ,paymentSuccess} from "../controllers/paymentController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/checkout",
  protect,
  authorizeRoles("user"), // only student
  createCheckoutSession
);
router.post("/success", protect, paymentSuccess);
export default router;