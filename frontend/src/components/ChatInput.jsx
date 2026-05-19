import { useRef } from "react";

import { Send, ImagePlus, FileText } from "lucide-react";

import PDFUpload from "./PDFUpload";

function ChatInput({
  message,
  setMessage,
  sendMessage,
  handleImageUpload,
  selectedImage,
  setSelectedImage,
  loading,
  attachedPdf,
  setAttachedPdf,
}) {
  const fileInputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (!loading) {
        sendMessage();
      }
    }
  };

  return (
    <div className="relative">
      {/* IMAGE PREVIEW */}

      {selectedImage && (
        <div className="mb-4 relative w-fit">
          <img
            src={selectedImage.preview}
            alt="preview"
            className="w-32 h-32 object-cover rounded-2xl border border-white/10 shadow-xl"
          />

          {/* REMOVE IMAGE */}

          <button
            onClick={() => setSelectedImage(null)}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 transition-all flex items-center justify-center shadow-lg"
          >
            ✕
          </button>
        </div>
      )}

      {/* ATTACHED PDF */}

      {attachedPdf && (
        <div className="mb-4 inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
          <FileText size={18} className="text-cyan-400" />

          <p className="text-sm text-zinc-200 max-w-[220px] truncate">
            {attachedPdf}
          </p>

          <button
            onClick={() => setAttachedPdf("")}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* INPUT CONTAINER */}

      <div className="flex items-end gap-3 bg-white/[0.03] border border-white/10 rounded-3xl p-3 backdrop-blur-2xl shadow-2xl">
        {/* TEXTAREA */}

        <textarea
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask QuicKey Intelligence..."
          className="flex-1 bg-transparent outline-none resize-none text-white placeholder:text-zinc-500 px-3 py-3 max-h-40"
        />

        {/* FILE INPUT */}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0])}
        />

        {/* IMAGE BUTTON */}

        <button
          onClick={() => fileInputRef.current.click()}
          className="w-14 h-14 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all duration-300 flex items-center justify-center hover:scale-105"
        >
          <ImagePlus size={20} />
        </button>

        {/* PDF Upload BUTTON */}
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all duration-300 flex items-center justify-center hover:scale-105 overflow-hidden">
          <PDFUpload iconOnly setAttachedPdf={setAttachedPdf} />
        </div>

        {/* SEND BUTTON */}

        <button
          onClick={sendMessage}
          disabled={loading}
          className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/40 disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
