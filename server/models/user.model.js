import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  _id: String, // Store UID as document ID
  email: String,
  name: String,
  createdAt: { type: Date, default: Date.now },
});
