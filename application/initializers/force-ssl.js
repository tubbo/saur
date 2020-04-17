import SSLRedirect from "../middleware/ssl.js"

export default function ForceSSL(app) {
  if (app.config.forceSSL) {
    app.use(SSLRedirect)
  }
}
