import { requireAuth, validateRequest } from "@ticketiano/common";
import { Router } from "express";
import { newPaymentRules } from "../validators/payments-rules";
import { createNewPayment } from "../controllers/payment-controller";

const router = Router();

router.post(
  "/",
  requireAuth,
  newPaymentRules,
  validateRequest,
  createNewPayment
);

export { router as paymentRouter };
