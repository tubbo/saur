/**
 * Load configuration from ./config/environment/$env-name.js
 */
export default async function EnvironmentConfig(app) {
  const { environment } = app.config;
  const file = `${app.root}/config/environments/${environment}.js`;
  const env = await import(file);
  app.config = { ...app.config, ...env.default };
}
