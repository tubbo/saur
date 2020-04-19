import { Hash } from "https://deno.land/x/checksum/mod.ts";

export default class Token {
  constructor(date, { token, hash }) {
    this.date = date.getTime();
    this.secret = token;
    this.hash = new Hash(hash);
  }

  get source() {
    return `${this.date}|${this.secret}`;
  }

  get digest() {
    return this.hash.digest(this.source);
  }

  toString() {
    return this.digest.hex();
  }
}
