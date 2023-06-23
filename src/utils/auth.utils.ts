import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "model";
import config from "config";

export const GetToken = (req: Request) => {
     return req.headers.authorization;
};

export const GetUserFromToken = async (req: Request) => {
     const token = GetToken(req);
     const verified = jwt.verify(token, config.get("JWT_SECRET")) as any;
     const user = await User.findOne({ _id: verified.id });
     return user;
};
