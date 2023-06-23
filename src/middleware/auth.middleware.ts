import { Request, Response, NextFunction } from "express";

import config from "config";
import jwt from "jsonwebtoken";

import { BadRequest, GetToken, Ok, UnAuthorized } from "utils";

export const ProtectRoute = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const token = GetToken(req);
          if (!token) {
               return BadRequest(res, "missing token");
          }
          const verified = jwt.verify(token, config.get("JWT_SECRET")) as any;
          if (verified) {
               next();
          } else {
               return BadRequest(res, "token is not valid");
          }
     } catch (err) {
          return UnAuthorized(res, err);
     }
};
