import Application from "../application.js";
import HomeController from "./controllers/home.js";

// `import` your code here:

const App = new Application({
  root: import.meta.url,
  // Place your default configuration here. Environments can override
  // this configuration in their respective `./config/environments/*.js`
  // file.
  log: {
    level: "DEBUG",
  },
});

App.routes.draw(({ root }) => {
  root("home#index");
});

await App.initialize();

export default App;
