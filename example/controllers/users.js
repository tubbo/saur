class UsersController extends Controller {
  index() {
    this.users = User.all
  }

  active() {}
  setup() {}
}
