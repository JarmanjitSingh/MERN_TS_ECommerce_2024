import express from "express";
import {
  allCoupons,
  applyCoupon,
  deleteCoupon,
  newCoupon,
} from "../controllers/payment.js";
import { adminOnly } from "../middlewares/auth.js";

const router = express.Router();

//route - /api/v1/payment/coupon/new
router.route("/coupon/new").post(adminOnly, newCoupon);

router.route("/coupon/apply").get(applyCoupon);

router.route("/coupon/all").get(adminOnly, allCoupons);

router.route("/coupon/:id").delete(adminOnly, deleteCoupon);

export default router;
