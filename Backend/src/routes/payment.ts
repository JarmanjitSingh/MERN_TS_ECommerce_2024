import express from "express";
import {
  allCoupons,
  applyCoupon,
  createPaymentIntent,
  deleteCoupon,
  newCoupon,
} from "../controllers/payment.js";
import { adminOnly } from "../middlewares/auth.js";

const router = express.Router();

// route - /api/v1/payment/create
router.route("/create").post(createPaymentIntent);

//route - /api/v1/payment/coupon/new
router.route("/coupon/new").post(adminOnly, newCoupon);

router.route("/coupon/apply").get(applyCoupon);

router.route("/coupon/all").get(adminOnly, allCoupons);

router.route("/coupon/:id").delete(adminOnly, deleteCoupon);

export default router;
