import express from "express";
import userRoute from "./routes/user.js";
import productRoute from "./routes/products.js";
import { connectDB } from "./config/database.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";

const port = 4000;

export const myCache = new NodeCache()

const app = express();
connectDB();

//using middlewares
app.use(express.json());
app.use("/uploads",express.static("uploads"))

// Imorting routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);

app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce Backend");
});

//using error middleware
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
