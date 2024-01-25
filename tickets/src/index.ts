import { app } from "./app";
import mongoose from "mongoose";
import stan from "./nats-client-wrapper";

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

    await stan.connect("ticketing", "sdsdsd", "http://nats-srv:4222");
    stan.client.on("close", () => {
      console.log("closing down the listener");
      process.exit();
    });

    process.on("SIGINT", () => stan.client.close());
    process.on("SIGTERM", () => stan.client.close());
  } catch (err) {
    console.error(err);
    return;
  }

  app.listen(3000, () => {
    console.log("🎫 Tickets Service is running on port 3000");
  });
};

start();
