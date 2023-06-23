"use-strict";

import { Request, Response } from "express";
import { Category, SubCategory } from "model";
import { IController, IControllerRoutes } from "types";
import { CategoryProps, SubCategoryProps } from "types/category.interface";
import { Ok, UnAuthorized } from "utils";

export class CategoryController implements IController {
     public routes: IControllerRoutes[] = [];
     constructor() {
          // Categories
          this.routes.push({
               handler: this.NewCategory,
               method: "POST",
               path: "/category",
          });
          this.routes.push({
               handler: this.NewSubCategory,
               method: "POST",
               path: "/sub-category",
          });

          // Sub Categories
          this.routes.push({
               handler: this.GetCategories,
               method: "GET",
               path: "/category",
          });
          this.routes.push({
               handler: this.GetSubCategories,
               method: "GET",
               path: "/sub-category",
          });
     }

     // Categories
     public async NewCategory(req: Request, res: Response) {
          try {
               const { label, desc }: CategoryProps = req.body;

               if (!label) {
                    return UnAuthorized(res, "missing fields");
               }

               const NewCategory = new Category({
                    label,
                    desc,
               }).save();

               return Ok(res, `${label} is created`);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
     public async GetCategories(req: Request, res: Response) {
          try {
               const data = await Category.find();
               return Ok(res, data);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     // Sub categories
     public async GetSubCategories(req: Request, res: Response) {
          try {
               const data = await SubCategory.find().populate("category", "label");
               return Ok(res, data);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
     public async NewSubCategory(req: Request, res: Response) {
          try {
               const { category, label }: SubCategoryProps = req.body;

               if (!label || !category) {
                    return UnAuthorized(res, "missing fields");
               }

               const NewSubCategory = new SubCategory({
                    category,
                    label,
               }).save();

               return Ok(res, `${label} is created`);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
}
