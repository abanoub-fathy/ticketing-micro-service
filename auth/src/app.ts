import express from "express";
require("express-async-errors");
import cookieSession from "cookie-session";

import { userRouter } from "./routes/user";
import { errorHandler, NotFoundError } from "@ticketiano/common";

const app = express();
app.set("trust proxy", true);

app.use(express.json());
app.use(
  cookieSession({
    httpOnly: true,
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

// Routes
app.use("/api/users", userRouter);

// Not Found handler
app.all("*", async () => {
  throw new NotFoundError();
});

// Error handling middleware
app.use(errorHandler);

export { app };
