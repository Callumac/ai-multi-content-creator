// File: src/lib/zipOutput.ts import fs from 'fs'; import path from 'path'; import archiver from 'archiver';

export async function zipOutput(tempDir: string): Promise<string> { const zipPath = path.join(tempDir, 'package.zip'); const output = fs.createWriteStream(zipPath); const archive = archiver('zip', { zlib: { level: 9 } });

return new Promise((resolve, reject) => { output.on('close', () => resolve(zipPath)); archive.on('error', (err) => reject(err));

archive.pipe(output);
archive.directory(tempDir, false);
archive.finalize();

}); }

// File: src/lib/chatgpt.ts import { Configuration, OpenAIApi } from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''; const configuration = new Configuration({ apiKey: OPENAI_API_KEY }); const openai = new OpenAIApi(configuration);

export async function chatWithGPT(prompt: string): Promise<string> { const response = await openai.createChatCompletion({ model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: prompt }], temperature: 0.8, }); return response.data.choices[0].message?.content?.trim() || 'No response.'; }

// File: src/lib/scriptGen.ts import { chatWithGPT } from "@/lib/chatgpt";

export async function generateScript(prompt: string, type: string): Promise<string> { const promptMap: Record<string, string> = { story: Write a creative short story based on this: ${prompt}, review: Write a balanced product review about: ${prompt}, news: Summarize the latest news topic: ${prompt} in 3 short paragraphs., explainer: Explain the topic '${prompt}' in a clear, simple way., motivation: Write a motivational message about: ${prompt}, under 100 words., promo: Create an engaging promo script for: ${prompt}. Include CTA., shorts: Generate a catchy YouTube Shorts script about: ${prompt}., podcast: Create an audio podcast-style monologue on: ${prompt}. };

const finalPrompt = promptMap[type] || promptMap["story"]; return await chatWithGPT(finalPrompt); }

// File: src/pages/api/generate.ts import { NextApiRequest, NextApiResponse } from "next"; import fs from 'fs'; import path from 'path'; import { v4 as uuidv4 } from 'uuid';

import { generateScript } from '@/lib/scriptGen'; import { generateVoice } from '@/lib/tts'; import { makeVideo } from '@/lib/videoMaker'; import { generateThumbnail } from '@/lib/thumbnail'; import { generateSEO } from '@/lib/seo'; import { zipOutput } from '@/lib/zipOutput';

export default async function handler(req: NextApiRequest, res: NextApiResponse) { if (req.method !== 'POST') { return res.status(405).json({ message: 'Method Not Allowed' }); }

const { prompt, type } = req.body;

try { const sessionId = uuidv4(); const tempDir = path.join(process.cwd(), 'public', 'outputs', sessionId); fs.mkdirSync(tempDir, { recursive: true });

const script = await generateScript(prompt, type);
fs.writeFileSync(path.join(tempDir, 'script.txt'), script);

const audioPath = await generateVoice(script, tempDir);
const videoPath = await makeVideo(script, audioPath, tempDir);
const thumbnailPath = await generateThumbnail(prompt, tempDir);

const seo = generateSEO(prompt);
fs.writeFileSync(
  path.join(tempDir, 'seo.txt'),
  `${seo.caption}\n\n${seo.hashtags.join(' ')}\n\n${seo.description}`
);

const zipPath = await zipOutput(tempDir);
const zipUrl = `/outputs/${sessionId}/package.zip`;

res.status(200).json({ zipUrl });

} catch (error) { console.error(error); res.status(500).json({ message: 'Failed to generate package' }); } }

