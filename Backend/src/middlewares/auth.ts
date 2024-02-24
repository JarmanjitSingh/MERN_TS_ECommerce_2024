import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "./error.js";
import ErrorHandler from "../utils/utility-class.js";
import { User } from "../models/user.js";

export const adminOnly = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;

    if (!id) return next(new ErrorHandler("Login first", 400));

    const user = await User.findById(id);
    if (!user) return next(new ErrorHandler("Invalid id", 400));

    if (user.role !== "admin")
      return next(new ErrorHandler("You are not authorized as admin", 403));

    next();
  }
);
