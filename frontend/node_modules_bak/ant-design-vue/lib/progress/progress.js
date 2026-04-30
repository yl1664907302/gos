"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _initDefaultProps = _interopRequireDefault(require("../_util/props-util/initDefaultProps"));
var _CloseOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseOutlined"));
var _CheckOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CheckOutlined"));
var _CheckCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CheckCircleFilled"));
var _CloseCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseCircleFilled"));
var _Line = _interopRequireDefault(require("./Line"));
var _Circle = _interopRequireDefault(require("./Circle"));
var _Steps = _interopRequireDefault(require("./Steps"));
var _utils = require("./utils");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _devWarning = _interopRequireDefault(require("../vc-util/devWarning"));
var _props = require("./props");
var _style = _interopRequireDefault(require("./style"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AProgress',
  inheritAttrs: false,
  props: (0, _initDefaultProps.default)((0, _props.progressProps)(), {
    type: 'line',
    percent: 0,
    showInfo: true,
    // null for different theme definition
    trailColor: null,
    size: 'default',
    strokeLinecap: 'round'
  }),
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)('progress', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    if (process.env.NODE_ENV !== 'production') {
      (0, _devWarning.default)('successPercent' in props, 'Progress', '`successPercent` is deprecated. Please use `success.percent` instead.');
      (0, _devWarning.default)('width' in props, 'Progress', '`width` is deprecated. Please use `size` instead.');
    }
    const strokeColorNotArray = (0, _vue.computed)(() => Array.isArray(props.strokeColor) ? props.strokeColor[0] : props.strokeColor);
    const percentNumber = (0, _vue.computed)(() => {
      const {
        percent = 0
      } = props;
      const successPercent = (0, _utils.getSuccessPercent)(props);
      return parseInt(successPercent !== undefined ? successPercent.toString() : percent.toString(), 10);
    });
    const progressStatus = (0, _vue.computed)(() => {
      const {
        status
      } = props;
      if (!_props.progressStatuses.includes(status) && percentNumber.value >= 100) {
        return 'success';
      }
      return status || 'normal';
    });
    const classString = (0, _vue.computed)(() => {
      const {
        type,
        showInfo,
        size
      } = props;
      const pre = prefixCls.value;
      return {
        [pre]: true,
        [`${pre}-inline-circle`]: type === 'circle' && (0, _utils.getSize)(size, 'circle').width <= 20,
        [`${pre}-${type === 'dashboard' && 'circle' || type}`]: true,
        [`${pre}-status-${progressStatus.value}`]: true,
        [`${pre}-show-info`]: showInfo,
        [`${pre}-${size}`]: size,
        [`${pre}-rtl`]: direction.value === 'rtl',
        [hashId.value]: true
      };
    });
    const strokeColorNotGradient = (0, _vue.computed)(() => typeof props.strokeColor === 'string' || Array.isArray(props.strokeColor) ? props.strokeColor : undefined);
    const renderProcessInfo = () => {
      const {
        showInfo,
        format,
        type,
        percent,
        title
      } = props;
      const successPercent = (0, _utils.getSuccessPercent)(props);
      if (!showInfo) return null;
      let text;
      const textFormatter = format || (slots === null || slots === void 0 ? void 0 : slots.format) || (val => `${val}%`);
      const isLineType = type === 'line';
      if (format || (slots === null || slots === void 0 ? void 0 : slots.format) || progressStatus.value !== 'exception' && progressStatus.value !== 'success') {
        text = textFormatter((0, _utils.validProgress)(percent), (0, _utils.validProgress)(successPercent));
      } else if (progressStatus.value === 'exception') {
        text = isLineType ? (0, _vue.createVNode)(_CloseCircleFilled.default, null, null) : (0, _vue.createVNode)(_CloseOutlined.default, null, null);
      } else if (progressStatus.value === 'success') {
        text = isLineType ? (0, _vue.createVNode)(_CheckCircleFilled.default, null, null) : (0, _vue.createVNode)(_CheckOutlined.default, null, null);
      }
      return (0, _vue.createVNode)("span", {
        "class": `${prefixCls.value}-text`,
        "title": title === undefined && typeof text === 'string' ? text : undefined
      }, [text]);
    };
    return () => {
      const {
        type,
        steps,
        title
      } = props;
      const {
          class: cls
        } = attrs,
        restAttrs = __rest(attrs, ["class"]);
      const progressInfo = renderProcessInfo();
      let progress;
      // Render progress shape
      if (type === 'line') {
        progress = steps ? (0, _vue.createVNode)(_Steps.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
          "strokeColor": strokeColorNotGradient.value,
          "prefixCls": prefixCls.value,
          "steps": steps
        }), {
          default: () => [progressInfo]
        }) : (0, _vue.createVNode)(_Line.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
          "strokeColor": strokeColorNotArray.value,
          "prefixCls": prefixCls.value,
          "direction": direction.value
        }), {
          default: () => [progressInfo]
        });
      } else if (type === 'circle' || type === 'dashboard') {
        progress = (0, _vue.createVNode)(_Circle.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
          "prefixCls": prefixCls.value,
          "strokeColor": strokeColorNotArray.value,
          "progressStatus": progressStatus.value
        }), {
          default: () => [progressInfo]
        });
      }
      return wrapSSR((0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({
        "role": "progressbar"
      }, restAttrs), {}, {
        "class": [classString.value, cls],
        "title": title
      }), [progress]));
    };
  }
});