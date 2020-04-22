const { run, exit } = Deno;

/**
 * Reinstall the `saur` CLI.
 */
export default async function Upgrade() {
  const cmd = [
    "deno",
    "install",
    "--allow-read=.",
    "--allow-write",
    "--allow-run",
    "saur",
    "https://deno.land/x/saur/cli.js",
  ];
  const stdout = "piped";
  const upgrade = run({ cmd, stdout });
  const status = await upgrade.status();

  exit(status);
}
