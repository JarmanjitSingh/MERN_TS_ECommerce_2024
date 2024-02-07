import express from "express";

const port = 4000;


const app = express();

app.get("/", (req, res)=>{
    res.send("Welcome to the E-commerce Backend")
})

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})