import mongoose from "mongoose";

export interface PaymentAttrs {
  chargeId: string;
  orderId: string;
}

export interface PaymentDoc extends mongoose.Document {
  chargeId: string;
  orderId: string;
  createdAt: Date;
}

export interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: [true, "the orderId is required"],
    },
    chargeId: {
      type: String,
      required: [true, "chargeId is required"],
    },
    createdAt: {
      type: mongoose.Schema.Types.Date,
      default: new Date(),
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

paymentSchema.statics.build = function (attrs: PaymentAttrs): PaymentDoc {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  paymentSchema
);
export { Payment };
