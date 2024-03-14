import { Subjects } from "../subjects";

export interface OrderExpirationComplete {
  subject: Subjects.OrderExpirationComplete;
  data: {
    orderId: string;
  };
}
