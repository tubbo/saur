---
layout: page
path: /guides/views.html
---


# Views and Templates

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


