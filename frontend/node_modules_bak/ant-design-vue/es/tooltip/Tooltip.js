import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import { computed, watch, defineComponent, ref } from 'vue';
import VcTooltip from '../vc-tooltip';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import warning from '../_util/warning';
import { getStyle, filterEmpty, isValidElement, initDefaultProps, isFragment } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import abstractTooltipProps from './abstractTooltipProps';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import getPlacements from '../_util/placements';
import firstNotUndefined from '../_util/firstNotUndefined';
import raf from '../_util/raf';
import { parseColor } from './util';
import useStyle from './style';
import { getTransitionName } from '../_util/transition';
const splitObject = (obj, keys) => {
  const picked = {};
  const omitted = _extends({}, obj);
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
export const tooltipProps = () => _extends(_extends({}, abstractTooltipProps()), {
  title: PropTypes.any
});
export const tooltipDefaultProps = () => ({
  trigger: 'hover',
  align: {},
  placement: 'top',
  mouseEnterDelay: 0.1,
  mouseLeaveDelay: 0.1,
  arrowPointAtCenter: false,
  autoAdjustOverflow: true
});
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ATooltip',
  inheritAttrs: false,
  props: initDefaultProps(tooltipProps(), {
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
        warning(props[deprecatedName] === undefined, 'Tooltip', `\`${deprecatedName}\` is deprecated, please use \`${newName}\` instead.`);
      });
    }
    const {
      prefixCls,
      getPopupContainer,
      direction,
      rootPrefixCls
    } = useConfigInject('tooltip', props);
    const mergedOpen = computed(() => {
      var _a;
      return (_a = props.open) !== null && _a !== void 0 ? _a : props.visible;
    });
    const innerOpen = ref(firstNotUndefined([props.open, props.visible]));
    const tooltip = ref();
    let rafId;
    watch(mergedOpen, val => {
      raf.cancel(rafId);
      rafId = raf(() => {
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
    const tooltipPlacements = computed(() => {
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
      return builtinPlacements || getPlacements({
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
          } = splitObject(getStyle(ele), ['position', 'left', 'right', 'top', 'bottom', 'float', 'display', 'zIndex']);
          const spanStyle = _extends(_extends({
            display: 'inline-block'
          }, picked), {
            cursor: 'not-allowed',
            lineHeight: 1,
            width: ele.props && ele.props.block ? '100%' : undefined
          });
          const buttonStyle = _extends(_extends({}, omitted), {
            pointerEvents: 'none'
          });
          const child = cloneElement(ele, {
            style: buttonStyle
          }, true);
          return _createVNode("span", {
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
    const colorInfo = computed(() => parseColor(prefixCls.value, props.color));
    const injectFromPopover = computed(() => attrs['data-popover-inject']);
    const [wrapSSR, hashId] = useStyle(prefixCls, computed(() => !injectFromPopover.value));
    return () => {
      var _a, _b;
      const {
        openClassName,
        overlayClassName,
        overlayStyle,
        overlayInnerStyle
      } = props;
      let children = (_b = filterEmpty((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots))) !== null && _b !== void 0 ? _b : null;
      children = children.length === 1 ? children[0] : children;
      let tempVisible = innerOpen.value;
      // Hide tooltip when there is no title
      if (mergedOpen.value === undefined && isNoTitle()) {
        tempVisible = false;
      }
      if (!children) {
        return null;
      }
      const child = getDisabledCompatibleChildren(isValidElement(children) && !isFragment(children) ? children : _createVNode("span", null, [children]));
      const childCls = classNames({
        [openClassName || `${prefixCls.value}-open`]: true,
        [child.props && child.props.class]: child.props && child.props.class
      });
      const customOverlayClassName = classNames(overlayClassName, {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
      }, colorInfo.value.className, hashId.value);
      const formattedOverlayInnerStyle = _extends(_extends({}, colorInfo.value.overlayStyle), overlayInnerStyle);
      const arrowContentStyle = colorInfo.value.arrowStyle;
      const vcTooltipProps = _extends(_extends(_extends({}, attrs), props), {
        prefixCls: prefixCls.value,
        arrow: !!props.arrow,
        getPopupContainer: getPopupContainer === null || getPopupContainer === void 0 ? void 0 : getPopupContainer.value,
        builtinPlacements: tooltipPlacements.value,
        visible: tempVisible,
        ref: tooltip,
        overlayClassName: customOverlayClassName,
        overlayStyle: _extends(_extends({}, arrowContentStyle), overlayStyle),
        overlayInnerStyle: formattedOverlayInnerStyle,
        onVisibleChange: handleVisibleChange,
        onPopupAlign,
        transitionName: getTransitionName(rootPrefixCls.value, 'zoom-big-fast', props.transitionName)
      });
      return wrapSSR(_createVNode(VcTooltip, vcTooltipProps, {
        default: () => [innerOpen.value ? cloneElement(child, {
          class: childCls
        }) : child],
        arrowContent: () => _createVNode("span", {
          "class": `${prefixCls.value}-arrow-content`
        }, null),
        overlay: getOverlay
      }));
    };
  }
});