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
    const {
      app: {
        config: { template: handlers },
        root,
      },
    } = view;

    this.view = view;
    this.app = view.app;
    this.name = path;
    this.format = format;
    this.language = "ejs";
    this.ext = `${this.format}.${this.language}`;
    this.root = root.replace("file://", "");
    this.path = `${this.root}/templates/${this.name}.${this.ext}`;
    this.handler = handlers[this.language] || handlers.txt;
  }

  get layoutName() {
    return this.view.layout
      ? this.view.layout
      : this.app.config.template.layout;
  }

  get layout() {
    return `${this.root}/templates/layouts/${this.layoutName}.${this.ext}`;
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
  async partial(view) {
    const source = await this.compile(this.path, { view });

    return source;
  }

  /**
   * Render this template and wrap it in a layout.
   */
  async render(view) {
    try {
      const innerHTML = await this.partial(view);
      const outerHTML = await this.compile(this.layout, { innerHTML, view });

      this.app.log.info(
        `Compiled template "${this.name}" with layout "${this.layoutName}".`,
      );

      return outerHTML;
    } catch (e) {
      this.app.log.error(e.message);

      return e.message;
    }
  }
}
