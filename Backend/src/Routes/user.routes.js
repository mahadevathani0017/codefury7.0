import { Router } from "express";
import { upload } from "../Middlewares/multer.middleware.js";
import { registerUser,loginUser,logoutUser,refreshAccessTokens, changeCurrentPassword } from "../Controllers/user.controllers.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";

const userRouter=Router()

userRouter.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount: 1
        },
        {
            name:"coverImage",
            maxCount: 1
        }

    ]),
    registerUser
)

userRouter.route("/login").post( loginUser)


userRouter.route("/logout").post(verifyJWT,logoutUser)
userRouter.route("/change-password").post(verifyJWT,changeCurrentPassword)

export default userRouter