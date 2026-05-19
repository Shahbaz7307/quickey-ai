import { useEffect } from "react";

import gsap from "gsap";

import { useGSAP } from "@gsap/react";

import useChatStore from "../store/chatStore";

import useAuthStore from "../store/authStore";

function Sidebar() {
  const { chats, fetchChats, openChat, resetChat, chatId } = useChatStore();

  const { user, fetchUser, logout } = useAuthStore();

  useEffect(() => {
    fetchUser();

    const loadChats = async () => {
      await fetchChats();

      const activeChatId = localStorage.getItem("activeChatId");

      if (activeChatId) {
        openChat(activeChatId);
      }
    };

    loadChats();
  }, []);

  // SIDEBAR ANIMATION

  useGSAP(() => {
    const items = gsap.utils.toArray(".chat-item");

    if (!items.length) return;

    gsap.from(items, {
      opacity: 0,

      x: -10,

      stagger: 0.05,

      duration: 0.5,

      ease: "power2.out",
    });
  }, [chats]);
  return (
    <div className="w-[280px] sm:w-80 h-screen relative p-2">
      {/* SIDEBAR PANEL */}

      <div className="sidebar-panel h-full max-w-full glass rounded-3xl border border-white/10 px-5 py-6 flex flex-col overflow-hidden backdrop-blur-2xl">
        {/* TOP */}

        <div className="mb-6">
          {/* LOGO */}

          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="text-2xl font-bold">Q</span>
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">QuicKey</h1>

              <p className="text-zinc-400 text-sm">Locksmith AI</p>
            </div>
          </div>

          {/* NEW CHAT */}

          <button
            onClick={resetChat}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-[1.02] active:scale-95 transition-all duration-300 p-4 rounded-2xl text-white font-semibold shadow-lg shadow-cyan-500/20"
          >
            + New Chat
          </button>
        </div>

        {/* CHATS */}

        <div className="flex-1 overflow-y-auto pr-1 pl-2 space-y-3 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
          {chats.map((chat) => (
            <button
              key={chat._id}
              onClick={() => openChat(chat._id)}
              className={`chat-item group w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                chatId === chat._id
                  ? "bg-white/[0.08] border-cyan-400/30 shadow-lg shadow-cyan-500/10"
                  : "bg-white/[0.05] border-white/10 hover:bg-white/[0.08] hover:border-cyan-400/20"
              }`}
            >
              <p className="truncate text-sm font-medium">{chat.title}</p>

              <p className="text-xs text-zinc-400 mt-1 group-hover:text-zinc-400 transition-colors">
                AI conversation
              </p>
            </button>
          ))}
        </div>

        {/* USER CARD */}

        <div className="mt-5 pt-5 border-t border-white/10">
          <div className="glass rounded-3xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              {/* AVATAR */}

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-lg font-bold shadow-lg shadow-cyan-500/20">
                {user?.name?.charAt(0) || "U"}
              </div>

              {/* USER INFO */}

              <div className="flex-1 overflow-hidden">
                <h3 className="font-semibold truncate">
                  {user?.name || "User"}
                </h3>

                <p className="text-sm text-zinc-400 truncate">
                  {user?.email || "No email"}
                </p>
              </div>
            </div>

            {/* LOGOUT */}

            <button
              onClick={logout}
              className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 py-3 rounded-2xl transition-all duration-300 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Sidebar;
