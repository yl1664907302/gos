import { resolveUnref } from './resolveUnref';
/**
 * Get the dom element of a ref of element or Vue component instance
 *
 * @param elRef
 */
export function unrefElement(elRef) {
  var _a;
  const plain = resolveUnref(elRef);
  return (_a = plain === null || plain === void 0 ? void 0 : plain.$el) !== null && _a !== void 0 ? _a : plain;
}