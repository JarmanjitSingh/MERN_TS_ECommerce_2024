import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";

export const newOrder = CatchAsyncErrors(
  async (
    req: Request<{}, {}, NewOrderRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const {
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    } = req.body;

    if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !total)
      return next(new ErrorHandler("Please Enter All Fields", 400));

    await Order.create({
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    });

    await reduceStock(orderItems);
    await invalidateCache({ product: true, order: true, admin: true });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
    });
  }
);

export const myOrders = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;

    let orders = [];

    if (myCache.has(`my-orders-${id}`))
      orders = JSON.parse(myCache.get(`my-orders-${id}`) as string);
    else {
      orders = await Order.find({ user: id }).populate("user", "name");
      myCache.set(`my-orders-${id}`, JSON.stringify(orders));
    }

    return res.status(200).json({
      success: true,
      orders,
    });
  }
);

export const allOrders = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    let orders = [];

    if (myCache.has(`all-orders`))
      orders = JSON.parse(myCache.get(`all-orders`) as string);
    else {
      orders = await Order.find();
      myCache.set(`all-orders`, JSON.stringify(orders));
    }

    return res.status(200).json({
      success: true,
      orders,
    });
  }
);

export const getSingleOrder = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let key = `order-${id}`;

    let order;

    if (myCache.has(key)) order = JSON.parse(myCache.get(key) as string);
    else {
      order = await Order.findById(id).populate("user", "name");
      if (!order) return next(new ErrorHandler("Order not found", 404));
      myCache.set(key, JSON.stringify(order));
    }

    return res.status(200).json({
      success: true,
      order,
    });
  }
);

export const processOrder = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) return next(new ErrorHandler("Order not found", 404));

    switch (order.status) {
      case "Processing":
        order.status = "Shipped";
        break;
      case "Shipped":
        order.status = "Delivered";
        break;
      default:
        order.status = "Delivered";
        break;
    }

    await order.save();

    invalidateCache({
      product: false,
      order: true,
      admin: true,
      userId: order.user,
      orderId: String(order._id),
    });

    return res.status(200).json({
      success: true,
      message: "Order processed successfully",
    });
  }
);

export const deleteOrder = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) return next(new ErrorHandler("Order not found", 404));

    await order.deleteOne();

    invalidateCache({
      product: false,
      order: true,
      admin: true,
      userId: order.user,
      orderId: String(order._id),
    });

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  }
);
