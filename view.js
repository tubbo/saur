export default class View {
  constructor(controller) {
    this.controller = controller
    this.template = new Template(this.constructor.template, this.controller.layout)
  }

  render(partial, context={}) {
    const template = new Template(partial)

    return template.compile(context)
  }
}
