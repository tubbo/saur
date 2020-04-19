import { walkSync } from "https://deno.land/std/fs/mod.ts";

/**
 * Tasks are user-defined subcommands of the `saur` CLI that are active
 * when the user is at the top level of an application directory.
 */
export class Task {
  static async all() {
    const tasks = [];
    try {
      for (const { filename } of walkSync(`${Deno.cwd()}/tasks`)) {
        if (filename.match(/\.js$/)) {
          const exports = await import(filename);
          tasks.push(exports.default);
        }
      }
      return tasks;
    } catch (e) {
      return tasks;
    }
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
