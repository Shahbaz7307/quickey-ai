import { useState } from "react";

import { FileText, Loader2 } from "lucide-react";

import { uploadPDF } from "../services/knowledgeService";

function PDFUpload({ iconOnly = false, setAttachedPdf }) {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setLoading(true);

      setError("");

      await uploadPDF(file);

      // SET PDF CHIP

      setAttachedPdf(file.name);
    } catch (err) {
      console.log(err);

      setError("Failed to upload PDF");

      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // ICON MODE

  if (iconOnly) {
    return (
      <div className="relative w-full h-full">
        <label className="w-full h-full flex items-center justify-center cursor-pointer">
          <input
            type="file"
            accept=".pdf"
            onChange={handleUpload}
            className="hidden"
          />

          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <FileText size={18} />
          )}
        </label>

        {/* ERROR */}

        {error && (
          <div className="absolute bottom-16 right-0 bg-red-500/10 border border-red-500/20 text-red-300 text-xs px-4 py-3 rounded-2xl backdrop-blur-xl whitespace-nowrap shadow-2xl">
            {error}
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default PDFUpload;
