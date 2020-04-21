import Component from "saur/ui/component";
import "./title.css";

class Title extends Component {
  initialize() {
    this.element.classList.add("title--initialized");
  }

  changeColor(event) {
    this.element.classList.add("title--clicked");

    this.element.parentElement.insertAdjacentHTML(
      "beforeend",
      `<div><p class="title">test</p></div>`,
    );
  }
}

Title.selector = ".title";
Title.events = { click: ["changeColor"] };

export default Title;
