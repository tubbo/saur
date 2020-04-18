import Template from "./view/template.js";
import reduce from "https://deno.land/x/lodash/reduce.js";

export default class View {
  static template = null;

  constructor(controller, context = {}) {
    this.context = context;
    this.controller = controller;
    this.request = controller.request;
    this.template = new Template(
      this.constructor.template,
      this.controller.layout,
    );
    this.urlFor = App.routes.resolve.bind(App.routes);

    App.routes.forEach((route) => route.hydrate(this));
    this.initialize();
  }

  initialize() {}

  cache(key, options = {}, fresh) {
    return App.cache.fetch(key, options, fresh);
  }

  /**
   * Render the given View's template as a partial within this View,
   * using this View as context. You can also pass in other context as
   * the last argument to this method.
   */
  async render(View, context = {}) {
    const view = new View(this, { ...this.context, ...context });
    const result = await view.template.partial(view);

    App.log.info(`Rendering partial ${view.template.path}`);

    return result.toString();
  }

  /**
   * Render a hash of options as HTML attributes.
   */
  htmlAttributes(options = {}, prefix = null) {
    return reduce(
      options,
      (value, option, memo) => {
        if (typeof value === "object") {
          value = this.htmlAttributes(value, option);
        }

        if (prefix) {
          option = `${prefix}-${option}`;
        }

        return `${memo} ${option}="${value}"`;
      },
      "",
    );
  }

  /**
   * Render a `<form>` tag and hidden fields to verify authenticity
   * token and make PATCH/PUT/DELETE requests.
   */
  formTag({ action, method, ...options }) {
    const attributes = this.htmlAttributes(options);
    const token = App.authenticityToken;

    if (method === "GET" && method === "POST") {
      return `<form action="${action}" method="${method}" ${attributes}>`;
    }

    return `<form action="${action}" method="POST" ${attributes}>
    <input type="hidden" name="_method" value="${method}" />
    <input type="hidden" name="authenticity_token" value="${token}" />
    `;
  }

  formFor({ model = null, action = null, method = null, ...options }) {
    action = model ? this.urlFor(model) : action;
    method = method || (model && model.persisted ? "PATCH" : "POST");

    return this.formTag({ action, method, ...options });
  }

  /**
   * Render an `<a>` tag pointing to a specific route. You can use
   * `urlFor` syntax or a route helper in the `href` argument.
   */
  linkTo(text, href, options) {
    const attributes = this.htmlAttributes(options);
    const url = this.urlFor(href);

    return `<a href="${url}" ${attributes}>${text}</a>`;
  }

  get csrfMetaTag() {
    const token = App.authenticityToken;

    return `<meta name="authenticity_token" content="${token}" />`;
  }

  get endFormTag() {
    return "</form>";
  }
}
