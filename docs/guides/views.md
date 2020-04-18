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


