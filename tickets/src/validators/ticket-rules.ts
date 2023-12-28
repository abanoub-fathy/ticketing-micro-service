import { body } from "express-validator";

export const createTicketValidators = [
  body("title")
    .trim()
    .toLowerCase()
    .exists()
    .notEmpty()
    .withMessage("Please enter a vaild title"),
  body("price")
    .exists()
    .isFloat({ gt: 0 })
    .withMessage("Please enter a vaild price"),
];
