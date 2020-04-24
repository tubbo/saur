import Controller from "../../controller.js";
import HomeIndexView from "../views/home/index.js";
import User from "../models/user.js";

export default class HomeController extends Controller {
  index() {
    const user = User.all.first;

    return this.render(HomeIndexView, { user });
  }
}
