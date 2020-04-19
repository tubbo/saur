/**
 * Template reads and compiles a template to render the response for a
 * View, using the View as context. Templates have a conventional
 * filename, `${path_to_template}.${response_format}.${templating_language}`.
 * A "users/show" page for HTML would therefore have a template of
 * `users/show.html.ejs`, while the same route for XML would use the
 * `users/show.xml.ejs` template.
 */
export default class Template {
  constructor(path, format, view) {
    this.view = view;
    this.app = view.app;
    this.name = path;
    this.format = format;
    this.language = "ejs";
    this.ext = `${this.format}.${this.language}`;
    this.path = `${view.app.root}/templates/${this.name}.${this.ext}`;
    this.handler =
      view.app.config.template.handlers[this.language] ||
      view.app.config.template.handlers.txt;
  }

  get layout() {
    const layout = this.view.layout
      ? this.view.layout
      : this.app.config.template.layout;

    return `${this.app.root}/templates/layouts/${layout}.${this.ext}`;
  }

  /**
   * Compile this template using the template handler.
   */
  async compile(path, context) {
    try {
      const source = await this.handler(path, context);

      return source;
    } catch (e) {
      throw new Error(`Template "${path}" not compiled: ${e.message}`);
    }
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
    try {
      const relpath = this.path.replace(this.app.root + "/", "");
      const relayout = this.layout.replace(this.app.root + "/", "");
      const innerHTML = await this.partial(view);
      const context = { innerHTML, ...view };
      const outerHTML = await this.compile(this.layout, context);

      this.app.log.info(
        `Rendering template "${relpath}" with layout "${relayout}".`,
      );

      return outerHTML;
    } catch (e) {
      this.app.log.error(e.message);

      return e.message;
    }
  }
}
