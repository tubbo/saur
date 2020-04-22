---
layout: page
path: /guides/controllers.html
---

# Controllers and Routing

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

And it could be routed in **index.js** like so:

```javascript
App.routes.draw({ get }) => {
  get("users/:id", { controller: UsersController, action: "show" });
});
```

This will render the `UsersController#show` action on the
<http://localhost:3000/users/1> route.
