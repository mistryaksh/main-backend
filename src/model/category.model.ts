import mongoose from "mongoose";
import { CategoryProps } from "types/category.interface";

const CategorySchema = new mongoose.Schema<CategoryProps>(
     {
          label: { type: mongoose.Schema.Types.String, required: true },
          desc: { type: mongoose.Schema.Types.String },
     },
     {
          timestamps: true,
     }
);

export const Category = mongoose.model("Category", CategorySchema);
