import { ejs } from "../assets.js";

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
  const template = `cli/templates/migration/${action}.ejs`;
  const source = ejs(template, context);

  await Deno.writeFile(path, encoder.encode(source.toString()));
  console.log("Created new migration", className, "in", path);
}
