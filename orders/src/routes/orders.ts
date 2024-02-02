import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrder,
} from "../controllers/orders";

const router = Router();

router.get("/", getAllOrders);
router.get("/:orderId", getOrder);
router.post("/", createOrder);
router.delete("/:orderId", deleteOrder);

export { router as orderRouter };
