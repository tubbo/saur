import Asset from "./loader/asset.js";
// import LoadError from "./loader/error.js";

const { readFile } = Deno;

/**
 * Loads files from arbitrary locations, typically a URL, and caches
 * them similarly to how Deno caches locally imported JavaScript files.
 * The Loader object attempts to extend this functionality to everything
 * in Saur, especially in the CLI, allowing template files and static
 * assets to be required into the project without needing to have a copy
 * of the source code locally.
 */
export default class Loader {
  constructor(options = {}) {
    this.Processor = options.processor;
    this.reader = options.reader || readFile;
    this.base = options.base;
  }

  process(body) {
    const { Processor } = this;

    if (!Processor) {
      return body;
    }

    const processor = new Processor(body);

    return processor.process();
  }

  async require(path, caching = true) {
    const asset = new Asset(path, this.base);

    if (asset.local) {
      const file = await this.reader(path);

      return file;
    }

    if (caching && asset.cached) {
      return asset.body();
    }

    const response = await fetch(asset.url);
    const body = await response.text();

    asset.cache({ body });

    return body;
  }
}
