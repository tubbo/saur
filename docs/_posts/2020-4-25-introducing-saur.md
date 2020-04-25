---
layout: post
---

# Introducing Saur!

This is **Deno Saur**, a web application framework for JavaScript
on the [Deno][] runtime. Saur was created for web developers who want a
full-stack application framework in a language they are comfortable in.
It was designed for getting things done, and getting them done fast.

## Fully-Featured Tooling

Saur's tooling is made for rapid development. To generate the
boilerplate code for a new app, run:

    saur new YOUR-APP-NAME

To generate code in your app, run:

    saur generate TYPE NAME

The `TYPE` parameter names one of the set of generators that are
available to you (such as `model` or `controller`). You can run the
following command to view more information for them all:

    saur help generate

Or, for a specific generator:

    saur help generate model

## RESTful Routing

Saur's main app file is also where you define your routes. A routing DSL
is provided that makes it easy to define the API for your application:

```javascript
App.routes.draw({ root, resources }) => {
  resources("posts");
  root("posts#index");
})
```

## Web MVC

One of the many concepts brought over from other frameworks is the
**Model-View-Controller** pattern. Since this is not the same "MVC" as
is used in UI development, it's been known as "Web MVC" when similar
concepts are used to model the backend. Saur is similar to Rails in that
it uses **Controllers** for handling requests, **Models** to express the
database logic, and **Views** for rendering the HTML for responses.

### Controllers

Controllers look very similar to their Rails counterparts:

```javascript
import Controller from "https://deno.land/x/saur/controller.js";
import IndexView from "../views/posts/index.jsx";
import ShowView from "../views/posts/show.jsx";

export default class PostsController extends Controller {
  // Controller actions typically render 
  index() {
    const posts = Post.all;

    return this.render(IndexView, { posts });
  }

  // When params are given in the URL, they are passed down into the
  // controller's action method.
  show({ id }) {
    const posts = Post.find(id);

    return this.render(ShowView, { post });
  }
}
```

You can also use TypeScript decorators to establish callbacks for
actions in `.ts` files:

```typescript
import Controller from "https://deno.land/x/saur/controller.js";
import IndexView from "../views/posts/index.jsx";
import { before } from "https://deno.land/x/saur/callbacks.js"

export default class PostsController extends Controller {
  @before("index")
  authenticateUser() {
    try {
      this.user = User.find(this.request.cookies.userID);
    } catch() {
      return this.redirect("sessions#new");
    }
  }

  index() {
    const posts = Post.all;

    return this.render(IndexView, { posts });
  }
}
```

### Models

Models are also derived from Rails' ActiveRecord, and the active record
pattern in general. The built-in `Database` object follows the adapter
pattern and can be used to interact with [MySQL][], [PostgreSQL][], and
[SQLite][] databases out of the box.

A model also looks very similar to an ActiveRecord class:

```javascript
import Model from "https://deno.land/x/saur/model.js";

export default class Post extends Model {
  static validations = [
    validates("title", { presence: true, uniqueness: true }),
    validates("body", { presence: true })
  ];
}
```

If you use TypeScript, you can also use decorators to define validations
and business logic:

```typescript
import Model, { validates } from "https://deno.land/x/saur/model.js";
import { validates } from "https://deno.land/x/saur/model/decorators.js";
import { before, after, around } from "https://deno.land/x/saur/callbacks.js";

@validates("title", { presence: true, uniqueness: true })
@validates("body", { presence: true })
export default class Post extends Model {
  @before("valid")
  generateSlug() {
    this.slug = paramCase(this.name);
  }

  @after("save")
  generateSlug() {
    UserMailer.deliver("notify");
  }

  @around("update")
  lock(update) {
    this.locked = true;
    const value = update();
    this.locked = false;

    return value;
  }
}
```

### Views

Here's where things start to diverge. In Saur, a view object is used to
either wrap a pre-defined EJS template or just render straight HTML to a
String with JSX. View files can either be `.js` or `.jsx`, depending on
how you want to use them. Since there are no helper methods in Saur,
view objects are used to encapsulate presentation-level logic for the
various controller actions and means of rendering content in your
application.

