import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.js";
import connectDB from "./database/db.js";
import authRoutes from "./routes/auth.js";
import visionRoutes from "./routes/vision.js";
import knowledgeRoutes from "./routes/knowledge.js";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/vision", visionRoutes);

app.use("/api/knowledge", knowledgeRoutes);

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
