import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState("story");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/generate", { prompt, type });
      setResult(res.data);
    } catch (e) {
      alert("Generation failed");
    }
    setLoading(false);
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>AI Content Generator</h1>
      <textarea placeholder="Enter prompt..." value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} style={{ width: '100%' }} />
      <select value={type} onChange={e => setType(e.target.value)} style={{ margin: '10px 0' }}>
        <option value="story">Story</option>
        <option value="review">Product Review</option>
        <option value="news">News</option>
        <option value="explainer">Explainer</option>
        <option value="motivation">Motivation</option>
        <option value="promo">Promo</option>
        <option value="shorts">YouTube Shorts</option>
        <option value="podcast">Podcast</option>
      </select>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>Generated Script</h2>
          <pre>{result.script}</pre>
          <h3>SEO</h3>
          <p>{result.caption}</p>
          <p>{result.hashtags?.join(" ")}</p>
          <p>{result.description}</p>

          <h3>Media</h3>
          <audio controls src={result.audio} />
          <video controls width="400" src={result.video} />
          <img src={result.thumbnail} alt="thumbnail" style={{ width: 200 }} />
        </div>
      )}
    </main>
  );
}
