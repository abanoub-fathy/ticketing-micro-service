import { OrderStatus } from "@ticketiano/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  status: OrderStatus;
  price: number;
}

interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  status: OrderStatus;
  price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
  findByEvent(eventData: {
    id: string;
    version: number;
  }): Promise<OrderDoc | null>;
}

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      values: Object.values(OrderStatus),
      required: [true, "status is required"],
    },
    userId: {
      type: String,
      required: [true, "userId is required"],
    },
    price: {
      type: Number,
      required: [true, "price is required"],
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.statics.build = function (attrs: OrderAttrs): OrderDoc {
  return new Order({
    _id: attrs.id,
    ...attrs,
  });
};

orderSchema.statics.findByEvent = async function (eventData: {
  id: string;
  version: number;
}): Promise<OrderDoc | null> {
  return Order.findOne({
    _id: eventData.id,
    version: eventData.version - 1,
  });
};

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
