import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middlewares/error.js";
import {
  BaseQueryType,
  NewProductRequestBody,
  SearchRequestQueryType,
} from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";

export const newProduct = CatchAsyncErrors(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;

    if (!photo) return next(new ErrorHandler("Please enter photo", 400));

    if (!name || !price || !stock || !category) {
      rm(photo.path, () => {
        console.log("deleted");
      });
      return next(new ErrorHandler("Please enter all fields", 400));
    }
    await Product.create({
      name,
      price,
      stock,
      category: category.toLocaleLowerCase(),
      photo: photo?.path,
    });

    return res.status(201).json({
      success: true,
      message: "Product Created",
    });
  }
);

export const getLatestProducts = CatchAsyncErrors(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);

    return res.status(201).json({
      success: true,
      products,
    });
  }
);

export const getAllCategories = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await Product.distinct("category");

    return res.status(200).json({
      success: true,
      categories,
    });
  }
);

export const getAdminProducts = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find({});

    return res.status(200).json({
      success: true,
      products,
    });
  }
);

export const getSingleProduct = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) return next(new ErrorHandler("Invalid Id", 400));
    const product = await Product.findById(id);

    if (!product) return next(new ErrorHandler("Invalid Id", 400));

    return res.status(200).json({
      success: true,
      product,
    });
  }
);

export const updateProduct = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;

    const product = await Product.findById(id);
    if (!product) return next(new ErrorHandler("Product not found", 404));

    if (photo) {
      rm(product.photo, () => {
        console.log("old photo deleted");
      });

      product.photo = photo.path;
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product Updated",
    });
  }
);

export const deleteProduct = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) return next(new ErrorHandler("Invalid Id", 400));
    const product = await Product.findById(id);

    if (!product) return next(new ErrorHandler("Invalid Id", 400));

    rm(product.photo, () => {
      console.log("Photo deleted");
    });

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  }
);

export const filterAllProducts = CatchAsyncErrors(
  async (
    req: Request<{}, {}, {}, SearchRequestQueryType>,
    res: Response,
    next: NextFunction
  ) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    const baseQuery: BaseQueryType = {};

    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };

    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };

    if (category) baseQuery.category = category;

    const [products, filteredOnlyProducts] = await Promise.all([
      Product.find(baseQuery)
        .sort(sort ? { price: sort === "asc" ? 1 : -1 } : undefined)
        .limit(limit)
        .skip(skip),

      Product.find(baseQuery),
    ]);

    // const products = await Product.find(baseQuery)
    //   .sort(sort ? { price: sort === "asc" ? 1 : -1 } : undefined)
    //   .limit(limit)
    //   .skip(skip);

    // const filteredOnlyProducts = await Product.find(baseQuery);

    const totalPage = Math.ceil(filteredOnlyProducts.length / limit);

    return res.status(200).json({
      success: true,
      products,
      totalPage,
    });
  }
);
