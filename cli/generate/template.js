export default async function GenerateTemplate(name, className, encoder) {
  const template = `<h1>hello world</h1>`;

  await Deno.writeFile(`templates/${name}.ejs`, encoder.encode(template));

  console.log(`Created templates/${name}.ejs`);
}
