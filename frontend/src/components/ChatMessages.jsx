import { useEffect, useRef } from "react";

import gsap from "gsap";

import { useGSAP } from "@gsap/react";

import ReactMarkdown from "react-markdown";

import rehypeHighlight from "rehype-highlight";

import VINCard from "./VINCard";

import FCCCard from "./FCCCard";

function ChatMessages({ messages, loading }) {
  const messagesEndRef = useRef(null);

  // MESSAGE ENTRANCE ANIMATION

  useGSAP(() => {
    const items = gsap.utils.toArray(".message-item");

    const lastItem = items[items.length - 1];

    if (!lastItem) return;

    gsap.fromTo(
      lastItem,
      {
        y: 20,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
      },
    );
  }, [messages]);

  // AUTO SCROLL

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto space-y-5 pr-2 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          {/* ICON */}

          <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-blue-500 via-cyan-400 to-purple-500 flex items-center justify-center shadow-2xl shadow-cyan-500/20 mb-8 animate-pulse">
            <span className="text-5xl font-bold">Q</span>
          </div>

          {/* TITLE */}

          <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-cyan-200 to-zinc-400 bg-clip-text text-transparent">
            QuicKey Intelligence
          </h1>

          {/* SUBTITLE */}

          <p className="text-zinc-400 max-w-2xl text-lg leading-relaxed mb-10">
            AI-powered locksmith intelligence platform for key analysis, VIN
            decoding, FCC lookup, vehicle diagnostics, and smart automotive
            assistance.
          </p>

          {/* SUGGESTIONS */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full">
            {[
              "Analyze a vehicle key image",
              "Decode a VIN number",
              "Lookup FCC ID information",
              "Ask locksmith programming questions",
            ].map((item, index) => (
              <button
                key={index}
                className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-cyan-400/20 transition-all duration-300 text-left backdrop-blur-xl"
              >
                <p className="font-medium">{item}</p>
              </button>
            ))}
          </div>
        </div>
      )}
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message-item p-5 rounded-3xl whitespace-pre-wrap border backdrop-blur-xl shadow-xl transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 ${
            message.role === "user" ? "max-w-[75%]" : "max-w-[82%]"
          } ${
            message.role === "user"
              ? "ml-auto bg-gradient-to-br from-blue-500 via-sky-500 to-cyan-400 border-white/10 shadow-2xl shadow-cyan-500/10"
              : "bg-white/[0.03] border-white/10 shadow-lg shadow-black/20 hover:shadow-cyan-500/5"
          }`}
        >
          <>
            {/* IMAGE MESSAGE */}

            {message.type === "image" ? (
              <div>
                <img
                  src={message.image}
                  alt="uploaded"
                  className="rounded-2xl mb-3 w-full max-h-80 object-cover border border-white/10"
                />

                <p className="text-sm text-zinc-300">{message.content}</p>
              </div>
            ) : /* LOADING MESSAGE */

            message.type === "loading" ? (
              <div className="flex items-center gap-2 py-2">
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

              <div className="prose prose-invert max-w-none">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            )}

            {/* SOURCES */}

            {message.sources && message.sources.length > 0 && (
              <div className="mt-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />

                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-medium">
                    Knowledge Sources
                  </p>
                </div>

                <div className="space-y-3">
                  {message.sources.map((source, index) => (
                    <div
                      key={index}
                      className="group rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-all duration-300 backdrop-blur-xl overflow-hidden"
                    >
                      {/* TOP */}

                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300 text-sm">
                            📄
                          </div>

                          <div>
                            <p className="text-sm font-medium text-white">
                              Source {index + 1}
                            </p>

                            <p className="text-xs text-zinc-500">
                              AI knowledge retrieval
                            </p>
                          </div>
                        </div>

                        <div className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/20">
                          {Math.round(source.score * 100)}% match
                        </div>
                      </div>

                      {/* CONTENT */}

                      <div className="p-4">
                        <p className="text-sm leading-7 text-zinc-300 line-clamp-5">
                          {source.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        </div>
      ))}

      {/* GLOBAL LOADING */}

      {loading && (
        <div className="bg-white/[0.04] border border-white/10 backdrop-blur-xl p-4 rounded-2xl w-fit">
          <span className="animate-pulse">Typing...</span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatMessages;
