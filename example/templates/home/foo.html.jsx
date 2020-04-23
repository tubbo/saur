import React from "https://deno.land/x/saur/view/react.js";

export default function (view) {
  const foo = view.constructor.name;

  return <div>{foo}</div>;
}
