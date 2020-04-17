import { connect } from "https://denopkg.com/keroxp/deno-redis/mod.ts";

export class Adapter {
  constructor(config = {}) {
    this.config = config;
    this.keys = [];
    this.initialize();
    this.contains = this.keys.contains.bind(this.keys)
  }

  get httpEnabled() {
    return this.config.enabled && this.config.http.enabled
  }

  /**
   * Fragment caching
   */
  fetch(key, options = {}, fresh) {
    if (this.contains(key)) {
      return this.readFromCache(key, options = {});
    } else {
      return this.writeToCache(key, options, fresh());
    }
  }

  /**
   * HTTP caching
   */
  http(url, freshen, context, send) {
    const { http: { expires } } = this.config
    const etag = context.response.headers.get("ETag")
    const json = this.fetch(`${url}|${etag}`, { expires }, () => {
      freshen()

      const status = context.response.status
      const body = context.response.body
      let headers = {}

      context.response.headers.forEach((v, h) => headers[h] = v)

      return JSON.stringify({ status, headers, body })
    })

    send(JSON.parse(json))
  }

  readFromCache(key, options = {}) {
    return this.read(key, value, options = {});
  }

  // Define this in the adapter
  read(...args) {}

  writeToCache(key, value, options = {}) {
    if (!this.contains(key)) {
      this.keys.push(key)
    }
    return this.write(key, value, options = {});
  }

  // Define this in the adapter
  write(...args) {}
}

export class Redis extends Adapter {
  async initialize() {
    const { hostname, port } = this.config;
    this.client = await connect({ hostname, port });
  }

  async read(key) {
    return await this.client.get(key);
  }

  async write(key, value, { expire = null }) {
    if (expire) {
      await this.client.setex(key, expire, value);
    } else {
      await this.client.set(key, value);
    }

    return value;
  }
}

export class Memory extends Adapter {
  initialize() {
    this.data = {};
  }

  read(key) {
    return this.data[key];
  }

  write(key, value) {
    this.data[key] = value;

    return value;
  }
}

export const ADAPTERS = {
  redis: Redis,
  memory: Memory,
};

export default { ADAPTERS };
