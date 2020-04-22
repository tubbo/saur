import App from "../../index.js";
import { describe } from "https://deno.land/x/saur/testing.js";
import { assert } from "https://deno.land/std/testing/asserts.ts";

test("Visit the home page", () => {
  visit("/");

  assert.content("hello world!");
});
