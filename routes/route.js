import camelCase from "https://deno.land/x/case/camelCase.ts";
// import { partial } from "https://deno.land/x/lodash/lodash.js";

const partial = () => "wtf lodash";

export default class Route {
  constructor({ as, path, controller, action }) {
    this.name = camelCase(as);
    this.path = path;
    this.controller = controller;
    this.action = action;
  }

  get urlHelperName() {
    return `${this.name}URL`;
  }

  get pathHelperName() {
    return `${this.name}URL`;
  }

  /**
   * A helper method that resolves the route for this controller,
   * action, and given params, and returns an absolute path to the
   * resource.
   */
  pathHelper(params = {}) {
    return App.routes.resolve(this.controller, this.action, params);
  }

  /**
   * A helper method that resolves the route for this controller,
   * action, and given params, and returns a fully-qualified URL to the
   * resource.
   */

  urlHelper(params = {}, host) {
    return App.routes.resolve(this.controller, this.action, params, host);
  }

  /**
   * Define helper methods on another object instance. This makes routes easier
   * to access from within templates.
   */
  hydrate(instance) {
    const { protocol, hostname } = instance.request;
    const host = `${protocol}://${hostname}`;

    instance[this.pathHelperName] = this.pathHelper.bind(this);
    instance[this.urlHelperName] = partial(this.urlHelper.bind(this), host);
  }
}
