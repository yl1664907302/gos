import { inject, provide, ref } from 'vue';
var contextKey = Symbol('iconContext');
export var useProvideIconContext = function useProvideIconContext(props) {
  provide(contextKey, props);
  return props;
};
export var useInjectIconContext = function useInjectIconContext() {
  return inject(contextKey, {
    prefixCls: ref('anticon'),
    rootClassName: ref(''),
    csp: ref()
  });
};