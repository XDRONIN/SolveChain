import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema({
  qid: String,
  username: String,
  createdAt: Date,
  status: String,
});

const Reward = mongoose.model("Reward", rewardSchema);
export default Reward;
