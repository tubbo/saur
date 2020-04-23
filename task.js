import { walkSync } from "https://deno.land/std/fs/mod.ts";

/**
 * Tasks are user-defined subcommands of the `saur` CLI that are active
 * when the user is at the top level of an application directory. They
 * are typically created using the `task()` function which is the
 * default export of this module. Generally, `Task` classes do not need
 * to be instantiated or used direcrlty.
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

/**
 * Create a new task with the given `name` and `description`, calling
 * the function when the task is invoked.
 */
export default function task(name, description, perform) {
  return new Task({ name, description, perform });
}
