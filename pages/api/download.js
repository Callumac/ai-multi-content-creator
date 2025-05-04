import fs from 'fs';
import path from 'path';

const tempDir = path.join(process.cwd(), 'temp');

export default async function handler(req, res) {
  const { file } = req.query;
  const filePath = path.join(tempDir, file);

  if (!fs.existsSync(filePath)) return res.status(404).send('File not found');

  res.setHeader('Content-Type', 'image/jpeg');
  res.setHeader('Content-Disposition', `attachment; filename="${file}"`);

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);

  stream.on('end', () => {
    fs.unlink(filePath, () => {}); // delete file after serving
  });
}
