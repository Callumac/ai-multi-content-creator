import { useState } from "react";

export default function ComedyGenerator() {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const handleUpload = async () => {
    if (!image) return alert("Upload a picture of a comedian.");
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch("/api/comedy", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setVideoUrl(data.videoUrl);
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Comedy Clip Generator</h1>
      <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Generating Clip..." : "Generate Comedy Clip"}
      </button>

      {videoUrl && (
        <div style={{ marginTop: 20 }}>
          <h2>Funny Video</h2>
          <video src={videoUrl} controls width="400" />
        </div>
      )}
    </div>
  );
}
