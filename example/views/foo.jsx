import View from "https://deno.land/x/saur/view.js";
import React from "https://deno.land/x/saur/view/react.js";

export default class FooView extends View {
  render() {
    return <div>{this.rootURL()}</div>
  }
]
