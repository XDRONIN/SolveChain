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
import User from "./models/User.js";
import Notification from "./models/Notification.js";
import upload from "./multerConfig.js";
import Question from "./models/Questions.js";

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
// Serve static files from the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
  const { ...userData } = req.body; // Directly take UID from request
  // if (!uid) return res.status(400).json({ error: "UID is required" });

  req.session.user = {
    ...userData,
  }; // Store only UID in session
  console.log(req.session.user);
  res.json({ message: "User session stored", user: req.session.user });
});

// Get User Session
app.get("/api/user", (req, res) => {
  if (req.session.user) {
    res.json(req.session.user.userData);
  } else {
    res.status(401).json({ error: "No active session" });
  }
});

// Logout - Destroy session
app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Session destroyed" });
});
// API endpoint to initialize user document
app.post("/api/initializeUser", async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Check if user already exists
    const existingUser = await User.findById(_id);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user document
    const newUser = new User({
      _id,
      notifyQues: [],
      notifyDiss: [],
      following: [],
      followers: [],
      solved: 0,
      stars: 0,
      profilePic: "",
      certs: [],
      verified: false,
    });

    await newUser.save();
    //Create new notification collection
    const newNotification = new Notification({
      _id,
      notificationDetails: [],
    });
    await newNotification.save();
    res.status(201).json({ message: "User initialized successfully" });
  } catch (error) {
    console.error("Error initializing user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Upload API (supports multiple files)
app.post("/api/upload", upload.array("media", 5), async (req, res) => {
  try {
    // Extract file data
    const mediaFiles = req.files
      ? req.files.map((file) => ({
          url: file.path,
          contentType: file.mimetype,
        }))
      : [];
    const tags = Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags];

    // Create new question entry
    const newQuestion = new Question({
      _id: new mongoose.Types.ObjectId().toString(),
      author: req.session.user.userData.uid,
      username: req.session.user.userData.username,
      solved: false,
      whoCanRespond: req.body.whoCanRespond,
      queBody: req.body.queBody,
      tags: tags || [],
      media: mediaFiles,
      meta: {
        upvotes: 0,
        downvotes: 0,
        notify: 0,
        discussion: 0,
        share: 0,
      },
    });

    await newQuestion.save();
    res.status(201).json({ message: "Uploaded successfully!", newQuestion });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
});
//get posts
app.get("/api/getPosts", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const filter = req.query.filter || "New";
    const field = req.query.field || "All";
    const baseURL = "http://localhost:5000";

    let query = {};
    if (field !== "All") {
      query.tags = field;
    }

    let sortOption = {};
    if (filter === "Popular") sortOption["meta.upvotes"] = -1;
    else if (filter === "Unsolved") query.solved = false;
    else if (filter === "Solved") query.solved = true;
    else sortOption["createdAt"] = -1;

    const posts = await Question.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    const formattedPosts = posts.map((post) => ({
      ...post.toObject(),
      media: post.media.map((m) => ({
        url: `${baseURL}/${m.url}`, // Convert relative path to absolute URL
        contentType: m.contentType,
      })),
    }));

    res.json({ posts: formattedPosts });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch posts", details: error.message });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} hello world `)
);
