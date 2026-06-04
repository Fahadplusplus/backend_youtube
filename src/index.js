import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express";
import connectDB from "./db/index.js";


dotenv.config();

connectDB()


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