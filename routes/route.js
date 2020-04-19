import camelCase from "https://deno.land/x/case/camelCase.ts";

export default class Route {
  constructor({ as, path, controller, action, app }) {
    this.app = app;
    this.name = camelCase(as);
    this.path = path;
    this.controller = controller;
    this.action = action;
  }

  get urlHelperName() {
    return `${this.name}URL`;
  }

  get pathHelperName() {
    return `${this.name}Path`;
  }

  /**
   * A helper method that resolves the route for this controller,
   * action, and given params, and returns an absolute path to the
   * resource.
   */
  pathHelper(params = {}) {
    return this.app.routes.resolve(this.controller, this.action, params);
  }

  /**
   * A helper method that resolves the route for this controller,
   * action, and given params, and returns a fully-qualified URL to the
   * resource.
   */

  urlHelper(params = {}, host) {
    return this.app.routes.resolve(this.controller, this.action, params, host);
  }

  /**
   * Define helper methods on another object instance. This makes routes easier
   * to access from within templates.
   */
  hydrate(instance) {
    const host = "//" + instance.request.headers.get("Host");

    instance[this.pathHelperName] = (params) => this.pathHelper(params);
    instance[this.urlHelperName] = (params) => this.urlHelper(params, host);
  }
}
