import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI ?? "");
    console.log("Connected to DB");
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

export default connectToDB;
