import mongoose from "mongoose";
import { CategoryProps } from "types/category.interface";

const SubCategorySchema = new mongoose.Schema<CategoryProps>(
     {
          label: { type: mongoose.Schema.Types.String, required: true },
          category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
     },
     {
          timestamps: true,
     }
);

export const SubCategory = mongoose.model("SubCategory", SubCategorySchema);
