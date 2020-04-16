const { cwd } = Deno;
import { renderFile } from "https://deno.land/x/dejs/mod.ts"

export default class Template {
  constructor(path, layout) {
    this.path = `${cwd()}/templates/${path}`
    this.layout = `${cwd()}/templates/layouts/${layout}`
    this.context = context
  }

  async compile(view) {
    const innerHTML = await renderFile(this.path, view)
    const context = Object.assign({ innerHTML }, view)
    const outerHTML = await renderFile(this.layout, context)

    return outerHTML
  }
}
