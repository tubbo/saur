# Deno Saur

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

### Controllers

The controller layer is used for parsing requests and rendering
responses. It's the abstraction between the router/server and your
application code. Controllers are primarily used to query the database
and render Views to display that data in a certain way, depending on the
requested format.

Here's what a controller for the `User` model might look like:

```javascript
import Controller from "https://deno.land/x/saur/controlller.js";
import UserView from "../views/user.js";

export default UsersController extends Controller {
  show({ id }) {
    const user = User.find(id);

    this.render(UserView, { user });
  }
}
```

### Views and Templates

View objects are used to encapsulate template rendering and data
presentation. Separating the concerns of the "presentation" and "data"
layers, Views take the form of a "presenter" from other applications,
but are coupled to a particular template that it is responsible for
rendering. As such, a view will need to be made alongside a
corresponding template for each response you wish to create. Here's an
example of what the `UserView` might look like from before:

```javascript
import View from "https://deno.land/x/saur/view.js";

export default UserView extends View {
  static template = "user.ejs";

  get title() {
    const { user: { name } } = this.context

    return `@${name}'s Profile`
  }
}
```

And your `user.ejs` template:

```html
<article class="user">
  <header>
    <h1><%= title %></h1>
  </header>
</article>
```

Although views need a template in order to render, templates can be
reused between views given the right kind of context. The markup in
`user.ejs`, for example, can be reused by another template like
`users.ejs` when it comes time to render a partial:

```html
<ul class="users">
<% users.forEach(user => { %>
  <li><%= include("user.ejs", { user, title: user.name }) %></li>
<% }) %>
</ul>
```

The partial is rendered without the `UserView` context. To supply a
different view context, you can also render the partial from the view
class itself:

```javascript
import View from "https://deno.land/x/saur/view.js";

export default UsersView extends View {
  static template = "users.ejs";

  get users() {
    return this.context.users.map(user => this.render(UserView, { user })
  }

  get title() {
    const { user: { name } } = this.context

    return `@${name}'s Profile`
  }
}
```

The template can be cleaned up like so:

```html
<ul class="users">
  <%= users %>
</ul>
```

Additionally, views are not coupled to controllers. They can be used in
mailers as well:

```javascript
import Mailer from "https://deno.land/x/saur/mailer.js"

export default class UserMailer extends Mailer {
  confirmation(user) {
    const title = "Click here to confirm your account"
    this.render(UserView, { user })
  }
}
```

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
