import mongoose from "mongoose";

let isConnected = false;
export default async function connectDB() {
    if(isConnected) {
        console.log("Connection available to DB");
        return;
    }
    console.log("Connecting to DB", process.env.MONGODB_URI, process.env.DB_NAME);
    try {
        mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME,
        });      
        isConnected = true;  
    } catch (error) {
        console.log(error)
    }
};