Here's an example of a view object used to render a post using JSX:

```javascript
import View from "https://deno.land/x/saur/view.js";
import React from "https://deno.land/x/saur/view/react.js";
import { moment } from "https://deno.land/x/moment/moment.ts";

export default class PostView extends View {
  get date() {
    return moment(this.post.created_at).format();
  }

  render() {
    const __html = this.post.body;

    return(
      <article className="post">
        <header>
          <h1>{this.post.title}</h1>
        </header>
        <main dangerouslySetInnerHtml={{ __html }} />
        <footer>
          <p>Posted on {this.date}</p>
        </footer>
      </article>
    );
  }
}
```

And here's what that same view would look like written using an EJS
template:

```javascript
import View from "https://deno.land/x/saur/view.js";
import { moment } from "https://deno.land/x/moment/moment.ts";

export default class PostsShowView extends View {
  static template = "posts/show";

  get date() {
    return moment(this.post.created_at).format();
  }
}
```

With a template in **templates/posts/index.html.ejs**:

```html
<article className="post">
  <header>
    <h1><%= post.title %></h1>
  </header>
  <main>
    <%- post.body %>
  <footer>
    <p>Posted on <%= view.date %></p>
  </footer>
</article>
```

Views also get their own decorators for configuring the `View.template`:

```typescript
import View from "https://deno.land/x/saur/view.js";
import { template } from "https://deno.land/x/saur/view/decorators.js";
import { moment } from "https://deno.land/x/moment/moment.ts";

@template("posts/show")
export default class PostsShowView extends View {
  get date() {
    return moment(this.post.created_at).format();
  }
}
```

## Security

Saur takes security seriously, just like Deno. By leveraging Deno's
security model, Saur applications are inherently protected against
malicious libraries and other problems because their actions are
isolated to the app code directory. A Saur application, out-of-box,
cannot access other parts of the filesystem other than its own folder.
The main `saur` CLI must actually delegate to the application's own
`bin/server` executable in order to run the server, because `saur` does
not have `--allow-net` privileges. This is by design, as the CLI does
not need to make outbound network calls, and the application server
never needs to access files outside the application itself. As a result,
`bin/server` has read/write and network permissions, but 

## The Front-End

It wouldn't be a "full-stack" framework without some front-end
enhancements! Saur comes complete with its own (optional) framework for
organizing your client-side JavaScript. The UI aspect of Saur takes
inspiration from other JS frameworks for server-rendered HTML, like
[Stimulus][]. What Stimulus calls "Controllers", Saur calls
"Components", but they serve relatively the same purpose. Here's an
example of a component used to open a dialog box:

```typescript
import Component from "saur/ui/component";
import { element, event } from "saur/ui/decorators";
import Dialog from "../templates/dialog.ejs";

@element("[data-dialog-link]");
export default class OpenDialog extends Component {
  @event("click")
  async open(event) {
    const title = this.element.getAttribute("title");
    const href = this.element.getAttribute("href");
    const response = await fetch(href);
    const content = await response.text();
    const dialog = Dialog({ title, content });

    document.insertAdjacentHTML("beforeend", dialog);
  }
}
```

You'll notice that this is also ES6 modular JavaScript. For now, we're
using [Webpack][] to transpile and bundle your JS/CSS assets for the
browser. One benefit of this is that decorators are supported here in
`.js` files since out-of-box the babel plugin for transpiling them is
included and configured. They are _not_ required, however, as you can
bind events and set the element selector manually with static attributes
as well:

```javascript
import Component from "saur/ui/component";
import Dialog from "../templates/dialog.ejs";

class OpenDialog extends Component {
  async open(event) {
    const title = this.element.getAttribute("title");
    const href = this.element.getAttribute("href");
    const response = await fetch(href);
    const content = await response.text();
    const dialog = Dialog({ title, content });

    document.insertAdjacentHTML("beforeend", dialog);
  }
}

OpenDialog.selector = "[data-dialog-link]";
OpenDialog.events.click = ["open"];

export default OpenDialog;
```

EJS templating is supported on the front-end out of the box, but not
JSX. You should just use [React][] for that.
