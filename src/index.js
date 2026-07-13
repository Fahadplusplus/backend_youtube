import "./config/env.js"
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express";
import connectDB from "./db/index.js";
import {app} from "./app.js";








connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running ${process.env.PORT || 8000}`);
    });
})
.catch((err) => {
    console.log("MONGO DB CONNECTION FAILED !!!", err);
});


// const app = express()

// ;(async()=>{
//     try{
//      const connectionInstance = await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//      console.log(`MongoDb connected: ${connectionInstance.connection.host}`);
     
//       app.on("error", (error)=>{
//         console.log("ERROR: ", error);
//         throw error  
//       })
//       app.listen(process.env.PORT, ()=>{
//         console.log(`app is listening on ${process.env.PORT}`);
        
//       })
//     }
//     catch(error){
//           console.error("ERROR:", error)
//           throw error
          
//     }
// })()