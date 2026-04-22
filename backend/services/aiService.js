import OpenAI from "openai";

export const createAIStream = async ({
  message,
  messages,
  knowledgeContext,
}) => {
  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,

    baseURL: "https://api.groq.com/openai/v1",
  });

  const stream = await client.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",

    stream: true,

    messages: [
      {
        role: "system",

        content: `
You are QuicKey Intelligence, an advanced AI locksmith assistant.

IMPORTANT INSTRUCTIONS:

1. Use locksmith knowledge base when relevant.
2. Never hallucinate locksmith specifications.
3. If information is missing, clearly say so.
4. Be concise, accurate, and professional.

LOCKSMITH KNOWLEDGE BASE:

${knowledgeContext || "No knowledge available"}
`,
      },

      ...messages
        .filter((msg) => msg.type !== "loading")
        .map((msg) => ({
          role: msg.role === "ai" ? "assistant" : "user",

          content: msg.content,
        })),

      {
        role: "user",

        content: message,
      },
    ],
  });

  return stream;
};
