"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _context = require("../../config-provider/context");
var _LocaleReceiver = require("../../locale-provider/LocaleReceiver");
var _en_US = _interopRequireDefault(require("../../locale/en_US"));
var _ConfirmDialog = _interopRequireDefault(require("../ConfirmDialog"));
var _initDefaultProps = _interopRequireDefault(require("../../_util/props-util/initDefaultProps"));
const comfirmFuncProps = () => ({
  config: Object,
  afterClose: Function,
  destroyAction: Function,
  open: Boolean
});
var _default = exports.default = (0, _vue.defineComponent)({
  name: 'HookModal',
  inheritAttrs: false,
  props: (0, _initDefaultProps.default)(comfirmFuncProps(), {
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
    const open = (0, _vue.computed)(() => props.open);
    const innerConfig = (0, _vue.computed)(() => props.config);
    const {
      direction,
      getPrefixCls
    } = (0, _context.useConfigContextInject)();
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
    const [contextLocale] = (0, _LocaleReceiver.useLocaleReceiver)('Modal', _en_US.default.Modal);
    return () => (0, _vue.createVNode)(_ConfirmDialog.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({
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