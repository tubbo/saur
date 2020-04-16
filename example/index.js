import Application from "https://deno.land/x/saur/application.js"

window.App = new Application({
  layout: "layout.ejs",
})

App.routes.draw(({ resources, namespace, root }) => {
  resources("users", UsersController, (collection, member) => {
    collection(({ get }) => {
      get("active")
    })

    member(({ get }) => {
      get("setup")
    })
  })

  namespace("foo", ({ namespace }) => {
    namespace("bar", ({ get }) => {
      get("baz", { controller: HomeController })
    })
  })

  root(HomeController, "index")
})

App.start()
