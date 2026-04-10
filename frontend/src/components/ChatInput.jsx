import { useRef } from "react";

function ChatInput({
  message,
  setMessage,
  sendMessage,
  handleImageUpload,
  selectedImage,
}) {
  const fileInputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      sendMessage();

      setMessage("");
    }
  };

  return (
    <div className="border border-zinc-800 rounded-2xl p-3 bg-zinc-900">
      {selectedImage && (
        <div className="mb-3">
          <img
            src={selectedImage.preview}
            alt="preview"
            className="max-h-40 rounded-xl"
          />
        </div>
      )}
      <textarea
        rows={1}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask QuicKey Intelligence..."
        className="w-full bg-transparent outline-none resize-none"
      />

      <div className="flex justify-between mt-2">
        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files[0])}
          />

          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-xl"
          >
            Upload Image
          </button>
        </div>

        <button
          onClick={() => {
            sendMessage();

            setMessage("");
          }}
          className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
