import mongoose from "mongoose";

const knowledgeSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
      },

      content: {
        type: String,
      },

      chunkIndex: {
        type: Number,
      },

      embedding: {
        type: [Number],
      },
    },

    {
      timestamps: true,
    }
  );

const Knowledge =
  mongoose.model(
    "Knowledge",
    knowledgeSchema
  );

export default Knowledge;