import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect("mongodb://127.0.0.1:27017/hairbnb");
        console.log(`connected`);
    }catch(error){
        console.log(error);
        process.exit(1);
    }

}

export default connectDB;
