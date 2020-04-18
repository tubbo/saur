import MissingRoute from "../middleware/missing-route.js";

export default function Routing(app) {
  app.use(app.routes.all);
  app.use(app.routes.methods);
  app.use(MissingRoute);
}
