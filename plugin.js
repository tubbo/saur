import Application from "./application.js";

/**
 * Plugins are groupings of code that are imported into and included by
 * a host application. This is actually a subclass of `Application` with
 * some overrides that make it suitable for mounting within an app.
 * Other than that, it's basically the same thing as an Application, you
 * can add routes/initializers to it and even include other plugins.
 * Routes are not actually added into the application until the user
 * mounts the plugin with a call to `mount("some/path", YourPlugin)` in
 * the routing DSL.
 */
export default class Plugin extends Application {
  static setup = () => {};

  constructor(name, config = {}) {
    super({ [name]: config });
  }

  /**
   * Initialize all plugins and run this plugin's initializers in the
   * context of the host application.
   */
  initialize(app) {
    this.log = app.log;
    this.plugins.forEach((plugin) => plugin.initialize(app));
    this.initializers.forEach(async (initializer) => {
      await initializer(app);
    });
  }

  /**
   * For plugins, the `setup` method does nothing out-of-box, as
   * default app initializers and middleware have already been loaded.
   */
  setup() {}

  /**
   * Prevent this plugin from running a server on its own.
   */
  start() {
    throw new Error("Plugins cannot be run on their own.");
  }
}
