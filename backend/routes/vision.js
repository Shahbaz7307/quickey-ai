import express from "express";

import multer from "multer";

import fs from "fs";

import OpenAI from "openai";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/",
  upload.single("image"),

  async (req, res) => {
    try {
      const client = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,

        baseURL: "https://openrouter.ai/api/v1",
      });

      if (!req.file) {
        return res.status(400).json({
          error: "No image uploaded",
        });
      }

      const imageBuffer = fs.readFileSync(req.file.path);

      const base64Image = imageBuffer.toString("base64");

      const completion = await client.chat.completions.create({
        model: "openai/gpt-4o-mini",

        messages: [
          {
            role: "user",

            content: [
              {
                type: "text",

                text: `
Analyze this vehicle or locksmith-related image.

Identify:
- vehicle make/model if visible
- possible key type
- smart key or blade key
- locksmith-relevant observations
- FCC ID if visible
- dashboard or immobilizer clues if visible

Be concise and professional.
`,
              },

              {
                type: "image_url",

                image_url: {
                  url: `data:${req.file.mimetype};base64,${base64Image}`,
                  detail: "high",
                },
              },
            ],
          },
        ],
      });


      const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

      res.json({
        reply: completion.choices[0].message.content,

        imageUrl,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        error: error.message,
      });
    }
  },
);

export default router;
