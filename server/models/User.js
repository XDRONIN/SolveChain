import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: String,
  notify: {
    ques: [String],
    diss: [String],
  },
  following: [String],
  followers: [String],
  solved: Number,
  stars: Number,
  profilePic: String, // URL or file path for profile picture
  certs: [String], // Array of URLs or file paths for certifications
});

const User = mongoose.model("User", userSchema, "userData");
export default User;
