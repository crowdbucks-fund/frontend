var isProduction = process.env.NODE_ENV === 'production';
var prefix = 'Invariant failed';
function invariant(condition: any, message: string | (() => string), cause?: any): asserts condition {
  if (condition) {
    return;
  }
  if (isProduction) {
    throw new Error(prefix, cause ? { cause } : undefined);
  }
  var provided = typeof message === 'function' ? message() : message;
  var value = provided ? "".concat(prefix, ": ").concat(provided) : prefix;
  throw new Error(value, cause ? { cause } : undefined);
}

export { invariant as default };
