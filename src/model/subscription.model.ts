import mongoose from "mongoose";
import { SubscriptionProps } from "types";

const SubscriptionSchema = new mongoose.Schema<SubscriptionProps>(
     {
          email: { type: mongoose.Schema.Types.String, required: true },
          message: { type: mongoose.Schema.Types.String, required: true },
     },
     {
          timestamps: true,
     }
);

export const Subscription = mongoose.model("Subscription", SubscriptionSchema);
