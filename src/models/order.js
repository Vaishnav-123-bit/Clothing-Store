import mongoose from "mongoose";
import Product from "./product";
import User from "../models/user.js";

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        qty: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Fix the reference to "Product" model
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true, default: "Stripe" },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false }, // Fix default value
    paidAt: { type: Date }, // Remove required here if it's not always present
    isProcessing: { type: Boolean, default: true }, // Fix default value
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
