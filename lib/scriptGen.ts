export async function generateFunnyScript(): Promise<string> {
  const jokes = [
    "I told my wife she should embrace her mistakes... She gave me a hug.",
    "Why don't skeletons fight each other? They don't have the guts.",
    "I asked the dog what's two minus two. He said nothing.",
  ];
  const joke = jokes[Math.floor(Math.random() * jokes.length)];
  return `Here's a joke for you: ${joke}`;
}
