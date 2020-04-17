/**
 * Load configuration from ./config/environment/$env-name.js
 */
export default async function EnvironmentConfig(app) {
  const { environment } = app.config;
  const envConfigFile = `${app.root}/config/environments/${environment}.js`;
  const envConfig = await Deno.readFile(envConfigFile);
  app.config = { ...app.config, ...envConfig };
}
