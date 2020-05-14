export default class LoadError extends Error {
  constructor(url) {
    super(`Error loading "${url}"`);
  }
}
