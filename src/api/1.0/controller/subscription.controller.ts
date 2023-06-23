import { Request, Response } from "express";
import { IController, IControllerRoutes } from "types";
import { Ok, UnAuthorized, mailer } from "utils";
import { Subscription } from "model";
import config from "config";

export class SubscriptionController implements IController {
     public routes: IControllerRoutes[] = [];

     constructor() {
          // subscription api
          this.routes.push({
               handler: this.ContactUs,
               method: "POST",
               path: "/contact-us",
          });
          this.routes.push({
               handler: this.GetAllSubscription,
               method: "GET",
               path: "/get-all-subscription",
          });
     }

     // contact / subscription api start
     public async ContactUs(req: Request, res: Response) {
          try {
               const { email, message } = req.body;
               if (!email || !message) {
                    return UnAuthorized(res, "invalid fields");
               }

               await mailer.sendMail({
                    from: config.get("MAIL_USER"),
                    to: email,
                    subject: "Hello you have subscribed with us",
                    html: `
                    <h1>You have subscripted with us.</h1>
                    <p>${await email} is successfully registered with us, you will get notified every time whenever new offer's or any sale are on the line.</p>
                    `,
               });

               await new Subscription({
                    email,
                    message,
               }).save();

               return Ok(res, `${email} is subscribed`);
          } catch (err) {
               console.log("");
               return UnAuthorized(res, err);
          }
     }

     public async GetAllSubscription(req: Request, res: Response) {
          try {
               const data = await Subscription.find();
               return Ok(res, data);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
     // contact / subscription api end
}
