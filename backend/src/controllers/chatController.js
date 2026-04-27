import { getChatResponse } from "../services/groqService.js";

export const handleChat = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { messages } = req.body;

    // ✅ better validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Valid messages required" });
    }

    const reply = await getChatResponse(messages);

    console.log("REPLY:", reply);

    return res.json({ reply });

  } catch (error) {
    console.error("Groq Error:", error);

    return res.status(500).json({
      error: error?.message || "Failed to fetch response",
    });
  }
};