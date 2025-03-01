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
    upvotes: Number,
    downvotes: Number,
    notify: Number,
    discussion: Number,
    share: Number,
  },
  createdAt: { type: Date, default: Date.now },
});

const Question = mongoose.model("Question", questionSchema);
export default Question;
