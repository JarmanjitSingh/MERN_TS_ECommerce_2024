import express from "express";
import userRoute from "./routes/user.js";
import { connectDB } from "./config/database.js";
import { errorMiddleware } from "./middlewares/error.js";
const port = 4000;


const app = express();
connectDB();

//using middlewares
app.use(express.json())


// Imorting routes

app.use("/api/v1/user", userRoute)

app.get("/", (req, res)=>{
    res.send("Welcome to the E-commerce Backend")
})


//using error middleware
app.use(errorMiddleware)

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})