import { Query } from "https://deno.land/x/sql_builder/mod.ts";
import each from "https://deno.land/x/lodash/each.js";

/**
 * An extension of `SQLBuilder.Query`, Relations are used to both build
 * new queries from fragments and to return the results of that query
 * when it is needed.
 */
export default class Relation extends Query {
  constructor(model) {
    super();
    this.model = model;
    this.db = model.app.db;
    this.table(this.model.table);
    this.filters = {};
  }

  /**
   * Compile this query to SQL.
   */
  get sql() {
    if (!this._fields) {
      this.select("*");
    }

    return this.build();
  }

  /**
   * Perform the compiled query specified by this object.
   */
  run() {
    const result = this.db.exec(this.sql);

    if (!Array.isArray(result)) {
      return result;
    }

    result.map((row) => new this.model(row));
  }

  /**
   * Return the first record in the result set.
   */
  get first() {
    const records = this.run();

    return records[0];
  }

  /**
   * Return the last record in the result set.
   */
  get last() {
    const records = this.run();

    return records[records.length];
  }

  /**
   * Find the length of all returned records in the result.
   */
  get length() {
    return this.run().length;
  }

  /**
   * Perform a SQL COUNT() query with the given parameters and return
   * the result.
   */
  get count() {
    this.select("count(*)");

    return this.run();
  }

  /**
   * Override where() from `SQLBuilder.Query` to save off all filters
   * specified the object.
   */
  where(query = {}, ...context) {
    if (typeof query === "string") {
      return super.where(query, ...context);
    }

    this.filters = { ...this.filters, ...query };

    each(query, (value, param) => {
      if (typeof value === "function") {
        super.where(param, ...value());
      } else {
        super.where(param, "=", value());
      }
    });

    return this;
  }

  /**
   * Perform the query and iterate over all of its results.
   */
  forEach(iterator) {
    const records = this.run();

    return records.forEach(iterator);
  }

  /**
   * Perform the query and iterate over all of its results, returning a
   * new Array of each iteration's return value.
   */
  map(iterator) {
    const records = this.run();

    return records.map(iterator);
  }

  /**
   * Perform the query and iterate over all of its results, returning a
   * new memoized object based on the logic performed in each iteration.
   */
  reduce(iterator, memo) {
    const records = this.run();

    return records.reduce(iterator, memo);
  }

  /**
   * Perform the query and iterate over all of its results, returning a
   * new Array containing the records for which the iteration's return
   * value was truthy.
   */
  filter(iterator) {
    const records = this.run();

    return records.filter(iterator);
  }

  /**
   * Perform the query and iterate over all of its results, returning
   * `true` if the given record exists within it. The record's ID
   * property is used to evaluate this.
   */
  contains(record) {
    return this.map((record) => record.id).contains(record.id);
  }

  /**
   * Create a new model that would appear in this query.
   */
  create(attributes = {}) {
    return this.model.create({ ...attributes, ...this.filters });
  }

  /**
   * Instantiate a new model that would appear in this query.
   */
  build(attributes = {}) {
    return new this.model({ ...attributes, ...this.filters });
  }
}
