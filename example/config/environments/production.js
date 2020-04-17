import { config } from "https://deno.land/x/dotenv/dotenv.ts"

const { DATABASE_URL, REDIS_URL } = config()

export default {
  environment: "production",
  forceSSL: true,
  db: {
    url: DATABASE_URL
  },
  cache: {
    enabled: true,
    adapter: "redis",
    url: REDIS_URL
  },
  log: {
    level: "DEBUG"
  }
}
