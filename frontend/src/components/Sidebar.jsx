import { useEffect } from "react";

import useChatStore from "../store/chatStore";
import PDFUpload from "./PDFUpload";
import useAuthStore from "../store/authStore";

function Sidebar() {
  const { chats, fetchChats, openChat, resetChat, chatId } = useChatStore();

  const { user, fetchUser, logout } = useAuthStore();

  useEffect(() => {
    const loadData = async () => {
      await fetchChats();

      await fetchUser();

      const activeChatId = localStorage.getItem("activeChatId");

      if (activeChatId) {
        openChat(activeChatId);
      }
    };

    loadData();
  }, []);

  return (
    <div className="w-72 bg-zinc-950 border-r border-zinc-800 p-4 flex flex-col h-full overflow-hidden">
      <button
        onClick={resetChat}
        className="bg-blue-500 hover:bg-blue-600 p-3 rounded-xl text-white mb-4"
      >
        + New Chat
      </button>
      <PDFUpload />
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent hover:scrollbar-thumb-zinc-500 pr-1">
        {chats.map((chat) => (
          <button
            key={chat._id}
            onClick={() => openChat(chat._id)}
            className={`text-left p-3 rounded-lg transition ${
              chatId === chat._id
                ? "bg-zinc-700"
                : "bg-zinc-900 hover:bg-zinc-800"
            }`}
          >
            <p className="truncate">{chat.title}</p>
          </button>
        ))}
      </div>
      <div className="border-t border-zinc-800 pt-4 mt-4">
        <div className="bg-zinc-900 rounded-xl p-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">
              {user?.name?.charAt(0)}
            </div>

            <div>
              <p className="font-medium">{user?.name}</p>

              <p className="text-xs text-zinc-400">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 transition p-2 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
