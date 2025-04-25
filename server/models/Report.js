import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  sender: String,
  user: String,
  reason: String,
  dId: String,
  createdAt: Date,
});

const Report = mongoose.model("Report", reportSchema);
export default Report;
