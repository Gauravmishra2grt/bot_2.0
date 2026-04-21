import groq from "../config/groqClient.js";

export const getChatResponse = async (messages) => {
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages,
  });

  return response.choices[0].message.content;
};