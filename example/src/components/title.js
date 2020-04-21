import Component from "saur/component";

export default class Title extends Component {
  static selector = ".title";
  static events = { click: "alertWhenClicked" };

  initialize() {
    alert("initialized");
  }

  alertWhenClicked() {
    alert("clicked");
  }
}
