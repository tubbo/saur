import * as PostgreSQL from "https://deno.land/x/postgres/mod.ts";
import * as MySQL from "https://deno.land/x/mysql/mod.ts";

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
    this.client = new PostgreSQL.Client(this.config)
  }

  async exec(sql) {
    App.log.debug(`Running Query "${sql}"`)

    await client.connect()

    const result = await this.client.query(sql)

    await client.end()

    return result.rowsOfObjects()
  }
}

export class MysqlAdapter extends Database {
  initialize() {
    this.client = new MySQL.Client(this.config)
  }

  async exec(sql) {
    App.log.debug(`Running Query "${sql}"`)

    await client.connect()

    const result = await this.client.query(sql)

    await client.end()

    return result.rowsOfObjects()
  }
}

export const ADAPTERS = {
  postgres: PostgresAdapter,
  mysql: MysqlAdapter
}
