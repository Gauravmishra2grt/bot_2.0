import express from "express";
import { handleChat } from "../controllers/chatController.js";

const router = express.Router();

// test route
router.get("/", (req, res) => {
  res.send("Chat route working 🚀");
});

// main chat route
router.post("/", handleChat);

export default router;