import express from "express";

import multer from "multer";

import { uploadKnowledge } from "../controllers/knowledgeController.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/upload",

  upload.single("pdf"),

  uploadKnowledge
);

export default router;