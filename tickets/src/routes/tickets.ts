import { Router } from "express";
import { createTicket, getTicket } from "../controllers/tickets";
import { requireAuth, validateRequest } from "@ticketiano/common";
import { createTicketValidators } from "../validators/ticket-rules";

const router = Router();

router.post(
  "/",
  requireAuth,
  createTicketValidators,
  validateRequest,
  createTicket
);

router.get("/:id", getTicket);

export { router as ticketRouter };
