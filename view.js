import reduce from "https://deno.land/x/lodash/reduce.js";
import Template from "./view/template.js";

/**
 * A decorator for defining the `template` of a given view.
 */
export function template(name) {
  return (target) => {
    target.template = name;
  };
}

/**
 * View encapsulates the presentation code and template rendering for a
 * given UI.
 */
export default class View {
  /**
   * Optional configuration for this View's template. This is the
   * template file that will be rendered when the `render()` method is
   * called on this View, out-of-box.
   *
   * @return string
   */
  static template = null;

  static get name() {
    return `${this}`.split(" ")[1];
  }

  constructor(controller, context = {}) {
    this.context = context;
    this.controller = controller;
    this.app = controller.app;
    this.request = controller.request;
    this.template = new Template(
      this.constructor.template,
      controller.format,
      this,
    );
    this.urlFor = this.app.routes.resolve.bind(this.app.routes);

    Object.entries(this.context).forEach((value, key) => (this[key] = value));
    this.app.routes.forEach((route) => route.hydrate(this));
    this.initialize();
  }

  /**
   * Called when the `View` is instantiated, this method can be
   * overridden in your class to provide additional setup functionality
   * for the view. Views are instantiated when they are rendered.
   */
  initialize() {}

  cache(key, options = {}, fresh) {
    return this.app.cache.fetch(key, options, fresh);
  }

  /**
   * Render the given View's template as a partial within this View,
   * using this View as context. You can also pass in other context as
   * the last argument to this method.
   */
  async partial(View, context = {}) {
    const view = new View(this, { ...this.context, ...context });
    const result = await view.toHTML();

    this.app.log.info(`Rendering partial ${view.template.path}`);

    return result.toString();
  }

  /**
   * Render this View's template as a String of HTML.
   *
   * @return string
   */
  toHTML() {
    return this.template.partial(this);
  }

  /**
   * Render this View's template as the response to a Controller
   * request. This method can be overridden to return a String of HTML
   * or JSX, rather than use the configured template.
   *
   * @return string
   */
  render() {
    return this.template.render(this);
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
    const token = this.app.authenticityToken;

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
    const token = this.app.authenticityToken;

    return `<meta name="authenticity_token" content="${token}" />`;
  }

  get endFormTag() {
    return "</form>";
  }
}
