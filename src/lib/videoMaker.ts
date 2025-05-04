import { exec } from "child_process";
import fs from "fs";
import path from "path";

export function makeVideo(
  script: string,
  audioPath: string,
  dir: string,
  bg = "public/placeholder.png"
): Promise<string> {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true});
  const words = script.split(/\s+/).length;
  const dur = Math.min(Math.max((words/140)*60,120),240);
  const sentences = script.split(/(?<=[.?!])\s+/).filter(s=>s);
  const sd = dur / sentences.length;

  const srt = sentences.map((s,i)=>{
    const start=i*sd, end=start+sd;
    const fmt=(t:number)=>`00:${String(Math.floor(t/60)).padStart(2,"0")}:${String(Math.floor(t%60)).padStart(2,"0")},000`;
    return `${i+1}\n${fmt(start)} --> ${fmt(end)}\n${s}\n`;
  }).join("\n");

  const srtPath = path.join(dir,"subs.srt");
  fs.writeFileSync(srtPath, srt);

  const out = path.join(dir,"video.mp4");
  const cmd = `ffmpeg -y -loop 1 -i ${bg} -i ${audioPath} -vf subtitles=${srtPath} -c:v libx264 -t ${dur} -c:a aac -shortest ${out}`;
  return new Promise((res,rej)=> exec(cmd, err=>err?rej(err):res(out)) );
}
