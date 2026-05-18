import fs from "fs";

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

import { getEmbedding } from "../services/embeddingService.js";

import Knowledge from "../models/Knowledge.js";

export const uploadKnowledge = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No PDF uploaded",
      });
    }

    const data = new Uint8Array(fs.readFileSync(req.file.path));

    const pdf = await pdfjsLib.getDocument({
      data,
    }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);

      const content = await page.getTextContent();

      const strings = content.items.map((item) => item.str);

      text += strings.join(" ") + "\n";
    }

    const chunks = [];

    const chunkSize = 1000;

    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }

    const knowledgeDocs = await Promise.all(
      chunks.map(async (chunk, index) => {
        const embedding = await getEmbedding(chunk);

        return Knowledge.create({
          title: req.file.originalname,

          content: chunk,

          chunkIndex: index,

          embedding,
        });
      }),
    );

    fs.unlinkSync(req.file.path);

    res.json({
      message: "PDF uploaded successfully",

      chunksCreated: knowledgeDocs.length,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
};
