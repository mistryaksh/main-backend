import mongoose from "mongoose";
import { ProjectProps } from "types";

const ProjectSchema = new mongoose.Schema<ProjectProps>(
     {
          projectName: { type: mongoose.Schema.Types.String, required: true },
          projectDesc: { type: mongoose.Schema.Types.String, max: 2000, required: true },
          subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
          cost: { type: mongoose.Schema.Types.String, required: true },
          deliveryTime: { type: mongoose.Schema.Types.String, required: true },
          status: { type: mongoose.Schema.Types.String, required: true, default: "active" },
     },
     {
          timestamps: true,
     }
);

export const Project = mongoose.model<ProjectProps>("Project", ProjectSchema);
