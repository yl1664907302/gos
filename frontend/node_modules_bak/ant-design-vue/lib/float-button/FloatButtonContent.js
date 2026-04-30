"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _FileTextOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/FileTextOutlined"));
var _interface = require("./interface");
var _propsUtil = require("../_util/props-util");
const FloatButtonContent = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AFloatButtonContent',
  inheritAttrs: false,
  props: (0, _interface.floatButtonContentProps)(),
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    return () => {
      var _a;
      const {
        prefixCls
      } = props;
      const description = (0, _propsUtil.filterEmpty)((_a = slots.description) === null || _a === void 0 ? void 0 : _a.call(slots));
      return (0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": [attrs.class, `${prefixCls}-content`]
      }), [slots.icon || description.length ? (0, _vue.createVNode)(_vue.Fragment, null, [slots.icon && (0, _vue.createVNode)("div", {
        "class": `${prefixCls}-icon`
      }, [slots.icon()]), description.length ? (0, _vue.createVNode)("div", {
        "class": `${prefixCls}-description`
      }, [description]) : null]) : (0, _vue.createVNode)("div", {
        "class": `${prefixCls}-icon`
      }, [(0, _vue.createVNode)(_FileTextOutlined.default, null, null)])]);
    };
  }
});
var _default = exports.default = FloatButtonContent;