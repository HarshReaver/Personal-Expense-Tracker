import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const connectDB = async () => {
    const MongoDB_URI = process.env.MongoDB_URI || 'mongodb+srv://new-user:ansh123@cluster3.janbnkb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster3';
	try {
		const conn = await mongoose.connect(MongoDB_URI);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1); 
	}
};
