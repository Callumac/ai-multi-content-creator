import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

import formidable from "formidable";
const uploadDir = path.join(process.cwd(), "public", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = new formidable.IncomingForm({ uploadDir, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload failed" });

    // Simulate processing (replace with actual face animation + TTS)
    const filename = path.basename((files.image as any)?.filepath);
    const videoUrl = `/placeholder/comedy.mp4`; // You will replace with real output path

    res.status(200).json({ videoUrl });
  });
}
