import RequestLogger from "../middleware/logger.js";
import RequestTimer from "../middleware/timing.js";
import MethodOverride from "../middleware/method-override.js";
import CSP from "../middleware/content-security-policy.js";
import CORS from "../middleware/cors.js";
import AuthenticityToken from "../middleware/authenticity-token.js";

export default function DefaultMiddleware(app) {
  app.use(RequestLogger);
  app.use(RequestTimer);
  app.use(MethodOverride);
  app.use(AuthenticityToken);
  app.use(CSP);
  app.use(CORS);
  app.use(Assets);
}
