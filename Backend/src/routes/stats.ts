import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { getBarCharts, getLineCharts, getPieCharts, getdashboardStats } from "../controllers/stats.js";

const router = express.Router();

router.route("/stats").get(adminOnly, getdashboardStats);

router.route("/pie").get(adminOnly, getPieCharts);

router.route("/bar").get(adminOnly, getBarCharts);

router.route("/line").get(adminOnly, getLineCharts);

export default router;
