/**
 * Thrown when `Controller.perform` cannot run because the controller
 * class does not have the correct action method defined.
 */
export default class ActionMissingError extends Error {
  constructor(controller, action) {
    super(`${controller}#${action}() is not defined.`);
  }
}
