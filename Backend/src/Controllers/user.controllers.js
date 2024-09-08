import { User } from "../models/User.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { AsyncHandler } from "../utils/AsyncHandler.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js"




const generateAccessAndRefreshToken=async (userId)=>{
    try {
        const user=await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})
        return  { accessToken, refreshToken}
        
    } catch (error) {
        console.log(error)
        throw new ApiError(500,"Something went wrong during token generation")
        
    }
}


const registerUser=AsyncHandler(async (req,res,next)=>{
    console.log(req)
    const {fullname,email,password,username,address}=req.body

    if([fullname,email,username,password].some((field)=>field?.trim()==="")){
        return next( new ApiError(400,"All fields are required"))
    }

    const existedUserEmail=await User.findOne({email})
    if(existedUserEmail) 
    {
        return next(new ApiError(409,"Account with same Email already exists !!"))
    }
    const existedUsername=await User.findOne({username})
    if(existedUsername) 
    {
        return next( new ApiError(409,"Username already exists"))
    }

    let avatarLocalPath;
    if( req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0 )
    {
        avatarLocalPath=req.files?.avatar[0]?.path
    }

    

    const avatar=await uploadOnCloudinary(avatarLocalPath)
    
    

    const user=await User.create({
        fullname,
        email,
        username,
        password,
        avatar: avatar?.url || "",
        address,
        
    })

    const createdUser=await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        return next( new ApiError(500,"Something went wrong while regestering user Try Again !!!"))

    }

    return res.status(200)
    .json(
        new ApiResponse(200,
            createdUser,
            "Successfully Registered"
        )
    )


})

const loginUser= AsyncHandler(async(req,res)=>{
    

    const {email,password}=req.body
    

    if(!( email) ){
        
       throw new ApiError(400," Email is required ")
    }

    const user=await User.findOne({email})

    if(!user){
        throw new  ApiError(404,"User not exists")
    }

    const isPasswordValid=await user.checkpassword(password)
    if(!isPasswordValid){
        throw  new ApiError(401,"Invalild User credentials")
    }

    const { accessToken, refreshToken}=await generateAccessAndRefreshToken(user._id)

    const loggedUser=await User.findById(user._id)
    .select("-password -refreshToken")

    const options={
        httpOnly: true,
        secure: false,
        

    }

    const ress= res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedUser,
                accessToken:accessToken
            },
            "User logged in successfully"
    )
    
    )
    console.log(ress)
    return ress


})


const logoutUser=(async(req,res)=>{
    console.log(req)

    const options={
        httpOnly: true,
        secure: true
    }
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
           
        },
        {
            new: true
        }
        
    )

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(
            200,{},"User logged out successfully"
        )
    )

})


const refreshAccessTokens=AsyncHandler(async (req,res)=>{
    const incomingRefreshtoken=req.cookie.refreshToken || req.body.refreshToken

    if( !incomingRefreshtoken){
        return next( new ApiError(401,"Unauthorized request"))
    }

    try {
        const decodedToken=jwt.verify(incomingRefreshtoken,process.env.REFRESH_TOKEN_SECRET)
    
    
        const user=await User.findById(decodedToken?._id)
    
        if(!user){
            return next( new ApiError(401,"Invalid refresh Token"))
    
        }
        if(incomingRefreshtoken!==user?.refreshToken){
            return next( new ApiError(401,"Refresh Token is expired"))
        }
    
        const options={
            httpOnly:true,
            secure: true
        }
    
        const {accessToken,newrefreshToken}=await generateAccessAndRefreshToken(user._id)
    
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newrefreshToken,options)
    } catch (error) {
        return next( new ApiError(500,error?.message || "Something went wrong during verification of refresh token"))
        
    }
})

const changeCurrentPassword=AsyncHandler(async(req,res)=>{
    const {oldpassword ,newpassword}=req.body

    const user=await User.findById(req.user._id)
    const isPasswordcorrect=await user.checkPassword(oldpassword)

    if(!isPasswordcorrect){
        throw new ApiError(400,"Invalid old password")
        
    }

    user.password=newpassword

    await user.save({
        validateBeforeSave: false
    })
    

    return res.status(200
    .json(
        new ApiResponse(200,{},"Password changed")
    )
    )
})



export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessTokens,
    changeCurrentPassword,
 }