"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _LoadingOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/LoadingOutlined"));
const getCollapsedWidth = node => {
  if (node) {
    node.style.width = '0px';
    node.style.opacity = '0';
    node.style.transform = 'scale(0)';
  }
};
const getRealWidth = node => {
  (0, _vue.nextTick)(() => {
    if (node) {
      node.style.width = `${node.scrollWidth}px`;
      node.style.opacity = '1';
      node.style.transform = 'scale(1)';
    }
  });
};
const resetStyle = node => {
  if (node && node.style) {
    node.style.width = null;
    node.style.opacity = null;
    node.style.transform = null;
  }
};
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'LoadingIcon',
  props: {
    prefixCls: String,
    loading: [Boolean, Object],
    existIcon: Boolean
  },
  setup(props) {
    return () => {
      const {
        existIcon,
        prefixCls,
        loading
      } = props;
      if (existIcon) {
        return (0, _vue.createVNode)("span", {
          "class": `${prefixCls}-loading-icon`
        }, [(0, _vue.createVNode)(_LoadingOutlined.default, null, null)]);
      }
      const visible = !!loading;
      return (0, _vue.createVNode)(_vue.Transition, {
        "name": `${prefixCls}-loading-icon-motion`,
        "onBeforeEnter": getCollapsedWidth,
        "onEnter": getRealWidth,
        "onAfterEnter": resetStyle,
        "onBeforeLeave": getRealWidth,
        "onLeave": node => {
          setTimeout(() => {
            getCollapsedWidth(node);
          });
        },
        "onAfterLeave": resetStyle
      }, {
        default: () => [visible ? (0, _vue.createVNode)("span", {
          "class": `${prefixCls}-loading-icon`
        }, [(0, _vue.createVNode)(_LoadingOutlined.default, null, null)]) : null]
      });
    };
  }
});