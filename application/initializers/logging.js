import * as log from "https://deno.land/std/log/mod.ts";

/**
 * Set up the `App.log` object before all other initializers.
 */
export default async function Logging(app) {
  const {
    log: { level, formatter },
  } = app.config;

  await log.setup({
    handlers: {
      default: new log.handlers.ConsoleHandler(level, { formatter }),
    },
    loggers: {
      default: {
        level: level,
        handlers: ["default"],
      },
    },
  });

  app.log = log.getLogger();
}
