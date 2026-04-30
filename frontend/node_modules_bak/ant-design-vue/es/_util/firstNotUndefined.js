function firstNotUndefined() {
  let arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  for (let i = 0, len = arr.length; i < len; i++) {
    if (arr[i] !== undefined) {
      return arr[i];
    }
  }
  return undefined;
}
export default firstNotUndefined;