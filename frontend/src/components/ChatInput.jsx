import { useRef } from "react";

import { Send, ImagePlus, FileText } from "lucide-react";

import PDFUpload from "./PDFUpload";

function ChatInput({
  message,
  setMessage,
  sendMessage,
  handleImageUpload,
  selectedImages,
  setSelectedImages,
  loading,
  attachedPdfs,
  setAttachedPdfs,
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
      {/* ATTACHMENTS */}

      {(selectedImages.length > 0 || attachedPdfs.length > 0) && (
        <div className="flex flex-wrap gap-3 mb-4">
          {/* IMAGE CHIPS */}

          {selectedImages.map((image, index) => (
            <div
              key={`image-${index}`}
              className="flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-2xl px-3 py-2 backdrop-blur-xl"
            >
              <img
                src={image.preview}
                alt="preview"
                className="w-10 h-10 rounded-xl object-cover"
              />

              <div className="max-w-[140px]">
                <p className="text-sm text-white truncate">{image.file.name}</p>

                <p className="text-xs text-zinc-400">Image attached</p>
              </div>

              <button
                onClick={() =>
                  setSelectedImages((prev) =>
                    prev.filter((_, i) => i !== index),
                  )
                }
                className="text-zinc-500 hover:text-red-400 transition-colors text-lg"
              >
                ✕
              </button>
            </div>
          ))}

          {/* PDF CHIPS */}

          {attachedPdfs.map((pdf, index) => (
            <div
              key={`pdf-${index}`}
              className="flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-2xl px-3 py-2 backdrop-blur-xl"
            >
              <FileText size={18} className="text-cyan-400" />

              <div className="max-w-[160px]">
                <p className="text-sm text-white truncate">{pdf}</p>

                <p className="text-xs text-zinc-400">Knowledge attached</p>
              </div>

              <button
                onClick={() =>
                  setAttachedPdfs((prev) => prev.filter((_, i) => i !== index))
                }
                className="text-zinc-500 hover:text-red-400 transition-colors text-lg"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* INPUT CONTAINER */}

      <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-3 backdrop-blur-2xl shadow-2xl">
        {/* TEXTAREA */}

        <textarea
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask QuicKey Intelligence..."
          className="w-full bg-transparent outline-none resize-none text-white placeholder:text-zinc-500 px-2 py-2 max-h-40"
        />

        {/* ACTION ROW */}

        <div className="flex items-center justify-between mt-3">
          {/* LEFT ACTIONS */}

          <div className="flex items-center gap-2">
            {/* FILE INPUT */}

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => handleImageUpload(Array.from(e.target.files))}
            />

            {/* IMAGE BUTTON */}

            <button
              onClick={() => fileInputRef.current.click()}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all duration-300 flex items-center justify-center"
            >
              <ImagePlus size={18} />
            </button>

            {/* PDF BUTTON */}

            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all duration-300 flex items-center justify-center overflow-hidden">
              <PDFUpload iconOnly setAttachedPdfs={setAttachedPdfs} />
            </div>
          </div>

          {/* SEND BUTTON */}

          <button
            onClick={sendMessage}
            disabled={loading}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 active:scale-95 transition-all duration-300 flex items-center justify-center shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
