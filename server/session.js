import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
dotenv.config();

export const sessionMiddleware = session({
  secret:
    process.env.SESSION_SECRET ||
    "f9a8e3d4c7b6a5e4d3c2b1f098765432fedcba9876543210abcdefabcdef1234",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Set secure: true in production with HTTPS
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // Store sessions in MongoDB
    collectionName: "sessions",
  }),
});
