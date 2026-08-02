import dns from "dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userroutes from "./routes/auth.js";
import questionroute from "./routes/question.js";
import answerroutes from "./routes/answer.js";
import postroutes from "./routes/post.js";
import bookmarkRoutes from "./routes/bookmarks.js"
import questionBookmarkRoutes from "./routes/questionBookmark.js"
import followRoutes  from "./routes/follow.js";
import path from "path";
import notificationRoutes from "./routes/notification.js"

const app = express();
dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }));
app.use("/uploads",express.static(path.join(process.cwd(),"uploads")));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.get("/", (req, res) => {
  res.send("Stackoverflow clone is running perfect");
});
app.use('/user',userroutes);
app.use('/question',questionroute);
app.use('/answer',answerroutes);
app.use("/post",postroutes);
app.use("/bookmark",bookmarkRoutes)
app.use("/question-bookmark",questionBookmarkRoutes)
app.use("/follow",followRoutes);
app.use("/notification",notificationRoutes);

const PORT = process.env.PORT;
const databaseurl = process.env.MONGODB_URL;

mongoose
  .connect(databaseurl)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });