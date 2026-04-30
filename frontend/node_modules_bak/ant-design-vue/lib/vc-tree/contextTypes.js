"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProvideKeysState = exports.useInjectTreeContext = exports.useInjectKeysState = exports.TreeContext = void 0;
var _vue = require("vue");
/**
 * Webpack has bug for import loop, which is not the same behavior as ES module.
 * When util.js imports the TreeNode for tree generate will cause treeContextTypes be empty.
 */

const TreeContextKey = Symbol('TreeContextKey');
const TreeContext = exports.TreeContext = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'TreeContext',
  props: {
    value: {
      type: Object
    }
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    (0, _vue.provide)(TreeContextKey, (0, _vue.computed)(() => props.value));
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
const useInjectTreeContext = () => {
  return (0, _vue.inject)(TreeContextKey, (0, _vue.computed)(() => ({})));
};
exports.useInjectTreeContext = useInjectTreeContext;
const KeysStateKey = Symbol('KeysStateKey');
const useProvideKeysState = state => {
  (0, _vue.provide)(KeysStateKey, state);
};
exports.useProvideKeysState = useProvideKeysState;
const useInjectKeysState = () => {
  return (0, _vue.inject)(KeysStateKey, {
    expandedKeys: (0, _vue.shallowRef)([]),
    selectedKeys: (0, _vue.shallowRef)([]),
    loadedKeys: (0, _vue.shallowRef)([]),
    loadingKeys: (0, _vue.shallowRef)([]),
    checkedKeys: (0, _vue.shallowRef)([]),
    halfCheckedKeys: (0, _vue.shallowRef)([]),
    expandedKeysSet: (0, _vue.computed)(() => new Set()),
    selectedKeysSet: (0, _vue.computed)(() => new Set()),
    loadedKeysSet: (0, _vue.computed)(() => new Set()),
    loadingKeysSet: (0, _vue.computed)(() => new Set()),
    checkedKeysSet: (0, _vue.computed)(() => new Set()),
    halfCheckedKeysSet: (0, _vue.computed)(() => new Set()),
    flattenNodes: (0, _vue.shallowRef)([])
  });
};
exports.useInjectKeysState = useInjectKeysState;