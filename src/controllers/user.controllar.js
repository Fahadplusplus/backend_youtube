import { apiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshTokens = async(userId) => {
   try
       {
    
     const user = await User.findById(userId)
    console.log(user);
    
     const accessToken = user.generateAccessToken()
     
     const refreshToken = user.generateRefreashToken()
     console.log(accessToken,"asscess token");

     user.refreshToken = refreshToken
     await user.save({ validateBeforeSave: false })
     return{accessToken,refreshToken}
     
      
   } catch (error) {
         console.log("TOKEN ERROR:", error);
   throw error;
      throw new apiError(500, "Somthing went wrong while generating assess and refresh token")
   }
}



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
      new apiResponse(200, createduser, "User registered successfully")
    )
})

const loginUser = asyncHandler( async( req , res ) =>{
   
   
      const {email,username,password} = req.body;
   
      if(!username && !email){
         throw new apiError(400,"username or email is required")
      }

      const user =await User.findOne({
         $or:[{username},{email}]
      })
      if(!user){
         throw new apiError(404, "user does not exists")
      }
      
      const isPassowrdValid = await user.isPasswordCorrect(password)
        if(!isPassowrdValid){
         throw new apiError(401, "Password Incorrect")
      }

     const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

     const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

     const options ={
      httpOnly: true,
      secure: true
     }

     return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", refreshToken, options)
     .json(
      new apiResponse(
         200,
         {
            user: loggedInUser,accessToken,refreshToken
         },
         "User logged In Successfully"
      )
     )

       
})

export {registerUser,loginUser}