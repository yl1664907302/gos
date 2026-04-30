function createRef() {
  const func = node => {
    func.current = node;
  };
  return func;
}
export function fillRef(ref, node) {
  if (typeof ref === 'function') {
    ref(node);
  } else if (typeof ref === 'object' && ref && 'current' in ref) {
    ref.current = node;
  }
}
/**
 * Merge refs into one ref function to support ref passing.
 */
export function composeRef() {
  for (var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++) {
    refs[_key] = arguments[_key];
  }
  return node => {
    refs.forEach(ref => {
      fillRef(ref, node);
    });
  };
}
export default createRef;