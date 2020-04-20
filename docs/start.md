# Quick Start: Hello World

Create a new application:

    saur new hello
    cd hello

Generate the controller and action:

    saur generate application index

Edit **templates/application/hello.html.ejs**:

```html
<h1>hello world</h1>
```

Open **index.js** and add your route:

```javascript
import Application from "https://deno.land/x/saur/application.js"
import ApplicationController from "./controllers/application"

const App = new Application({
  // enter your config settings here
})

App.routes.draw(({ root }) => {
  root("index", ApplicationController)
})

export default App
```

Start the server, and browse to <http://localhost:3000>

    saur server

You should see a big ol' "Hello World!"
