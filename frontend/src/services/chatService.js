import axios from "axios";

const API_URL = "http://localhost:5000/api/chat";

export const sendChatMessage = async (message, chatId) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    API_URL,
    {
      message,
      chatId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const getChats = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getSingleChat = async (chatId) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/${chatId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const streamChatMessage = async (message, chatId, messages, onChunk) => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      message,
      chatId,
      messages,
    }),
  });

  const reader = response.body.getReader();

  const decoder = new TextDecoder();

  let done = false;

  while (!done) {
    const result = await reader.read();

    done = result.done;

    const chunk = decoder.decode(result.value);

    if (chunk) {
      // SMALL DELAY FOR SMOOTH STREAMING

      await new Promise((resolve) => setTimeout(resolve, 12));

      onChunk(chunk);
    }
  }
};
