import cosineSimilarity from "compute-cosine-similarity";

import Knowledge from "../models/Knowledge.js";

import { getEmbedding } from "./embeddingService.js";

export const searchKnowledge = async (message) => {
  const queryEmbedding = await getEmbedding(message);

  const knowledgeDocs = await Knowledge.find();

  const scoredDocs = knowledgeDocs
    .filter(
      (doc) => doc.embedding && doc.embedding.length === queryEmbedding.length,
    )
    .map((doc) => {
      const score = cosineSimilarity(
        queryEmbedding,

        doc.embedding,
      );

      return {
        ...doc.toObject(),

        score,
      };
    });

  const topDocs = scoredDocs.sort((a, b) => b.score - a.score).slice(0, 3);

  const knowledgeContext = topDocs.map((doc) => doc.content).join("\n\n");

  return {
    knowledgeContext,

    sources: topDocs.map((doc) => ({
      title: doc.title,

      chunkIndex: doc.chunkIndex,

      score: doc.score,
    })),
  };
};
