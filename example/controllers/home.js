import Controller from "../../controller.js";
import HomePageView from "../views/home-page.js";
import { renderFile } from "https://deno.land/x/dejs/mod.ts";

export default class HomeController extends Controller {
  async index() {
    await this.render(HomePageView);
  }

  async baz() {
  }
}
