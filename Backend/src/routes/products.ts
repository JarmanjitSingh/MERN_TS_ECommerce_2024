import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  deleteProduct,
  filterAllProducts,
  getAdminProducts,
  getAllCategories,
  getLatestProducts,
  getSingleProduct,
  newProduct,
  updateProduct,
} from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// route -  /api/v1/product/new
router.post("/new", adminOnly, singleUpload, newProduct);

router.get("/latest", getLatestProducts);

router.get("/categories", getAllCategories);

router.get("/admin-products", adminOnly, getAdminProducts);

router.get("/filter", filterAllProducts)

router
  .route("/:id")
  .get(getSingleProduct)
  .put(adminOnly, singleUpload, updateProduct)
  .delete(adminOnly, deleteProduct);


export default router;
