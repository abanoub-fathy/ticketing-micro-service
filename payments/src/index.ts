import { app } from "./app";
import mongoose from "mongoose";
import stan from "./nats-client-wrapper";
import natsClientWrapper from "./nats-client-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const start = async () => {
  // check the secret key exists
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }

  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📅 Database is connected successfully!");

    await stan.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    stan.client.on("close", () => {
      console.log("closing down the listener");
      process.exit();
    });

    // subscribe/listen to events
    new OrderCreatedListener(natsClientWrapper.client).subscribe();

    process.on("SIGINT", () => stan.client.close());
    process.on("SIGTERM", () => stan.client.close());
  } catch (err) {
    console.error(err);
    return;
  }

  app.listen(3000, () => {
    console.log("💸 Payments Service is running on port 3000");
  });
};

start();
