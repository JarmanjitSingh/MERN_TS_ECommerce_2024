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
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

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

    await invalidateCache({ product: true });

    return res.status(201).json({
      success: true,
      message: "Product Created",
    });
  }
);

// Revalidate caching on New, Update, Delete product and on New Order
export const getLatestProducts = CatchAsyncErrors(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    let products;

    if (myCache.has("latest-product"))
      products = JSON.parse(myCache.get("latest-product") as string);
    else {
      products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
      myCache.set("latest-product", JSON.stringify(products));
    }

    return res.status(201).json({
      success: true,
      products,
    });
  }
);

// Revalidate caching on New, Update, Delete product and on New Order
export const getAllCategories = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    let categories;

    if (myCache.has("categories"))
      categories = JSON.parse(myCache.get("categories") as string);
    else {
      categories = await Product.distinct("category");
      myCache.set("categories", JSON.stringify(categories));
    }

    return res.status(200).json({
      success: true,
      categories,
    });
  }
);

// Revalidate caching on New, Update, Delete product and on New Order
export const getAdminProducts = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    let products;
    if (myCache.has("all-products"))
      products = JSON.parse(myCache.get("all-products") as string);
    else {
      products = await Product.find({});
      myCache.set("all-products", JSON.stringify(products));
    }

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

    let product;

    if (myCache.has(`product-${id}`))
      product = JSON.parse(myCache.get(`product-${id}`) as string);
    else {
      product = await Product.findById(id);
      myCache.set(`product-${id}`, JSON.stringify(product));
    }

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

    await invalidateCache({ product: true, productId: String(product._id) });

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

    await invalidateCache({ product: true, productId: String(product._id) });

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
