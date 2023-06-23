import { Express } from "express";
import { IController } from "types";
import {
     CategoryController,
     HomePageController,
     ProjectController,
     SubscriptionController,
     UserController,
} from "./controller";

const routesHandler = (express: Express, controller: IController) => {
     for (const route of controller.routes) {
          const middleware = route.middleware || [];
          switch (route.method) {
               case "GET":
                    express.get(`/api/1.0${route.path}`, ...middleware, route.handler);
                    break;
               case "POST":
                    express.post(`/api/1.0${route.path}`, ...middleware, route.handler);
                    break;
               case "PUT":
                    express.put(`/api/1.0${route.path}`, ...middleware, route.handler);
                    break;
               case "DELETE":
                    express.delete(`/api/1.0${route.path}`, ...middleware, route.handler);
                    break;
               default:
                    break;
          }
     }
};

export const registerRoutesV1 = (express: Express) => {
     routesHandler(express, new HomePageController());
     routesHandler(express, new SubscriptionController());
     routesHandler(express, new CategoryController());
     routesHandler(express, new ProjectController());
     routesHandler(express, new UserController());
};
