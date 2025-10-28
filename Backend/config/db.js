import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const connectDB = async () => {
  const MongoDB_URI =
    process.env.MongoDB_URI || "mongodb://localhost:27017/expense_tracker";
  try {
    await mongoose.connect(MongoDB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    console.log(
      "Please check your MongoDB connection string and make sure MongoDB is running"
    );
    process.exit(1);
  }
};
