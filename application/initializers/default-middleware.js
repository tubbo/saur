import RequestLogger from "../middleware/logger.js";
import RequestTimer from "../middleware/timing.js";
import SSLRedirect from "../middleware/ssl-redirect.js";
import CompileAssets from "../middleware/compile-assets.js";
import StaticFiles from "../middleware/static-files.js";
import { existsSync } from "https://deno.land/std/fs/mod.ts";

import MethodOverride from "../middleware/method-override.js";
import CSP from "../middleware/content-security-policy.js";
import CORS from "../middleware/cors.js";
import AuthenticityToken from "../middleware/authenticity-token.js";
import HTTPCaching from "../middleware/http-cache.js";

export default async function DefaultMiddleware(app) {
  const root = app.root.replace("file://", "");

  if (app.config.forceSSL) {
    app.use(SSLRedirect);
  }

  if (app.config.cache.http.enabled) {
    app.use(HTTPCaching);
  }

  if (app.config.serveStaticFiles) {
    app.use(StaticFiles);
  }

  if (app.config.assets.enabled) {
    const watcher = Deno.fsEvents(`${root}/src`);

    if (existsSync(`${root}/public/main.js`)) {
      Deno.removeSync(`${root}/public/main.js`);
    }

    if (existsSync(`${root}/public/main.css`)) {
      Deno.removeSync(`${root}/public/main.css`);
    }

    app.use(CompileAssets);

    for await (const event of watcher) {
      event.paths.forEach((path) => app.log.debug(`Reloading ${path}`));

      if (existsSync(`${root}/public/main.js`)) {
        Deno.removeSync(`${root}/public/main.js`);
      }

      if (existsSync(`${root}/public/main.css`)) {
        Deno.removeSync(`${root}/public/main.css`);
      }
    }
  }

  app.use(MethodOverride);
  app.use(AuthenticityToken);
  app.use(CSP);
  app.use(CORS);
  app.use(RequestLogger);
  app.use(RequestTimer);
}
