import ReactMarkdown from "react-markdown";

function ChatBubble({ role, content }) {
  return (
    <div
      className={`max-w-[80%] p-4 rounded-2xl whitespace-pre-wrap ${
        role === "user"
          ? "bg-blue-500 self-end text-white"
          : "bg-zinc-800 self-start text-white"
      }`}
    >
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

export default ChatBubble;
