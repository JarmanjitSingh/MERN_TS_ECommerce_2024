import express from "express";
import userRoute from "./routes/user.js";
import productRoute from "./routes/products.js";
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import dashboardRoute from "./routes/stats.js";
import { connectDB } from "./config/database.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";
import Stripe from "stripe";

config({
  path: "./.env",
});

const port = process.env.PORT || 4000;
const stripeKey = process.env.STRIPE_KEY || "";

export const stripe = new Stripe(stripeKey);
export const myCache = new NodeCache();

const app = express();
connectDB();

//using middlewares
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(morgan("dev"));

// Imorting routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);

app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce Backend");
});

//using error middleware
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
