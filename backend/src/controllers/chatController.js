import { getChatResponse } from "../services/groqService.js";

export const handleChat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({ error: "Messages required" });
    }

    const reply = await getChatResponse(messages);

    res.json({ reply });
  } catch (error) {
    console.error("Groq Error:", error);
    const status = error?.status || error?.response?.status || 500;
    const message =
      error?.message ||
      error?.error?.message ||
      "Failed to fetch response";

    res.status(status).json({ error: message });
  }
};