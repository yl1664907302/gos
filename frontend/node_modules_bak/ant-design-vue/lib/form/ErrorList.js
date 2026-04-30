"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _context = require("./context");
var _transition = require("../_util/transition");
var _collapseMotion = _interopRequireDefault(require("../_util/collapseMotion"));
var _style = _interopRequireDefault(require("./style"));
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ErrorList',
  inheritAttrs: false,
  props: ['errors', 'help', 'onErrorVisibleChanged', 'helpStatus', 'warnings'],
  setup(props, _ref) {
    let {
      attrs
    } = _ref;
    const {
      prefixCls,
      status
    } = (0, _context.useInjectFormItemPrefix)();
    const baseClassName = (0, _vue.computed)(() => `${prefixCls.value}-item-explain`);
    const visible = (0, _vue.computed)(() => !!(props.errors && props.errors.length));
    const innerStatus = (0, _vue.ref)(status.value);
    const [, hashId] = (0, _style.default)(prefixCls);
    // Memo status in same visible
    (0, _vue.watch)([visible, status], () => {
      if (visible.value) {
        innerStatus.value = status.value;
      }
    });
    return () => {
      var _a, _b;
      const colMItem = (0, _collapseMotion.default)(`${prefixCls.value}-show-help-item`);
      const transitionGroupProps = (0, _transition.getTransitionGroupProps)(`${prefixCls.value}-show-help-item`, colMItem);
      transitionGroupProps.role = 'alert';
      transitionGroupProps.class = [hashId.value, baseClassName.value, attrs.class, `${prefixCls.value}-show-help`];
      return (0, _vue.createVNode)(_vue.Transition, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, (0, _transition.getTransitionProps)(`${prefixCls.value}-show-help`)), {}, {
        "onAfterEnter": () => props.onErrorVisibleChanged(true),
        "onAfterLeave": () => props.onErrorVisibleChanged(false)
      }), {
        default: () => [(0, _vue.withDirectives)((0, _vue.createVNode)(_vue.TransitionGroup, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, transitionGroupProps), {}, {
          "tag": "div"
        }), {
          default: () => [(_b = props.errors) === null || _b === void 0 ? void 0 : _b.map((error, index) => (0, _vue.createVNode)("div", {
            "key": index,
            "class": innerStatus.value ? `${baseClassName.value}-${innerStatus.value}` : ''
          }, [error]))]
        }), [[_vue.vShow, !!((_a = props.errors) === null || _a === void 0 ? void 0 : _a.length)]])]
      });
    };
  }
});