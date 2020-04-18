import Application from "../application.js";
import UsersController from "./controllers/users.js";
import HomeController from "./controllers/home.js";

window.App = new Application({
  root: window.APP_ROOT,
  layout: "layout.ejs",
  db: {
    name: "example",
  },
});

App.routes.draw(({ resources, namespace, root }) => {
  resources("users", UsersController, ({ collection, member }) => {
    collection(({ get }) => {
      get("active");
    });

    member(({ get }) => {
      get("setup");
    });
  });

  namespace("foo", ({ namespace }) => {
    namespace("bar", ({ get }) => {
      get("baz", { controller: HomeController });
    });
  });

  root("index", HomeController);
});

await App.start(window.APP_RUN);
