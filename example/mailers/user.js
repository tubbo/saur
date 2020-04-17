import Mailer from "../../mailer.js";
import UserConfirmationView from "../views/user-confirmation.js";

export default class UserMailer extends Mailer {
  confirmation(user) {
    const to = user.email;
    const subject = "Confirm Your Account";

    this.mail({ to, subject }, UserConfirmationView);
  }
}
