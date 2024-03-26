import { OrderStatus } from "../types/order-status";

export interface paymentCreatedEvent {
  subject: OrderStatus.Completed;
  data: {
    id: string;
    orderId: string;
    chargeId: string;
  };
}
