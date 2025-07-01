import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    const res = await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("Connected to MongoDB:", res.connection.name);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

export default connectToDatabase;
