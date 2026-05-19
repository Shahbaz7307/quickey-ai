import { useState } from "react";

import gsap from "gsap";

import { useGSAP } from "@gsap/react";

import useChatStore from "../store/chatStore";

import Sidebar from "../components/Sidebar";

import ChatInput from "../components/ChatInput";
import ChatMessages from "../components/ChatMessages";

import { analyzeImage } from "../services/visionService";

import { saveImageChat } from "../services/imageChatService";

function ChatPage() {
  useGSAP(() => {
    gsap.from(".page-header", {
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });

    gsap.from(".chat-container", {
      opacity: 0,
      scale: 0.98,
      duration: 0.8,
      delay: 0.15,
      ease: "power2.out",
    });

    gsap.from(".sidebar", {
      x: -20,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  }, []);

  const [message, setMessage] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const [attachedPdf, setAttachedPdf] = useState("");

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
      // IMAGE FLOW

      if (selectedImage) {
        // STORE VALUES BEFORE CLEARING
        const imageFile = selectedImage.file;

        const imagePreview = selectedImage.preview;

        const imageName = message || selectedImage.file.name;

        // TEMP USER IMAGE
        addMessage({
          role: "user",

          type: "image",

          image: imagePreview,

          content: imageName,
        });

        // LOADING MESSAGE
        addMessage({
          role: "ai",

          type: "loading",

          content: "Analyzing image...",
        });

        // CLEAR INPUT IMMEDIATELY
        setSelectedImage(null);

        setMessage("");

        // ANALYZE IMAGE
        const data = await analyzeImage(imageFile);

        const updatedMessages = [...useChatStore.getState().messages];

        // REMOVE LOADING
        updatedMessages.pop();

        // REPLACE TEMP IMAGE WITH REAL URL
        updatedMessages[updatedMessages.length - 1] = {
          role: "user",

          type: "image",

          image: data.imageUrl,

          content: imageName,
        };

        // AI RESPONSE
        updatedMessages.push({
          role: "ai",

          content: data.reply,
        });

        // SAVE CHAT
        const savedChat = await saveImageChat({
          image: data.imageUrl,

          content: imageName,

          reply: data.reply,

          chatId: localStorage.getItem("activeChatId"),
        });

        localStorage.setItem("activeChatId", savedChat.chatId);

        useChatStore.setState({
          messages: updatedMessages,
        });
      } else {
        // NORMAL TEXT FLOW

        await sendMessage(message);

        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen text-white flex overflow-hidden relative">
      {/* SIDEBAR */}

      <div className="sidebar">
        <Sidebar />
      </div>

      {/* CHAT AREA */}

      <div className="flex-1 p-6 flex flex-col h-full overflow-hidden relative">
        {/* HEADER */}

        <div className="mb-6 page-header">
          <h1 className="text-4xl font-bold tracking-tight">
            QuicKey Intelligence
          </h1>

          <p className="text-zinc-400 mt-2 text-sm">
            AI-powered locksmith intelligence platform
          </p>
        </div>

        {/* CHAT */}

        <div className="chat-container flex-1 overflow-hidden glass rounded-3xl p-4 flex flex-col min-h-0">
          <ChatMessages messages={messages} loading={loading} />
        </div>

        {/* INPUT */}

        <div className="mt-4 glass rounded-2xl p-3">
          <ChatInput
            message={message}
            setMessage={setMessage}
            sendMessage={handleSend}
            handleImageUpload={handleImageUpload}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            loading={loading}
            attachedPdf={attachedPdf}
            setAttachedPdf={setAttachedPdf}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
