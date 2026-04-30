import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { computed, defineComponent } from 'vue';
import { useConfigContextInject } from '../../config-provider/context';
import { useLocaleReceiver } from '../../locale-provider/LocaleReceiver';
import defaultLocale from '../../locale/en_US';
import ConfirmDialog from '../ConfirmDialog';
import initDefaultProps from '../../_util/props-util/initDefaultProps';
const comfirmFuncProps = () => ({
  config: Object,
  afterClose: Function,
  destroyAction: Function,
  open: Boolean
});
export default defineComponent({
  name: 'HookModal',
  inheritAttrs: false,
  props: initDefaultProps(comfirmFuncProps(), {
    config: {
      width: 520,
      okType: 'primary'
    }
  }),
  setup(props, _ref) {
    let {
      expose
    } = _ref;
    var _a;
    const open = computed(() => props.open);
    const innerConfig = computed(() => props.config);
    const {
      direction,
      getPrefixCls
    } = useConfigContextInject();
    const prefixCls = getPrefixCls('modal');
    const rootPrefixCls = getPrefixCls();
    const afterClose = () => {
      var _a, _b;
      props === null || props === void 0 ? void 0 : props.afterClose();
      (_b = (_a = innerConfig.value).afterClose) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    const close = function () {
      props.destroyAction(...arguments);
    };
    expose({
      destroy: close
    });
    const mergedOkCancel = (_a = innerConfig.value.okCancel) !== null && _a !== void 0 ? _a : innerConfig.value.type === 'confirm';
    const [contextLocale] = useLocaleReceiver('Modal', defaultLocale.Modal);
    return () => _createVNode(ConfirmDialog, _objectSpread(_objectSpread({
      "prefixCls": prefixCls,
      "rootPrefixCls": rootPrefixCls
    }, innerConfig.value), {}, {
      "close": close,
      "open": open.value,
      "afterClose": afterClose,
      "okText": innerConfig.value.okText || (mergedOkCancel ? contextLocale === null || contextLocale === void 0 ? void 0 : contextLocale.value.okText : contextLocale === null || contextLocale === void 0 ? void 0 : contextLocale.value.justOkText),
      "direction": innerConfig.value.direction || direction.value,
      "cancelText": innerConfig.value.cancelText || (contextLocale === null || contextLocale === void 0 ? void 0 : contextLocale.value.cancelText)
    }), null);
  }
});