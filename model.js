import each from "https://deno.land/x/lodash/each.js"
import reduce from "https://deno.land/x/lodash/reduce.js"
import Validations from "./validations.js"

export function validates(property, validations={}) {
  return target => {
    each(validations, (name, options) => {
      const Validation = Validations[name]
      options = options === true ? {} : options

      target.validations.push(new Validation(property, options))
    })
  }
}

export class Errors {
  constructor() {
    this.all = {}
  }

  add(property, message) {
    this.all[property] = this.all[property] || []
    this.all[property].push(message)
  }

  get any() {
    return Object.keys(this.all).length
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

    return reduce(query, (val, key, q) q.where(key, "=", val), this.all)
  }

  static findBy(query) {
    return this.where(query).first
  }

  static get all() {
    return new Query(this)
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

    const query = new Query(this)

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
    const query = new Query(this)

    query.where("id", this.id).delete()

    query.run()

    return true
  }
}
