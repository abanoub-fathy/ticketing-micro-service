import { app } from "./app";
import mongoose from "mongoose";

const start = async () => {
  // check the secret key exists
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📅 Database is connected successfully!");
  } catch (err) {
    console.error(err);
    return;
  }

  app.listen(3000, () => {
    console.log("🔒 Auth service is running on port 3000");
  });
};

start();
