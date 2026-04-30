"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.popoverProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _tooltip = _interopRequireDefault(require("../tooltip"));
var _abstractTooltipProps = _interopRequireDefault(require("../tooltip/abstractTooltipProps"));
var _propsUtil = require("../_util/props-util");
var _type = require("../_util/type");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _omit = _interopRequireDefault(require("../_util/omit"));
var _transition = require("../_util/transition");
var _Tooltip = require("../tooltip/Tooltip");
var _style = _interopRequireDefault(require("./style"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _warning = _interopRequireDefault(require("../_util/warning"));
const popoverProps = () => (0, _extends2.default)((0, _extends2.default)({}, (0, _abstractTooltipProps.default)()), {
  content: (0, _type.anyType)(),
  title: (0, _type.anyType)()
});
exports.popoverProps = popoverProps;
const Popover = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'APopover',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)(popoverProps(), (0, _extends2.default)((0, _extends2.default)({}, (0, _Tooltip.tooltipDefaultProps)()), {
    trigger: 'hover',
    placement: 'top',
    mouseEnterDelay: 0.1,
    mouseLeaveDelay: 0.1
  })),
  setup(props, _ref) {
    let {
      expose,
      slots,
      attrs
    } = _ref;
    const tooltipRef = (0, _vue.ref)();
    (0, _warning.default)(props.visible === undefined, 'popover', `\`visible\` will be removed in next major version, please use \`open\` instead.`);
    expose({
      getPopupDomNode: () => {
        var _a, _b;
        return (_b = (_a = tooltipRef.value) === null || _a === void 0 ? void 0 : _a.getPopupDomNode) === null || _b === void 0 ? void 0 : _b.call(_a);
      }
    });
    const {
      prefixCls,
      configProvider
    } = (0, _useConfigInject.default)('popover', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const rootPrefixCls = (0, _vue.computed)(() => configProvider.getPrefixCls());
    const getOverlay = () => {
      var _a, _b;
      const {
        title = (0, _propsUtil.filterEmpty)((_a = slots.title) === null || _a === void 0 ? void 0 : _a.call(slots)),
        content = (0, _propsUtil.filterEmpty)((_b = slots.content) === null || _b === void 0 ? void 0 : _b.call(slots))
      } = props;
      const hasTitle = !!(Array.isArray(title) ? title.length : title);
      const hasContent = !!(Array.isArray(content) ? content.length : title);
      if (!hasTitle && !hasContent) return null;
      return (0, _vue.createVNode)(_vue.Fragment, null, [hasTitle && (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-title`
      }, [title]), (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-inner-content`
      }, [content])]);
    };
    return () => {
      const overlayCls = (0, _classNames.default)(props.overlayClassName, hashId.value);
      return wrapSSR((0, _vue.createVNode)(_tooltip.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, (0, _omit.default)(props, ['title', 'content'])), attrs), {}, {
        "prefixCls": prefixCls.value,
        "ref": tooltipRef,
        "overlayClassName": overlayCls,
        "transitionName": (0, _transition.getTransitionName)(rootPrefixCls.value, 'zoom-big', props.transitionName),
        "data-popover-inject": true
      }), {
        title: getOverlay,
        default: slots.default
      }));
    };
  }
});
var _default = exports.default = (0, _type.withInstall)(Popover);