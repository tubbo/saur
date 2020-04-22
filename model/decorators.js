/**
 * Decorator for adding pre-defined validators to a model.
 *
 * @example
 *   import Model, { validates } from "https://deno.land/x/saur/model.js";
 *   import { titleCase } from "https://deno.land/x/case/mod.ts";
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
  return (target) => {
    console.log(target);
    target.validates(name, validations);
  };
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
  return (target) => {
    target.validate(method);
  };
}

export function model(table) {
  return (target) => {
    target.table = table;
  };
}

export function association(type, name, Model) {
  return (target) => {
    target[type][name] = Model;
  };
}

export function belongsTo(Model, options) {
  const name = options.name || Model.paramName;

  return association("belongsTo", name, Model);
}

export function hasMany(Model, options) {
  const name = options.name || Model.tableName;

  return association("hasMany", name, Model);
}

export function hasOne(Model, options) {
  const name = options.name || Model.tableName;

  return association("hasOne", name, Model);
}
