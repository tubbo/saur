import { render } from "https://deno.land/x/dejs/mod.ts";
import Loader from "../loader.js";
import Processor from "../loader/processor.js";

class EJSProcessor extends Processor {
  async process() {
    const compiled = await render(this.source, this.loader.params);

    return compiled;
  }
}

const EJS = new Loader({
  processor: EJSProcessor,
  base: "https://deno.land/x/saur",
});

export async function ejs(path, params = {}) {
  EJS.params = params;

  return EJS.require(path);
}
