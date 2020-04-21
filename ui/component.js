export default class Component {
  static selector = null;
  static events = {};

  constructor(element) {
    this.element = element;
    this.initialize();
  }

  initialize() {}
}
