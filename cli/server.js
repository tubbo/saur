const { run, cwd } = Deno;

export default async function Server() {
  const cmd = [`${cwd()}/bin/server`];
  const stdout = "piped";
  const stderr = "piped";
  const decoder = new TextDecoder();
  const proc = run({ cmd, stdout, stderr });
  const buff = new Uint8Array(80);
  let done = false;

  while (!done) {
    await proc.stdout.read(buff);
    console.log(decoder.decode(buff));
    done = buff.toString() === "";
  }

  const status = await proc.status();

  Deno.exit(status);
}
