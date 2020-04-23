const REACT_ELEMENT_TYPE = Symbol.for("react.element");

class Element {
  constructor(type, props, children) {
    this.$$typeof = REACT_ELEMENT_TYPE;
    this.props = props;
    this.props.children = children;
  }
}

export {
  createElement(type, props = {}, children) {
    return new Element(type, props, children)
  }
}
