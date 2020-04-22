---
layout: page
path: /guides/cli.html
---

# Command-Line Interface

The `saur` CLI allows easy administration of your app from the Terminal.

You can create a new app:

    saur new my-app

Generate some code within it:

    saur model user name:citext password

Start a web server:

    saur server

Evaluate code within the context of your app:

    saur run "console.log(App.root)"
    /Users/tubbo/my-saur-app

Or, run any number of custom tasks. For more information on what's
available to you, run:

    saur help

## Custom Tasks

Tasks can be defined in your application under `./tasks`, and mounted in
the `saur` CLI when you're inside your application. For example, given
the following code in **tasks/hello.js**:

```javascript
import task from "https://deno.land/x/saur/task.js"
import App from "../index.js"

export default task("root", "Show the app root", console.log(App.root))
```

Running `saur help` will show:

    saur [ARGUMENTS] [OPTIONS]

    ...

    Tasks:
      new - Generate a new app
      generate - Generate code for your app
      server - Start the server
      run - Evaluate code within your app environment
      help - Get help on any command
      root - Show the app root

You can now run `saur root` to run the command within your app
environment:

    $ saur root
    /Users/tubbo/my-saur-app
