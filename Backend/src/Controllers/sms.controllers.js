import twilio from "twilio"
import {ApiResponse} from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"


const sendMessage=async(req,res)=>{
    console.log(req.body)
const accountSid=process.env.TWILIO_SID
const authtoken=process.env.TWILIO_TOKEN

const client=twilio(accountSid,authtoken)

const rescuer=process.env.PHONE_NUMBER

const{name,phonenumber,latitude,longitude,details}=req.body

const message= `Emergency Message :: SafeSurge :: name:${name} ,Phone Number :${phonenumber} ,Latitude:${latitude} ,Longitude:${longitude},Address:${details}`

client.messages.create({
    body: message,
    from: process.env.TWILIO_NUMBER,
    to: rescuer
}).then((message)=>res.status(200).json(
    new ApiResponse(200,{message},"Successfully sent the message")
)).catch(error=>
    new ApiError(500,"Could not send message due to server error")
)

}
export {sendMessage}

