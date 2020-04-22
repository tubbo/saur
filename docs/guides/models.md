---
layout: page
path: /guides/models.html
---


# Models

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


