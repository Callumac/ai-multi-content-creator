import { Configuration, OpenAIApi } from "openai";

const KEY = process.env.OPENAI_API_KEY || "";

export async function generateScript(prompt: string, type = "story"): Promise<string> {
  const map: Record<string,string> = {
    story: `Write a creative short story about "${prompt}".`,
    review: `Write a balanced product review of "${prompt}". Include pros & cons.`,
    news: `Summarize the latest news on "${prompt}" in 3 paragraphs.`,
    explainer: `Explain "${prompt}" simply for beginners.`,
    motivation: `Write a short motivational message about "${prompt}".`,
    promo: `Create a promo script for "${prompt}" with a call to action.`,
    shorts: `Generate a 45-second YouTube Shorts script on "${prompt}".`,
    podcast: `Create a 2-minute podcast monologue on "${prompt}".`,
    comedy: `Write a 30-second stand-up comedy bit about "${prompt}".`
  };
  const final = map[type] || map.story;

  if (KEY) {
    try {
      const ai = new OpenAIApi(new Configuration({ apiKey: KEY }));
      const res = await ai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: final }],
        temperature: 0.8
      });
      const txt = res.data.choices[0].message?.content?.trim();
      if (txt) return txt;
    } catch {
      console.warn("OpenAI failed—fallback.");
    }
  }
  return `Basic ${type} output for "${prompt}".`;
}
