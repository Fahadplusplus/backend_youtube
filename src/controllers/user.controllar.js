import { apiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"

const registerUser = asyncHandler( async(req,res)=>{
   //Receive data from users
   //validate that data 
   //check if user already exists: username & email
   //check for files: avatar image
   //create user object - create entery in DB
   //remove password and refres token field form response
   //check if user is created
   //return response
   //  res.status(200).json({
   //      message: "okkkkk"
   //  })

   // console.log("fahad");
   
   const {fullname,email,username}= req.body
  

   if(
      [fullname,email,username].some((field) => field?.trim() === "" )
   ){
      throw new apiError(400,"All fields are required")
   }
   // const existingUser=User.findOne({
   //    $or: [{email},{username}]
   // })
   // if(existingUser){
   //   throw new apiError(409,"user with username or email already exists")
   // }
   
   const existingEmail=User.findOne(email)
   if(existingEmail){
     throw new apiError(409,"email already exists")
   }
     const existingUsername=User.findOne(email)
   if(existingUsername){
     throw new apiError(409,"Username already exists")
   }

   req.body
   
})

export {registerUser}