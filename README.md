# Saur

A rapid development web framework for [deno][].

## Features

* Model-View-Controller Architecture
* Supports multiple SQL database backends
* Built-in caching
* Routing DSL

## Installation

Install the CLI with `deno install`:

    deno install --allow-run --allow-write saur https://deno.land/x/saur/cli.js

Then create your app using the `new` command:

    saur new my-app
    cd my-app

You'll get an **index.js** file to start out.

Generate code by running the `generate` command:

    saur generate controller home

And start the server by running:

    saur server

You can also run tests:

    deno test

## Usage

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

### Quick Example: Hello World

Create a new appliction in any JS file. For this example, it will be
called **index.js**:

```javascript
import Application from "https://deno.land/x/saur/application.js"
import ApplicationController from "./controllers/application"

window.App = new Application({
  // enter your config settings here
})

App.routes.draw(({ root }) => {
  root("index", ApplicationController)
})
```

Next, add the `ApplicationController` in **controllers/application.js**:

```javascript
import Controller from "https://deno.land/x/saur/application.js"
import HelloWorld from "../views/hello.js"

export default class ApplicationController extends Controller {
  index() {
    this.response.body = "Hello World"
  }
}
```

You can now start the server:

```
deno index.js
```

Browse to <https://localhost:3000> to see your new app!

### Full Example: Views and Templates

Unlike Rails, views and templates are not the same thing in Saur. The
separation of concerns here allows the developer to write methods
particular to each view without having to share that context with other
views.

For example, say a developer wants to make it so a user's name appears
titleized in the `show` view, but on the `index` view it should be
abbreviated. To accomplish this, first create a new `ShowView` class:

```javascript
import View from "https://deno.land/x/saur/view.js"
import titleCase from "https://deno.land/x/case/titleCase.ts";

export default class ShowView extends View {
  static template = "./templates/user.ejs" // relative to App.root

  get title() {
    return titleCase(this.controller.user.name)
  }
}
```

Now, create a `SummaryView` class that only displays the user name as
the title:

```javascript
import View from "https://deno.land/x/saur/view.js"

export default class SummaryView extends View {
  static template = "./templates/user.ejs" // relative to App.root

  get title() {
    return this.controller.user.name
  }
}
```

You'll notice both of these views use the same template. That's not a
typo! It's possible to render common templates with differing contexts
using view objects. Here's the EJS template we'll be rendering in
**templates/user.ejs**:

```html
<h1><%= title %></h1>
```

Connect it to the router by rendering these views from a
`UsersController`:

```javascript
import Controller from "https://deno.land/x/saur/controller.js"
import SummaryView from "../views/users/summary.js"
import ShowView from "../views/users/show.js"
import User from "../models/user.js"

export default class UsersController extends Controller {
  summary({ id }) {
    const user = User.find(id)

    this.render(IndexView)
  }

  show({ id }) {
    const user = User.find(id)

    this.render(ShowView)
  }
}
```

And finally, route the controller actions in your application code:

```javascript
import UsersController from "./controllers/users.js"

App.routes.draw(({ resources }) => {
  resources("users", UsersController, ({ member } => {
    member(({ get }) => get("summary"))
  })
})
```

Now, when you visit `/users/:id`, you'll get the titleized name, but
visiting `/users/:id/summary` will only render the abbreviated name.

### Models

Models are structured very similar to ActiveRecord. Here's an example of
what a `User` model might look like:

```javascript
import Model, { validates, validate } from "https://deno.land/x/saur/model.js"

export default class User extends Model {
  static table = "users"
  static validations = [
    validates("name", { presence: true })
    validates("password", { presence: true })
    validate("nameNotFoo")
  ]

  nameNotFoo() {
    if (this.name === "foo") {
      this.errors.add("name", "cannot be 'foo'")
    }
  }
}
```

You can find a model by its ID like so;

```javascript
const user = User.find(1)
```

Or, find it by any other property:

```javascript
const userByName = User.findBy({ name: "bar" })
```

Using [SQL Builder][] under the hood, you can chain query fragments
together to construct a query based on the given data. Saur wraps the
SQL Builder's `Query` object, lazy-loading the data you need when you
ask for it. For example, the following query won't be run immediately:

```javascript
const users = User.where({ name: "bar" })

users.limit(10)
```

Only when the data is actually needed, like iteration methods, will it be run:

```javascript
const names = users.map(user => user.name) // => ["bar"]
```

This doesn't apply for `find` or `findBy`, since those need to return a
full model object, and thus the query will run when called in order to
give you immediate feedback.

### Caching

A caching layer is also built in, with support for "russian-doll"
strategies in the view:

```
<article>
  <%= cache(`users/${user.id}`, () => { %>
    <header>
      <h1><%= user.name %></h1>
    </header>
    <main>
      <%= cache(`users/${user.id}/posts`, () => { %>
        <% user.posts.forEach(post => { %>
          <p><%= post.title %></p>
        <% }) %>
      <%= }) %>
    </main>
  <%= }) %>
</article>
```

This `cache` method is provided in the `View` for your convenience, but
you can access the app cache directly using `App.cache`. The method used
in the `cache` helper is `App.cache.fetch`, and is notable because it
first checks if a key is available and uses the cache if so, otherwise
it will call the provided "fresh" method and save that value as the
cache.

## Development

To build documentation, you'll need [ESDoc][] and plugins installed:

    yarn global add esdoc esdoc-ecmascript-proposal-plugin esdoc-standard-plugin

Then, run:

    make

This will also generate a `bin/saur` binstub so you can run CLI
commands.

Before submitting your code, make sure it's formatted:

    make fmt

[deno]: https://deno.land
[SQL Builder]: https://github.com/manyuanrong/sql-builder
[Django]: https://djangoproject.com
[Ruby on Rails]: https://rubyonrails.org
