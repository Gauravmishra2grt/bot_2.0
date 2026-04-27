import groq from "../config/groqClient.js";

export const getChatResponse = async (messages) => {
  try {
    console.log("Sending to Groq:", messages);

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
    });

    const reply = response?.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error("No response from Groq API");
    }

    console.log("Groq Reply:", reply);

    return reply;

  } catch (error) {
    console.error("Groq Service Error:", error);
    throw error;
  }
};