export default class MissingRouteError extends Error {
  constructor(controller, action, params) {
    super(
      `No route matches for
        controller=${controller}
        action=${action}
      with params ${params}`,
    );
  }
}
