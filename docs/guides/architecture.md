---
layout: page
path: /guides/architecture.html
---

# Architecture

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
  file. Templates can be rendered as the result of a controller action,
  or within another view as a "partial", in which they won't be compiled
  with their wrapping layout of choice.
- **Mailers** are similar to controllers, in that they render responses
  from Views, but have the responsibility of emailing those responses
  over SMTP rather than responding to an HTTP request. A mailer can be
  called from anywhere in your application, and you can re-use views
  that were created as part of your controllers with mailers.
- **Tasks** are sub-commands of `saur` that pertain to a specific
  application. You can write these tasks yourself in the `tasks/`
  folder, all tasks

All of the aforementioned objects have corresponding generators, so to
generate any of them, you can run:

    saur generate [controller|model|view|template|mailer|task] NAME

Some of these generators come with additional options, which you can
view by adding an `-h` to the command, or by running:

    saur help generate [controller|model|view|template|mailer|task]
