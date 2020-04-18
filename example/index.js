import Application from "https://deno.land/x/saur/application.js";

const App = new Application();

App.routes.draw(({ root }) => {
  // root("index", HomeController)
});

await App.initialize();

export default App;
