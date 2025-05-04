import { createCanvas } from "canvas";
import fs from "fs";
import path from "path";

export function createThumbnail(
  prompt: string,
  dir: string
): string {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true});
  const w=1280,h=720;
  const c=createCanvas(w,h),ctx=c.getContext("2d")!;
  ctx.fillStyle="#333";ctx.fillRect(0,0,w,h);
  ctx.fillStyle="#fff";ctx.font="bold 60px Arial";
  ctx.fillText(prompt.slice(0,30)+"...",50,360);
  const out = path.join(dir,"thumb.png");
  fs.writeFileSync(out, c.toBuffer("image/png"));
  return out;
}
