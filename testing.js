/**
 * Wrap `Deno.test` methods in a group for easier organization.
 */
export function describe(group, callback) {
  const test = (name, fn) => Deno.test({ name: `${group}#${name}`, fn });

  return callback({ test });
}
