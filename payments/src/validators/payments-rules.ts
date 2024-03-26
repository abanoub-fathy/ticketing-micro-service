import { body } from "express-validator";

export const newPaymentRules = [
  body("orderId").trim().isMongoId().notEmpty(),
  body("token").trim().notEmpty(),
];
