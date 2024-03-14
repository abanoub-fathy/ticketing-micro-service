import Queue from "bull";
import natsClientWrapper from "../nats-client-wrapper";
import { OrderExpirationCompletePublisher } from "../events/publishers/order-expiration-complete-publisher";

interface Payload {
  orderId: string;
}

export const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

// processing jobs from the queue
expirationQueue.process(async (job) => {
  console.table([{ orderId: job.data.orderId }]);

  await new OrderExpirationCompletePublisher(natsClientWrapper.client).publish({
    orderId: job.data.orderId,
  });
});
