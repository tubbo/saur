import Controller from "../../controller.js"

export default class UsersController extends Controller {
  index() {
    this.users = User.all
  }

  create(params) {
    const user = User.create(params.user)

    UserMailer.deliver("confirmation", user)

    this.redirect(UsersController, "show", { id: user.id })
  }

  active() {}
  setup() {}
}
