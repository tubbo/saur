import reduce from "https://deno.land/x/lodash/reduce.js";
import merge from "https://deno.land/x/lodash/merge.js";
import each from "https://deno.land/x/lodash/forEach.js";
import flatten from "https://deno.land/x/lodash/flatten.js";
import Validations, { GenericValidation } from "./model/validations.js";
import Errors from "./model/errors.js";
import Relation from "./model/relation.js";
import { camelCase, snakeCase } from "https://deno.land/x/case/mod.ts";
// import "https://deno.land/x/humanizer.ts/vocabularies.ts";

/**
 * Models are classes that construct the data model for your
 * application, as well as perform any database-related business logic
 * such as validations and data massaging or aggregation. They follow
 * the active record pattern, and therefore encapsulate all logic
 * related to the querying and persistence of a table in your database.
 */
export default class Model {
  /**
   * The app this model is a part of.
   */
  static app = null

  /**
   * Name of the class, used in logging.
   */
  static get name() {
    return `${this}`.split(" ")[1];
  }

  /**
   * Name used in parameters.
   */
  static get paramName() {
    return camelCase(this.name);
  }

  static get collectionName() {
    return snakeCase(this.name) + "s";
  }

  /**
   * All validations on this model.
   */
  static validations = [];

  /**
   * All associations to other models.
   */
  static associations = {
    belongsTo: {},
    hasMany: {},
    hasOne: {},
  };

  /**
   * Table name for this model.
   */
  static table = this.tableName;

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
    this.associated = {};

    this._buildAssociations();
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

  /**
   * Build model associations from the `.associations` static property
   * when constructed.
   *
   * @private
   */
  _buildAssociations() {
    Object.entries(this.constructor.associations, (type, associations) => {
      Object.entries(associations, (name, Model) => {
        Object.defineProperty(this, name, {
          get() {
            if (typeof this.associated[name] !== "undefined") {
              return this.associated[name];
            }

            const param = this.constructor.paramName;
            const fk = `${param}ID`;
            const id = this[`${name}ID`];
            let value;

            if (type === "hasMany") {
              value = Model.where({ [fk]: this.id });
            } else if (type === "hasOne") {
              value = Model.where({ [fk]: this.id });
            } else if (type === "belongsTo") {
              value = Model.find(id);
            } else {
              throw new Error(`Invalid association type: "${type}"`);
            }

            this.associated[name] = value;

            return value;
          },

          set(value) {
            this.associated[name] = value;
            this[`${name}ID`] = value.id;
          },
        });
      });
    });
  }
}
