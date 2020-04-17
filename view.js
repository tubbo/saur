import Template from "./view/template.js"

export default class View {
  static template = null

  constructor(controller, context={}) {
    this.context = context
    this.controller = controller
    this.template = new Template(
      this.constructor.template,
      this.controller.layout
    )
    this.urlFor = App.routes.resolve.bind(App.routes)
    const host = `${controller.request.protocol}://${controller.request.host}`

    App.routes.forEach(({ as, controller, action }) => {
      const name = camelCase(as)

      this[`${name}Path`] = (params={}) => (
        this.urlFor(controller, action, params)
      );
      this[`${name}URL`] = (params={}) => (
        this.urlFor(controller, action, params, host)
      );
    })

    this.initialize()
  }

  initialize() {}

  cache(key, options={}, fresh) {
    return App.cache.fetch(key, fresh)
  }

  linkTo(text, href, options={}) {
    return `<a href="${href}">${text}</a>`
  }

  /**
   * Render the given view's template using an instance as context.
   */
  async render(View) {
    const view = new View(this)
    const result = await view.template.partial(view)

    App.log.info(`Rendering partial ${view.template.path}`)

    return result.toString()
  }

  htmlAttributes(options={}) {
    return reduce(options, (value, option) => `${option}="${value}"`, "");
  }

  formTag({ action, method, ...options }) {
    const attributes = this.htmlAttributes(options)
    const token = App.authenticityToken

    if (method === "GET" && method === "POST") {
      return `<form action="${action}" method="${method}" ${attributes}>`
    }

    return `<form action="${action}" method="POST" ${attributes}>
    <input type="hidden" name="_method" value="${method}" />
    <input type="hidden" name="authenticity_token" value="${token}" />
    `
  }

  linkTo(text, href, options) {
    const attributes = this.htmlAttributes(options)

    if (typeof href === "string") {
      return `<a href="${href}" ${attributes}>${text}</a>`
    }

    const url = this.urlFor(href)

    return `<a href="${url}" ${attributes}>${text}</a>`
  }

  get csrfMetaTag() {
    const token = App.authenticityToken

    return `<meta name="authenticity_token" content="${token}" />`
  }

  get endFormTag() {
    return "</form>"
  }
}
