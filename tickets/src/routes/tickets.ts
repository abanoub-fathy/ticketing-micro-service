import { Router } from "express";
import {
  createTicket,
  getAllTickets,
  getTicket,
  updateTicket,
} from "../controllers/tickets";
import { requireAuth, validateRequest } from "@ticketiano/common";
import {
  createTicketValidators,
  updateTicketValidators,
} from "../validators/ticket-rules";

const router = Router();

router.post(
  "/",
  requireAuth,
  createTicketValidators,
  validateRequest,
  createTicket
);

router.get("/:id", getTicket);
router.get("/", getAllTickets);
router.put(
  "/:id",
  requireAuth,
  updateTicketValidators,
  validateRequest,
  updateTicket
);

export { router as ticketRouter };
