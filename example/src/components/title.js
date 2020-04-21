import Component from "saur/component";
import "./title.css";

export default class Title extends Component {
  static selector = ".title";
  static events = { click: "changeColor" };

  initialize() {
    this.element.style.color = "blue";
  }

  changeColor() {
    this.element.style.color = "red";
  }
}
