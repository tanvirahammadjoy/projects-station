// server.js
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";

// Load environment variables
dotenv.config();
// console.log("MONGO_URI:", process.env.MONGO_URI);
// console.log("MONGO_URI:", process.env.NODE_ENV);
// console.log("MONGO_URI:", process.env.PORT);

// Connect to MongoDB
connectDB();

// old way to connect to MongoDB (commented out for clarity)
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1); // Exit process with failure
//   }
// };

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV}${PORT}`);
});

// Uncomment the following lines if you want to use the old way to connect to MongoDB (commented out for clarity)
// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
//   });
// });
