import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("MongoDB is connected");
        })
        const conn = await mongoose.connect(`${process.env.MONGODB_URL}/quickgpt`);
    } catch (error) {
        console.log(error.message);
    }
};

export default connectDB