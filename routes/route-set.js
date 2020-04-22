import Route from "./route.js";

/**
 * RouteSet defines the routing DSL used by the top-level application
 * router. It uses `Oak.Router` under the hood, but pre-fills
 * information based on the current context and whether you've selected
 * a controller. Controllers are selected by providing a `resources()`
 * route, and base paths can be selected by themselves by providing a
 * `namespace()`.
 */
export default class RouteSet {
  constructor(router, app, options = {}) {
    this.router = router;
    this.app = app;
    this.controller = options.controller;
    this.base = options.base;
    this.routes = [];
    this.namespaces = [];
  }

  /**
   * Call the function provided and pass in all of the routing methods
   * contextualized to this particular set. This enables "relative"
   * routing where calling e.g. `get()` within a `namespace()`
   * will nest the path of the GET request into the namespace itself.
   */
  draw(routing) {
    const get = this.get.bind(this);
    const post = this.post.bind(this);
    const put = this.put.bind(this);
    const patch = this.patch.bind(this);
    const del = this.delete.bind(this);
    const resources = this.resources.bind(this);
    const namespace = this.namespace.bind(this);
    const root = this.root.bind(this);
    const use = this.use.bind(this);

    if (this.base) {
      routing({
        use,
        get,
        post,
        put,
        patch,
        delete: del,
        resources,
        namespace,
      });
    } else {
      routing({
        use,
        get,
        post,
        put,
        patch,
        delete: del,
        resources,
        namespace,
        root,
      });
    }
  }

  async add(method, name, options = {}, config = {}) {
    let action, controller, controllerName;

    const { app } = this;
    const as = options.as || config.as || name;
    const path = this.base ? `${this.base}/${name}` : name;

    if (typeof options === "string") {
      [controllerName, action] = options.split("#");
      const controllerPath = `${app.root}/controllers/${controllerName}.js`;
      const exports = await import(controllerPath);
      controller = exports.default;
    } else {
      action = options.action || name;
      controller = options.controller || this.controller;
    }

    this.routes.push(new Route({ as, path, controller, action, app }));
    this.router[method](path, controller.perform(action, this.app));
  }

  /**
   * Route a GET request to the given path. You can also specify a
   * `controller` and `action`, but these options will default to the
   * top-level controller (if you're in a `resources()` block) and the
   * name of the path, respectively.
   */
  get(path, options = {}) {
    this.add("get", path, options);
  }

  use(middleware) {
    this.router.use(this.base, middleware);
  }

  /**
   * Route a POST request to the given path. You can also specify a
   * `controller` and `action`, but these options will default to the
   * top-level controller (if you're in a `resources()` block) and the
   * name of the path, respectively.
   */
  post(path, options = {}) {
    this.add("post", path, options);
  }

  /**
   * Route a PUT request to the given path. You can also specify a
   * `controller` and `action`, but these options will default to the
   * top-level controller (if you're in a `resources()` block) and the
   * name of the path, respectively.
   */
  put(path, options = {}) {
    this.add("put", path, options);
  }

  /**
   * Route a PATCH request to the given path. You can also specify a
   * `controller` and `action`, but these options will default to the
   * top-level controller (if you're in a `resources()` block) and the
   * name of the path, respectively.
   */
  patch(path, options = {}) {
    this.add("patch", path, options);
  }

  /**
   * Route a del request to the given path. You can also specify a
   * `controller` and `action`, but these options will default to the
   * top-level controller (if you're in a `resources()` block) and the
   * name of the path, respectively.
   */
  delete(path, options = {}) {
    this.add("delete", path, options);
  }

  /**
   * Define a RouteSet that is nested within this one.
   */
  namespace(path, routes) {
    const controller = this.controller;
    const base = `${this.base}/${path}`;
    const set = new RouteSet(this.router, this.app, { controller, base });
    path = this.base ? `${this.base}/${path}` : path;

    this.namespaces.push({ path, controller, base });
    set.draw(routes);
  }

  /**
   * Define the index route to the application. This is always a GET
   * request.
   */
  root(action, controller = null) {
    const as = "root";

    if (!controller) {
      return this.add("get", "/", action, { as });
    }

    this.add("get", "/", { as, controller, action });
  }

  /**
   * Define a RESTful resource, which contains all
   * create/read/update/destroy actions as well as new/edit pages. You
   * can optionally also pass a function in which provides two route
   * sets of nested resources for the "collection" and "member" routes.
   */
  resources(path, controller, nested) {
    this.get(path, { controller, action: "index" });
    this.post(path, { controller, action: "create" });
    this.get(`${path}/new`, { controller, action: "new" });
    this.get(`${path}/:id`, { controller, action: "show" });
    this.get(`${path}/:id/edit`, { controller, action: "edit" });
    this.put(`${path}/:id`, { controller, action: "update" });
    this.patch(`${path}/:id`, { controller, action: "update" });
    this.delete(`${path}/:id`, { controller, action: "destroy" });

    if (nested) {
      const cs = new RouteSet(this.router, this.app, {
        controller,
        base: path,
      });
      const ms = new RouteSet(this.router, this.app, {
        controller,
        base: `${path}/:id`,
      });
      const collection = cs.draw.bind(cs);
      const member = ms.draw.bind(ms);

      nested({ collection, member });
    }
  }

  /**
   * Mount an application or Oak middleware at the given path.
   */
  mount(path, app) {
    path = this.base ? `${this.base}/${path}` : path;

    if (app.routes) {
      this.namespace(path, ({ use }) => use(app.routes.all));
    } else {
      this.router.use(path, app);
    }
  }
}
