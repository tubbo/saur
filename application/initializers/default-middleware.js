import RequestLogger from "../middleware/logger.js";
import RequestTimer from "../middleware/timing.js";
import SSLRedirect from "../middleware/ssl-redirect.js";
import StaticFiles from "../middleware/static-files.js";

import MethodOverride from "../middleware/method-override.js";
import CSP from "../middleware/content-security-policy.js";
import CORS from "../middleware/cors.js";
import AuthenticityToken from "../middleware/authenticity-token.js";
import HTTPCaching from "../middleware/http-cache.js";

export default async function DefaultMiddleware(app) {
  if (app.config.forceSSL) {
    app.use(SSLRedirect);
  }

  if (app.config.cache.http.enabled) {
    app.use(HTTPCaching);
  }

  if (app.config.serveStaticFiles) {
    app.use(StaticFiles);
  }

  app.use(MethodOverride);
  app.use(AuthenticityToken);
  app.use(CSP);
  app.use(CORS);
  app.use(RequestLogger);
  app.use(RequestTimer);
}
