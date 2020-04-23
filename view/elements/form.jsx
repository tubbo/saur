/**
 * @example
 *   <Form.For model={product}>
 *     <Form.Label name="name" />
 *     <Form.Input name="name" />
 *     <Form.Fields name="variant">
 *       <Form.Input name="name" />
 *     </Form.Fields>
 *     <Form.Submit>Submit</Form.Submit>
 *   </Form.For>
 * @param model
 */
export async function For({ model, children, ...options }) {
  const { default: App } = await import(`${Deno.cwd()}/index.js`);
  const method = model.persisted ? "PATCH" : "POST";
  const action = App.routes.urlFor(model);

  return (
    <Form action={action} method={method} {...options}>
      <Fields name={model.paramName}>{children}</Fields>
    </Form>
  );
}

export function Label({ name, base, children, ...options }) {
  if (base) {
    name = `${base}[${name}]`;
  }

  return (
    <label for={name} {...options}>
      {children}
    </label>
  );
}

export function Input({ type, name, base, children, ...options }) {
  if (base) {
    name = `${base}[${name}]`;
  }

  return (
    <input type={type} name={name} {...options}>
      {children}
    </input>
  );
}

export function Submit({ value = "commit", children, ...options }) {
  return (
    <button type="submit" value={value} {...options}>
      {children}
    </button>
  );
}

/**
 * High-level component for wrapping groups of fields with a base name.
 */
export function Fields({ name, children }) {
  return children.map((child) => child({ base: name }));
}

/**
 * HTML Form helper in JSX.
 */
export default async function Form({ action, method, children, ...options }) {
  const { default: App } = await import(`${Deno.cwd()}/index.js`);
  const token = App.authenticityToken;
  const methodOverride = !method.match(/GET|POST/) ? (
    <input type="hidden" name="_method" value={method} />
  ) : (
    ""
  );

  return (
    <form action={action} method={method} {...options}>
      {methodOverride}
      <input type="hidden" name="authenticity_token" value={token} />
      {children}
    </form>
  );
}

export async function Button({ to, ...options }) {
  return (
    <Form action={to} method="GET">
      <Submit {...options}>{children}</Submit>
    </Form>
  );
}
