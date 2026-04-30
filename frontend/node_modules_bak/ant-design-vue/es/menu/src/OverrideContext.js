import { provide, computed, inject } from 'vue';
export const OverrideContextKey = Symbol('OverrideContextKey');
export const useInjectOverride = () => {
  return inject(OverrideContextKey, undefined);
};
export const useProvideOverride = props => {
  var _a, _b, _c;
  const {
    prefixCls,
    mode,
    selectable,
    validator,
    onClick,
    expandIcon
  } = useInjectOverride() || {};
  provide(OverrideContextKey, {
    prefixCls: computed(() => {
      var _a, _b;
      return (_b = (_a = props.prefixCls) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : prefixCls === null || prefixCls === void 0 ? void 0 : prefixCls.value;
    }),
    mode: computed(() => {
      var _a, _b;
      return (_b = (_a = props.mode) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : mode === null || mode === void 0 ? void 0 : mode.value;
    }),
    selectable: computed(() => {
      var _a, _b;
      return (_b = (_a = props.selectable) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : selectable === null || selectable === void 0 ? void 0 : selectable.value;
    }),
    validator: (_a = props.validator) !== null && _a !== void 0 ? _a : validator,
    onClick: (_b = props.onClick) !== null && _b !== void 0 ? _b : onClick,
    expandIcon: (_c = props.expandIcon) !== null && _c !== void 0 ? _c : expandIcon === null || expandIcon === void 0 ? void 0 : expandIcon.value
  });
};