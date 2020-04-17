import each from "https://deno.land/x/lodash/each.js"

export default class Controller {
  /**
   * Perform a request using an action method on this controller.
   */
  static perform(action) {
    return async context => {
      const controller = new this(context)
      const handler = controller[action].bind(controller)
      const params = context.request.params

      try {
        const name = `${this}`.split(" ")[1]
        App.log.info(`Performing ${name}#${action}`)
        await handler(params)
      } catch(e) {
        App.log.error(e)
        context.response.body = e.message
        context.response.status = 500
        context.response.headers.set("Content-Type", "text/html")
      }
    }
  }

  constructor(context) {
    this.request = context.request
    this.response = context.response
    this.layout = this.constructor.layout || App.config.layout
    this.status = 200
    this.headers = {
      "Content-Type": "text/html; charset=utf-8"
    }
    this.initialize()
  }

  initialize() {}

  get actions() {
    return Object.keys(this).filter(key => (
      typeof this[key] === "function" && typeof super[key] === "undefined"
    ))
  }

  /**
   * Prepare the response for rendering by setting its status and
   * headers based on the information in the controller.
   */
  prepare() {
    this.response.status = this.status;
    const bytes = encodeURIComponent(this.response.body).match(/%[89ABab]/g);
    const length = this.response.body.length + (bytes ? bytes.length : 0)
    this.response.headers.set("Content-Length", length)

    each(this.headers, (value, header) => this.response.headers.set(header, value))
  }

  /**
   * Render the given view's template using an instance as context.
   */
  async render(View, context={}) {
    const view = new View(this, context={});
    const result = await view.template.render(view);
    const html = result.toString();

    this.response.body = html;
    this.response.headers.set("Content-Type", "text/html");

    App.log.info(`Rendering template ${view.template.path}`);
    App.log.info(`Using layout ${view.template.layout}`);
    this.prepare();
  }

  /**
   * Redirect to an entirely new location
   */
  redirect(action, options) {
    const controller = options.controller || this
    const params = options.params || {}
    const url = App.routes.resolve(controller, action, params)
    this.status = 302
    this.headers["Location"] = url
    this.response.body = `You are being <a href="${url}">redirected</a>`
  }

  head(status) {
    this.status = status
    this.prepare()
  }
}
