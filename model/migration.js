import { Query } from "https://deno.land/x/sql_builder/mod.ts";

/**
 * Migration represents a single migration used when defining the
 * database schema. Migrations occur sequentially and the last known
 * version is stored in the DB so they won't be re-run.
 */
export default class Migration {
  constructor(name, version, app) {
    this.name = name;
    this.version = parseInt(version);
    this.query = new Query();
    this.execute = app.db.exec.bind(app.db);
  }

  /**
   * Build the query into SQL so it can be executed.
   */
  get sql() {
    return this.query.build();
  }

  get latestVersion() {
    const query = new Query();

    query
      .table("schema_migrations")
      .select("version")
      .limit(1, 1)
      .order("version", "desc")
      .build();

    return query;
  }

  get appendVersions() {
    const query = new Query();

    query.table("schema_migrations").insert("version", this.version).build();

    return query;
  }

  /**
   * Query for the latest version from the database, and test whether
   * this version is higher than the one specified by the migration. If
   * so, this migration was already executed.
   */
  async executed() {
    const rows = await this.execute(this.latestVersion);
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

    this.execute(this.appendVersions);

    return value;
  }
}
