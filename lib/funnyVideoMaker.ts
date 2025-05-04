// lib/funnyVideoMaker.ts
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

export async function makeFunnyVideo(imagePath: string, audioPath: string, outputDir: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(outputDir, 'funny-video.mp4');

    ffmpeg()
      .addInput(imagePath)
      .loop()
      .addInput(audioPath)
      .outputOptions([
        '-shortest',
        '-c:v libx264',
        '-tune stillimage',
        '-c:a aac',
        '-b:a 192k',
        '-pix_fmt yuv420p'
      ])
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .save(outputPath);
  });
}
