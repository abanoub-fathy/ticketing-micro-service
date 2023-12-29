import mongoose from "mongoose";

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required"],
  },
  price: {
    type: Number,
    required: [true, "price is required"],
  },
  userId: {
    type: String,
    required: [true, "userId is required"],
  },
});

ticketSchema.statics.build = function (attrs: TicketAttrs): TicketDoc {
  return new Ticket(attrs);
};

ticketSchema.methods.toJSON = function () {
  var obj = this.toObject();

  delete obj.__v;

  obj.id = obj._id;
  delete obj._id;

  return obj;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);
export { Ticket };
