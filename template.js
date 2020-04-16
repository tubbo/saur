const { cwd } = Deno;
import { renderFile } from "https://deno.land/x/dejs/mod.ts"
import { extname } from "https://deno.land/std@v0.12.0/fs/path/mod.ts"

export default class Template {
  constructor(path, layout) {
    this.path = `${cwd()}/templates/${path}`
    this.layout = `${cwd()}/templates/layouts/${layout}`
    this.context = context
    this.handlers = {
      ejs: renderFile
    }
  }

  async compile(view) {
    const innerHTML = await this.render(this.path, view)
    const context = Object.assign({ innerHTML }, view)
    const outerHTML = await this.render(this.layout, context)

    return outerHTML
  }

  async render(path, context) {
    const type = extname(this.path)

    return await this.handlers[type](path, context)
  }
}
