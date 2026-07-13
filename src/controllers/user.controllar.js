import { apiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
const registerUser = asyncHandler( async(req,res)=>{
   //Receive data from users
   //validate that data 
   //check if user already exists: username & email
   //check for files: avatar image
   //create user object - create entery in DB
   //remove password and refres token field form response
   //check if user is created
 
   
   const {fullName,email,username,password}= req.body
  

   if(
      [fullName,email,username,password].some((field) => field?.trim() === "" )
   ){
      throw new apiError(400,"All fields are required")
   }

   
   
   const existingUser=await User.findOne({
      $or: [{email},{username}]
   })
   if(existingUser){
     throw new apiError(409,"user with username or email already exists")
   }
   
   // const existingEmail= await User.findOne(email)
   // if(existingEmail){
   //   throw new apiError(409,"email already exists")
   // }
   //   const existingUsername= await User.findOne(username)
   // if(existingUsername){
   //   throw new apiError(409,"Username already exists")
   // }



  const profilePicLocalPath = req.files?.profilePic[0]?.path;
const coverImgLocalPath = req.files?.coverImage?.[0]?.path;



   if(!profilePicLocalPath){
      throw new apiError(400, "profile Image not found")
   }

   const profilePic = await uploadOnCloudinary(profilePicLocalPath)
   const coverImage = await uploadOnCloudinary(coverImgLocalPath)

   if(!profilePic){
        throw new apiError(400, "profile Image not found")
   }

  const user = await User.create({
      fullName,
      password,
      profilePic: profilePic.url,
      coverImage: coverImage?.url || "",
      email,
      username: username.toLowerCase()
   })
 
   const  createduser = await User.findById(user._id).select(
      "-password -refreshToken"
   )

   if (!createduser){
      throw new apiError(500,"Something went wrong while registring the user")
   }
  
   return res.status(201).json(
      new apiResponse(200, createduser, "User registered successfully"

      )
   )


  

   
})

const loginUser = asyncHandler( async( req , res ) =>{

})

export {registerUser,loginUser}