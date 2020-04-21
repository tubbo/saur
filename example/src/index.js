import Saur from "saur";

import "./index.css";

const context = require.context("./components", true, /\.js$/);
const App = new Saur(context);
const ready = "DOMContentLoaded";

document.addEventListener(ready, ({ target }) => App.start(target));
