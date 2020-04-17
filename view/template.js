const { cwd } = Deno;
import { renderFile } from "https://deno.land/x/dejs/mod.ts"
import { extname } from "https://deno.land/std@v0.12.0/fs/path/mod.ts"

export default class Template {
  constructor(path, layout) {
    this.path = `${cwd()}/templates/${path}`
    this.layout = `${cwd()}/templates/layouts/${layout}`
    this.handlers = {
      ejs: renderFile
    }
  }

  async render(view) {
    const innerHTML = await this.compile(this.path, view)
    const context = Object.assign({ innerHTML }, view)
    const outerHTML = await this.compile(this.layout, context)

    return outerHTML
  }

  async compile(path, context) {
    const type = extname(this.path).replace('.', '')

    return await this.handlers[type](path, context)
  }
}
