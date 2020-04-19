import { __ } from "https://deno.land/x/dirname/mod.ts";
import { renderFile } from "https://deno.land/x/dejs/mod.ts";
import { Task } from "../task.js";

const { readFile } = Deno;
const { __dirname } = __(import.meta);
const decoder = new TextDecoder("utf-8");

export default async function Help(cmd, ...argv) {
  const command = !cmd || cmd === "help" ? "usage" : [cmd, ...argv].join("/");
  const path =
    command === "usage"
      ? `${__dirname}/help/usage.ejs`
      : `${__dirname}/help/${command}.txt`;
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
