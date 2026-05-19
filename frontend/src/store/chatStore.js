import { create } from "zustand";

import {
  streamChatMessage,
  getChats,
  getSingleChat,
} from "../services/chatService";

const initialMessage = [
  {
    role: "ai",
    content: "Hello! I am QuicKey Intelligence. How can I help you today?",
  },
];

// const initialMessage = [];

const useChatStore = create((set, get) => ({
  loading: false,

  chatId: null,

  chats: [],

  messages: initialMessage,

  setChatId: (chatId) => {
    localStorage.setItem("activeChatId", chatId);

    set({ chatId });
  },
  resetChat: () => {
    localStorage.removeItem("activeChatId");

    set({
      chatId: null,

      messages: initialMessage,
    });
  },

  fetchChats: async () => {
    try {
      const chats = await getChats();

      set({ chats });
    } catch (error) {
      console.log(error);
    }
  },

  openChat: async (chatId) => {
    try {
      const chat = await getSingleChat(chatId);

      if (!chat) {
        localStorage.removeItem("activeChatId");

        return;
      }

      localStorage.setItem("activeChatId", chat._id);

      set({
        chatId: chat._id,

        messages: chat.messages,
      });
    } catch (error) {
      console.log(error);

      localStorage.removeItem("activeChatId");
    }
  },

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  sendMessage: async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      role: "user",

      content: message,
    };

    get().addMessage(userMessage);

    const aiMessage = {
      role: "ai",

      content: "",
    };

    set((state) => ({
      messages: [...state.messages, aiMessage],
    }));

    try {
      set({ loading: true });

      await streamChatMessage(
        message,
        get().chatId,
        get().messages,

        (chunk) => {
          set((state) => {
            const updatedMessages = [...state.messages];

            const lastMessage = updatedMessages[updatedMessages.length - 1];

            // VIN RESULT

            if (chunk.includes("[VIN_RESULT]")) {
              const vinJson = chunk.split("[VIN_RESULT]")[1];

              const vinData = JSON.parse(vinJson);

              updatedMessages[updatedMessages.length - 1] = {
                role: "ai",

                type: "vin_result",

                vinData,

                content: "",
              };

              return {
                messages: updatedMessages,
              };
            }

            // FCC RESULT

            if (chunk.includes("[FCC_RESULT]")) {
              const fccJson = chunk.split("[FCC_RESULT]")[1];

              const fccData = JSON.parse(fccJson);

              updatedMessages[updatedMessages.length - 1] = {
                role: "ai",

                type: "fcc_result",

                fccData,

                content: "",
              };

              return {
                messages: updatedMessages,
              };
            }

            // CHAT ID

            if (chunk.includes("[CHAT_ID]")) {
              const parts = chunk.split("[CHAT_ID]");

              const chatId = parts[1].split("\n")[0].trim();

              localStorage.setItem("activeChatId", chatId);

              set({ chatId });

              return {
                messages: updatedMessages,
              };
            }

            // SOURCES

            if (chunk.includes("[SOURCES]")) {
              const parts = chunk.split("[SOURCES]");

              lastMessage.content += parts[0];

              try {
                lastMessage.sources = JSON.parse(parts[1]);
              } catch (error) {
                console.log(error);
              }
            } else {
              lastMessage.content += chunk;
            }

            return {
              messages: updatedMessages,
            };
          });
        },
      );

      get().fetchChats();
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useChatStore;
