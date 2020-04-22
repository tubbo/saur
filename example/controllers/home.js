import Controller from "../../controller.js";
import HomeIndexView from "../views/home/index.js";

export default class HomeController extends Controller {
  index() {
    return this.render(HomeIndexView);
  }
}
