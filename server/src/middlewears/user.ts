import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../entities/User";

// middleware to chech if the user is authenticated
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.cookies.token);
    // get token from cookies
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "unauthenticated" });
    // if token exists,  verify if it's valid
    const { user }: any = jwt.verify(token, process.env.JWT_SECRET!);
    console.log(user);
    const foundUser = await User.findOne({ id: user });
    console.log(foundUser);
    // return the user and call next
    res.locals.user = foundUser;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "unauthenticated" });
  }
};
