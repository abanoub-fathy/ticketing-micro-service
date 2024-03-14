import { Subjects } from "../subjects";

export interface OrderExpirationCompleteEvent {
  subject: Subjects.OrderExpirationComplete;
  data: {
    orderId: string;
  };
}
