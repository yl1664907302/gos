"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PureContent = PureContent;
exports.default = exports.TypeIcon = void 0;
exports.getCloseIcon = getCloseIcon;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _style = _interopRequireDefault(require("./style"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _Notice = _interopRequireDefault(require("../vc-notification/Notice"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _LoadingOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/LoadingOutlined"));
var _ExclamationCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/ExclamationCircleFilled"));
var _CloseCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseCircleFilled"));
var _CheckCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CheckCircleFilled"));
var _InfoCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/InfoCircleFilled"));
var _CloseOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseOutlined"));
var _util = require("../_util/util");
function getCloseIcon(prefixCls, closeIcon) {
  return closeIcon || (0, _vue.createVNode)("span", {
    "class": `${prefixCls}-close-x`
  }, [(0, _vue.createVNode)(_CloseOutlined.default, {
    "class": `${prefixCls}-close-icon`
  }, null)]);
}
const TypeIcon = exports.TypeIcon = {
  info: (0, _vue.createVNode)(_InfoCircleFilled.default, null, null),
  success: (0, _vue.createVNode)(_CheckCircleFilled.default, null, null),
  error: (0, _vue.createVNode)(_CloseCircleFilled.default, null, null),
  warning: (0, _vue.createVNode)(_ExclamationCircleFilled.default, null, null),
  loading: (0, _vue.createVNode)(_LoadingOutlined.default, null, null)
};
const typeToIcon = {
  success: _CheckCircleFilled.default,
  info: _InfoCircleFilled.default,
  error: _CloseCircleFilled.default,
  warning: _ExclamationCircleFilled.default
};
function PureContent(_ref) {
  let {
    prefixCls,
    icon,
    type,
    message,
    description,
    btn
  } = _ref;
  let iconNode = null;
  if (icon) {
    iconNode = (0, _vue.createVNode)("span", {
      "class": `${prefixCls}-icon`
    }, [(0, _util.renderHelper)(icon)]);
  } else if (type) {
    const Icon = typeToIcon[type];
    iconNode = (0, _vue.createVNode)(Icon, {
      "class": `${prefixCls}-icon ${prefixCls}-icon-${type}`
    }, null);
  }
  return (0, _vue.createVNode)("div", {
    "class": (0, _classNames.default)({
      [`${prefixCls}-with-icon`]: iconNode
    }),
    "role": "alert"
  }, [iconNode, (0, _vue.createVNode)("div", {
    "class": `${prefixCls}-message`
  }, [message]), (0, _vue.createVNode)("div", {
    "class": `${prefixCls}-description`
  }, [description]), btn && (0, _vue.createVNode)("div", {
    "class": `${prefixCls}-btn`
  }, [btn])]);
}
/** @private Internal Component. Do not use in your production. */
var _default = exports.default = (0, _vue.defineComponent)({
  name: 'PurePanel',
  inheritAttrs: false,
  props: ['prefixCls', 'icon', 'type', 'message', 'description', 'btn', 'closeIcon'],
  setup(props) {
    const {
      getPrefixCls
    } = (0, _useConfigInject.default)('notification', props);
    const prefixCls = (0, _vue.computed)(() => props.prefixCls || getPrefixCls('notification'));
    const noticePrefixCls = (0, _vue.computed)(() => `${prefixCls.value}-notice`);
    const [, hashId] = (0, _style.default)(prefixCls);
    return () => {
      return (0, _vue.createVNode)(_Notice.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
        "prefixCls": prefixCls.value,
        "class": (0, _classNames.default)(hashId.value, `${noticePrefixCls.value}-pure-panel`),
        "noticeKey": "pure",
        "duration": null,
        "closable": props.closable,
        "closeIcon": getCloseIcon(prefixCls.value, props.closeIcon)
      }), {
        default: () => [(0, _vue.createVNode)(PureContent, {
          "prefixCls": noticePrefixCls.value,
          "icon": props.icon,
          "type": props.type,
          "message": props.message,
          "description": props.description,
          "btn": props.btn
        }, null)]
      });
    };
  }
});