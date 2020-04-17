/**
 * Redirect all insecure requests to HTTPS
 */
export default function* SSLRedirect(next) {
  if (this.secure) {
    return yield next;
  }

  const host = this.request.header.host;
  const path = this.request.url;
  const url = `https://${host}/${path}`;

  this.response.status = 301;

  this.response.redirect(url);
}
