import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
  uid: String,
  username: String,
  createdAt: Date,
  verified: Boolean,
});

const Verification = mongoose.model("Verification", verificationSchema);
export default Verification;
