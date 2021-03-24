import { NextFunction, Request, Response } from "express";
import User from "../entities/User";

// middleware to chech if the user is authenticated
export default async (_: Request, res: Response, next: NextFunction) => {
  try {
    const user: User | undefined = res.locals.user;
    if (!user) throw new Error("unauthenticated");
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "unauthenticated" });
  }
};
