import Application from "../application.js";
import HomeController from "./controllers/home.js";

// `import` your code here:

const App = new Application({
  root: import.meta.url,
});

App.config.log.level = "DEBUG";
App.config.db.database = "example";

App.routes.draw(({ root }) => {
  root("home#index");
});

await App.initialize();

export default App;
