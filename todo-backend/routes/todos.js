import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import todoRoutes from "./routes/todos.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Use todo routes
app.use("/api/todos", todoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

console.log("Server code created successfully!");
