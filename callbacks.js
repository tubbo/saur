/**
 * @example
 *   @before("valid");
 *   generateSlug() {
 *     this.slug = paramCase(this.name);
 *   }
 * @param method
 */
export function before(...methods) {
  return (target, key, descriptor) => {
    methods.forEach((method) => {
      const original = target[method];
      const callback = descriptor.value;
      const value = () => {
        callback();
        return original();
      };

      target.defineProperty(method, { value });
    });
  };
}

/**
 * @example
 *   @after("save");
 *   deliverConfirmationEmail() {
 *     UserMailer.deliver("confirmation", { user: this })
 *   }
 * @param method
 */
export function after(...methods) {
  return (target, key, descriptor) => {
    methods.forEach((method) => {
      const original = target[method];
      const callback = descriptor.value;
      const value = () => {
        const rv = original();

        callback(rv);

        return rv;
      };

      target.defineProperty(method, { value });
    });
  };
}

/**
 * @example
 *   @around("update");
 *   lock(update) {
 *     this.locked = true;
 *     const rv = update();
 *     this.locked = false;
 *
 *     return rv;
 *   }
 * @param method
 */
export function around(...methods) {
  return (target, key, descriptor) => {
    methods.forEach((method) => {
      const original = target[method];
      const callback = descriptor.value;
      const value = () => callback(original);

      target.defineProperty(method, { value });
    });
  };
}

/**
 * Callbacks can be used on any object
 */
export default { before, after, around };
