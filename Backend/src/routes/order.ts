import express from "express";
import { newOrder } from "../controllers/order.js";


const router = express.Router();

//route - /api/v1/order/new
router.route("/new").post(newOrder)

export default router;
