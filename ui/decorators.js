export function element(selector) {
  return (target) => (target.selector = selector);
}

export function on(event) {
  return (target, method, descriptor) => {
    target.events[event] = target.events[event] || [];
    target.events[event].push(method);

    return descriptor;
  };
}
