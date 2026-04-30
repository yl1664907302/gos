import { lintWarning } from './utils';
function isConcatSelector(selector) {
  var _a;
  const notContent = ((_a = selector.match(/:not\(([^)]*)\)/)) === null || _a === void 0 ? void 0 : _a[1]) || '';
  // split selector. e.g.
  // `h1#a.b` => ['h1', #a', '.b']
  const splitCells = notContent.split(/(\[[^[]*])|(?=[.#])/).filter(str => str);
  return splitCells.length > 1;
}
function parsePath(info) {
  return info.parentSelectors.reduce((prev, cur) => {
    if (!prev) {
      return cur;
    }
    return cur.includes('&') ? cur.replace(/&/g, prev) : `${prev} ${cur}`;
  }, '');
}
const linter = (_key, _value, info) => {
  const parentSelectorPath = parsePath(info);
  const notList = parentSelectorPath.match(/:not\([^)]*\)/g) || [];
  if (notList.length > 0 && notList.some(isConcatSelector)) {
    lintWarning(`Concat ':not' selector not support in legacy browsers.`, info);
  }
};
export default linter;