import Migration from "https://deno.land/x/saur/model/migration.js";

export default class CreateUsers extends Migration {
  up(db) {
    db.table("users").create({
      name: { type: "string", index: true },
      password: "string",
    });
  }

  down(db) {
    db.table("users").drop();
  }
}
