import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: String,
  notifyQues: [
    {
      quesId: String,
      lastViewed: Date,
      notify: Boolean, // True when the corresponding doc's solved value changes to true
    },
  ],
  notifyDiss: [
    {
      dissId: String,
      lastViewed: Date,
    },
  ],
  following: [String],
  followers: [String],
  solved: Number,
  stars: Number,
  profilePic: String, // URL or file path for profile picture
  certs: [String], // Array of URLs or file paths for certifications
  verified: Boolean,
});

const User = mongoose.model("User", userSchema, "userData");
export default User;
