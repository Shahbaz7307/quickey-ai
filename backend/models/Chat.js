import mongoose from "mongoose";

const messageSchema =
  new mongoose.Schema(
    {
      role: {
        type: String,

        required: true,
      },

      type: {
        type: String,

        default: "text",
      },

      content: {
        type: String,

        default: "",
      },

      image: {
        type: String,
      },

      sources: [
        {
          title: String,

          chunkIndex: Number,

          score: Number,
        },
      ],

      vinData: {
        make: String,

        model: String,

        year: String,

        engine: String,
      },

      fccData: {
        fccId: String,

        frequency: String,

        chip: String,

        vehicle: String,
      },
    },
    {
      timestamps: true,
    }
  );

const chatSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,

        default: "New Chat",
      },

      userId: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,
      },

      messages: [
        messageSchema,
      ],
    },
    {
      timestamps: true,
    }
  );

const Chat = mongoose.model(
  "Chat",
  chatSchema
);

export default Chat;