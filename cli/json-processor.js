import Processor from "../loader/processor.js";

export default class JSONProcessor extends Processor {
  process() {
    return JSON.parse(this.source);
  }
}
