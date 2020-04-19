export default async function Server() {
  await import(`${Deno.cwd()}/config/server.js`);
}
