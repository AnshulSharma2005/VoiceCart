import express from "express";
import multer from "multer";
import fs from "fs";
import OpenAI from "openai";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/upload-audio", upload.single("audio"), async (req, res) => {
  try {
    const audioFile = fs.createReadStream(req.file.path);

    // Step 1: Transcribe (auto language detect)
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });

    const rawText = transcription.text;

    // Step 2: Translate to English for NLP
    const translation = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Translate this into English clearly." },
        { role: "user", content: rawText },
      ],
    });

    const englishText = translation.choices[0].message.content;

    res.json({
      transcription: englishText, // ✅ normalized English
      detectedLanguage: transcription.language, // original language
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  } finally {
    // cleanup
    if (req.file) fs.unlinkSync(req.file.path);
  }
});

export default router;
