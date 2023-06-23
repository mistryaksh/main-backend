import { Request, Response } from "express";
import { User, WishList } from "model";
import { IController, IControllerRoutes, UserProps, WishlistProps } from "types";
import { GetUserFromToken, Ok, UnAuthorized } from "utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";
import { ProtectRoute } from "middleware";

export class UserController implements IController {
     public routes: IControllerRoutes[] = [];
     constructor() {
          this.routes.push({
               handler: this.RegisterNewUser,
               method: "POST",
               path: "/sign-up",
          });
          this.routes.push({
               handler: this.LoginUser,
               method: "POST",
               path: "/sign-in",
          });
          this.routes.push({
               handler: this.FindUser,
               method: "GET",
               path: "/users",
          });
          this.routes.push({
               handler: this.LogoutUser,
               method: "GET",
               path: "/sign-out",
          });
          this.routes.push({
               handler: this.UserImageUpdateOnly,
               method: "PUT",
               path: "/update-profile-image",
               middleware: [ProtectRoute],
          });
          this.routes.push({
               handler: this.GetAllWishList,
               method: "GET",
               path: "/wishlist",
               middleware: [ProtectRoute],
          });

          this.routes.push({
               handler: this.NewProjectToWishList,
               method: "POST",
               path: "/wishlist/:userId",
               middleware: [ProtectRoute],
          });
          this.routes.push({
               handler: this.RemoveProjectFromWishList,
               method: "DELETE",
               path: "/wishlist/:projectId",
               middleware: [ProtectRoute],
          });
          this.routes.push({
               handler: this.GetMyWishList,
               method: "GET",
               path: "/my-wishlist",
               middleware: [ProtectRoute],
          });
     }

     public async FindUser(req: Request, res: Response) {
          try {
               const data = await User.find();
               return Ok(res, data);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
     public async RegisterNewUser(req: Request, res: Response) {
          const { email, image, name, password }: UserProps = req.body;
          const hashPassword = bcrypt.hashSync(password, 10);

          if (!email || !image || !name || !password) {
               return UnAuthorized(res, "missing field");
          }

          const OldUser = await User.findOne({ email: email });

          if (OldUser) {
               return UnAuthorized(res, "user is already registered with us");
          }

          const user = new User({
               email,
               image,
               name,
               password: hashPassword,
          }).save();

          return Ok(res, `${name} is registered with us, please login with your email ${email}.`);
     }
     public async LoginUser(req: Request, res: Response) {
          try {
               const { email, password } = req.body;

               if (!email || !password) {
                    return UnAuthorized(res, "missing field");
               }

               const user = await User.findOne({ email: email });
               const passwordRight = bcrypt.compareSync(password, user.password) as Boolean;

               if (!user) {
                    return UnAuthorized(res, "no user found with this email kindly please register");
               }

               if (!passwordRight) {
                    return UnAuthorized(res, "invalid credentials");
               }

               const token = jwt.sign(
                    {
                         id: user._id,
                    },
                    config.get("JWT_SECRET")
               );

               return Ok(res, {
                    token: token,
                    user: user.email,
               });
          } catch (err) {
               console.log(err);
               return UnAuthorized(res, err);
          }
     }
     public async LogoutUser(req: Request, res: Response) {
          try {
               res.removeHeader("authorization");
               return Ok(res, `logout successfully`);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
     public async UserImageUpdateOnly(req: Request, res: Response) {
          try {
               const user = await GetUserFromToken(req);
               const image = req.body.image;

               if (!image) {
                    return UnAuthorized(res, image);
               }

               if (user) {
                    const data = await User.findOneAndUpdate({ _id: user._id }, { $set: { image: image } });
                    return Ok(res, `${data.name} is updated`);
               } else {
                    return UnAuthorized(res, "something went wrong");
               }
          } catch (err) {
               console.log(err);
               return UnAuthorized(res, err);
          }
     }
     public async GetAllWishList(req: Request, res: Response) {
          try {
               const user = await GetUserFromToken(req);
               const data = await WishList.findOne({ user: user._id }).populate({
                    path: "projects",
                    model: "Project",
               });
               return Ok(res, data);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
     public async NewProjectToWishList(req: Request, res: Response) {
          try {
               const userId = req.params.userId;
               const { projects } = req.body;
               const wishlist = await WishList.findOne({ _id: userId });
               const projectByWishlistId = await WishList.findOne({ projects: projects });
               if (projectByWishlistId) {
                    return UnAuthorized(res, "project is already in your wishlist");
               }
               if (!wishlist) {
                    if (!projects) {
                         return UnAuthorized(res, "missing field");
                    }
                    await WishList.create({
                         projects: projects,
                         user: userId,
                    });
                    return Ok(res, "wishlist is created at first time");
               } else {
                    return UnAuthorized(res, "something went wrong");
               }
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
     public async GetMyWishList(req: Request, res: Response) {
          try {
               const user = await GetUserFromToken(req);
               const MyWishlist = await WishList.find({ user: user }).populate({
                    path: "projects",
                    model: "Project",
               });
               return Ok(res, MyWishlist);
          } catch (err) {
               console.log(err);
               return UnAuthorized(res, err);
          }
     }
     public async RemoveProjectFromWishList(req: Request, res: Response) {
          try {
               const projectId = req.params.projectsId;
               await WishList.findOneAndDelete({ project: projectId });
               return UnAuthorized(res, "wishlist removed from your account");
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
}
