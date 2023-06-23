import mongoose from "mongoose";
import { WishlistProps } from "types";

const WishlistSchema = new mongoose.Schema<WishlistProps>(
     {
          projects: {
               type: mongoose.Schema.Types.ObjectId,
               required: true,
               ref: "Projects",
          },
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
     },
     {
          timestamps: true,
     }
);

export const WishList = mongoose.model("Wishlist", WishlistSchema);
