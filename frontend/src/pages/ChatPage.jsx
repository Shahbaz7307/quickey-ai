import { useState } from "react";
import { useEffect } from "react";
import gsap from "gsap";

import { useGSAP } from "@gsap/react";

import useChatStore from "../store/chatStore";
import { Menu } from "lucide-react";
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
    gsap.from(".sidebar-panel", {
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    const handleQuickPrompt = (e) => {
      setMessage(e.detail);
    };

    window.addEventListener("quickPrompt", handleQuickPrompt);

    return () => {
      window.removeEventListener("quickPrompt", handleQuickPrompt);
    };
  }, []);

  const [message, setMessage] = useState("");

  const [selectedImages, setSelectedImages] = useState([]);
  const [attachedPdfs, setAttachedPdfs] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { messages, loading, sendMessage, addMessage } = useChatStore();

  const handleImageUpload = (files) => {
    if (!files?.length) return;

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  const handleSend = async () => {
    if (!message.trim() && selectedImages.length === 0) return;

    try {
      // IMAGE FLOW

      if (selectedImages.length > 0) {
        const firstImage = selectedImages[0];

        const imageFile = firstImage.file;

        const imagePreview = firstImage.preview;

        const imageName = message || firstImage.file.name;

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
        setSelectedImages([]);

        setMessage("");
        setAttachedPdfs([]);

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

        setAttachedPdfs([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen text-white flex overflow-x-hidden relative">
      {/* SIDEBAR */}

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}

      <div
        className={`sidebar fixed lg:relative top-0 left-0 z-50 lg:z-auto h-screen w-[280px] sm:w-80 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* CHAT AREA */}

      <div className="flex-1 p-3 flex flex-col h-full overflow-hidden relative">
        {/* MOBILE TOPBAR */}

        <div className="lg:hidden flex items-center justify-between mb-4 relative z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-11 h-11 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center"
          >
            <Menu size={20} />
          </button>

          <h2 className="font-semibold">QuicKey</h2>
        </div>
        {/* HEADER */}

        <div className="mb-6 page-header">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            QuicKey Intelligence
          </h1>

          <p className="hidden sm:block text-zinc-400 mt-2 text-sm">
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
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
            loading={loading}
            attachedPdfs={attachedPdfs}
            setAttachedPdfs={setAttachedPdfs}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
