import { Request, Response } from "express";
import { ProtectRoute } from "middleware";
import { IController, IControllerRoutes } from "types";

import { Ok, UnAuthorized } from "utils";

export class HomePageController implements IController {
     public routes: IControllerRoutes[] = [];
     constructor() {
          this.routes.push({
               handler: this.Homepage,
               path: "/",
               method: "GET",
               middleware: [ProtectRoute],
          });
     }

     public async Homepage(req: Request, res: Response) {
          try {
               const data = "Hello api is responding";
               return Ok(res, data);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
}
