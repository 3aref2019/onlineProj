import { NextFunction, Request, Response } from "express";
import User from "../entities/User";

// middleware to chech if the user is authenticated
export default async (_: Request, res: Response, next: NextFunction) => {
  try {
    const user: User = res.locals.user;
    if (user.role !== "admin") throw new Error("unauthenticated admin");
    return next();
  } catch (error) {
    switch (error.message) {
      case "unauthenticated admin":
        return res.status(401).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
