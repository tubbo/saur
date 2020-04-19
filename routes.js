import { Router } from "https://denopkg.com/Soremwar/oak@v0.41/mod.ts";
import RouteSet from "./routes/route-set.js";
import MissingRouteError from "./errors/missing-route.js";

/**
 * Routes are used to collect all routes defined in `RouteSet`s and
 * connect them to the `Oak.Router` that actually does the work of
 * routing requests to their handlers.
 */
export default class Routes {
  constructor(app) {
    this.app = app;
    this.router = new Router();
    this.set = new RouteSet(this.router, this.app);
    this.draw = this.set.draw.bind(this.set);
  }

  /*
   * Create the AllowedMethods middleware to insert a header based on
   * the given routes.
   */
  get methods() {
    return this.router.allowedMethods();
  }

  /**
   * Compile all routes into Oak middleware.
   */
  get all() {
    return this.router.routes();
  }

  /**
   * Find the first matching route given the controller, action, and
   * parameters.
   */
  resolve(controller, action, params = {}, host = null) {
    if (typeof controller === "string") {
      return controller;
    }

    const keys = Object.keys(params);
    const route = this.set.routes.find(
      (route) => route.controller === controller && route.action === action,
    );

    if (!route) {
      throw new MissingRouteError(controller, action, params);
    }

    const path = keys.reduce(
      (k, p) => p.replace(`:${k}`, params[k]),
      route.path,
    );

    if (host) {
      return `${host}/${path}`;
    }

    return path;
  }

  forEach(iterator) {
    return this.set.routes.forEach(iterator);
  }
}
