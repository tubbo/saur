import Application from "https://deno.land/x/saur/application.js";

// `import` your code here:

const App = new Application({
  root: import.meta.url,
  // Place your default configuration here. Environments can override
  // this configuration in their respective `./config/environments/*.js`
  // file.
});

App.routes.draw(({ root }) => {
  // root("index", HomeController)
});

await App.initialize();

export default App;
