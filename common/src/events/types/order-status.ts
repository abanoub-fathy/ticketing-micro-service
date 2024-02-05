export enum OrderStatus {
  // the initial status of the order
  Created = "created",

  // when the user cancel the order
  // or when the order expires before payment
  // or  when the user try to book a ticket that has already been reserved
  Cancelled = "cancelled",

  AwaitingPayment = "awaiting:payment",

  // When the order is paid successfully
  Completed = "completed",
}
