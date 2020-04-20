import Adapter from "./adapter.js";
import { connect } from "https://denopkg.com/keroxp/deno-redis/mod.ts";

class Cache extends Adapter {
  constructor(config = {}, log) {
    super(config);
    this.log = log;
    this.config = config;
    this.keys = [];
    this.initialize();
    this.contains = this.keys.contains.bind(this.keys);
  }

  get httpEnabled() {
    return this.config.enabled && this.config.http.enabled;
  }

  /**
   * Fragment caching
   */
  fetch(key, options = {}, fresh) {
    if (this.contains(key)) {
      this.log.info(`Reading "${key}" from cache`);
      return this.readFromCache(key, (options = {}));
    } else {
      this.log.info(`Writing new cache entry for "${key}"`);
      return this.writeToCache(key, options, fresh());
    }
  }

  /**
   * HTTP caching
   */
  http(url, freshen, context, send) {
    const {
      http: { expires },
    } = this.config;
    const etag = context.response.headers.get("ETag");
    const json = this.fetch(`${url}|${etag}`, { expires }, () => {
      freshen();

      const status = context.response.status;
      const body = context.response.body;
      let headers = {};

      context.response.headers.forEach((v, h) => (headers[h] = v));

      return JSON.stringify({ status, headers, body });
    });

    send(JSON.parse(json));
  }

  readFromCache(key, options = {}) {
    return this.read(key, options);
  }

  // Define this in the adapter
  read() {}

  writeToCache(key, value, options = {}) {
    if (!this.contains(key)) {
      this.keys.push(key);
    }
    return this.write(key, value, options);
  }

  // Define this in the adapter
  write() {}
}

export class RedisCache extends Cache {
  async initialize() {
    const { hostname, port } = this.config;
    this.client = await connect({ hostname, port });
  }

  async read(key) {
    const value = await this.client.get(key);

    return value;
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

export class MemoryCache extends Cache {
  initialize() {
    this.data = {};
  }

  read(key) {
    return this.data[key].value;
  }

  write(key, value, { expires }) {
    const added = new Date();
    this.data[key] = { value, expires, added };

    return value;
  }

  contains(key) {
    const entry = this.data[key];

    return entry && entry.added <= entry.expires;
  }
}

Cache.adapters = {
  redis: RedisCache,
  memory: MemoryCache,
};

export default Cache;
