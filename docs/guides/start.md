---
layout: page
path: /guides/start.html
---

# Quick Start: Hello World

Create a new application:

    saur new hello
    cd hello

Generate the controller and action:

    saur generate home index

Edit **templates/home/index.html.ejs**:

```html
<h1>hello world</h1>
```

Open **index.js** and add your route:

```javascript
import Application from "../application.js";
import HomeController from "./controllers/home.js";

// `import` your code here:

const App = new Application({
  root: import.meta.url,
  // Place your default configuration here. Environments can override
  // this configuration in their respective `./config/environments/*.js`
  // file.
});

App.routes.draw(({ root }) => {
  root("index", HomeController);
});

await App.initialize();

export default App;
```

Start the server, and browse to <http://localhost:3000>

    saur server

You should see a big ol' "Hello World!"
