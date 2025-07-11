import mongoose from "mongoose";
const MONGO_DB_NAME = "vidtube";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${MONGO_DB_NAME}`);
        console.log(`\nMongoDB Connected! DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection FAILED !", error);
        process.exit(1); // Exit the process with failure code
    }
};

export {connectDB};