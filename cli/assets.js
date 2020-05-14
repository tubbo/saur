import { render } from "https://deno.land/x/dejs/mod.ts";
import Loader from "../loader.js";
import Processor from "../loader/processor.js";
import { decode } from "https://deno.land/std/encoding/utf8.ts";

class EJSProcessor extends Processor {
  async process() {
    const compiled = await render(decode(this.source), this.params);

    return compiled;
  }
}

const EJS = new Loader({
  processor: EJSProcessor,
  base: "https://deno.land/x/saur",
});

export async function ejs(path, params = {}) {
  EJS.params = params;
  const asset = await EJS.require(path);

  return asset;
}
