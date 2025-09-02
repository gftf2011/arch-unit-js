export function Service() {
  return function (target) {
    Object.defineProperty(target.prototype, '__service__', { value: true, enumerable: false });
  };
}
