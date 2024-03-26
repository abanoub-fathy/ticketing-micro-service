import { Request, Response } from "express";
import { Order } from "../models/order";
import {
  NotFoundError,
  BadRequestError,
  OrderStatus,
  UnAuthenticatedError,
} from "@ticketiano/common";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import natsClientWrapper from "../nats-client-wrapper";

export const createNewPayment = async (req: Request, res: Response) => {
  const { orderId, token } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new UnAuthenticatedError(
      "could not pay to order deos not belong to the same user"
    );
  }

  if (order.status === OrderStatus.Cancelled) {
    throw new BadRequestError("could not pay to a cancelled order");
  }

  const charge = await stripe.charges.create({
    amount: order.price * 100,
    source: token,
    currency: "usd",
  });

  const payment = await Payment.build({
    chargeId: charge.id,
    orderId: orderId,
  }).save();

  new PaymentCreatedPublisher(natsClientWrapper.client);

  res.status(201).send(payment);
};
