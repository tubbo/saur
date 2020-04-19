import CompileAssets from "../middleware/compile-assets.js";

/**
 * Add a middleware for compiling assets each time they are requested,
 * when enabled in configuration.
 */
export default function Assets(app) {
  if (app.config.assets.enabled) {
    app.use(CompileAssets);
  }
}
