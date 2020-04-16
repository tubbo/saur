import each from "https://deno.land/x/lodash/each.js"
import reduce from "https://deno.land/x/lodash/reduce.js"
import Validations from "./model/validations.js"
import Errors from "./model/errors.js"
import Relation from "./model/query.js"

export function validates(property, validations={}) {
  return target => {
    each(validations, (name, options) => {
      const Validation = Validations[name]
      options = options === true ? {} : options

      target.validations.push(new Validation(property, options))
    })
  }
}

export default class Model {
  static validations = []
  static table = null

  static create(attributes = {}) {
    const model = new this(attributes)
    model.save()
    return model
  }

  static find(id) {
    return this.where({ id }).first
  }

  static where(query) {
    if (typeof query === "string") {
      return this.all.where(query.split("\n"))
    }
    const append = (val, key, q) => q.where(key, "=", val)

    return reduce(query, append, this.all)
  }

  static findBy(query) {
    return this.where(query).first
  }

  static get all() {
    return new Relation(this)
  }

  constructor(attributes = {}) {
    this.attributes = attributes
    this.errors = new Errors()
  }

  get attributes() {
    return reduce(this, (attrs, value, prop) => {
      if (typeof value !== "function") {
        attrs[prop] = value
      }

      return attrs
    }, {})
  }

  set attributes(attrs={}) {
    each(attrs, (key, value) => this[key] = value)
  }

  get valid() {
    this.constructor.validations.forEach(validation => validation.valid(this))

    return this.errors.any
  }

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

  update(attributes = {}) {
    this.attributes = attributes

    return this.save()
  }

  destroy() {
    const query = new Relation(this)

    query.where("id", this.id).delete()
    query.run()

    return true
  }
}
