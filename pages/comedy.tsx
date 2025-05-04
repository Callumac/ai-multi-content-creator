import { useState } from 'react';

export default function ComedyGenerator() {
  const [image, setImage] = useState<File | null>(null);
  const [topic, setTopic] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !topic) return alert('Upload an image and enter a comedy topic.');

    const formData = new FormData();
    formData.append('image', image);
    formData.append('topic', topic);

    setLoading(true);
    try {
      const res = await fetch('/api/comedy', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.videoUrl) setVideoUrl(data.videoUrl);
      else alert(data.error || 'Failed to generate video');
    } catch (err) {
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: 'auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>AI Comedy Clip Generator</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          style={{ display: 'block', marginBottom: 10 }}
        />
        <input
          type="text"
          placeholder="Enter comedy topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Generating Clip...' : 'Generate Comedy Clip'}
        </button>
      </form>

      {videoUrl && (
        <div style={{ marginTop: 20 }}>
          <h2>Funny Video</h2>
          <video src={videoUrl} controls width="100%" />
        </div>
      )}
    </div>
  );
}
