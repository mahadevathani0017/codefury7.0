import dotenv from 'dotenv'
import connectDB from './DB/index.js'
import app from './app.js'

dotenv.config({path:'./env'})


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 3000 ,()=>{
        console.log("Server listening to port: ",process.env.PORT)
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed !",err)
})

app.on("error",(error)=>{
    console.log("ERROR in app :: ",error)
    throw(error)
})