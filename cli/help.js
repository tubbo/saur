import { dirname } from "https://deno.land/std/path/mod.ts";
import { renderFile } from "https://deno.land/x/dejs/mod.ts";
import { Task } from "../task.js";

const { readFile } = Deno;
const root = dirname(import.meta.url).replace("file://", "");
const decoder = new TextDecoder("utf-8");

export default async function Help(options, cmd, ...argv) {
  const command = !cmd || cmd === "help" ? "usage" : [cmd, ...argv].join("/");
  const path = command === "usage"
    ? `${root}/help/usage.ejs`
    : `${root}/help/${command}.txt`;
  let txt;

  try {
    if (command === "usage") {
      const Tasks = await Task.all();
      const tasks = Tasks.map((t) => `${t.name} - ${t.description}`);
      const src = await renderFile(path, { tasks });
      txt = src.toString();
    } else {
      const src = await readFile(path);
      txt = decoder.decode(src);
    }

    console.log(txt);
  } catch (e) {
    console.error("No manual entry for", "saur", cmd, ...argv);
    Deno.exit(1);
  }
}
