import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { withDirectives as _withDirectives, resolveDirective as _resolveDirective, vShow as _vShow, createVNode as _createVNode } from "vue";
import PanelContent from './PanelContent';
import { initDefaultProps } from '../_util/props-util';
import { collapsePanelProps } from './commonProps';
import { defineComponent, Transition } from 'vue';
import classNames from '../_util/classNames';
import devWarning from '../vc-util/devWarning';
import useConfigInject from '../config-provider/hooks/useConfigInject';
export { collapsePanelProps };
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ACollapsePanel',
  inheritAttrs: false,
  props: initDefaultProps(collapsePanelProps(), {
    showArrow: true,
    isActive: false,
    onItemClick() {},
    headerClass: '',
    forceRender: false
  }),
  slots: Object,
  // emits: ['itemClick'],
  setup(props, _ref) {
    let {
      slots,
      emit,
      attrs
    } = _ref;
    devWarning(props.disabled === undefined, 'Collapse.Panel', '`disabled` is deprecated. Please use `collapsible="disabled"` instead.');
    const {
      prefixCls
    } = useConfigInject('collapse', props);
    const handleItemClick = () => {
      emit('itemClick', props.panelKey);
    };
    const handleKeyPress = e => {
      if (e.key === 'Enter' || e.keyCode === 13 || e.which === 13) {
        handleItemClick();
      }
    };
    return () => {
      var _a, _b;
      const {
        header = (_a = slots.header) === null || _a === void 0 ? void 0 : _a.call(slots),
        headerClass,
        isActive,
        showArrow,
        destroyInactivePanel,
        accordion,
        forceRender,
        openAnimation,
        expandIcon = slots.expandIcon,
        extra = (_b = slots.extra) === null || _b === void 0 ? void 0 : _b.call(slots),
        collapsible
      } = props;
      const disabled = collapsible === 'disabled';
      const prefixClsValue = prefixCls.value;
      const headerCls = classNames(`${prefixClsValue}-header`, {
        [headerClass]: headerClass,
        [`${prefixClsValue}-header-collapsible-only`]: collapsible === 'header',
        [`${prefixClsValue}-icon-collapsible-only`]: collapsible === 'icon'
      });
      const itemCls = classNames({
        [`${prefixClsValue}-item`]: true,
        [`${prefixClsValue}-item-active`]: isActive,
        [`${prefixClsValue}-item-disabled`]: disabled,
        [`${prefixClsValue}-no-arrow`]: !showArrow,
        [`${attrs.class}`]: !!attrs.class
      });
      let icon = _createVNode("i", {
        "class": "arrow"
      }, null);
      if (showArrow && typeof expandIcon === 'function') {
        icon = expandIcon(props);
      }
      const panelContent = _withDirectives(_createVNode(PanelContent, {
        "prefixCls": prefixClsValue,
        "isActive": isActive,
        "forceRender": forceRender,
        "role": accordion ? 'tabpanel' : null
      }, {
        default: slots.default
      }), [[_vShow, isActive]]);
      const transitionProps = _extends({
        appear: false,
        css: false
      }, openAnimation);
      return _createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": itemCls
      }), [_createVNode("div", {
        "class": headerCls,
        "onClick": () => !['header', 'icon'].includes(collapsible) && handleItemClick(),
        "role": accordion ? 'tab' : 'button',
        "tabindex": disabled ? -1 : 0,
        "aria-expanded": isActive,
        "onKeypress": handleKeyPress
      }, [showArrow && icon, _createVNode("span", {
        "onClick": () => collapsible === 'header' && handleItemClick(),
        "class": `${prefixClsValue}-header-text`
      }, [header]), extra && _createVNode("div", {
        "class": `${prefixClsValue}-extra`
      }, [extra])]), _createVNode(Transition, transitionProps, {
        default: () => [!destroyInactivePanel || isActive ? panelContent : null]
      })]);
    };
  }
});