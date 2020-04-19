/**
 * Execute some JS code in the context of your application.
 */
export default async function Run(options, code) {
  window.APP_ROOT = `${Deno.cwd()}/example`;
  window.APP_RUN = true;

  await import(`${window.APP_ROOT}/index.js`);
  eval(code);
}
