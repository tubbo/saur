import RequestLogger from "../middleware/logger.js";
import RequestTimer from "../middleware/timing.js";
import SSLRedirect from "../middleware/ssl-redirect.js";
import CompileAssets from "../middleware/compile-assets.js";

// import MethodOverride from "../middleware/method-override.js";
// import CSP from "../middleware/content-security-policy.js";
// import CORS from "../middleware/cors.js";
// import AuthenticityToken from "../middleware/authenticity-token.js";

export default function DefaultMiddleware(app) {
  app.use(RequestLogger);
  app.use(RequestTimer);

  if (app.config.forceSSL) {
    app.use(SSLRedirect);
  }

  if (app.config.assets.enabled) {
    app.use(CompileAssets);
  }

  // app.use(MethodOverride);
  // app.use(AuthenticityToken);
  // app.use(CSP);
  // app.use(CORS);
}
