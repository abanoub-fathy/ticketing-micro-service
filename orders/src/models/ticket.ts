import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
  id?: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  version: number;
  title: string;
  price: number;

  isReserved(): Promise<boolean>;
}

export interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "ticket should have a title"],
    },
    price: {
      type: Number,
      min: 0,
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

ticketSchema.statics.build = function (attrs: TicketAttrs): TicketDoc {
  let modifiedAttrs: any = {
    ...attrs,
  };

  if (attrs.id) {
    modifiedAttrs._id = attrs.id;
    delete modifiedAttrs.id;
  }

  return new Ticket(modifiedAttrs);
};

ticketSchema.statics.findByEvent = function (data: {
  id: string;
  version: number;
}): Promise<TicketDoc | null> {
  return Ticket.findOne({
    _id: data.id,
    version: data.version - 1,
  });
};

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Completed,
      ],
    },
  });

  return existingOrder ? true : false;
};

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
