// server.js
import admin from "firebase-admin";
import { readFileSync } from "fs";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { sessionMiddleware } from "./session.js"; // Import session middleware

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure dotenv to load .env file from the correct path
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(sessionMiddleware);

// Example API route
app.get("/api", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/src/App.vue"));
});
app.get("/api/firebase-test", async (req, res) => {
  try {
    const customToken = await admin.auth().createCustomToken("test-uid");
    res.json({ message: "Firebase is working!", customToken });
  } catch (err) {
    console.error("Error with Firebase:", err);
    res.status(500).json({ error: "Firebase error" });
  }
});

const serviceAccount = JSON.parse(
  readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT, "utf-8")
);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("Firebase initialized");

// Connect to MongoDB - clean modern syntax with no deprecated options
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Store UID in session
app.post("/api/login", (req, res) => {
  const { uid } = req.body; // Directly take UID from request
  if (!uid) return res.status(400).json({ error: "UID is required" });

  req.session.user = { uid }; // Store only UID in session
  res.json({ message: "User session stored", user: req.session.user });
});

// Get User Session
app.get("/api/user", (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ error: "No active session" });
  }
});

// Logout - Destroy session
app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Session destroyed" });
});
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} hello world `)
);
