# Deno Saur

[Deno Saur][] is a web application framework optimized for rapid
development. Its goal is to provide a full set of features for creating
monolithic, server-side applications with [Deno][].

## Features

- **Security:** Deno Saur uses the latest advancements to make sure your
  apps stay safe. It's also running on Deno and Rust's extremely stable
  runtime, meaning you're protected from lower-level issues.
- **Immediacy:** When you need to build something *now*, Saur includes a
  complete set of command-line generators to quickly scaffold an
  application.
- **Persistence:** Saur makes dealing with a database easier by making
  use of the [SQL Builder][] query DSL, as well as pluggable adapters
  and migrations for schema updates.
- **Modularity:** Saur was designed from the ground up to be a
  decoupled, modular architecture. This is to promote reusability of
  components within the framework and outside of it. Almost anything
  from Saur's core codebase can be `export`-ed and used without
  depending on the full framework.
- **Modernity:** Use the latest features of JavaScript without pulling
  your hair out. Deno, and Saur, have first-class support for the latest
  features in the language. You can even write your code in TypeScript!

## Installation

To install Deno Saur, make sure you have [Deno][] installed, then run:

    deno install saur https://deno.land/x/saur/cli.js

Once that's complete, create your first application by running:

    saur new my-first-app

## Architecture

Saur is strucutured similarly to other "Web MVC" frameworks like
[Django][] and [Ruby on Rails][]. Each object in your application
represents a different role that's played:

- **Controllers** are used to respond to requests from the main
  application router. After parsing the URL, a new instance of the
  Controller is created to fulfill the request. Controllers come
  pre-packed with abstractions meant to help you in this effort.
- **Models** encapsulate the database logic with an Object-Relational
  Mapper, pre-populating your model objects with the data from the
  database and validating input before it's persisted.
- **Views** are objects used to render templates within a given context.
  Similar to helpers and presenters in Rails, you can define View
  methods and have them automatically appear in the rendered template.
- **Templates** are [EJS][] files that live in `./templates`, and
  populated with a `View` object as context when they are rendered from
  file.

### Quick Start: Hello World

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



## Documentation

If you're already up to speed with what Deno Saur is and want to learn
more, this site has a wealth of guides to help you get your job done.

- [Models](/models.html)
- [Controllers and Routing](/controllers.html)
- [Views and Templates](/views.html)
- [Mailers](/mailers.html)
- [Configuration Settings](/configuration.html)
- [CLI](/cli.html)
- [Cache](/cache.html)

Check out the [reference documentation][] if you want to learn more
about each feature.

[Deno Saur]: https://denosaur.org
[Deno]: https://deno.land
[reference documentation]: https://api.denosaur.org
[Django]: https://djangoproject.com
[Ruby on Rails]: https://rubyonrails.org
[SQL Builder]: https://github.com/manyuanrong/sql-builder
