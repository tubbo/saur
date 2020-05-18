import Controller from "../../controller.js";
import HomeIndexView from "../views/home/index.js";
import User from "../models/user.js";

export default class HomeController extends Controller {
  async index() {
    return this.render(HomeIndexView);
  }
}
