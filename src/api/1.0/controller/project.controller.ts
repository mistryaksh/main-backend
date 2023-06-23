import { Request, Response } from "express";
import { Project } from "model";
import { IController, IControllerRoutes, ProjectProps } from "types";
import { Ok, UnAuthorized } from "utils";

export class ProjectController implements IController {
     public routes: IControllerRoutes[] = [];
     constructor() {
          this.routes.push({
               handler: this.NewProject,
               method: "POST",
               path: "/projects",
          });

          this.routes.push({
               handler: this.GetProjects,
               method: "GET",
               path: "/projects",
          });

          this.routes.push({
               handler: this.GetProjectById,
               method: "GET",
               path: "/projects/:id",
          });

          this.routes.push({
               handler: this.UpdateProjectStatus,
               method: "PUT",
               path: "/projects/:id",
          });
          this.routes.push({
               handler: this.DeleteProjectStatus,
               method: "DELETE",
               path: "/projects/:id",
          });
     }

     public async NewProject(req: Request, res: Response) {
          try {
               const { cost, deliveryTime, projectDesc, projectName, subCategory }: ProjectProps = req.body;

               if (!cost || !deliveryTime || !projectDesc || !projectName || !subCategory) {
                    return UnAuthorized(res, "missing fields");
               }

               if (projectDesc.toString().length >= 2000) {
                    return UnAuthorized(res, "project description should be in 3000 letters");
               }

               const NewProject = new Project({
                    cost,
                    deliveryTime,
                    projectDesc,
                    projectName,
                    subCategory,
               }).save();

               return Ok(res, `${(await NewProject).projectName} is uploaded`);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async GetProjects(req: Request, res: Response) {
          try {
               const data = await Project.find({ status: "active" }).populate({
                    path: "subCategory",
                    model: "SubCategory",
                    populate: {
                         path: "category",
                         model: "Category",
                         select: "label",
                    },
               });
               return Ok(res, data);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
     public async GetProjectById(req: Request, res: Response) {
          try {
               const data = await Project.findById({ _id: req.params.id });
               return Ok(res, data);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
     public async UpdateProjectStatus(req: Request, res: Response) {
          try {
               const id = req.params.id;
               const data = await Project.findById({ _id: id });

               if (!data) {
                    return UnAuthorized(res, `no project found`);
               }

               if (data.status === "active") {
                    await Project.findByIdAndUpdate({ _id: id }, { $set: { status: "pause" } });
                    return Ok(res, `${data.projectName} status is updated`);
               }
               if (data.status === "pause") {
                    await Project.findByIdAndUpdate({ _id: id }, { $set: { status: "active" } });
                    return Ok(res, `${data.projectName} status is updated`);
               }
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
     public async DeleteProjectStatus(req: Request, res: Response) {
          try {
               const data = await Project.findByIdAndDelete({ _id: req.params.id });
               return Ok(res, `${data.projectName} is deleted`);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
}
