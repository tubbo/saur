const { fetch } = Deno;
import { render } from "https://deno.land/x/dejs/mod.ts";

export async function require(path) {
  const response = await fetch(`https://deno.land/x/saur/${path}`);
  const source = await response.text();

  return source;
}

export async function ejs(path, params = {}) {
  const source = require(path);

  return render(source, params);
}
