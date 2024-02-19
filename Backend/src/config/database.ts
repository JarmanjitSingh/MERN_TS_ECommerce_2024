import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(`${process.env.MONGO_URI}` , {
      dbName: "Ecommerce_2024",
    })
    .then(() => console.log(`database connected successfully`))
    .catch((err) => console.log(`Database connection error:`, err));
};
