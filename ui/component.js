class Component {
  constructor(element) {
    this.element = element;
    this.initialize();
  }

  initialize() {}
}

Component.selector = null;
Component.events = {};

export default Component;
