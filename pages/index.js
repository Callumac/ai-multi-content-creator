import { useState } from 'react';

export default function MemeGenerator() {
  const [image, setImage] = useState<File | null>(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert('Upload an image');

    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);
    formData.append('topText', topText);
    formData.append('bottomText', bottomText);

    const res = await fetch('/api/generate', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setDownloadUrl(data.downloadUrl);
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Instant Meme Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} required />
        <input type="text" placeholder="Top Text" value={topText} onChange={e => setTopText(e.target.value)} className="w-full border p-2" />
        <input type="text" placeholder="Bottom Text" value={bottomText} onChange={e => setBottomText(e.target.value)} className="w-full border p-2" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Generating...' : 'Generate Meme'}
        </button>
      </form>

      {downloadUrl && (
        <div className="mt-4">
          <a href={downloadUrl} download className="text-blue-600 underline">
            Download Meme
          </a>
        </div>
      )}
    </div>
  );
}
