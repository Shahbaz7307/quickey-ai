import { useState } from "react";

import useChatStore from "../store/chatStore";

import Sidebar from "../components/Sidebar";

import ChatInput from "../components/ChatInput";
import ChatMessages from "../components/ChatMessages";
import { analyzeImage } from "../services/visionService";
import { saveImageChat } from "../services/imageChatService";

function ChatPage() {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const { messages, loading, sendMessage, addMessage } = useChatStore();

  const handleImageUpload = (file) => {
    if (!file) return;

    setSelectedImage({
      file,
      preview: URL.createObjectURL(file),
    });
  };
  const handleSend = async () => {
    if (!message.trim() && !selectedImage) return;

    try {
      if (selectedImage) {
        // TEMP USER IMAGE
        addMessage({
          role: "user",

          type: "image",

          image: selectedImage.preview,

          content: message || selectedImage.file.name,
        });

        // LOADING MESSAGE
        addMessage({
          role: "ai",

          type: "loading",

          content: "Analyzing image...",
        });

        // ANALYZE IMAGE
        const data = await analyzeImage(selectedImage.file);

        const updatedMessages = [...useChatStore.getState().messages];

        // REMOVE LOADING
        updatedMessages.pop();

        // REPLACE TEMP IMAGE
        updatedMessages[updatedMessages.length - 1] = {
          role: "user",

          type: "image",

          image: data.imageUrl,

          content: message || selectedImage.file.name,
        };

        // AI RESPONSE
        updatedMessages.push({
          role: "ai",

          content: data.reply,
        });

        const savedChat = await saveImageChat({
          image: data.imageUrl,

          content: message || selectedImage.file.name,

          reply: data.reply,

          chatId: localStorage.getItem("activeChatId"),
        });

        localStorage.setItem("activeChatId", savedChat.chatId);

        useChatStore.setState({
          messages: updatedMessages,
        });

        setSelectedImage(null);

        setMessage("");
      } else {
        await sendMessage(message);

        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar />

      {/* CHAT AREA */}
      <div className="flex-1 p-6 flex flex-col h-full overflow-hidden">
        <h1 className="text-4xl font-bold mb-6">QuicKey Intelligence</h1>

        <ChatMessages messages={messages} loading={loading} />

        <ChatInput
          message={message}
          setMessage={setMessage}
          sendMessage={handleSend}
          handleImageUpload={handleImageUpload}
          selectedImage={selectedImage}
        />
      </div>
    </div>
  );
}

export default ChatPage;
