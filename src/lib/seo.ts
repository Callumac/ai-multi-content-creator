// src/lib/seo.ts

export function generateSEO(topic: string) {
  const hashtags = [
    `#${topic.replace(/\s+/g, '')}`,
    "#viral", "#trending", "#explore", "#reels", "#shorts", "#motivation", "#funny"
  ];

  const caption = `Discover the magic of "${topic}" – you won't believe how it ends!`;

  const description = `This short video explores the topic of "${topic}" in an exciting and engaging way. Perfect for anyone interested in creativity, fun, or inspiration. Like, share, and subscribe!`;

  return {
    hashtags,
    caption,
    description,
  };
}
