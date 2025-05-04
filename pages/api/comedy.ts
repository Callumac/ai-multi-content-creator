import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import formidable from "formidable";
import { v4 as uuidv4 } from "uuid";
import { generateScript } from "@/lib/scriptGen";
import { generateVoice } from "@/lib/tts";
import { makeFunnyVideo } from "@/lib/funnyVideoMaker";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Ensure the main upload directory exists
const uploadDir = path.join(process.cwd(), "public", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err || !files.image || !fields.topic) {
      return res.status(400).json({ error: "Missing image or topic" });
    }

    try {
      const sessionId = uuidv4();
      const outputDir = path.join(process.cwd(), "public", "comedy", sessionId);
      fs.mkdirSync(outputDir, { recursive: true });

      const imagePath = Array.isArray(files.image) ? files.image[0].filepath : files.image.filepath;
      const topic = Array.isArray(fields.topic) ? fields.topic[0] : fields.topic;

      const script = await generateScript(topic); // AI-generated comedy script
      const audioPath = await generateVoice(script, outputDir); // TTS audio file
      const videoPath = await makeFunnyVideo(imagePath, audioPath, outputDir); // Face + voice animated video

      const videoUrl = `/comedy/${sessionId}/funny-video.mp4`;
      res.status(200).json({ videoUrl });
    } catch (error) {
      console.error("Generation failed:", error);
      res.status(500).json({ error: "Failed to generate comedy video" });
    }
  });
}
