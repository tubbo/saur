import Migration from "../../model/migration.js";

export default class CreateUsers extends Migration {
  up(db) {
    db.table("users").create({
      name: "string",
      password: "string",
    });
  }
}
