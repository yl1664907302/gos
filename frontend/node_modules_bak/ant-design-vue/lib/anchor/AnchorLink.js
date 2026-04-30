"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.anchorLinkProps = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _propsUtil = require("../_util/props-util");
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _context = require("./context");
var _type = require("../_util/type");
const anchorLinkProps = () => ({
  prefixCls: String,
  href: String,
  title: (0, _type.anyType)(),
  target: String,
  /* private use  */
  customTitleProps: (0, _type.objectType)()
});
exports.anchorLinkProps = anchorLinkProps;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AAnchorLink',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)(anchorLinkProps(), {
    href: '#'
  }),
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    let mergedTitle = null;
    const {
      handleClick: contextHandleClick,
      scrollTo,
      unregisterLink,
      registerLink,
      activeLink
    } = (0, _context.useInjectAnchor)();
    const {
      prefixCls
    } = (0, _useConfigInject.default)('anchor', props);
    const handleClick = e => {
      const {
        href
      } = props;
      contextHandleClick(e, {
        title: mergedTitle,
        href
      });
      scrollTo(href);
    };
    (0, _vue.watch)(() => props.href, (val, oldVal) => {
      (0, _vue.nextTick)(() => {
        unregisterLink(oldVal);
        registerLink(val);
      });
    });
    (0, _vue.onMounted)(() => {
      registerLink(props.href);
    });
    (0, _vue.onBeforeUnmount)(() => {
      unregisterLink(props.href);
    });
    return () => {
      var _a;
      const {
        href,
        target,
        title = slots.title,
        customTitleProps = {}
      } = props;
      const pre = prefixCls.value;
      mergedTitle = typeof title === 'function' ? title(customTitleProps) : title;
      const active = activeLink.value === href;
      const wrapperClassName = (0, _classNames.default)(`${pre}-link`, {
        [`${pre}-link-active`]: active
      }, attrs.class);
      const titleClassName = (0, _classNames.default)(`${pre}-link-title`, {
        [`${pre}-link-title-active`]: active
      });
      return (0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": wrapperClassName
      }), [(0, _vue.createVNode)("a", {
        "class": titleClassName,
        "href": href,
        "title": typeof mergedTitle === 'string' ? mergedTitle : '',
        "target": target,
        "onClick": handleClick
      }, [slots.customTitle ? slots.customTitle(customTitleProps) : mergedTitle]), (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]);
    };
  }
});