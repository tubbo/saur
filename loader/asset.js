import { Hash } from "https://deno.land/x/checksum@1.2.0/mod.ts";
import { dirname } from "https://deno.land/std/path/mod.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";

const { dir, mkdir, writeFile, readFile } = Deno;
const SHA1 = new Hash("sha1");

export default class Asset {
  constructor(url, base) {
    this.url = base ? `${base}/${url}` : url;
    this.id = SHA1.digest(url).hex();
  }

  get cached() {
    return existsSync(this.path);
  }

  get path() {
    return `${dir()}/saur/${this.id}.json`;
  }

  get local() {
    return this.url.match(/$\./);
  }

  async cache(response) {
    // if (!existsSync(dirname(this.path))) {
    //   mkdir(dirname(this.path));
    // }

    // const json = JSON.stringify(response);

    // await writeFile(this.path, json);
  }

  async body() {
    const file = await readFile(this.path);
    const { body } = JSON.parse(file);

    return body;
  }
}
