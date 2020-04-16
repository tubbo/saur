import Controller from "https://deno.land/x/saur/controller.js"
import HomePageView from "../views/home-page"

export default class HomeController extends Controller {
  index() {
    return this.render(HomePageView)
  }

  baz() {
    return this.request.path
  }
}
