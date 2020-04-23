/**
 * An element you can include in your View JSX to link to a given URL.
 */
export default async function Link({ to, children, ...options }) {
  const { default: App } = await import(`${Deno.cwd()}/index.js`);
  const href = App.routes.resolve(to);

  return (
    <a href={href} {...options}>
      {children}
    </a>
  );
}
