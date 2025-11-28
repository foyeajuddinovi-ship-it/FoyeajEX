import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import { exec } from "child_process";
import { transcribeAudio } from "./utils/transcribe.js";
import { translateHindiBangla } from "./utils/translate.js";
import { textToSpeech } from "./utils/tts.js";

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/convert", upload.single("video"), async (req, res) => {
  try {
    const videoPath = req.file.path;
    const audioPath = `${videoPath}.wav`;

    await new Promise(resolve => {
      exec(`ffmpeg -i ${videoPath} -ar 16000 -ac 1 ${audioPath}`, resolve);
    });

    const hindiText = await transcribeAudio(audioPath);
    const banglaText = await translateHindiBangla(hindiText);
    const banglaAudio = await textToSpeech(banglaText);

    res.set({ "Content-Type": "audio/wav" });
    res.send(banglaAudio);

  } catch (err) {
    console.error(err);
    res.status(500).send("Conversion failed.");
  }
});

app.listen(5000, () => console.log("Server running on 5000"));
