import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/chat", chatRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

export default app;