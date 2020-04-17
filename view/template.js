const { cwd } = Deno;
import { renderFile } from "https://deno.land/x/dejs/mod.ts"
import { extname } from "https://deno.land/std@v0.12.0/fs/path/mod.ts"
import ReactDOMServer from "https://dev.jspm.io/react-dom/server.js"

export default class Template {
  constructor(path, layout) {
    this.path = `${cwd()}/templates/${path}`
    this.layout = `${cwd()}/templates/layouts/${layout}`
    this.handlers = {
      ejs: renderFile
    }
  }

  /**
   * Template handler type, such as "ejs"
   */
  get type() {
    return extname(this.path).replace('.', '')
  }

  /**
   * Template handler specified by its extension.
   */
  get handler() {
    return this.handlers[this.type]
  }

  /**
   * Compile this template using the template handler.
   */
  async compile(path, context) {
    return await this.handler(path, context)
  }


  /**
   * Render this template without its outer layout.
   */
  async partial(view) {
    return await this.compile(this.path, view)
  }

  /**
   * Render this template and wrap it in a layout.
   */
  async render(view) {
    const innerHTML = await this.partial(view)
    const context = { innerHTML, ...view }
    const outerHTML = await this.compile(this.layout, context)

    return outerHTML
  }
}
