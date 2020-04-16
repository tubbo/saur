export class Validation {
  constructor(property, options) {
    this.property = property
    this.options = options
  }

  valid(model) {}
}

export class Presence extends Validation {
  valid(model) {
    if (typeof model[this.property] === "undefined") {
      model.errors.add(this.property, "must be present")
    }
  }
}

export default {
  presence: Presence
}
