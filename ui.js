/**
 * Front-end application for Saur.
 */
export default class UI {
  constructor(context) {
    this.require = context;
    this.observer = new MutationObserver((records) => this.update(records));
  }

  /**
   * All filenames in the `./components` dir.
   */
  get files() {
    return this.require.entries();
  }

  /**
   * Require all components in `./components`.
   */
  get components() {
    return this.files.map((file) => this.require(file).default);
  }

  /**
   * Run the application's `initialize()` call for the first time, and
   * set up the observer for the root element.
   */
  start(target) {
    this.initialize(target);
    this.observer.observe(target);
  }

  /**
   * Initializes all components by finding their elements, instantiating
   * them, and binding their events.
   */
  initialize(target) {
    this.components.forEach((Component) => {
      const elements = target.querySelectorAll(Component.selector);

      elements.forEach((element) => {
        const component = new Component(element);

        Object.entries(component.events, (event, methods) => {
          methods.forEach((property) => {
            const method = component[property];
            const handler = method.bind(component);

            element.addEventListener(event, handler);
          });
        });
      });
    });
  }

  /**
   * Run when the DOM changes at any point, and re-initializes
   * components within the scope of the change.
   */
  update(records) {
    records.forEach(({ target }) => this.initialize(target));
  }
}
