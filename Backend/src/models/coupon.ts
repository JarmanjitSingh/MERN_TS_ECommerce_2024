import mongoose from "mongoose";

const schema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Please enter the coupon code"],
    unique: true,
  },
  amount: {
    type: Number,
    required: [true, "Please enter the discound amount"],
  },
});

export const Coupon = mongoose.model("Coupon", schema);
