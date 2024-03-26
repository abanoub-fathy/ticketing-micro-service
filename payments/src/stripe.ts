import Stripe from "stripe";

// TODO: don't forget to create a stripe secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});
