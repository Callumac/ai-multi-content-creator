import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Jimp from 'jimp';

export const config = {
  api: { bodyParser: false },
};

const tempDir = path.join(process.cwd(), 'temp');
fs.mkdirSync(tempDir, { recursive: true });

export default async function handler(req, res) {
  const form = formidable({ multiples: false, uploadDir: tempDir, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err || !files.image) return res.status(400).json({ error: 'Image required' });

    try {
      const imagePath = files.image.filepath;
      const topText = fields.topText || '';
      const bottomText = fields.bottomText || '';

      const image = await Jimp.read(imagePath);
      const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

      image.print(font, 10, 10, topText);
      image.print(font, 10, image.getHeight() - 50, bottomText);

      const filename = `meme-${uuidv4()}.jpg`;
      const memePath = path.join(tempDir, filename);
      await image.writeAsync(memePath);

      const downloadUrl = `/api/download?file=${filename}`;
      res.status(200).json({ downloadUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate meme' });
    }
  });
}
