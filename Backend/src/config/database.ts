import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017", {
      dbName: "Ecommerce_2024",
    })
    .then(() => console.log(`database connected successfully`))
    .catch((err) => console.log(`Database connection error:`, err));
};
