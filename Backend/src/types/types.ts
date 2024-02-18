import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  _id: string;
  dob: Date;
}

export interface NewProductRequestBody {
  name: string;
  category: string;
  price: number;
  stock: number;
  photo: string
}

export type catchAsyncErrorFunctionType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void |Response<any, Record<string, any>>>;
