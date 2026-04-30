import _extends from "@babel/runtime/helpers/esm/extends";
import { provide, defineComponent, reactive, watch } from 'vue';
import { changeConfirmLocale } from '../modal/locale';
import warning from '../_util/warning';
import { withInstall } from '../_util/type';
export const ANT_MARK = 'internalMark';
const LocaleProvider = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ALocaleProvider',
  props: {
    locale: {
      type: Object
    },
    ANT_MARK__: String
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    warning(props.ANT_MARK__ === ANT_MARK, 'LocaleProvider', '`LocaleProvider` is deprecated. Please use `locale` with `ConfigProvider` instead');
    const state = reactive({
      antLocale: _extends(_extends({}, props.locale), {
        exist: true
      }),
      ANT_MARK__: ANT_MARK
    });
    provide('localeData', state);
    watch(() => props.locale, locale => {
      changeConfirmLocale(locale && locale.Modal);
      state.antLocale = _extends(_extends({}, locale), {
        exist: true
      });
    }, {
      immediate: true
    });
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
/* istanbul ignore next */
LocaleProvider.install = function (app) {
  app.component(LocaleProvider.name, LocaleProvider);
  return app;
};
export default withInstall(LocaleProvider);