import { exec } from "child_process";
import fs from "fs";
import path from "path";

export function generateVoice(
  text: string,
  dir: string,
  gender: "male"|"female" = "female"
): Promise<string> {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true});
  const out = path.join(dir,"voice.mp3");
  const speed = gender==="male"?0.9:1.1;
  const cmd = `gtts-cli "${text.replace(/"/g,'\\"')}" | ffmpeg -i - -filter:a "atempo=${speed}" -y ${out}`;
  return new Promise((res,rej)=> exec(cmd, err => err?rej(err):res(out)) );
}
