import express, { Request, Response } from "express";
require("express-async-errors");
import cookieSession from "cookie-session";

import { currentUser, errorHandler, NotFoundError } from "@ticketiano/common";
import { orderRouter } from "./routes/orders";

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

app.use(currentUser);

// Routes
app.use("/api/orders", orderRouter);

// Not Found handler
app.all("*", async () => {
  throw new NotFoundError();
});

// Error handling middleware
app.use(errorHandler);

export { app };
