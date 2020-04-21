const { run, cwd } = Deno;

export default async function Server(options) {
  const cmd = [`${cwd()}/bin/server`];
  const stdout = "piped";
  const stderr = "piped";
  const decoder = new TextDecoder();
  const proc = run({ cmd, stdout, stderr });
  const buff = new Uint8Array(80);
  let done = false;

  if (options.o || options.open) {
    const open = run({ cmd: ["open", "http://localhost:3000"] });
    await open.status();
  }

  console.log(options);

  while (!done) {
    await proc.stdout.read(buff);
    console.log(decoder.decode(buff).replace("\n", ""));
    done = buff.toString() === "";
  }

  const status = await proc.status();

  Deno.exit(status);
}
