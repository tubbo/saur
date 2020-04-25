import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";

/**
 * Mailers send HTML-rendered emails to users based on predefined
 * information. They fill the same role as Controllers, except instead
 * of handling the request/response cycle of HTTP, they render their
 * results to an email message. Mailers use the SMTP configuration found
 * in `App.config.smtp` to configure the SMTP client when sending mails,
 * and are capable of rendering Views (and, subsequently, Templates) just
 * like controllers can.
 */
export default class Mailer {
  static layout = "mailer.ejs";

  /**
   * Deliver a given message using the provided args.
   */
  static async deliver(app, message, ...args) {
    const mailer = new this(app);
    const action = mailer[message].bind(mailer);

    await action(...args);
  }

  constructor(app) {
    this.app = app;
    this.config = app.config.mail;
    this.smtp = new SmtpClient();
  }

  get request() {
    const { hostname, protocol } = this.config;

    return { hostname, protocol };
  }

  /**
   * Compile the given view's template using an instance as context,
   * then email the rendered HTML given the configuration.
   */
  async mail(message = {}, View = null, context = {}) {
    const to = message.to || message.bcc;

    if (View) {
      const view = new View(this, context);
      const result = await view.render();
      this.app.log.info(`Rendered ${View.name}`);
      message.content = result.toString();
    }

    await this.smtp.connect(this.config.smtp);
    await this.smtp.send(message);
    await this.smtp.close();

    this.app.log.info(`Sent mail to "${to}"`);
  }
}
