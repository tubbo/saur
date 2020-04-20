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

## Why?

In JavaScript backend development, there aren't very many resources for
a fully-featured web application framework. While smaller components can
be cobbled together to make an application, there's nothing that can get
you started as quickly as something like Rails. For many developers,
running `rails new` is a lot easier than setting up a project with
`yarn` and including all the dependencies you'll need to get started. In
addition, once you get a sufficient framework of sorts going, you still
don't have any generators or a common way of running tasks that can be
exported and modularized.

Saur attempts to solve these problems by taking a lot of what we've
learned from Rails, Django, and other "web MVC" frameworks and applying
them in the world of server-side JavaScript. By imitating their
successes, and addressing some of their faults, we're ensuring that
backend applications are 

## Documentation

If you're already up to speed with what Deno Saur is and want to learn
more, this site has a wealth of guides to help you get your job done.

- [Quick Start](/start.html)
- [Architecture](/architecture.html)
  - [Models](/models.html)
  - [Controllers and Routing](/controllers.html)
  - [Views and Templates](/views.html)
  - [Mailers](/mailers.html)
- [Configuration](/configuration.html)
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
