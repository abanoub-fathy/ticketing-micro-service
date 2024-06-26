import { Router } from "express";
import {
  getCurrentUser,
  siginUser,
  sigupUser,
  signoutUser,
} from "../controllers/user";
import {
  signupValidatos,
  signinValidators,
} from "../validators/validtion-rules";
import { validateRequest, currentUser } from "@ticketiano/common";

const router = Router();

router.get("/current", currentUser, getCurrentUser);
router.post("/signup", signupValidatos, validateRequest, sigupUser);
router.post("/signin", signinValidators, validateRequest, siginUser);
router.post("/signout", signoutUser);

export { router as userRouter };
