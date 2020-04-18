import StaticFilesMiddleware from "../middleware/static-files.js";

export default function ServeStaticFiles(app) {
  if (app.config.serveStaticFiles) {
    app.use(StaticFilesMiddleware);
  }
}
