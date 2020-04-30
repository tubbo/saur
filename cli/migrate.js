import { walkSync } from "https://deno.land/std/fs/walk.ts";

export default async function Migrate(options, direction = "up") {
  const root = Deno.cwd();
  const { default: App } = await import(`${root}/index.js`);

  for (const { filename } of walkSync(`${root}/migrations`)) {
    if (filename.match(/\.js$/)) {
      const [version, name] = filename.split("_");
      const { default: Migration } = await import(filename);
      const migration = new Migration(name, version, App);

      if (!migration.executed()) {
        migration.exec(direction);
      }
    }
  }
}
