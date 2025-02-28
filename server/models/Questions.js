import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  _id: String,
  author: String,
  solved: Boolean,
  whoCanRespond: String,
  queBody: String,
  tags: [String],
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
