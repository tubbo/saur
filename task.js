// import { walkSync } from "https://deno.land/std/fs/mod.ts"

/**
 * Tasks are user-defined subcommands of the `saur` CLI that are active
 * when the user is at the top level of an application directory.
 */
export class Task {
  static get all() {
    const paths = [];

    // TODO bug in walkSync?
    // for (const fi of walkSync("./tasks")) {
    //   paths.push(fi.filename)
    // }

    return paths.map(async (path) => await import(path));
  }

  static find(command) {
    const task = this.all.find((task) => task.name === command);

    if (!task) {
      throw new Error(`Invalid command "${command}"`);
    }

    return task;
  }

  constructor({ name, description, perform }) {
    this.name = name;
    this.description = description;
    this.perform = perform;
  }
}

export default function task(name, description, perform) {
  return new Task({ name, description, perform });
}
