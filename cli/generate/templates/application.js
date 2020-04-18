import Application from "../application.js";

// `import` your code here:

const App = new Application({
  // Place your default configuration here. Environments can override
  // this configuration in their respective `./config/environments/*.js`
  // file.
});

App.routes.draw(({ root }) => {
  // root("index", HomeController)
});

await App.initialize();

export default App;
