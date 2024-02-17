import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { catchAsyncErrorFunctionType } from "../types/types.js";

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message ||= "Internal server error";
  err.statusCode ||= 500;

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};



export const CatchAsyncErrors = (
  passedFunction: catchAsyncErrorFunctionType
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(passedFunction(req, res, next)).catch(next);
  };
};
