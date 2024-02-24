import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";
import { Coupon } from "../models/coupon.js";
import { stripe } from "../app.js";


export const createPaymentIntent = CatchAsyncErrors(async(req:Request, res: Response, next: NextFunction)=>{
  const { amount } = req.body;

  if (!amount) return next(new ErrorHandler("Please enter amount", 400));

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: "inr",
  });

  return res.status(201).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
})

export const newCoupon = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { coupon, amount } = req.body;

    if (!coupon || !amount)
      return next(new ErrorHandler("Please enter all feilds", 400));

    await Coupon.create({
      code: coupon,
      amount,
    });

    res.status(201).json({
      success: true,
      message: `Coupon ${coupon} created successfully`,
    });
  }
);

export const applyCoupon = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { coupon } = req.query;

    const discount = await Coupon.findOne({ code: coupon });
    if (!discount) return next(new ErrorHandler("Invalid coupon", 400));

    res.status(200).json({
      success: true,
      discount: discount.amount,
    });
  }
);

export const allCoupons = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const coupons = await Coupon.find();

    res.status(200).json({
      success: true,
      coupons,
    });
  }
);

export const deleteCoupon = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) return next(new ErrorHandler("Invalid coupon", 400));

    res.status(200).json({
      success: true,
      message: `Coupon ${coupon.code} deleted successfully`,
    });
  }
);
