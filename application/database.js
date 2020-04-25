import Adapter from "./adapter.js";
import * as PostgreSQL from "https://deno.land/x/postgres/mod.ts";
import * as MySQL from "https://deno.land/x/mysql/mod.ts";
import SQLite from "https://deno.land/x/sqlite/mod.ts";

class Database extends Adapter {
  constructor(config = {}, logger) {
    super();
    this.config = config;
    this.logger = logger;
    this.initialize();
  }

  /**
   * Run when the adapter is instantiated.
   */
  initialize() {}

  /**
   * Execute the passed-in SQL query.
   */
  exec() {}
}

export class PostgresAdapter extends Database {
  initialize() {
    this.client = new PostgreSQL.Client(this.config);
  }

  async exec(sql) {
    this.logger.debug(`Running Query "${sql}"`);

    await this.client.connect();

    const result = await this.client.query(sql);

    await this.client.end();

    return result.rowsOfObjects();
  }
}

export class MysqlAdapter extends Database {
  initialize() {
    this.client = new MySQL.Client(this.config);
  }

  async exec(sql) {
    this.logger.debug(`Running Query "${sql}"`);

    await this.client.connect();

    const result = await this.client.query(sql);

    await this.client.end();

    return result.rowsOfObjects();
  }
}

export class SqliteAdapter extends Database {
  async exec(sql) {
    const db = await SQLite.open(this.config.database);
    const results = db.query(sql);

    await SQLite.save(db);

    return results;
  }
}

Database.adapters = {
  postgres: PostgresAdapter,
  mysql: MysqlAdapter,
  sqlite: SqliteAdapter,
};

export default Database;
