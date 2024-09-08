import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
// import  userRouter  from "./Routes/user.routes.js"
import { errorHandler } from "./utils/ErrorHandler.js"
import Smsroutes from "./Routes/SMSroutes.js"
import userRouter from "./Routes/user.routes.js"

const app=express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))


app.use(express.json())
app.use(express.urlencoded({extended: true }))
app.use(express.static('public'))
app.use(cookieParser())

app.use("/api/v1/esms",Smsroutes)
app.use("/api/v1/users",userRouter)




app.use(errorHandler)



export default app