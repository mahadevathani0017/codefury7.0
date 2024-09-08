import mongoose from "mongoose";
const DB_NAME="myappDB"


const connectDB=async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("MONGODB connected successfully !!!")
    } catch (error) {
        console.log("ERROR connecting to the MONGODB  !!!")

        throw(error)
    }
}

export default connectDB