import { walkSync } from "https://deno.land/std/path/fs.ts";

export default async function Migrate(direction = "up") {
  await import("./index.js");

  for (const { path } of walkSync(`${Deno.cwd()}/migrations/*.js`)) {
    const [version, name] = path.split("_");
    const Migration = await import(path);
    const migration = new Migration(name, version, App.db);

    if (!migration.executed) {
      migration.exec(direction);
    }
  }
}
