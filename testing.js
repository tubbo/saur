/**
 * Wrap `Deno.test` methods in a group for easier organization.
 */
export function describe(groupName, callback) {
  const test = (testName, assertions) =>
    Deno.test(`${testName}#${groupName}`, assertions);

  return callback({ test });
}
