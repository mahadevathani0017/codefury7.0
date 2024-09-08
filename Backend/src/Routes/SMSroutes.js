import { Router  } from "express"
import { sendMessage } from "../Controllers/sms.controllers.js"


const Smsroutes=Router()

Smsroutes.route("/send-message").post(sendMessage)


export default Smsroutes