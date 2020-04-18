import { Query } from "https://deno.land/x/sql_builder/mod.ts";

/**
 * Migration represents a single migration used when defining the
 * database schema. Migrations occur sequentially and the last known
 * version is stored in the DB so they won't be re-run.
 */
export default class Migration {
  constructor(name, version, client) {
    this.name = name;
    this.version = parseInt(version);
    this.query = new Query();
    this.execute = client.execute.bind(client);
  }

  /**
   * Build the query into SQL so it can be executed.
   */
  get sql() {
    return this.query.build();
  }

  /**
   * Query for the latest version from the database, and test whether
   * this version is higher than the one specified by the migration. If
   * so, this migration was already executed.
   */
  get executed() {
    const query = new Query();
    const rows = this.execute(
      query
        .table("schema_migrations")
        .select("version")
        .order("version", "asc")
        .limit(1),
    );
    const current = parseInt(rows[0].version);

    return current <= this.version;
  }

  /**
   * Run the specified action and execute the built SQL query
   * afterwards.
   */
  exec(direction) {
    if (this.executed) {
      return;
    }

    const action = this[direction];

    action(this.query);

    const value = this.execute(this.sql);
    const query = new Query();

    this.execute(
      query.table("schema_migrations").insert("version", this.version).build(),
    );

    return value;
  }
}
