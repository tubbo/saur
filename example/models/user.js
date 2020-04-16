import Model, { validates } from "https://deno.land/x/saur/model.js"

@validates("name", { presence: true })
export default class User extends Model {
  static table = "users"
}
