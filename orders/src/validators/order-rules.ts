import { body } from "express-validator";

export const createOrderRules = [
  body("ticketId")
    .notEmpty()
    .isMongoId()
    .withMessage("ticketId is required and should be a valid id"),
];
