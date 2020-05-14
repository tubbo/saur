export default class Processor {
  constructor(source, loader) {
    this.source = source;
    this.loader = loader;
  }

  get processed() {
    return this.process();
  }

  process() {}
}
