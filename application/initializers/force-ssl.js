import SSLRedirect from "../middleware/ssl-redirect.js";

export default function ForceSSL(app) {
  if (app.config.forceSSL) {
    app.use(SSLRedirect);
  }
}
