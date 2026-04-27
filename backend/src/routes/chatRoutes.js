import express from "express";
import { handleChat } from "../controllers/chatController.js";

const router = express.Router();
router.get("/", (req, res) => {
  res.send("API is working 🚀");
});
router.post("/", handleChat);

export default router;