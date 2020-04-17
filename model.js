import reduce from "https://deno.land/x/lodash/reduce.js"
import Validations, { GenericValidation } from "./model/validations.js"
import Errors from "./model/errors.js"
import Relation from "./model/query.js"

/**
 * A macro for creating a new `Validation` object in the list of
 * validations a model may run through.
 */
export function validates(name, validations={}) {
  return map(validations, (name, options) => {
    const Validation = Validations[name]
    options = options === true ? {} : options

    return new Validation(options)
  })
}

/**
 * A macro for creating a new `GenericValidation` object, allowing the
 * validation to consist of just running a method which may or may not
 * add errors.
 */
export function validate(method, options={}) {
  return new GenericValidation({ method, ...options })
}

export default class Model {
  static validations = []
  static table = null

  /**
   * Create a new model record and save it to the database.
   */
  static create(attributes = {}) {
    const model = new this(attributes)
    model.save()
    return model
  }

  /**
   * Return a relation representing all records in the database.
   */
  static get all() {
    return new Relation(this)
  }

  /**
   * Perform a query for matching models in the database.
   */
  static where(query) {
    return this.all.where(query)
  }

  /**
   * Find an existing model record in the database by the given
   * parameters.
   */
  static findBy(query) {
    return this.where(query).first
  }

  /**
   * Find an existing model record in the database by its ID.
   */
  static find(id) {
    return this.findBy({ id })
  }

  constructor(attributes = {}) {
    this.attributes = attributes
    this.errors = new Errors()
  }

  /**
   * All non-function properties of this object.
   */
  get attributes() {
    return reduce(this, (attrs, value, prop) => {
      if (typeof value !== "function") {
        attrs[prop] = value
      }

      return attrs
    }, {})
  }

  /**
   * Set attributes on this object by assigning properties directly to
   * it.
   */
  set attributes(attrs={}) {
    Object.assign(this, attrs)
  }

  /**
   * Flatten validators from their method calls.
   */
  get validations() {
    return flatten(this.constructor.validations)
  }

  /**
   * Run all configured validators.
   */
  get valid() {
    this.validations.forEach(validation => validation.valid(this))

    return this.errors.any
  }

  /**
   * Persist the current information in this model to the database.
   */
  save() {
    if (!this.valid) {
      return false
    }

    const query = new Relation(this)

    if (this.id) {
      query.where("id", this.id).update(this.attributes)
    } else {
      query.insert(this.attributes)
    }

    query.run()

    return true
  }

  /**
   * Set the given attributes on this model and persist.
   */
  update(attributes = {}) {
    this.attributes = attributes

    return this.save()
  }

  /**
   * Remove this model from the database.
   */
  destroy() {
    const query = new Relation(this)

    query.where("id", this.id).delete()
    query.run()

    return true
  }

  /**
   * Reload this model's information from the database.
   */
  reload() {
    const model = this.constructor.find(this.id)

    Object.assign(this, model.attributes)

    return this
  }
}
