import express from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";

import "dotenv/config";

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

app.use(cors());
app.use(express.json()); // gunakan ini untuk parsing JSON

app.post("/chat", async (req, res) => {
  const { body } = req;
  const { prompt } = body;

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({
      message: "Prompt harus diisikan dan berupa string",
      data: null,
      success: false, // perbaiki typo
    });
    return;
  }
  try {
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    });
    res.status(200).json({
      success: true,
      data: aiResponse.text,
      message: "Berhasil mendapatkan response dari AI",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      data: null,
      message: e.message || "Gagal mendapatkan response dari AI", // perbaiki typo
    });
  }
});

app.listen(3000, () => {
  console.log("I LOVE YOU 3000");
});
