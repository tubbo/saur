import { renderFile } from "https://deno.land/x/dejs/mod.ts";

function statementize(field) {
  let [name, type, ...options] = field.split(":");
  type = type || "string";

  if (options.length) {
    options = options.map((option) => `${option}: true`).join(", ");

    return `${name}: { type: "${type}", ${options} },`;
  }

  return `{ ${name}: "${type}" }`;
}

const ACTIONS = ["create", "drop"];

export default async function (name, className, encoder, ...fields) {
  const version = new Date().getTime();
  const path = `migrations/${version}_${name}.js`;
  const statements = fields.map(statementize);
  const splitName = name.split("-");
  const action = ACTIONS.contains(splitName[0]) ? splitName[0] : "update";
  const tableName = splitName[splitName.length];
  const context = { className, statements, tableName };
  const template = `./cli/generate/templates/migration/${action}.ejs`;
  const source = await renderFile(template, context);

  await Deno.writeFile(path, encoder.encode(source));
  console.log("Created new migration", className, "in", path);
}
