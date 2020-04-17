export default function GenerateModel(name, className) {
  const model = `import Model from "https://deno.land/x/saur/model.js"

  export default class ${className} extends Model {
  }
  `
  Deno.writeFileSync(`models/${name}.js`, encoder.encode(model))
  console.log(`Created new model ${className} in models/${name}.js`)
}
