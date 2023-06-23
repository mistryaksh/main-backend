import mongoose from "mongoose";
import { UserProps } from "types";

const UserSchema = new mongoose.Schema<UserProps>(
     {
          name: { type: mongoose.Schema.Types.String, required: true },
          email: { type: mongoose.Schema.Types.String, required: true },
          password: { type: mongoose.Schema.Types.String, required: true },
          image: { type: mongoose.Schema.Types.String, required: true },
     },
     {
          timestamps: true,
     }
);

export const User = mongoose.model("User", UserSchema);

UserSchema.virtual("wishlists", {
     ref: "Wishlists",
     localField: "_id",
     foreignField: "user",
});
