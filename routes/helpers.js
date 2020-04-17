export default class RouteHelpers {
  constructor(set, request) {
    this.set = set;
    this.request = request;
  }

  get host() {
    return `${request.protocol}://${request.host}`;
  }

  forEach(iterator) {
    this.set.forEach((route) => {
      const name = camelCase(route.path);
      const path = (params = {}) => `/${route.path}`;

      iterator({ name, path, url });
    });
  }
}
