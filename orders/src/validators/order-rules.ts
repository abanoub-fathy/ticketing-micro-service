import { body, param } from "express-validator";

export const fetchOrderRules = [
  param("orderId").isMongoId().withMessage("orderId is not valid"),
];

export const createOrderRules = [
  body("ticketId")
    .notEmpty()
    .isMongoId()
    .withMessage("ticketId is required and should be a valid id"),
];
