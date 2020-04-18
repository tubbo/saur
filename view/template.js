/**
 * Template reads and compiles a template to render the response for a
 * View, using the View as context. Templates have a conventional
 * filename, `${path_to_template}.${response_format}.${templating_language}`.
 * A "users/show" page for HTML would therefore have a template of
 * `users/show.html.ejs`, while the same route for XML would use the
 * `users/show.xml.ejs` template.
 */
export default class Template {
  constructor(path, root, { layout, handlers }) {
    const [name, format, language] = path.split(".");
    this.name = name;
    this.format = format;
    this.language = language;
    this.path = `${root}/templates/${name}.${format}.${language}`;
    this.layout = `${root}/templates/layouts/${layout}.${format}.${language}`;
    this.handler = handlers[this.language] || handlers.txt;
  }

  /**
   * Compile this template using the template handler.
   */
  compile(path, context) {
    return this.handler(path, context);
  }

  /**
   * Render this template without its outer layout.
   */
  partial(view) {
    return this.compile(this.path, view);
  }

  /**
   * Render this template and wrap it in a layout.
   */
  async render(view) {
    const layout = view.layout || this.layout
    const innerHTML = await this.partial(view);
    const context = { innerHTML, ...view };
    const outerHTML = await this.compile(layout, context);

    return outerHTML;
  }
}
