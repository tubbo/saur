import { renderFile } from "https://deno.land/x/dejs/mod.ts";
import { dirname } from "https://deno.land/std/path/mod.ts";

const root = dirname(import.meta.url).replace("file://", "");

function statementize(field) {
  let [name, type, ...options] = field.split(":");
  type = type || "string";

  if (options.length) {
    options = options.map((option) => `${option}: true`).join(", ");

    return `      ${name}: { type: "${type}", ${options} },`;
  }

  return `      ${name}: "${type}",`;
}

const ACTIONS = ["create", "drop"];

export default async function (name, className, options, encoder, ...args) {
  const version = new Date().getTime();
  const path = `migrations/${version}_${name}.js`;
  const fields = args.map(statementize).join("\n");
  const splitName = name.split("_");
  const action = ACTIONS.includes(splitName[0]) ? splitName[0] : "update";
  const tableName = splitName[splitName.length - 1];
  const context = { className, fields, tableName };
  const template = `${root}/templates/migration/${action}.ejs`;
  const source = await renderFile(template, context);

  await Deno.writeFile(path, encoder.encode(source.toString()));
  console.log("Created new migration", className, "in", path);
}
