import stan from "./nats-client-wrapper";

const start = async () => {
  // check the secret key exists
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
    await stan.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
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

  console.log("⏲ Expiration Service is running");
};

start();
