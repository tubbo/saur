import { Client as Postgres } from "https://deno.land/x/postgres/mod.ts";

export default class Database {
  constructor(config={}) {
    this.config = config
    this.initialize()
  }

  initialize() {}
  exec(sql) {}
}

export class PostgresAdapter extends Database {
  initialize() {
    this.client = new Postgres(this.config)
  }

  async exec(sql) {
    await client.connect()

    const result = await this.client.query(sql)

    await client.end()

    return result.rowsOfObjects()
  }
}

export const ADAPTERS = {
  postgres: PostgresAdapter
}
