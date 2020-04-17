import { connect } from "https://denopkg.com/keroxp/deno-redis/mod.ts";

export class Adapter {
  constructor(config={}) {
    this.config = config
    this.initialize()
  }

  fetch(key, options={}, fresh) {
    if (this.exists(key, options={})) {
      return this.read(key, options={})
    } else {
      return this.write(key, options, fresh())
    }
  }

  read(key) { return true }
  write(key, value, options={}) { return value }
}

export class Redis extends Adapter {
  async initialize() {
    const { hostname, port } = this.config
    this.client = await connect({ hostname, port })
  }

  async read(key) {
    return await this.client.get(key)
  }

  async write(key, value, { expire=null }) {
    if (expire) {
      await this.client.setex(key, expire, value)
    } else {
      await this.client.set(key, value)
    }

    return value
  }
}

export class Memory extends Adapter {
  initialize() {
    this.data = {}
  }

  read(key) {
    return this.data[key]
  }

  write(key, value) {
    this.data[key] = value

    return value
  }
}

export const ADAPTERS = {
  redis: Redis,
  memory: Memory
}

export default { ADAPTERS }
