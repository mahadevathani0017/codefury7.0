import mongoose  from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Schema } from "mongoose";

const userSchema = new Schema({
    username:{
        type: String ,
        required: true ,
        unique: true ,
        lowercase: true ,
        trim: true,
        index: true

    },
    email:{
        type: String ,
        required: true ,
        unique: true ,
        lowercase: true ,
        trim: true,
        index: true
        

    },
    fullname:{
        type: String,
        required: true ,
        trim: true ,
    },
    avatar:{
        type: String,
        
    },
    location:{
        type:{
        amenity: String,
        road: String,
        neighbourhood: String,
        suburb: String,
        city: String,
        county: String,
        state_district: String,
        state: String,
        
        postcode:String,
        country: String,
        country_code: String

        },
    },
    password:{
        type:String,
        required: [true,'Password is Required']
    },
    refreshToken:{
        type: String
    },
    watchHistory:{
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    posts:{
        type: Schema.Types.ObjectId,
        ref: "Post"
    }
},
{
    timestamps:true
}
)
userSchema.index({ fullname: 'text' });

userSchema.pre("save",async function(next) {
    if(!this.isModified("password")) return next();

    this.password=await bcrypt.hash(this.password,10)
    next();
    
})

userSchema.methods.checkpassword=async function(password){
    return await bcrypt.compare(password,this.password);
}


userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email: this.email,
            username: this.email,
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id,
           
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}

export const User=mongoose.model("User",userSchema)