import { useState } from "react";

import { uploadPDF } from "../services/knowledgeService";

function PDFUpload() {
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setLoading(true);

      setMessage("");

      const data = await uploadPDF(file);

      setMessage(
        `PDF uploaded successfully (${data.chunksCreated} chunks created)`,
      );
    } catch (error) {
      console.log(error);

      setMessage("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block">
        {loading ? "Uploading..." : "Upload PDF"}

        <input
          type="file"
          accept=".pdf"
          onChange={handleUpload}
          className="hidden"
        />
      </label>

      {message && <p className="text-sm text-zinc-400 mt-2">{message}</p>}
    </div>
  );
}

export default PDFUpload;
