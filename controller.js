import each from "https://deno.land/x/lodash/each.js";
import ActionMissingError from "./errors/action-missing.js";

export default class Controller {
  static get name() {
    return `${this}`.split(" ")[1];
  }

  /**
   * Perform a request using an action method on this controller.
   */
  static perform(action, app) {
    return async (context) => {
      try {
        const controller = new this(context, app);
        const method = controller[action];

        if (!method) {
          throw new ActionMissingError(this.name, action);
        }

        const handler = method.bind(controller);
        const params = context.request.params;

        app.log.info(`Performing ${this.name}#${action}`);
        await handler(params);
      } catch (e) {
        app.log.error(e);
        context.response.body = e.message;
        context.response.status = 500;
        context.response.headers.set("Content-Type", "text/html");
      }
    };
  }

  constructor(context, app) {
    this.request = context.request;
    this.response = context.response;
    this.status = 200;
    this.headers = {
      "Content-Type": "text/html; charset=utf-8",
    };
    this.app = app;
    this.routes = app.routes;
    this.initialize();
  }

  /**
   * Executed when the controller is instantiated, prior to the request
   * being fulfilled.
   */
  initialize() {}

  /**
   * All methods on this controller that aren't defined on the
   * superclass are considered actions.
   */
  get actions() {
    return Object.keys(this).filter(
      (key) =>
        typeof this[key] === "function" && typeof super[key] === "undefined",
    );
  }

  get format() {
    return this.request.accepts()[0].replace("text/", "");
  }

  /**
   * Prepare the response for rendering by setting its status and
   * headers based on the information in the controller.
   */
  prepare() {
    this.response.status = this.status;
    const bytes = encodeURIComponent(this.response.body).match(/%[89ABab]/g);
    const length = this.response.body.length + (bytes ? bytes.length : 0);
    this.headers["Content-Length"] = length;

    each(this.headers, (value, header) =>
      this.response.headers.set(header, value),
    );
  }

  /**
   * Render the given view's template using an instance as context.
   */
  async render(View, context = {}) {
    const view = new View(this, context);
    const result = await view.render();
    const html = result.toString();

    this.response.body = html;
    this.headers["Content-Type"] = this.request.accepts()[0];

    this.prepare();
    this.app.log.info(`Rendered ${View.name}`);
  }

  /**
   * Redirect to an entirely new location
   */
  redirect(action, options) {
    const controller = options.controller || this;
    const params = options.params || {};
    const url = this.app.routes.resolve(controller, action, params);
    this.status = 301;
    this.headers["Location"] = url;
    this.response.body = `You are being <a href="${url}">redirected</a>`;

    this.app.log.info(`Redirecting to ${url} as ${this.status}`);
    this.prepare();
  }

  /**
   * Return an empty response with a status code.
   *
   * @param number status - HTTP status code
   */
  head(status) {
    this.status = status;
    this.prepare();
  }
}
