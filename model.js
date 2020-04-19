import reduce from "https://deno.land/x/lodash/reduce.js";
import merge from "https://deno.land/x/lodash/merge.js";
import each from "https://deno.land/x/lodash/each.js";
import flatten from "https://deno.land/x/lodash/flatten.js";
import Validations, { GenericValidation } from "./model/validations.js";
import Errors from "./model/errors.js";
import Relation from "./model/query.js";

/**
 * Decorator for adding pre-defined validators to a model.
 *
 * @example
 *   import Model, { validates } from "https://deno.land/x/saur/model.js";
 *   import { titleCase } from "https://deno.land/std/case/mod.ts";
 *
 *   @validates("name", { presence: true })
 *   export default class YourModel extends Model {
 *      get title() {
 *        return titleCase(this.name)
 *      }
 *   }
 * @param string name - Name of the property
 * @param Object validations - Validations to add
 */
export function validates(name, validations = {}) {
  return (target) => target.validates(name, validations);
}

/**
 * Decorator for adding a custom validator to a model.
 *
 * @example
 *   import Model, { validate } from "https://deno.land/x/saur/model.js";
 *
 *   @validate("nameNotFoo");
 *   export default class YourModel extends Model {
 *     nameNotFoo() {
 *       if (this.name === "foo") {
 *          this.errors.add("name", "cannot be foo");
 *       }
 *     }
 *   }
 * @param string method - Method name to run in validations.
 */
export function validate(method) {
  return (target) => target.validate(method);
}

export default class Model {
  /**
   * Name of the class, used in logging.
   */
  static get name() {
    return `${this}`.split(" ")[1];
  }

  /**
   * All validations on this model.
   */
  static validations = [];

  /**
   * Table name for this model.
   */
  static table = null;

  /**
   * A macro for creating a new `Validation` object in the list of
   * validations a model may run through. Call it with
   * `YourModelName.validates`.
   *
   * @param string name - Name of the property
   * @param Object validations - Validations to add
   */
  static validates(name, validations = {}) {
    each(validations, (options, name) => {
      const Validation = Validations[name];
      options = options === true ? {} : options;

      this.validations.push(new Validation(options));
    });
  }

  /**
   * A macro for creating a new `GenericValidation` object, allowing the
   * validation to consist of just running a method which may or may not
   * add errors. Call it with `YourModelName.validate`.
   *
   * @param string method - Name of the method to call
   */
  static validate(method) {
    this.validations.push(new GenericValidation({ method }));
  }

  /**
   * Create a new model record and save it to the database.
   */
  static create(attributes = {}) {
    const model = new this(attributes);
    model.save();
    return model;
  }

  /**
   * Return a relation representing all records in the database.
   */
  static get all() {
    return new Relation(this);
  }

  /**
   * Perform a query for matching models in the database.
   */
  static where(query) {
    return this.all.where(query);
  }

  /**
   * Find an existing model record in the database by the given
   * parameters.
   */
  static findBy(query) {
    return this.where(query).first;
  }

  /**
   * Find an existing model record in the database by its ID.
   */
  static find(id) {
    return this.findBy({ id });
  }

  constructor(attributes = {}) {
    this.attributes = attributes;
    this.errors = new Errors();
    this.initialize();
  }

  initialize() {}

  /**
   * All non-function properties of this object.
   */
  get attributes() {
    return reduce(
      this,
      (attrs, value, prop) => {
        if (typeof value !== "function") {
          attrs[prop] = value;
        }

        return attrs;
      },
      {},
    );
  }

  /**
   * Set attributes on this object by assigning properties directly to
   * it.
   */
  set attributes(attrs = {}) {
    merge(this, attrs);
  }

  /**
   * Flatten validators from their method calls.
   */
  get validations() {
    return flatten(this.constructor.validations);
  }

  /**
   * Run all configured validators.
   */
  get valid() {
    this.validations.forEach((validation) => validation.valid(this));

    return this.errors.any;
  }

  /**
   * Persist the current information in this model to the database.
   */
  save() {
    if (!this.valid) {
      return false;
    }

    const query = new Relation(this);

    if (this.id) {
      query.where("id", this.id).update(this.attributes);
    } else {
      query.insert(this.attributes);
    }

    query.run();

    return true;
  }

  /**
   * Set the given attributes on this model and persist.
   */
  update(attributes = {}) {
    this.attributes = attributes;

    return this.save();
  }

  /**
   * Remove this model from the database.
   */
  destroy() {
    const query = new Relation(this);

    query.where("id", this.id).delete();
    query.run();

    return true;
  }

  /**
   * Reload this model's information from the database.
   */
  reload() {
    const model = this.constructor.find(this.id);

    merge(this, model.attributes);

    return this;
  }
}
