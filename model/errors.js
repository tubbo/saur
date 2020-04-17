export default class Errors {
  constructor() {
    this.all = {};
  }

  add(property, message) {
    this.all[property] = this.all[property] || [];
    this.all[property].push(message);
  }

  get any() {
    return Object.keys(this.all).length;
  }
}
