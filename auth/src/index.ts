import { app } from "./app";
import mongoose from "mongoose";

const start = async () => {
  // check the secret key exists
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY must be defined");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("📅 Database is connected successfully!");
  } catch (err) {
    console.error(err);
    return;
  }

  app.listen(3000, () => {
    console.log("🔒 Auth Service is running on port 3000");
  });
};

start();
