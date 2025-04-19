import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  _id: String,
  notificationDetails: [
    {
      typeOfNot: String,
      source: String,
      msg: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  lastView: Date,
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
