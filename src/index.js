import "dotenv/config";
import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("APP is listening on port :", process.env.PORT);
    });
    app.on("error", (error) => {
      console.log("MONGODB CONNECTION FAILED :", error);
    });
  })
  .catch((error) => {
    console.log("CONNECTION FAILED :", error);
  });

// import { DB_NAME } from "./constants.js";
// import mongoose from "mongoose";
// import express from "express";
// const app= express();
// ;(async()=>{
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.log(`Error:`,error)
//             throw error;
//         })
//         app.listen(process.env.PORT,()=>{
//             console.log("App is listening on PORT:",process.env.PORT);
//         })

//     }
//     catch(error){
//         console.error(`ERR:${error}`)
//         throw error

//     }

// })()
