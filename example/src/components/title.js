import Component from "saur/component";
import "./title.css";

export default class Title extends Component {
  static selector = ".title";
  static events = { click: ["changeColor"] };

  initialize() {
    this.element.classList.add("title--initialized");
  }

  changeColor() {
    this.element.classList.add("title--clicked");

    document.insertAdjacentHTML("beforeend", `<p="title">test</p>`);
  }
}
