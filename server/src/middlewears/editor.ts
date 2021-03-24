import { NextFunction, Request, Response } from "express";
import User from "../entities/User";

// middleware to chech if the user is authenticated
export default async (_: Request, res: Response, next: NextFunction) => {
  try {
    const user: User = res.locals.user;
    if (user.role === "editor" || user.role === "admin") return next();
    else throw new Error("unauthenticated editor");
  } catch (error) {
    switch (error.message) {
      case "unauthenticated editor":
        return res.status(401).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
