"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TypeIcon = exports.PureContent = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _Notice = _interopRequireDefault(require("../vc-notification/Notice"));
var _style = _interopRequireDefault(require("./style"));
var _LoadingOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/LoadingOutlined"));
var _ExclamationCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/ExclamationCircleFilled"));
var _CloseCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseCircleFilled"));
var _CheckCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CheckCircleFilled"));
var _InfoCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/InfoCircleFilled"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _context = require("../config-provider/context");
const TypeIcon = exports.TypeIcon = {
  info: (0, _vue.createVNode)(_InfoCircleFilled.default, null, null),
  success: (0, _vue.createVNode)(_CheckCircleFilled.default, null, null),
  error: (0, _vue.createVNode)(_CloseCircleFilled.default, null, null),
  warning: (0, _vue.createVNode)(_ExclamationCircleFilled.default, null, null),
  loading: (0, _vue.createVNode)(_LoadingOutlined.default, null, null)
};
const PureContent = exports.PureContent = (0, _vue.defineComponent)({
  name: 'PureContent',
  inheritAttrs: false,
  props: ['prefixCls', 'type', 'icon'],
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    return () => {
      var _a;
      return (0, _vue.createVNode)("div", {
        "class": (0, _classNames.default)(`${props.prefixCls}-custom-content`, `${props.prefixCls}-${props.type}`)
      }, [props.icon || TypeIcon[props.type], (0, _vue.createVNode)("span", null, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)])]);
    };
  }
});
/** @private Internal Component. Do not use in your production. */
var _default = exports.default = (0, _vue.defineComponent)({
  name: 'PurePanel',
  inheritAttrs: false,
  props: ['prefixCls', 'class', 'type', 'icon', 'content'],
  setup(props, _ref2) {
    let {
      slots,
      attrs
    } = _ref2;
    var _a;
    const {
      getPrefixCls
    } = (0, _context.useConfigContextInject)();
    const prefixCls = (0, _vue.computed)(() => props.prefixCls || getPrefixCls('message'));
    const [, hashId] = (0, _style.default)(prefixCls);
    return (0, _vue.createVNode)(_Notice.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
      "prefixCls": prefixCls.value,
      "class": (0, _classNames.default)(hashId.value, `${prefixCls.value}-notice-pure-panel`),
      "noticeKey": "pure",
      "duration": null
    }), {
      default: () => [(0, _vue.createVNode)(PureContent, {
        "prefixCls": prefixCls.value,
        "type": props.type,
        "icon": props.icon
      }, {
        default: () => [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]
      })]
    });
  }
});