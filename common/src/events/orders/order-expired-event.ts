import { Subjects } from "../subjects";

export interface OrderExpiredEvent {
  subject: Subjects.OrderExpired;
  data: {
    orderId: string;
  };
}
