import { Message, Stan, SubscriptionOptions } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  // abstract
  abstract onMessage(data: T["data"], message: Message): void;
  abstract subject: T["subject"];
  abstract queueGroupName: string;

  // protected
  protected ackWaitTime = 5 * 1000;
  protected client: Stan;

  // constructor
  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions(): SubscriptionOptions {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setDurableName(`${this.queueGroupName}-durable`)
      .setManualAckMode(true)
      .setAckWait(this.ackWaitTime);
  }

  subscribe() {
    const subscribtion = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscribtion.on("message", (msg: Message) => {
      console.log(`➡️ Msg: ${this.subject}/${this.queueGroupName} `);

      const parsedDate = this.parseMessage(msg);
      this.onMessage(parsedDate, msg);
    });
  }

  parseMessage(msg: Message): any {
    const data = msg.getData();

    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf-8"));
  }
}
