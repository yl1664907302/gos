"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _vnode = require("../_util/vnode");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _SingleNumber = _interopRequireDefault(require("./SingleNumber"));
var _propsUtil = require("../_util/props-util");
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const scrollNumberProps = {
  prefixCls: String,
  count: _vueTypes.default.any,
  component: String,
  title: _vueTypes.default.any,
  show: Boolean
};
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ScrollNumber',
  inheritAttrs: false,
  props: scrollNumberProps,
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      prefixCls
    } = (0, _useConfigInject.default)('scroll-number', props);
    return () => {
      var _a;
      const _b = (0, _extends2.default)((0, _extends2.default)({}, props), attrs),
        {
          prefixCls: customizePrefixCls,
          count,
          title,
          show,
          component: Tag = 'sup',
          class: className,
          style
        } = _b,
        restProps = __rest(_b, ["prefixCls", "count", "title", "show", "component", "class", "style"]);
      // ============================ Render ============================
      const newProps = (0, _extends2.default)((0, _extends2.default)({}, restProps), {
        style,
        'data-show': props.show,
        class: (0, _classNames.default)(prefixCls.value, className),
        title: title
      });
      // Only integer need motion
      let numberNodes = count;
      if (count && Number(count) % 1 === 0) {
        const numberList = String(count).split('');
        numberNodes = numberList.map((num, i) => (0, _vue.createVNode)(_SingleNumber.default, {
          "prefixCls": prefixCls.value,
          "count": Number(count),
          "value": num,
          "key": numberList.length - i
        }, null));
      }
      // allow specify the border
      // mock border-color by box-shadow for compatible with old usage:
      // <Badge count={4} style={{ backgroundColor: '#fff', color: '#999', borderColor: '#d9d9d9' }} />
      if (style && style.borderColor) {
        newProps.style = (0, _extends2.default)((0, _extends2.default)({}, style), {
          boxShadow: `0 0 0 1px ${style.borderColor} inset`
        });
      }
      const children = (0, _propsUtil.filterEmpty)((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots));
      if (children && children.length) {
        return (0, _vnode.cloneElement)(children, {
          class: (0, _classNames.default)(`${prefixCls.value}-custom-component`)
        }, false);
      }
      return (0, _vue.createVNode)(Tag, newProps, {
        default: () => [numberNodes]
      });
    };
  }
});