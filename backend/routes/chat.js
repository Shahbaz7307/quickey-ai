import express from "express";

import Chat from "../models/Chat.js";

import { createAIStream, generateChatTitle } from "../services/aiService.js";

import { searchKnowledge } from "../services/knowledgeService.js";

import { detectAndRunTool } from "../services/toolService.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",

  authMiddleware,

  async (req, res) => {
    try {
      const { message, chatId, messages } = req.body;

      const toolResult = await detectAndRunTool(message);

      if (toolResult) {
        res.setHeader("Content-Type", "text/plain");

        res.setHeader("Transfer-Encoding", "chunked");

        res.write(
          `[${toolResult.type.toUpperCase()}]${JSON.stringify(
            toolResult.data,
          )}`,
        );

        let chat;

        const aiToolMessage = {
          role: "ai",

          type: toolResult.type,

          content: "",
        };

        // VIN TOOL

        if (toolResult.type === "vin_result") {
          aiToolMessage.vinData = toolResult.data;
        }

        // FCC TOOL

        if (toolResult.type === "fcc_result") {
          aiToolMessage.fccData = toolResult.data;
        }

        if (chatId) {
          chat = await Chat.findById(chatId);

          chat.messages.push({
            role: "user",

            content: message,
          });

          chat.messages.push(aiToolMessage);

          await chat.save();
        } else {
          const title = await generateChatTitle(message);

          chat = await Chat.create({
            userId: req.userId,

            title,

            messages: [
              {
                role: "user",

                content: message,
              },

              aiToolMessage,
            ],
          });
        }

        // SEND CHAT ID

        res.write(`\n[CHAT_ID]${chat._id}`);

        return res.end();
      }

      // KNOWLEDGE SEARCH

      const {
        knowledgeContext,

        sources,
      } = await searchKnowledge(message);

      // AI STREAM

      const stream = await createAIStream({
        message,

        messages,

        knowledgeContext,
      });

      res.setHeader("Content-Type", "text/plain");

      res.setHeader("Transfer-Encoding", "chunked");

      let aiReply = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";

        aiReply += content;

        res.write(content);
      }

      // SAVE CHAT

      let chat;

      if (chatId) {
        chat = await Chat.findById(chatId);

        chat.messages.push({
          role: "user",

          content: message,
        });

        chat.messages.push({
          role: "ai",

          content: aiReply,
        });

        await chat.save();
      } else {
        const title = await generateChatTitle(message);

        chat = await Chat.create({
          userId: req.userId,

          title,

          messages: [
            {
              role: "user",

              content: message,
            },

            {
              role: "ai",

              content: aiReply,
            },
          ],
        });
      }

      // SEND SOURCES

      res.write(`\n[CHAT_ID]${chat._id}`);

      res.write(`\n[SOURCES]${JSON.stringify(sources)}`);

      res.end();
    } catch (error) {
      console.log(error);

      res.status(500).json({
        error: error.message,
      });
    }
  },
);

// GET ALL CHATS

router.get(
  "/",

  authMiddleware,

  async (req, res) => {
    try {
      const chats = await Chat.find({
        userId: req.userId,
      }).sort({
        updatedAt: -1,
      });

      res.json(chats);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        error: error.message,
      });
    }
  },
);

// GET SINGLE CHAT

router.get(
  "/:id",

  authMiddleware,

  async (req, res) => {
    try {
      const chat = await Chat.findById(req.params.id);

      res.json(chat);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        error: error.message,
      });
    }
  },
);

router.post("/image", authMiddleware, async (req, res) => {
  try {
    const { image, content = "", reply = "", chatId } = req.body;

    let chat;

    const userImageMessage = {
      role: "user",

      type: "image",

      image,

      content,
    };

    const aiMessage = {
      role: "ai",

      content: reply,
    };

    if (chatId) {
      chat = await Chat.findById(chatId);

      chat.messages.push(userImageMessage);

      chat.messages.push(aiMessage);

      await chat.save();
    } else {
      chat = await Chat.create({
        userId: req.userId,

        title: await generateChatTitle(content || "Image Analysis"),

        messages: [userImageMessage, aiMessage],
      });
    }

    res.json({
      success: true,

      chatId: chat._id,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;
