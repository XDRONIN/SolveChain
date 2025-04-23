// server.js
import admin from "firebase-admin";
import { readFileSync, existsSync, mkdirSync, unlinkSync } from "fs";
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
import Reward from "./models/Reward.js";
import Report from "./models/Report.js";
import Verification from "./models/Verification.js";
import { error } from "console";
import Web3Service from "./services/web3Service.js";

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
app.get("/api/user", async (req, res) => {
  if (req.session.user) {
    const ppic = await User.findById(req.session.user.userData.uid).select(
      "profilePic"
    ); // only get profilePic field
    const cert = await User.findById(req.session.user.userData.uid).select(
      "certs"
    );
    const combinedData = {
      ...req.session.user.userData,
      profilePic: ppic.profilePic || "",
      certs: cert.certs || "", // or any field name you want
    };

    res.json(combinedData);
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
      lastView: new Date(),
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
        upvotes: { users: "", val: 0 },
        downvotes: { users: "", val: 0 },
        notify: { users: "", val: 0 },
        discussion: { users: "", val: 0 },
        share: { users: "", val: 0 },
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
    if (filter === "Popular") sortOption["meta.upvotes.val"] = -1;
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
app.post("/api/updateMeta", async (req, res) => {
  try {
    const { whichMeta, qid } = req.body;
    const userId = req.session.user.userData.uid;

    if (!whichMeta || !qid) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const question = await Question.findById(qid);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (!question.meta[whichMeta]) {
      return res.status(400).json({ error: "Invalid meta field" });
    }

    const userIndex = question.meta[whichMeta].users.indexOf(userId);

    if (userIndex === -1) {
      // User hasn't interacted: Add them and increment val
      await Question.findByIdAndUpdate(
        qid,
        {
          $addToSet: {
            [`meta.${whichMeta}.users`]: userId,
          }, // Ensure user is added
          $inc: { [`meta.${whichMeta}.val`]: 1 }, // Increment val
        },
        { new: true }
      );

      // If whichMeta is 'notify', add qid to user's notifyQues
      if (whichMeta === "notify") {
        await User.findByIdAndUpdate(
          userId,
          {
            $addToSet: {
              notifyQues: {
                quesId: qid,
                lastViewed: new Date(),
                notify: false,
              },
            },
          },
          { new: true }
        );
      }

      return res.json({ message: `User added & ${whichMeta} incremented` });
    } else {
      // User has interacted: Remove them and decrement val
      await Question.findByIdAndUpdate(
        qid,
        {
          $pull: { [`meta.${whichMeta}.users`]: userId }, // Remove user
          $inc: { [`meta.${whichMeta}.val`]: -1 }, // Decrement val
        },
        { new: true }
      );

      // If whichMeta is 'notify', remove qid from user's notifyQues
      if (whichMeta === "notify") {
        await User.findByIdAndUpdate(
          userId,
          {
            $pull: { notifyQues: { quesId: qid } },
          },
          { new: true }
        );
      }

      return res.json({ message: `User removed & ${whichMeta} decremented` });
    }
  } catch (error) {
    console.error("Error updating meta:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// If discussion exists, add user to the users array if not already present

// Fetch messages route

// Send message route
app.get("/api/fetchUid", async (req, res) => {
  const uid = req.session.user.userData.uid;
  const usrName = req.session.user.userData.username;
  res.json({ userId: uid, username: usrName });
});
// Upload API - supports multiple files (max 5)
app.post("/api/uploadMedia", upload.array("media", 5), async (req, res) => {
  try {
    // Get the user ID from the request (adjust according to your auth system)
    const userId =
      req.session.user.userData.uid || req.body.userId || "anonymous";

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    // Extract file data
    const mediaFiles = req.files.map((file) => ({
      url: `/uploads/${file.filename}`, // URL relative to your server
      contentType: file.mimetype,
    }));

    // You can add additional processing here, like:
    // - Image resizing
    // - Virus scanning
    // - Updating database records

    // Return success with file information
    return res.status(200).json({
      success: true,
      message: `${mediaFiles.length} file(s) uploaded successfully`,
      mediaFiles: mediaFiles,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Error uploading files",
      error: error.message,
    });
  }
});
app.post("/api/addAuthor", async (req, res) => {
  try {
    const { qid } = req.body;

    if (!qid)
      return res.status(400).json({ error: "Question ID (qid) is required" });

    const question = await Question.findById(qid).select(
      "author username queBody"
    );

    if (!question) return res.status(404).json({ error: "Question not found" });

    res.json({
      author: question.author,
      username: question.username,
      queBody: question.queBody,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
app.post("/api/setSolved", async (req, res) => {
  const { qid } = req.body;

  if (!qid) {
    return res.status(400).json({ success: false, message: "qid is required" });
  }

  try {
    const result = await Question.findByIdAndUpdate(
      qid,
      { $set: { solved: true } },
      { new: true }
    );

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Question marked as solved",
      question: result,
    });
  } catch (error) {
    console.error("Error updating question:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});
// Upload profile picture
app.post(
  "/api/user/profile-pic",
  upload.single("profilePic"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // In a real app, you'd get the user ID from authentication
      const userId = req.session.user.userData.uid;

      const profilePicUrl = `http://localhost:5000/uploads/${req.file.filename}`;

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { profilePic: profilePicUrl } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "Profile picture uploaded successfully",
        profilePic: profilePicUrl,
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);
// Upload certification
app.post("/api/user/cert", upload.single("cert"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // In a real app, you'd get the user ID from authentication
    const userId = req.session.user.userData.uid;

    const certUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { certs: certUrl } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Certification uploaded successfully", certUrl });
  } catch (error) {
    console.error("Error uploading certification:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete certification
app.delete("/api/user/cert", async (req, res) => {
  try {
    const { certUrl } = req.body;
    if (!certUrl) {
      return res.status(400).json({ message: "Certification URL is required" });
    }

    // In a real app, you'd get the user ID from authentication
    const userId = req.session.user.userData.uid;

    // Remove the URL from the user's certs array
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { certs: certUrl } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the filename from the URL and delete the file
    const filename = certUrl.split("/").pop();
    const filePath = path.join("uploads", filename);

    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }

    res.json({ message: "Certification deleted successfully" });
  } catch (error) {
    console.error("Error deleting certification:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/api/checkForSolve", async (req, res) => {
  try {
    const uid = req.session.user.userData.uid; // get uid from query param or use req.user if you have auth

    if (!uid) {
      return res.status(400).json({ success: false, message: "UID required" });
    }

    const user = await User.findById(uid);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Filter notifyQues with notify = false
    const notifyItems = user.notifyQues.filter((item) => item.notify === false);

    // Check each related question for solved = true
    for (const item of notifyItems) {
      const question = await Question.findById(item.quesId);
      if (question && question.solved === true) {
        return res.json({ success: true });
      }
    }

    // If no matching solved questions found
    return res.json({ success: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.post("/api/checkSolvedNotify", async (req, res) => {
  try {
    const uid = req.session.user.userData.uid;
    if (!uid) {
      return res.status(400).json({ success: false, message: "UID required" });
    }

    const user = await User.findById(uid);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const notifyItems = user.notifyQues.filter((item) => item.notify === false);
    const notificationsToAdd = [];

    for (const item of notifyItems) {
      const question = await Question.findById(item.quesId);
      if (question && question.solved) {
        item.notify = true;

        notificationsToAdd.push({
          typeOfNot: "question",
          source: item.quesId,
          msg: `This question was solved: "${question.queBody}"`,
          createdAt: new Date(),
        });
      }
    }

    // Save user only if something was updated
    if (notificationsToAdd.length > 0) {
      await user.save();

      const notificationDoc = await Notification.findById(uid);

      if (notificationDoc) {
        notificationDoc.notificationDetails.push(...notificationsToAdd);
        await notificationDoc.save();
      } else {
        await Notification.create({
          _id: uid,
          notificationDetails: notificationsToAdd,
          lastView: new Date(),
        });
      }
    }

    return res
      .status(200)
      .json({ success: true, message: "Notifications updated." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});
app.post("/api/updateSeen", async (req, res) => {
  try {
    const uid = req.session.user.userData.uid;
    if (!uid)
      return res
        .status(400)
        .json({ success: false, message: "User ID required" });

    const notificationDoc = await Notification.findById(uid);
    if (!notificationDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Notification document not found" });
    }

    notificationDoc.lastView = new Date();
    await notificationDoc.save();

    return res
      .status(200)
      .json({ success: true, message: "lastView updated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
app.get("/api/getNotifications", async (req, res) => {
  try {
    const uid = req.session.user.userData.uid;
    if (!uid)
      return res
        .status(400)
        .json({ success: false, message: "User ID required" });

    const notifications = await Notification.findById(uid);
    if (!notifications) {
      return res
        .status(404)
        .json({ success: false, message: "No notifications found" });
    }

    return res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
app.post("/api/addDissToUser", async (req, res) => {
  try {
    const userId = req.session.user.userData.uid;
    const { qid } = req.body;

    const user = await User.findById(userId);
    const alreadyExists = user.notifyDiss.some((d) => d.dissId === qid);

    if (!alreadyExists) {
      user.notifyDiss.push({ dissId: qid, lastViewed: new Date() });
      await user.save();
    }

    return res
      .status(200)
      .json({ success: true, message: "Added Discussion to user" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
});
// Endpoint to fetch questions related to user's notifyDiss
app.get("/api/dissNotifications", async (req, res) => {
  try {
    const userId = req.session.user.userData.uid;

    // Find user and populate notification data
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract all dissIds from notifyDiss array
    const dissIds = user.notifyDiss.map((item) => item.dissId);

    // Fetch all questions that match these dissIds
    const questions = await Question.find({ _id: { $in: dissIds } });

    // Create response with question bodies
    const notifications = questions.map((question) => {
      // Find the associated notification data
      const notificationData = user.notifyDiss.find(
        (item) => item.dissId === question._id.toString()
      );

      return {
        questionId: question._id,
        queBody: question.queBody,
        author: question.author,
        username: question.username,
        solved: question.solved,
        lastViewed: notificationData ? notificationData.lastViewed : null,
      };
    });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notification questions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
app.post("/api/updateLastViewed", async (req, res) => {
  try {
    const userId = req.session.user.userData.uid;
    const { dissId } = req.body;

    // Validate required parameters
    if (!dissId) {
      return res.status(400).json({ message: "dissId is required" });
    }

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the dissId exists in the user's notifyDiss array
    const notificationIndex = user.notifyDiss.findIndex(
      (item) => item.dissId === dissId
    );

    if (notificationIndex === -1) {
      return res
        .status(404)
        .json({ message: "Notification not found for this user" });
    }

    // Update the lastViewed timestamp
    user.notifyDiss[notificationIndex].lastViewed = new Date();

    // Save the updated user document
    await user.save();

    res.status(200).json({
      message: "Last viewed timestamp updated successfully",
      dissId,
      lastViewed: user.notifyDiss[notificationIndex].lastViewed,
    });
  } catch (error) {
    console.error("Error updating lastViewed timestamp:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
app.get("/api/getUserQuestions", async (req, res) => {
  try {
    // Get user ID from session
    const userId = req.session.user.userData.uid;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    // Keep the original parameter handling
    //const page = parseInt(req.query.page) || 1;
    //const limit = parseInt(req.query.limit) || 20;
    //const filter = req.query.filter || "New";
    //const field = req.query.field || "All";
    const baseURL = "http://localhost:5000";

    // Create query to find only the user's questions
    let query = { author: userId };

    // Add the field filter - same as in getPosts

    // Get questions with pagination
    const userQuestions = await Question.find(query);

    // Format the results just like getPosts
    const formattedQuestions = userQuestions.map((question) => ({
      ...question.toObject(),
      media: question.media.map((m) => ({
        url: `${baseURL}/${m.url}`, // Convert relative path to absolute URL
        contentType: m.contentType,
      })),
    }));

    // Return in the same format as getPosts
    res.json({ posts: formattedQuestions });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch questions", details: error.message });
  }
});
app.post("/api/markDissSolved", async (req, res) => {
  const { quid, uid } = req.body; // Changed qid to quid

  try {
    // Find the user first
    const user = await User.findById(uid);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the notifyDiss item by dissId
    const dissItem = user.notifyDiss.find((item) => item.dissId === quid); // Changed qid to quid

    if (!dissItem) {
      return res.status(404).json({ error: "dissId not found in notifyDiss" });
    }

    // If it's already solved, don't increment count
    if (dissItem.solved === true) {
      return res.json({ message: "Already solved. No update made." });
    }

    // Either solved is missing or false → set to true & increment
    const updateResult = await User.updateOne(
      { _id: uid, "notifyDiss.dissId": quid }, // Changed qid to quid
      {
        $set: { "notifyDiss.$.solved": true },
        $inc: { solved: 1 },
      }
    );

    res.json({ message: "Solved set to true and count incremented" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/solved-diss-posts", async (req, res) => {
  try {
    const userId = req.session?.user?.userData?.uid;
    const baseURL = "http://localhost:5000";

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: No user session found" });
    }

    const user = await User.findById(userId).select("notifyDiss");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Filter solved dissIds
    const solvedDissIds = user.notifyDiss
      .filter((diss) => diss.solved === true)
      .map((diss) => diss.dissId);

    if (solvedDissIds.length === 0) {
      return res.json({ posts: [] });
    }

    // Fetch question docs based on dissIds
    const userQuestions = await Question.find({ _id: { $in: solvedDissIds } });

    // Format output with media URLs
    const formattedQuestions = userQuestions.map((question) => ({
      ...question.toObject(),
      media: question.media.map((m) => ({
        url: `${baseURL}/${m.url}`,
        contentType: m.contentType,
      })),
    }));

    res.json({ posts: formattedQuestions });
  } catch (error) {
    console.error("Error fetching solved diss posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/api/reward", async (req, res) => {
  try {
    const { userAddress, amount, solutionId } = req.body;

    // Validate inputs
    if (!userAddress || !amount || !solutionId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userAddress, amount, or solutionId",
      });
    }

    // Only admins or solution owners can reward
    if (!req.user.isAdmin && req.user.id !== req.solution.createdBy) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to reward users",
      });
    }

    // Process the reward
    const result = await web3Service.rewardUser(userAddress, amount);

    if (result.success) {
      // Update your database to record this reward
      // For example:
      // await RewardModel.create({
      //   solutionId,
      //   userAddress,
      //   rewardAmount: amount,
      //   transactionHash: result.transactionHash,
      //   createdBy: req.user.id
      // });

      return res.status(200).json({
        success: true,
        message: "User rewarded successfully",
        data: result,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to reward user",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Error in reward endpoint:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});
app.get("/balance/:address", async (req, res) => {
  try {
    const { address } = req.params;
    const result = await web3Service.getTokenBalance(address);

    if (result.success) {
      return res.status(200).json({
        success: true,
        balance: result.balance,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to get balance",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Error getting balance:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});
app.get("/api/analytics/questions", async (req, res) => {
  try {
    // Get total questions count
    const totalCount = await Question.countDocuments();

    // Get solved questions count
    const solvedCount = await Question.countDocuments({ solved: true });

    // Get questions by tag
    const tagAggregation = await Question.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { tag: "$_id", count: 1, _id: 0 } },
    ]);

    // Get question trend for the last 7 days
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trendData = await Question.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          new: { $sum: 1 },
          solved: { $sum: { $cond: ["$solved", 1, 0] } },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          date: "$_id",
          new: 1,
          solved: 1,
          _id: 0,
        },
      },
    ]);

    res.json({
      totalCount,
      solvedCount,
      byTag: tagAggregation,
      trend: trendData,
    });
  } catch (error) {
    console.error("Error fetching question analytics:", error);
    res.status(500).json({
      message: "Failed to fetch question analytics",
      error: error.message,
    });
  }
});
app.post("/api/request-verification", async (req, res) => {
  try {
    const userData = req.session.user.userData;

    if (!userData || !userData.uid || !userData.username) {
      return res.status(400).json({ message: "User data missing in session." });
    }

    const existingRequest = await Verification.findOne({ uid: userData.uid });
    if (existingRequest) {
      return res
        .status(409)
        .json({ message: "Verification request already exists." });
    }

    const newRequest = new Verification({
      uid: userData.uid,
      username: userData.username,
      createdAt: new Date(),
      verified: false,
    });

    await newRequest.save();

    res
      .status(201)
      .json({ message: "Verification request submitted successfully." });
  } catch (err) {
    console.error("Error processing verification request:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});
/// Get all unverified verification requests
app.get("/api/getVrequests", async (req, res) => {
  try {
    // Fetch only unverified requests
    const verifications = await Verification.find({ verified: false })
      .sort({ createdAt: -1 })
      .limit(50);

    // Extract uids
    const uids = verifications.map((verification) => verification.uid);

    // Fetch corresponding profile data from Users collection
    const users = await User.find(
      { _id: { $in: uids } },
      "_id profilePic certs followers solved"
    );

    // Create a map of uid to user details
    const uidToData = {};
    users.forEach((user) => {
      uidToData[user._id] = {
        profilePic: user.profilePic || null,
        certs: user.certs || [],
        followers: user.followers || [],
        solved: user.solved || 0,
      };
    });

    // Prepare result array
    const result = uids.map((uid) => ({
      uid,
      profilepic: uidToData[uid]?.profilePic || null,
      certs: uidToData[uid]?.certs || [],
      followers: uidToData[uid]?.followers || [],
      solved: uidToData[uid]?.solved || 0,
    }));

    return res.status(200).json({
      users: result,
      count: result.length,
    });
  } catch (error) {
    console.error("Error fetching verification requests:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch verification requests" });
  }
});
// Reject verification request
app.post("/api/rejectVerification", async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Delete the verification request
    const result = await Verification.deleteOne({ uid, verified: false });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ error: "Verification request not found or already verified" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error rejecting verification:", error);
    return res.status(500).json({ error: "Failed to reject verification" });
  }
});
app.post("/api/approveVerification", async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Update user's verified status
    const updatedUser = await User.findByIdAndUpdate(
      uid,
      { verified: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the verification request
    const result = await Verification.deleteOne({ uid, verified: false });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: "Verification request not found or already verified",
      });
    }

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error approving verification:", error);
    return res.status(500).json({ error: "Failed to approve verification" });
  }
});

app.post("/api/getUsersData", async (req, res) => {
  const { uids } = req.body;

  if (!uids || !Array.isArray(uids) || uids.length === 0) {
    return res.status(400).json({ error: "Valid user IDs are required" });
  }

  try {
    // Find users by their _id which should match the uids
    const mongoUsers = await User.find({ _id: { $in: uids } })
      .select("_id profilePic") // Select only the fields we need
      .lean(); // Convert to plain JavaScript objects

    // Map the _id to uid for consistency with your frontend expectations
    const formattedUsers = mongoUsers.map((user) => ({
      uid: user._id,
      profilePic: user.profilePic || "",
    }));

    return res.status(200).json({ users: formattedUsers });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.get("/api/searchPosts", async (req, res) => {
  const { query } = req.query;

  if (!query || query.length < 2) {
    return res.status(400).json({ error: "Search query too short" });
  }

  try {
    // Based on your schema, adjust the search fields
    const posts = await Question.find({
      $or: [
        { queBody: { $regex: query, $options: "i" } }, // Changed from content to queBody based on schema
        { tags: { $in: [new RegExp(query, "i")] } },
      ],
    })
      .limit(5)
      .select("_id queBody tags createdAt author username") // Updated field names
      .lean();

    // Format to match what the frontend expects
    const formattedPosts = posts.map((post) => ({
      _id: post._id,
      title: post.queBody.substring(0, 50), // Create a title from queBody since there's no title field
      content: post.queBody,
      tags: post.tags,
      createdAt: post.createdAt,
      authorId: post.author,
      username: post.username,
    }));

    return res.status(200).json({ posts: formattedPosts });
  } catch (error) {
    console.error("Error searching posts:", error);
    return res.status(500).json({ error: "Failed to search posts" });
  }
});
app.post("/api/getSearchQuestions", async (req, res) => {
  try {
    const { qid } = req.body;
    const baseURL = "http://localhost:5000";

    const question = await Question.findById(qid);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const formattedQuestion = {
      ...question.toObject(),
      media: question.media.map((m) => ({
        url: `${baseURL}/${m.url}`,
        contentType: m.contentType,
      })),
    };

    res.json({ posts: [formattedQuestion] });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch questions", details: error.message });
  }
});
// POST user profile - Changed from GET with params to POST with body
app.post("/api/user", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      profilePic: user.profilePic || "",
      certs: user.certs || [],
      solved: user.solved || 0,
      stars: user.stars || 0,
      verified: user.verified || false,
      followers: user.followers || [],
      following: user.following || [],
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST follow user - Updated to use request body
app.post("/api/user/follow", async (req, res) => {
  try {
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ error: "Target user ID is required" });
    }

    // Get current user ID from session
    const currentUserId = req.session.user?.userData?.uid;

    if (!currentUserId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (currentUserId === targetUserId) {
      return res.status(400).json({ error: "Cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!targetUser.followers.includes(currentUserId)) {
      targetUser.followers.push(currentUserId);
      await targetUser.save();
    }

    if (!currentUser.following.includes(targetUserId)) {
      currentUser.following.push(targetUserId);
      await currentUser.save();
    }

    res.json({ message: "Followed successfully" });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ error: "Failed to follow user" });
  }
});

// POST add star - Updated to use request body
app.post("/api/user/star", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.stars = (user.stars || 0) + 1;
    await user.save();

    res.json({ message: "Star added" });
  } catch (error) {
    console.error("Error adding star:", error);
    res.status(500).json({ error: "Failed to add star" });
  }
});
app.post("/api/reportUser", async (req, res) => {
  try {
    // Get the report data from the request body
    const { user, reason, dId } = req.body;

    // Validate the required fields
    if (!user || !reason) {
      return res.status(400).json({ error: "User ID and reason are required" });
    }

    // Get the sender ID from the session/auth (assuming you have authentication middleware)
    const sender = req.session.user.userData.username;

    // Create a new report document
    const newReport = new Report({
      sender,
      user,
      reason,
      dId: dId || null,
      createdAt: new Date(),
    });

    // Save the report to the database
    await newReport.save();

    // Return success response
    res.status(201).json({ message: "User reported successfully" });
  } catch (error) {
    console.error("Error reporting user:", error);
    res.status(500).json({ error: "Failed to report user" });
  }
});
app.get("/api/getAllReports", async (req, res) => {
  try {
    // Fetch all reports from MongoDB using the Report model
    const reports = await Report.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .exec();

    // Return the reports data to the frontend
    res.status(200).json({ reports });
  } catch (error) {
    console.error("Error retrieving reports:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/api/toggle-account-status", async (req, res) => {
  const { userId, disabled } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }

  try {
    // Update user in Firebase Authentication
    await admin.auth().updateUser(userId, { disabled });

    return res.status(200).json({
      success: true,
      message: `User account successfully ${disabled ? "disabled" : "enabled"}`,
    });
  } catch (error) {
    console.error("Error updating user account status:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Request a reward
app.post("/api/requestReward", async (req, res) => {
  try {
    const { qid, username } = req.body;

    // Validate input
    if (!qid || !username) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    // Check if reward already exists for this question
    const existingReward = await Reward.findOne({ qid });
    if (existingReward) {
      return res.status(400).json({
        success: false,
        error: "A reward has already been requested for this question",
      });
    }

    // Create new reward document
    const newReward = new Reward({
      qid,
      username,
      createdAt: new Date(),
      status: "pending",
    });

    // Save to database
    await newReward.save();

    return res.status(201).json({
      success: true,
      message: "Reward requested successfully",
    });
  } catch (error) {
    console.error("Error requesting reward:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while requesting reward",
    });
  }
});

// Check if a reward has been requested for a question
app.get("/api/checkRewardStatus", async (req, res) => {
  try {
    const { qid } = req.query;

    if (!qid) {
      return res
        .status(400)
        .json({ success: false, error: "Question ID is required" });
    }

    const reward = await Reward.findOne({ qid });

    return res.status(200).json({
      success: true,
      exists: Boolean(reward),
      reward: reward || null,
    });
  } catch (error) {
    console.error("Error checking reward status:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while checking reward status",
    });
  }
});
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} hello world `)
);
