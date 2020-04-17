export default function Generate(type, name) {
  const className = pascalCase(name)
  const USAGE = "Usage: saur generate [model|view|controller|help] NAME [OPTIONS]"

  switch(type) {
    case "model":
      GenerateModel(name, className)
      break
    case "controller":
      GenerateController(name, className)
      break
    case "view":
      GenerateView(name, className)
      break
    case "template":
      GenerateTemplate(name, className)
      break
    default:
      console.log("Invalid generator", type)
      console.log(USAGE)
      Deno.exit(1)
  }
}
