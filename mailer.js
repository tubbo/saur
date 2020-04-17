import { SmtpClient } from "https://deno.land/x/smtp/mod.ts"

/**
 * Send emails to users with Views and Templates.
 */
export default class Mailer {
  static layout = "mailer.ejs"

  /**
   * Deliver a given message using the provided args.
   */
  static async deliver(message, ...args) {
    const mailer = new this(App.config.smtp)
    const action = mailer[message].bind(mailer)

    await action(...args)
  }

  constructor(config={}) {
    this.config = config
    this.smtp = new SmtpClient()
  }

  /**
   * Compile the given view's template using an instance as context,
   * then email the rendered HTML given the configuration.
   */
  async mail(message={}, View=null) {
    const to = message.to || message.bcc

    if (View) {
      const view = new View(this)
      const result = await view.template.render(view)
      message.content = result.toString()
    }

    await this.smtp.connect(this.config)
    await this.smtp.send(message)
    await this.smtp.close()

    App.log.info(`Sent mail to "${to}"`)
  }
}
