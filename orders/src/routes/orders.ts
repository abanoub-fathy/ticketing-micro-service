import { Router } from "express";
import { requireAuth, validateRequest } from "@ticketiano/common";
import { createOrderRules, fetchOrderRules } from "../validators/order-rules";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrder,
} from "../controllers/orders";

const router = Router();

router.get("/", requireAuth, getAllOrders);
router.get(
  "/:orderId",
  fetchOrderRules,
  validateRequest,
  requireAuth,
  getOrder
);
router.post("/", requireAuth, createOrderRules, validateRequest, createOrder);
router.delete(
  "/:orderId",
  requireAuth,
  fetchOrderRules,
  validateRequest,
  deleteOrder
);

export { router as orderRouter };
