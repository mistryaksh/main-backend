import mongoose from "mongoose";

export interface WishlistProps {
     projects: mongoose.Schema.Types.ObjectId;
     user: string;
}
