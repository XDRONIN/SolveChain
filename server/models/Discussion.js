import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema({
  _id: String,
  users: [String],
  messages: [
    {
      username: String,
      msg: String,
      time: Date,
      solved: Boolean,
      media: [
        {
          url: String, // File path stored here
          contentType: String,
        },
      ],
    },
  ],
});

const Discussion = mongoose.model("Discussion", discussionSchema);
export default Discussion;
