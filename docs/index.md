---
layout: home
path: /
---

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
  your objects within the framework and outside of it. Almost anything
  from Saur's core codebase can be `export`-ed and used without
  depending on the full framework.
- **Modernity:** Use the latest features of JavaScript without pulling
  your hair out. Deno, and Saur, have first-class support for the latest
  features in the ECMAScript standard, as well as TypeScript. Saur
  includes decorators for TypeScript users that make writing models,
  views, and components a breeze.
- **Familiarity:** Saur looks and feels like the technology you already
  know, without the overhead of learning an additional language. Learn
  how writing your backend application in JavaScript can be just as
  expressive, if not more so, than in PHP, Ruby, or Python.

## Installation

To install Deno Saur, make sure you have [Deno][] installed, then run:

```bash
deno install --unstable --allow-read=. --allow-write --allow-run --name saur https://deno.land/x/saur/cli.js
```

This will install the CLI to **~/.deno/bin/**, and give it permissions
to read and write to the filesystem, as well as run commands. You can
define which directory it has write access to by passing that
directory into the command:

```bash
deno install --allow-read=. --allow-write=~/Code --allow-run saur https://deno.land/x/saur/cli.js
```

Once everything is installed and compiled, you'll want to have the
`saur` command in your `$PATH` if you haven't done so already:

```bash
export PATH=~/.deno/bin:$PATH
```

You can now create your first application by running:

```bash
saur new my-first-app
```

This command will create a new directory and generate some boilerplate
files you'll need for Saur to work. It will also install the
`bin/server` script for easily starting the application server, which is
used by `saur server` to run your application. This is due to Deno's
security model. The `saur` CLI has no network access, meaning it can't
make outbound calls to the Internet, however, it has read/write access
to your entire filesystem and the ability to run commands. The `bin/server`
script does have network access, but only the ability to write to the
filesystem within its own directory, and no ability to run arbitrary
commands. This means that even if you download a malicious plugin or
module, it won't be able to change any information outside of your app,
so you can isolate and contain its impact. The most it can do is affect
your actual application code and make outbound calls to the Internet,
which is still bad, but not as bad as losing your identity.

## Why?

In JavaScript backend development, there aren't very many resources for
a fully-featured web application framework. While smaller libraries can
be cobbled together to make an application, there's nothing that can get
you started as quickly as something like Rails. For many developers,
running `rails new` is a lot easier than setting up a project with
`yarn` and including all the dependencies you'll need to get started. In
addition, once you get a sufficient framework of sorts going, you still
don't have any generators or a common way of running tasks that can be
exported and modularized. The result is a lot of projects out there are
difficult to navigate, which makes developing on them much harder.

Saur attempts to solve these problems by taking a lot of what we've
learned from Rails, Django, and other "web MVC" frameworks and applying
them in the world of server-side JavaScript. By imitating their
successes, and addressing some of their faults, we're ensuring that
backend applications can be made quickly, easily, and securely in
JavaScript without having to reach for additional tools.

Much like how the beauty of Ruby spurred the pragmatic development of
Rails, Saur probably wouldn't have been as straightforward to use
without the accomplishments of the [Deno][] JavaScript runtime. Deno's
built-in TypeScript, code formatting, external module importing (without
the need for a centralized package manager!) and Promise-based
asynchronous I/O is a major positive boon to the Saur framework,
bringing with it the speed and correctness you've come to expect from
your backend, without the weird hacks and questionable runtimes that
plague Node.js applications. No need to set `--use-experimental` here,
ECMAScript modules and top-level async/await are fully supported in
Deno, and the runtime itself is written in Rust to ensure maximum
compatibility and minimize nasty segfault bugs that are rampant
throughout the C-based interpreted languages that most of the Web runs
on.

[Deno Saur]: https://denosaur.org
[Deno]: https://deno.land
[reference documentation]: https://api.denosaur.org
[Django]: https://djangoproject.com
[Ruby on Rails]: https://rubyonrails.org
[SQL Builder]: https://github.com/manyuanrong/sql-builder
