import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { generateFunnyScript } from "./scriptGen";
import { generateVoice } from "./tts";
import { animateFace } from "./faceAnimator";

export async function createComedyClip(imagePath: string) {
  const sessionId = uuidv4();
  const tempDir = path.join(process.cwd(), "public", "outputs", sessionId);
  fs.mkdirSync(tempDir, { recursive: true });

  // 1. Generate funny script
  const script = await generateFunnyScript();

  // 2. Generate funny voice
  const audioPath = await generateVoice(script, tempDir);

  // 3. Animate face with voice
  const videoPath = await animateFace(imagePath, audioPath, tempDir);

  // 4. Save caption
  const captionPath = path.join(tempDir, "caption.txt");
  fs.writeFileSync(captionPath, script);

  return {
    videoUrl: `/outputs/${sessionId}/comedy.mp4`,
    captionUrl: `/outputs/${sessionId}/caption.txt`,
  };
}
