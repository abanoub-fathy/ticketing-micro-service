import { OrderStatus } from "@ticketiano/common";
import mongoose from "mongoose";
import { TicketDoc } from "./ticket";

export { OrderStatus };

interface OrderAttrs {
  userId: String;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: String;
  status: OrderStatus;
  createdAt: Date;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "userId is required"],
  },
  status: {
    type: String,
    required: [true, "status is required"],
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created,
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    required: true,
    default: Date.now(),
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date,
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
  },
});

orderSchema.statics.build = function (attrs: OrderAttrs): OrderDoc {
  return new Order(attrs);
};

orderSchema.methods.toJSON = function () {
  var obj = this.toObject();

  delete obj.__v;

  obj.id = obj._id;
  delete obj._id;

  return obj;
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
