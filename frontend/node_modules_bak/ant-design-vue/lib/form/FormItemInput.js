"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _Col = _interopRequireDefault(require("../grid/Col"));
var _context = require("./context");
var _ErrorList = _interopRequireDefault(require("./ErrorList"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _propsUtil = require("../_util/props-util");
const FormItemInput = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  slots: Object,
  inheritAttrs: false,
  props: ['prefixCls', 'errors', 'hasFeedback', 'onDomErrorVisibleChange', 'wrapperCol', 'help', 'extra', 'status', 'marginBottom', 'onErrorVisibleChanged'],
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const formContext = (0, _context.useInjectForm)();
    const {
      wrapperCol: contextWrapperCol
    } = formContext;
    // Pass to sub FormItem should not with col info
    const subFormContext = (0, _extends2.default)({}, formContext);
    delete subFormContext.labelCol;
    delete subFormContext.wrapperCol;
    (0, _context.useProvideForm)(subFormContext);
    (0, _context.useProvideFormItemPrefix)({
      prefixCls: (0, _vue.computed)(() => props.prefixCls),
      status: (0, _vue.computed)(() => props.status)
    });
    return () => {
      var _a, _b, _c;
      const {
        prefixCls,
        wrapperCol,
        marginBottom,
        onErrorVisibleChanged,
        help = (_a = slots.help) === null || _a === void 0 ? void 0 : _a.call(slots),
        errors = (0, _propsUtil.filterEmpty)((_b = slots.errors) === null || _b === void 0 ? void 0 : _b.call(slots)),
        // hasFeedback,
        // status,
        extra = (_c = slots.extra) === null || _c === void 0 ? void 0 : _c.call(slots)
      } = props;
      const baseClassName = `${prefixCls}-item`;
      const mergedWrapperCol = wrapperCol || (contextWrapperCol === null || contextWrapperCol === void 0 ? void 0 : contextWrapperCol.value) || {};
      const className = (0, _classNames.default)(`${baseClassName}-control`, mergedWrapperCol.class);
      // Should provides additional icon if `hasFeedback`
      // const IconNode = status && iconMap[status];
      return (0, _vue.createVNode)(_Col.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, mergedWrapperCol), {}, {
        "class": className
      }), {
        default: () => {
          var _a;
          return (0, _vue.createVNode)(_vue.Fragment, null, [(0, _vue.createVNode)("div", {
            "class": `${baseClassName}-control-input`
          }, [(0, _vue.createVNode)("div", {
            "class": `${baseClassName}-control-input-content`
          }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)])]), marginBottom !== null || errors.length ? (0, _vue.createVNode)("div", {
            "style": {
              display: 'flex',
              flexWrap: 'nowrap'
            }
          }, [(0, _vue.createVNode)(_ErrorList.default, {
            "errors": errors,
            "help": help,
            "class": `${baseClassName}-explain-connected`,
            "onErrorVisibleChanged": onErrorVisibleChanged
          }, null), !!marginBottom && (0, _vue.createVNode)("div", {
            "style": {
              width: 0,
              height: `${marginBottom}px`
            }
          }, null)]) : null, extra ? (0, _vue.createVNode)("div", {
            "class": `${baseClassName}-extra`
          }, [extra]) : null]);
        }
      });
    };
  }
});
var _default = exports.default = FormItemInput;