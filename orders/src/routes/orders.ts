import { Router } from "express";
import { requireAuth, validateRequest } from "@ticketiano/common";
import { createOrderRules } from "../validators/order-rules";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrder,
} from "../controllers/orders";

const router = Router();

router.get("/", getAllOrders);
router.get("/:orderId", getOrder);
router.post("/", requireAuth, createOrderRules, validateRequest, createOrder);
router.delete("/:orderId", deleteOrder);

export { router as orderRouter };
