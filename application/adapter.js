/**
 * Base class for database and caching adapters.
 */
export default class Adapter {
  static adapters = {
    postgres: PostgresAdapter,
    mysql: MysqlAdapter,
  }

  static adapt(adapter) {
    return this.adapters[adapter] ||
           throw new Error(`Database adapter "${adapter}" not found`)
  }
}
