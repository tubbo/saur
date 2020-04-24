import Adapter from "./adapter.js";
import { connect } from "https://denopkg.com/keroxp/deno-redis/mod.ts";

/**
 * Cache is the base class for app/http cache adapters. It provides
 * methods for accessing the cache both for external users and
 * subclasses, as well as the typical `Adapter` functionality: A
 * standard API for configuring and connecting to the backend cache
 * store.
 */
class Cache extends Adapter {
  constructor(config = {}, log) {
    super(config);
    this.log = log;
    this.config = config;
    this.keys = new Set();
    this.initialize();
  }

  /**
   * Executed after instantiation for subclassing adapters which need to
   * connect to a client or set up configuration.
   */
  initialize() {}

  /**
   * Check the set for the given key. This can be overridden in the
   * cache store to actually make a DB query if that's more accurate.
   *
   * @return boolean
   */
  includes(key) {
    return this.keys.has(key);
  }

  /**
   * Determine whether HTTP caching is enabled.
   *
   * @return boolean
   */
  get httpEnabled() {
    return this.config.enabled && this.config.http.enabled;
  }

  /**
   * Cache Upsertion. This method first checks if the given `key` is
   * available in the cache (since it's the cache store's
   * responsibility to expire keys in the cache when needed), and if so,
   * reads the item from the cache and returns it. Otherwise, it calls
   * the provided `fresh()` function to write data to the cache.
   *
   * @return string
   */
  fetch(key, options = {}, fresh) {
    if (this.includes(key)) {
      this.log.info(`Reading "${key}" from cache`);
      return this.read(key, (options = {}));
    } else {
      this.log.info(`Writing new cache entry for "${key}"`);
      this.keys.add(key);
      return this.write(key, options, fresh());
    }
  }

  /**
   * HTTP Caching. Runs `this.fetch()` on a key as determined by the URL
   * and ETag of the given request. The fetch method will determine if
   * this cache needs to be freshened. It calls a function with 3 data
   * points: `status`, `headers`, and `body`, and that function is used
   * in the middleware to determine the response. This allows the
   * middleware to handle the actual HTTP logic, while this method is
   * entirely devoted to manipulating the cache storage.
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

  /**
   * This method should be overridden in the adapter to pull data out of
   * the cache. It takes a `key` and an `options` hash.
   *
   * @return string
   */
  read() {}

  /**
   * This method should be overridden in the adapter to write data into
   * the cache. It takes a `key`, `value`, and an `options` hash which
   * typically includes the `expires` property. The value is then
   * returned back to the user to keep a consistent API with `read()`.
   *
   * @return string
   */
  write() {}
}

/**
 * Cache store for Redis, connnecting to the server specified by the
 * `hostname` and `port` options in your app configuration.
 */
export class RedisCache extends Cache {
  async initialize() {
    const { hostname, port } = this.config;
    this.client = await connect({ hostname, port });
  }

  /**
   * Read a key from the Redis cache.
   *
   * @return string
   */
  async read(key) {
    const value = await this.client.get(key);

    return value;
  }

  /**
   * Use setex() when an expire key is given, otherwise store it
   * permanently with set().
   *
   * @return string
   */
  async write(key, value, { expire = null }) {
    if (expire) {
      await this.client.setex(key, expire, value);
    } else {
      await this.client.set(key, value);
    }

    return value;
  }
}

/**
 * An in-memory cache store used for testing and development. Data is
 * stored in the heap of the program in Deno, and flushed after the
 * server shuts down.
 */
export class MemoryCache extends Cache {
  initialize() {
    this.data = {};
  }

  read(key) {
    return this.data[key].value;
  }

  write(key, value, { expire = null }) {
    this.data[key] = { value, expire };

    return value;
  }

  /**
   * Check if a given key exists in the `data` hash. If so, also check
   * whether the current time is past the `expire` time set on the
   * entry, if the key was set to expire at any point.
   */
  includes(key) {
    const entry = this.data[key];
    const now = new Date();

    if (!entry) {
      return false;
    }

    if (entry.expire === null) {
      return true;
    }

    return now <= entry.expire;
  }
}

Cache.adapters = {
  redis: RedisCache,
  memory: MemoryCache,
};

export default Cache;
