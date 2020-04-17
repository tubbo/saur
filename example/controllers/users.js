import Controller from "../../controller.js"

export default class UsersController extends Controller {
  index() {
    this.users = User.all
  }

  active() {}
  setup() {}
}
