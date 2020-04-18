export class Validation {
  constructor({ property, ...options }) {
    this.property = property;
    this.options = options;
  }
}

export class Presence extends Validation {
  valid(model) {
    const { property } = this.options;
    const message = this.options.message || "must be present";

    if (typeof model[property] === "undefined") {
      model.errors.add(property, message);
    }
  }
}

export class GenericValidation extends Validation {
  valid(model) {
    const { method } = this.options;
    const validation = model[method].bind(model);

    validation();
  }
}

// Validations that can be used as part of the `validates` method.
export default {
  presence: Presence,
};
