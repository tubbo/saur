import Builder from "https://deno.land/x/sql_builder/mod.ts";

export default class Query extends Builder.Query {
  constructor(model) {
    super()
    this.model = model
    this.table(this.model.table)
  }

  get sql() {
    return this.build()
  }

  run() {
    const rows = App.db.exec(this.sql)

    return rows.map(row => new this.model(row))
  }

  get first() {
    const records = this.run()

    return records[0]
  }

  get last() {
    const records = this.run()

    return records[records.length]
  }

  get length() {
    return this.run().length
  }

  forEach(iterator) {
    const records = this.run()

    return records.forEach(iterator)
  }

  map(iterator) {
    const records = this.run()

    return records.map(iterator)
  }

  reduce(iterator, memo) {
    const records = this.run()

    return records.reduce(iterator, memo)
  }

  filter(iterator) {
    const records = this.run()

    return records.filter(iterator)
  }

  contains(record) {
    return this.map(record => record.id).contains(record.id)
  }
}
