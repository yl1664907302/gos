"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resultProps = exports.default = exports.IconMap = exports.ExceptionMap = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _CheckCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CheckCircleFilled"));
var _CloseCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseCircleFilled"));
var _ExclamationCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/ExclamationCircleFilled"));
var _WarningFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/WarningFilled"));
var _noFound = _interopRequireDefault(require("./noFound"));
var _serverError = _interopRequireDefault(require("./serverError"));
var _unauthorized = _interopRequireDefault(require("./unauthorized"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _style = _interopRequireDefault(require("./style"));
const IconMap = exports.IconMap = {
  success: _CheckCircleFilled.default,
  error: _CloseCircleFilled.default,
  info: _ExclamationCircleFilled.default,
  warning: _WarningFilled.default
};
const ExceptionMap = exports.ExceptionMap = {
  '404': _noFound.default,
  '500': _serverError.default,
  '403': _unauthorized.default
};
// ExceptionImageMap keys
const ExceptionStatus = Object.keys(ExceptionMap);
const resultProps = () => ({
  prefixCls: String,
  icon: _vueTypes.default.any,
  status: {
    type: [Number, String],
    default: 'info'
  },
  title: _vueTypes.default.any,
  subTitle: _vueTypes.default.any,
  extra: _vueTypes.default.any
});
exports.resultProps = resultProps;
const renderIcon = (prefixCls, _ref) => {
  let {
    status,
    icon
  } = _ref;
  if (ExceptionStatus.includes(`${status}`)) {
    const SVGComponent = ExceptionMap[status];
    return (0, _vue.createVNode)("div", {
      "class": `${prefixCls}-icon ${prefixCls}-image`
    }, [(0, _vue.createVNode)(SVGComponent, null, null)]);
  }
  const IconComponent = IconMap[status];
  const iconNode = icon || (0, _vue.createVNode)(IconComponent, null, null);
  return (0, _vue.createVNode)("div", {
    "class": `${prefixCls}-icon`
  }, [iconNode]);
};
const renderExtra = (prefixCls, extra) => extra && (0, _vue.createVNode)("div", {
  "class": `${prefixCls}-extra`
}, [extra]);
const Result = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AResult',
  inheritAttrs: false,
  props: resultProps(),
  slots: Object,
  setup(props, _ref2) {
    let {
      slots,
      attrs
    } = _ref2;
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)('result', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const className = (0, _vue.computed)(() => (0, _classNames.default)(prefixCls.value, hashId.value, `${prefixCls.value}-${props.status}`, {
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
    }));
    return () => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const title = (_a = props.title) !== null && _a !== void 0 ? _a : (_b = slots.title) === null || _b === void 0 ? void 0 : _b.call(slots);
      const subTitle = (_c = props.subTitle) !== null && _c !== void 0 ? _c : (_d = slots.subTitle) === null || _d === void 0 ? void 0 : _d.call(slots);
      const icon = (_e = props.icon) !== null && _e !== void 0 ? _e : (_f = slots.icon) === null || _f === void 0 ? void 0 : _f.call(slots);
      const extra = (_g = props.extra) !== null && _g !== void 0 ? _g : (_h = slots.extra) === null || _h === void 0 ? void 0 : _h.call(slots);
      const pre = prefixCls.value;
      return wrapSSR((0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": [className.value, attrs.class]
      }), [renderIcon(pre, {
        status: props.status,
        icon
      }), (0, _vue.createVNode)("div", {
        "class": `${pre}-title`
      }, [title]), subTitle && (0, _vue.createVNode)("div", {
        "class": `${pre}-subtitle`
      }, [subTitle]), renderExtra(pre, extra), slots.default && (0, _vue.createVNode)("div", {
        "class": `${pre}-content`
      }, [slots.default()])]));
    };
  }
});
/* add resource */
Result.PRESENTED_IMAGE_403 = ExceptionMap[403];
Result.PRESENTED_IMAGE_404 = ExceptionMap[404];
Result.PRESENTED_IMAGE_500 = ExceptionMap[500];
/* istanbul ignore next */
Result.install = function (app) {
  app.component(Result.name, Result);
  return app;
};
var _default = exports.default = Result;