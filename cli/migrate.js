import { walkSync } from "https://deno.land/std/path/fs.ts";

export default async function Migrate(options, direction = "up") {
  const { default: App } = await import("./index.js");

  for (const { filename } of walkSync(`${Deno.cwd()}/migrations`)) {
    if (filename.match(/\.js$/)) {
      const [version, name] = filename.split("_");
      const { default: Migration } = await import(filename);
      const migration = new Migration(name, version, App);

      if (!migration.executed) {
        migration.exec(direction);
      }
    }
  }
}
