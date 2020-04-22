const { run } = Deno;

/**
 * Reinstall the `saur` CLI.
 */
export default async function Upgrade() {
  const cmd = [
    "deno",
    "install",
    "--force",
    "--allow-read=.",
    "--allow-write",
    "--allow-run",
    "saur",
    "https://deno.land/x/saur/cli.js",
  ];
  const stdout = "piped";
  const upgrade = run({ cmd, stdout });

  await upgrade.status();
}
