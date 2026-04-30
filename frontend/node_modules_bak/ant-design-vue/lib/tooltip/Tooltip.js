"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tooltipProps = exports.tooltipDefaultProps = exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vcTooltip = _interopRequireDefault(require("../vc-tooltip"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _warning = _interopRequireDefault(require("../_util/warning"));
var _propsUtil = require("../_util/props-util");
var _vnode = require("../_util/vnode");
var _abstractTooltipProps = _interopRequireDefault(require("./abstractTooltipProps"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _placements = _interopRequireDefault(require("../_util/placements"));
var _firstNotUndefined = _interopRequireDefault(require("../_util/firstNotUndefined"));
var _raf = _interopRequireDefault(require("../_util/raf"));
var _util = require("./util");
var _style = _interopRequireDefault(require("./style"));
var _transition = require("../_util/transition");
const splitObject = (obj, keys) => {
  const picked = {};
  const omitted = (0, _extends2.default)({}, obj);
  keys.forEach(key => {
    if (obj && key in obj) {
      picked[key] = obj[key];
      delete omitted[key];
    }
  });
  return {
    picked,
    omitted
  };
};
const tooltipProps = () => (0, _extends2.default)((0, _extends2.default)({}, (0, _abstractTooltipProps.default)()), {
  title: _vueTypes.default.any
});
exports.tooltipProps = tooltipProps;
const tooltipDefaultProps = () => ({
  trigger: 'hover',
  align: {},
  placement: 'top',
  mouseEnterDelay: 0.1,
  mouseLeaveDelay: 0.1,
  arrowPointAtCenter: false,
  autoAdjustOverflow: true
});
exports.tooltipDefaultProps = tooltipDefaultProps;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ATooltip',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)(tooltipProps(), {
    trigger: 'hover',
    align: {},
    placement: 'top',
    mouseEnterDelay: 0.1,
    mouseLeaveDelay: 0.1,
    arrowPointAtCenter: false,
    autoAdjustOverflow: true
  }),
  slots: Object,
  // emits: ['update:visible', 'visibleChange'],
  setup(props, _ref) {
    let {
      slots,
      emit,
      attrs,
      expose
    } = _ref;
    if (process.env.NODE_ENV !== 'production') {
      [['visible', 'open'], ['onVisibleChange', 'onOpenChange']].forEach(_ref2 => {
        let [deprecatedName, newName] = _ref2;
        (0, _warning.default)(props[deprecatedName] === undefined, 'Tooltip', `\`${deprecatedName}\` is deprecated, please use \`${newName}\` instead.`);
      });
    }
    const {
      prefixCls,
      getPopupContainer,
      direction,
      rootPrefixCls
    } = (0, _useConfigInject.default)('tooltip', props);
    const mergedOpen = (0, _vue.computed)(() => {
      var _a;
      return (_a = props.open) !== null && _a !== void 0 ? _a : props.visible;
    });
    const innerOpen = (0, _vue.ref)((0, _firstNotUndefined.default)([props.open, props.visible]));
    const tooltip = (0, _vue.ref)();
    let rafId;
    (0, _vue.watch)(mergedOpen, val => {
      _raf.default.cancel(rafId);
      rafId = (0, _raf.default)(() => {
        innerOpen.value = !!val;
      });
    });
    const isNoTitle = () => {
      var _a;
      const title = (_a = props.title) !== null && _a !== void 0 ? _a : slots.title;
      return !title && title !== 0;
    };
    const handleVisibleChange = val => {
      const noTitle = isNoTitle();
      if (mergedOpen.value === undefined) {
        innerOpen.value = noTitle ? false : val;
      }
      if (!noTitle) {
        emit('update:visible', val);
        emit('visibleChange', val);
        emit('update:open', val);
        emit('openChange', val);
      }
    };
    const getPopupDomNode = () => {
      return tooltip.value.getPopupDomNode();
    };
    expose({
      getPopupDomNode,
      open: innerOpen,
      forcePopupAlign: () => {
        var _a;
        return (_a = tooltip.value) === null || _a === void 0 ? void 0 : _a.forcePopupAlign();
      }
    });
    const tooltipPlacements = (0, _vue.computed)(() => {
      var _a;
      const {
        builtinPlacements,
        autoAdjustOverflow,
        arrow,
        arrowPointAtCenter
      } = props;
      let mergedArrowPointAtCenter = arrowPointAtCenter;
      if (typeof arrow === 'object') {
        mergedArrowPointAtCenter = (_a = arrow.pointAtCenter) !== null && _a !== void 0 ? _a : arrowPointAtCenter;
      }
      return builtinPlacements || (0, _placements.default)({
        arrowPointAtCenter: mergedArrowPointAtCenter,
        autoAdjustOverflow
      });
    });
    const isTrueProps = val => {
      return val || val === '';
    };
    const getDisabledCompatibleChildren = ele => {
      const elementType = ele.type;
      if (typeof elementType === 'object' && ele.props) {
        if ((elementType.__ANT_BUTTON === true || elementType === 'button') && isTrueProps(ele.props.disabled) || elementType.__ANT_SWITCH === true && (isTrueProps(ele.props.disabled) || isTrueProps(ele.props.loading)) || elementType.__ANT_RADIO === true && isTrueProps(ele.props.disabled)) {
          // Pick some layout related style properties up to span
          // Prevent layout bugs like https://github.com/ant-design/ant-design/issues/5254
          const {
            picked,
            omitted
          } = splitObject((0, _propsUtil.getStyle)(ele), ['position', 'left', 'right', 'top', 'bottom', 'float', 'display', 'zIndex']);
          const spanStyle = (0, _extends2.default)((0, _extends2.default)({
            display: 'inline-block'
          }, picked), {
            cursor: 'not-allowed',
            lineHeight: 1,
            width: ele.props && ele.props.block ? '100%' : undefined
          });
          const buttonStyle = (0, _extends2.default)((0, _extends2.default)({}, omitted), {
            pointerEvents: 'none'
          });
          const child = (0, _vnode.cloneElement)(ele, {
            style: buttonStyle
          }, true);
          return (0, _vue.createVNode)("span", {
            "style": spanStyle,
            "class": `${prefixCls.value}-disabled-compatible-wrapper`
          }, [child]);
        }
      }
      return ele;
    };
    const getOverlay = () => {
      var _a, _b;
      return (_a = props.title) !== null && _a !== void 0 ? _a : (_b = slots.title) === null || _b === void 0 ? void 0 : _b.call(slots);
    };
    const onPopupAlign = (domNode, align) => {
      const placements = tooltipPlacements.value;
      // 当前返回的位置
      const placement = Object.keys(placements).find(key => {
        var _a, _b;
        return placements[key].points[0] === ((_a = align.points) === null || _a === void 0 ? void 0 : _a[0]) && placements[key].points[1] === ((_b = align.points) === null || _b === void 0 ? void 0 : _b[1]);
      });
      if (placement) {
        // 根据当前坐标设置动画点
        const rect = domNode.getBoundingClientRect();
        const transformOrigin = {
          top: '50%',
          left: '50%'
        };
        if (placement.indexOf('top') >= 0 || placement.indexOf('Bottom') >= 0) {
          transformOrigin.top = `${rect.height - align.offset[1]}px`;
        } else if (placement.indexOf('Top') >= 0 || placement.indexOf('bottom') >= 0) {
          transformOrigin.top = `${-align.offset[1]}px`;
        }
        if (placement.indexOf('left') >= 0 || placement.indexOf('Right') >= 0) {
          transformOrigin.left = `${rect.width - align.offset[0]}px`;
        } else if (placement.indexOf('right') >= 0 || placement.indexOf('Left') >= 0) {
          transformOrigin.left = `${-align.offset[0]}px`;
        }
        domNode.style.transformOrigin = `${transformOrigin.left} ${transformOrigin.top}`;
      }
    };
    const colorInfo = (0, _vue.computed)(() => (0, _util.parseColor)(prefixCls.value, props.color));
    const injectFromPopover = (0, _vue.computed)(() => attrs['data-popover-inject']);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls, (0, _vue.computed)(() => !injectFromPopover.value));
    return () => {
      var _a, _b;
      const {
        openClassName,
        overlayClassName,
        overlayStyle,
        overlayInnerStyle
      } = props;
      let children = (_b = (0, _propsUtil.filterEmpty)((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots))) !== null && _b !== void 0 ? _b : null;
      children = children.length === 1 ? children[0] : children;
      let tempVisible = innerOpen.value;
      // Hide tooltip when there is no title
      if (mergedOpen.value === undefined && isNoTitle()) {
        tempVisible = false;
      }
      if (!children) {
        return null;
      }
      const child = getDisabledCompatibleChildren((0, _propsUtil.isValidElement)(children) && !(0, _propsUtil.isFragment)(children) ? children : (0, _vue.createVNode)("span", null, [children]));
      const childCls = (0, _classNames.default)({
        [openClassName || `${prefixCls.value}-open`]: true,
        [child.props && child.props.class]: child.props && child.props.class
      });
      const customOverlayClassName = (0, _classNames.default)(overlayClassName, {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
      }, colorInfo.value.className, hashId.value);
      const formattedOverlayInnerStyle = (0, _extends2.default)((0, _extends2.default)({}, colorInfo.value.overlayStyle), overlayInnerStyle);
      const arrowContentStyle = colorInfo.value.arrowStyle;
      const vcTooltipProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, attrs), props), {
        prefixCls: prefixCls.value,
        arrow: !!props.arrow,
        getPopupContainer: getPopupContainer === null || getPopupContainer === void 0 ? void 0 : getPopupContainer.value,
        builtinPlacements: tooltipPlacements.value,
        visible: tempVisible,
        ref: tooltip,
        overlayClassName: customOverlayClassName,
        overlayStyle: (0, _extends2.default)((0, _extends2.default)({}, arrowContentStyle), overlayStyle),
        overlayInnerStyle: formattedOverlayInnerStyle,
        onVisibleChange: handleVisibleChange,
        onPopupAlign,
        transitionName: (0, _transition.getTransitionName)(rootPrefixCls.value, 'zoom-big-fast', props.transitionName)
      });
      return wrapSSR((0, _vue.createVNode)(_vcTooltip.default, vcTooltipProps, {
        default: () => [innerOpen.value ? (0, _vnode.cloneElement)(child, {
          class: childCls
        }) : child],
        arrowContent: () => (0, _vue.createVNode)("span", {
          "class": `${prefixCls.value}-arrow-content`
        }, null),
        overlay: getOverlay
      }));
    };
  }
});