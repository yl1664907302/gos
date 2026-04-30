import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import { computed, defineComponent } from 'vue';
import RcDropdown from '../vc-dropdown';
import DropdownButton from './dropdown-button';
import { cloneElement } from '../_util/vnode';
import classNames from '../_util/classNames';
import { isValidElement, initDefaultProps } from '../_util/props-util';
import { dropdownProps } from './props';
import RightOutlined from "@ant-design/icons-vue/es/icons/RightOutlined";
import useConfigInject from '../config-provider/hooks/useConfigInject';
import devWarning from '../vc-util/devWarning';
import omit from '../_util/omit';
import getPlacements from '../_util/placements';
import warning from '../_util/warning';
import useStyle from './style';
import { useProvideOverride } from '../menu/src/OverrideContext';
const Dropdown = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ADropdown',
  inheritAttrs: false,
  props: initDefaultProps(dropdownProps(), {
    mouseEnterDelay: 0.15,
    mouseLeaveDelay: 0.1,
    placement: 'bottomLeft',
    trigger: 'hover'
  }),
  // emits: ['visibleChange', 'update:visible'],
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      attrs,
      emit
    } = _ref;
    const {
      prefixCls,
      rootPrefixCls,
      direction,
      getPopupContainer
    } = useConfigInject('dropdown', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    // Warning for deprecated usage
    if (process.env.NODE_ENV !== 'production') {
      [['visible', 'open'], ['onVisibleChange', 'onOpenChange'], ['onUpdate:visible', 'onUpdate:open']].forEach(_ref2 => {
        let [deprecatedName, newName] = _ref2;
        warning(props[deprecatedName] === undefined, 'Dropdown', `\`${deprecatedName}\` is deprecated which will be removed in next major version, please use \`${newName}\` instead.`);
      });
    }
    const transitionName = computed(() => {
      const {
        placement = '',
        transitionName
      } = props;
      if (transitionName !== undefined) {
        return transitionName;
      }
      if (placement.includes('top')) {
        return `${rootPrefixCls.value}-slide-down`;
      }
      return `${rootPrefixCls.value}-slide-up`;
    });
    useProvideOverride({
      prefixCls: computed(() => `${prefixCls.value}-menu`),
      expandIcon: computed(() => {
        return _createVNode("span", {
          "class": `${prefixCls.value}-menu-submenu-arrow`
        }, [_createVNode(RightOutlined, {
          "class": `${prefixCls.value}-menu-submenu-arrow-icon`
        }, null)]);
      }),
      mode: computed(() => 'vertical'),
      selectable: computed(() => false),
      onClick: () => {},
      validator: _ref3 => {
        let {
          mode
        } = _ref3;
        // Warning if use other mode
        warning(!mode || mode === 'vertical', 'Dropdown', `mode="${mode}" is not supported for Dropdown's Menu.`);
      }
    });
    const renderOverlay = () => {
      var _a, _b, _c;
      // rc-dropdown already can process the function of overlay, but we have check logic here.
      // So we need render the element to check and pass back to rc-dropdown.
      const overlay = props.overlay || ((_a = slots.overlay) === null || _a === void 0 ? void 0 : _a.call(slots));
      const overlayNode = Array.isArray(overlay) ? overlay[0] : overlay;
      if (!overlayNode) return null;
      const overlayProps = overlayNode.props || {};
      // Warning if use other mode
      devWarning(!overlayProps.mode || overlayProps.mode === 'vertical', 'Dropdown', `mode="${overlayProps.mode}" is not supported for Dropdown's Menu.`);
      // menu cannot be selectable in dropdown defaultly
      const {
        selectable = false,
        expandIcon = (_c = (_b = overlayNode.children) === null || _b === void 0 ? void 0 : _b.expandIcon) === null || _c === void 0 ? void 0 : _c.call(_b)
      } = overlayProps;
      const overlayNodeExpandIcon = typeof expandIcon !== 'undefined' && isValidElement(expandIcon) ? expandIcon : _createVNode("span", {
        "class": `${prefixCls.value}-menu-submenu-arrow`
      }, [_createVNode(RightOutlined, {
        "class": `${prefixCls.value}-menu-submenu-arrow-icon`
      }, null)]);
      const fixedModeOverlay = isValidElement(overlayNode) ? cloneElement(overlayNode, {
        mode: 'vertical',
        selectable,
        expandIcon: () => overlayNodeExpandIcon
      }) : overlayNode;
      return fixedModeOverlay;
    };
    const placement = computed(() => {
      const placement = props.placement;
      if (!placement) {
        return direction.value === 'rtl' ? 'bottomRight' : 'bottomLeft';
      }
      if (placement.includes('Center')) {
        const newPlacement = placement.slice(0, placement.indexOf('Center'));
        devWarning(!placement.includes('Center'), 'Dropdown', `You are using '${placement}' placement in Dropdown, which is deprecated. Try to use '${newPlacement}' instead.`);
        return newPlacement;
      }
      return placement;
    });
    const mergedVisible = computed(() => {
      return typeof props.visible === 'boolean' ? props.visible : props.open;
    });
    const handleVisibleChange = val => {
      emit('update:visible', val);
      emit('visibleChange', val);
      emit('update:open', val);
      emit('openChange', val);
    };
    return () => {
      var _a, _b;
      const {
        arrow,
        trigger,
        disabled,
        overlayClassName
      } = props;
      const child = (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)[0];
      const dropdownTrigger = cloneElement(child, _extends({
        class: classNames((_b = child === null || child === void 0 ? void 0 : child.props) === null || _b === void 0 ? void 0 : _b.class, {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
        }, `${prefixCls.value}-trigger`)
      }, disabled ? {
        disabled
      } : {}));
      const overlayClassNameCustomized = classNames(overlayClassName, hashId.value, {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
      });
      const triggerActions = disabled ? [] : trigger;
      let alignPoint;
      if (triggerActions && triggerActions.includes('contextmenu')) {
        alignPoint = true;
      }
      const builtinPlacements = getPlacements({
        arrowPointAtCenter: typeof arrow === 'object' && arrow.pointAtCenter,
        autoAdjustOverflow: true
      });
      const dropdownProps = omit(_extends(_extends(_extends({}, props), attrs), {
        visible: mergedVisible.value,
        builtinPlacements,
        overlayClassName: overlayClassNameCustomized,
        arrow: !!arrow,
        alignPoint,
        prefixCls: prefixCls.value,
        getPopupContainer: getPopupContainer === null || getPopupContainer === void 0 ? void 0 : getPopupContainer.value,
        transitionName: transitionName.value,
        trigger: triggerActions,
        onVisibleChange: handleVisibleChange,
        placement: placement.value
      }), ['overlay', 'onUpdate:visible']);
      return wrapSSR(_createVNode(RcDropdown, dropdownProps, {
        default: () => [dropdownTrigger],
        overlay: renderOverlay
      }));
    };
  }
});
Dropdown.Button = DropdownButton;
export default Dropdown;