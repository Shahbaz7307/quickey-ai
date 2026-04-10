import { useEffect, useRef } from "react";

import ReactMarkdown from "react-markdown";

import rehypeHighlight from "rehype-highlight";

import VINCard from "./VINCard";

import FCCCard from "./FCCCard";

function ChatMessages({ messages, loading }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent hover:scrollbar-thumb-zinc-500">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`p-4 rounded-2xl max-w-fit whitespace-pre-wrap ${
            message.role === "user" ? "bg-blue-500 ml-auto" : "bg-zinc-800"
          }`}
        >
          <>
            {/* IMAGE MESSAGE */}

            {message.type === "image" ? (
              <div>
                <img
                  src={message.image}
                  alt="uploaded"
                  className="rounded-xl mb-2 max-h-72 object-cover"
                />

                <p className="text-sm text-zinc-300">{message.content}</p>
              </div>
            ) : /* LOADING MESSAGE */

            message.type === "loading" ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" />

                <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-100" />

                <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-200" />

                <span className="ml-2">{message.content}</span>
              </div>
            ) : /* VIN TOOL CARD */

            message.type === "vin_result" ? (
              <VINCard
                make={message.vinData.make}
                model={message.vinData.model}
                year={message.vinData.year}
                engine={message.vinData.engine}
              />
            ) : message.type === "fcc_result" ? (
              <FCCCard
                fccId={message.fccData.fccId}
                frequency={message.fccData.frequency}
                chip={message.fccData.chip}
                vehicle={message.fccData.vehicle}
              />
            ) : (
              /* NORMAL AI MARKDOWN */

              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {message.content}
              </ReactMarkdown>
            )}

            {/* SOURCES */}

            {message.sources && message.sources.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                <p className="text-xs text-zinc-400">Sources</p>

                {message.sources.map((source, index) => (
                  <div
                    key={index}
                    className="bg-zinc-900 border border-zinc-700 p-2 rounded-lg text-sm"
                  >
                    <p>📄 {source.title}</p>

                    <p className="text-zinc-400 text-xs">
                      Similarity: {Math.round(source.score * 100)}%
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        </div>
      ))}

      {loading && (
        <div className="bg-zinc-800 p-4 rounded-2xl w-fit">
          <span className="animate-pulse">Typing...</span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatMessages;
