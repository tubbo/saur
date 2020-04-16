import Application from "https://deno.land/x/saur/application.js"

window.App = new Application({
  layout: "layout.ejs",
})

App.routes.draw(() => {
  this.resources("users", UsersController, (collection, member) => {
    collection(() => {
      this.get("active")
    })

    member(() => {
      this.get("setup")
    })
  })

  this.namespace("foo", () => {
    this.namespace("bar", () => {
      this.get("baz", HomeController)
    })
  })

  this.root(HomeController, "index")
})

App.start()
