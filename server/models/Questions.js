import mongoose from "mongoose";
const questionSchema = new mongoose.Schema({
  _id: String,
  author: String,
  username: String,
  solved: Boolean,
  whoCanRespond: String,
  queBody: String,
  tags: [String],
  media: [
    {
      url: String, // File path stored here
      contentType: String,
    },
  ],
  meta: {
    upvotes: {
      users: [String],
      val: Number,
    },
    downvotes: { users: [String], val: Number },
    notify: { users: [String], val: Number },
    discussion: { users: [String], val: Number },
  },
  createdAt: { type: Date, default: Date.now },
});

const Question = mongoose.model("Question", questionSchema);
export default Question;
