import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { CatchAsyncErrors } from "../middlewares/error.js";

export const newUser = CatchAsyncErrors(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, photo, gender, _id, dob } = req.body;

    let user = await User.findById(_id);

    if (user)
      return res.status(200).json({
        success: true,
        message: `Welcome Back, ${user.name}`,
      });

    if (!name || !email || !photo || !gender || !_id || !dob)
      return next(new ErrorHandler("Please fill all fields", 400));

    user = await User.create({ name, email, photo, gender, _id, dob });

    return res.status(201).json({
      success: true,
      message: `Welcome, ${user.name}`,
    });
  }
);

export const getAllUsers = CatchAsyncErrors(async (req, res, next) => {
  const users = await User.find({});

  return res.status(200).json({
    success: true,
    users,
  });
});

export const getSingleUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) return next(new ErrorHandler("Invalid Id", 400));

    return res.status(200).json({
      success: true,
      user,
    });
  }
);

export const deleteUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) return next(new ErrorHandler("Invalid Id", 400));

    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  }
);
