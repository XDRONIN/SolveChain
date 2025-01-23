// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure dotenv to load .env file from the correct path
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Example API route
app.get("/api", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Connect to MongoDB - clean modern syntax with no deprecated options
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));
// Define a schema for the "hello" collection
const helloSchema = new mongoose.Schema({}, { strict: false }); // Flexible schema
const Hello = mongoose.model("Hello", helloSchema, "hello"); // Explicitly specify the collection name

// Fetch and log data from the "hello" collection
Hello.find()
  .then((data) => {
    console.log("Data from 'hello' collection:", data);
    process.exit(); // Exit the process after logging the data
  })
  .catch((err) => {
    console.error("Error fetching data:", err);
    process.exit(1); // Exit with an error
  });

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} hello world `)
);
