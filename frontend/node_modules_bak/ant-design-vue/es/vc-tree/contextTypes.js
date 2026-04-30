/**
 * Webpack has bug for import loop, which is not the same behavior as ES module.
 * When util.js imports the TreeNode for tree generate will cause treeContextTypes be empty.
 */
import { shallowRef, inject, computed, defineComponent, provide } from 'vue';
const TreeContextKey = Symbol('TreeContextKey');
export const TreeContext = defineComponent({
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
    provide(TreeContextKey, computed(() => props.value));
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
export const useInjectTreeContext = () => {
  return inject(TreeContextKey, computed(() => ({})));
};
const KeysStateKey = Symbol('KeysStateKey');
export const useProvideKeysState = state => {
  provide(KeysStateKey, state);
};
export const useInjectKeysState = () => {
  return inject(KeysStateKey, {
    expandedKeys: shallowRef([]),
    selectedKeys: shallowRef([]),
    loadedKeys: shallowRef([]),
    loadingKeys: shallowRef([]),
    checkedKeys: shallowRef([]),
    halfCheckedKeys: shallowRef([]),
    expandedKeysSet: computed(() => new Set()),
    selectedKeysSet: computed(() => new Set()),
    loadedKeysSet: computed(() => new Set()),
    loadingKeysSet: computed(() => new Set()),
    checkedKeysSet: computed(() => new Set()),
    halfCheckedKeysSet: computed(() => new Set()),
    flattenNodes: shallowRef([])
  });
};