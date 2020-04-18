/**
 * Base class for database and caching adapters.
 */
export default class Adapter {
  static adapters = {};
  static adapt(adapter) {
    if (!this.adapters[adapter]) {
      throw new Error(`Database adapter "${adapter}" not found`);
    }

    return this.adapters[adapter];
  }

  constructor(config = {}) {
    this.config = config;
  }
}
