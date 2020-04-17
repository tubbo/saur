export default function GenerateTemplate(name, className) {
  const template = `<h1>hello world</h1>`

  Deno.writeFileSync(`layouts/${name}.ejs`, encoder.encode(template))

  console.log(`Created templates/${name}.ejs`)
}
