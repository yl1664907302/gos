import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { flattenChildren, isValidElement } from '../../_util/props-util';
import PropTypes from '../../_util/vue-types';
import { computed, defineComponent, getCurrentInstance, onBeforeUnmount, shallowRef, watch } from 'vue';
import { useInjectKeyPath, useMeasure } from './hooks/useKeyPath';
import { useInjectFirstLevel, useInjectMenu } from './hooks/useMenuContext';
import { cloneElement } from '../../_util/vnode';
import Tooltip from '../../tooltip';
import KeyCode from '../../_util/KeyCode';
import useDirectionStyle from './hooks/useDirectionStyle';
import Overflow from '../../vc-overflow';
import devWarning from '../../vc-util/devWarning';
import { objectType } from '../../_util/type';
let indexGuid = 0;
export const menuItemProps = () => ({
  id: String,
  role: String,
  disabled: Boolean,
  danger: Boolean,
  title: {
    type: [String, Boolean],
    default: undefined
  },
  icon: PropTypes.any,
  onMouseenter: Function,
  onMouseleave: Function,
  onClick: Function,
  onKeydown: Function,
  onFocus: Function,
  // Internal user prop
  originItemValue: objectType()
});
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AMenuItem',
  inheritAttrs: false,
  props: menuItemProps(),
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      emit,
      attrs
    } = _ref;
    const instance = getCurrentInstance();
    const isMeasure = useMeasure();
    const key = typeof instance.vnode.key === 'symbol' ? String(instance.vnode.key) : instance.vnode.key;
    devWarning(typeof instance.vnode.key !== 'symbol', 'MenuItem', `MenuItem \`:key="${String(key)}"\` not support Symbol type`);
    const eventKey = `menu_item_${++indexGuid}_$$_${key}`;
    const {
      parentEventKeys,
      parentKeys
    } = useInjectKeyPath();
    const {
      prefixCls,
      activeKeys,
      disabled,
      changeActiveKeys,
      rtl,
      inlineCollapsed,
      siderCollapsed,
      onItemClick,
      selectedKeys,
      registerMenuInfo,
      unRegisterMenuInfo
    } = useInjectMenu();
    const firstLevel = useInjectFirstLevel();
    const isActive = shallowRef(false);
    const keysPath = computed(() => {
      return [...parentKeys.value, key];
    });
    // const keysPath = computed(() => [...parentEventKeys.value, eventKey]);
    const menuInfo = {
      eventKey,
      key,
      parentEventKeys,
      parentKeys,
      isLeaf: true
    };
    registerMenuInfo(eventKey, menuInfo);
    onBeforeUnmount(() => {
      unRegisterMenuInfo(eventKey);
    });
    watch(activeKeys, () => {
      isActive.value = !!activeKeys.value.find(val => val === key);
    }, {
      immediate: true
    });
    const mergedDisabled = computed(() => disabled.value || props.disabled);
    const selected = computed(() => selectedKeys.value.includes(key));
    const classNames = computed(() => {
      const itemCls = `${prefixCls.value}-item`;
      return {
        [`${itemCls}`]: true,
        [`${itemCls}-danger`]: props.danger,
        [`${itemCls}-active`]: isActive.value,
        [`${itemCls}-selected`]: selected.value,
        [`${itemCls}-disabled`]: mergedDisabled.value
      };
    });
    const getEventInfo = e => {
      return {
        key,
        eventKey,
        keyPath: keysPath.value,
        eventKeyPath: [...parentEventKeys.value, eventKey],
        domEvent: e,
        item: _extends(_extends({}, props), attrs)
      };
    };
    // ============================ Events ============================
    const onInternalClick = e => {
      if (mergedDisabled.value) {
        return;
      }
      const info = getEventInfo(e);
      emit('click', e);
      onItemClick(info);
    };
    const onMouseEnter = event => {
      if (!mergedDisabled.value) {
        changeActiveKeys(keysPath.value);
        emit('mouseenter', event);
      }
    };
    const onMouseLeave = event => {
      if (!mergedDisabled.value) {
        changeActiveKeys([]);
        emit('mouseleave', event);
      }
    };
    const onInternalKeyDown = e => {
      emit('keydown', e);
      if (e.which === KeyCode.ENTER) {
        const info = getEventInfo(e);
        // Legacy. Key will also trigger click event
        emit('click', e);
        onItemClick(info);
      }
    };
    /**
     * Used for accessibility. Helper will focus element without key board.
     * We should manually trigger an active
     */
    const onInternalFocus = e => {
      changeActiveKeys(keysPath.value);
      emit('focus', e);
    };
    const renderItemChildren = (icon, children) => {
      const wrapNode = _createVNode("span", {
        "class": `${prefixCls.value}-title-content`
      }, [children]);
      // inline-collapsed.md demo 依赖 span 来隐藏文字,有 icon 属性，则内部包裹一个 span
      // ref: https://github.com/ant-design/ant-design/pull/23456
      if (!icon || isValidElement(children) && children.type === 'span') {
        if (children && inlineCollapsed.value && firstLevel && typeof children === 'string') {
          return _createVNode("div", {
            "class": `${prefixCls.value}-inline-collapsed-noicon`
          }, [children.charAt(0)]);
        }
      }
      return wrapNode;
    };
    // ========================== DirectionStyle ==========================
    const directionStyle = useDirectionStyle(computed(() => keysPath.value.length));
    return () => {
      var _a, _b, _c, _d, _e;
      if (isMeasure) return null;
      const title = (_a = props.title) !== null && _a !== void 0 ? _a : (_b = slots.title) === null || _b === void 0 ? void 0 : _b.call(slots);
      const children = flattenChildren((_c = slots.default) === null || _c === void 0 ? void 0 : _c.call(slots));
      const childrenLength = children.length;
      let tooltipTitle = title;
      if (typeof title === 'undefined') {
        tooltipTitle = firstLevel && childrenLength ? children : '';
      } else if (title === false) {
        tooltipTitle = '';
      }
      const tooltipProps = {
        title: tooltipTitle
      };
      if (!siderCollapsed.value && !inlineCollapsed.value) {
        tooltipProps.title = null;
        // Reset `visible` to fix control mode tooltip display not correct
        // ref: https://github.com/ant-design/ant-design/issues/16742
        tooltipProps.open = false;
      }
      // ============================ Render ============================
      const optionRoleProps = {};
      if (props.role === 'option') {
        optionRoleProps['aria-selected'] = selected.value;
      }
      const icon = (_d = props.icon) !== null && _d !== void 0 ? _d : (_e = slots.icon) === null || _e === void 0 ? void 0 : _e.call(slots, props);
      return _createVNode(Tooltip, _objectSpread(_objectSpread({}, tooltipProps), {}, {
        "placement": rtl.value ? 'left' : 'right',
        "overlayClassName": `${prefixCls.value}-inline-collapsed-tooltip`
      }), {
        default: () => [_createVNode(Overflow.Item, _objectSpread(_objectSpread(_objectSpread({
          "component": "li"
        }, attrs), {}, {
          "id": props.id,
          "style": _extends(_extends({}, attrs.style || {}), directionStyle.value),
          "class": [classNames.value, {
            [`${attrs.class}`]: !!attrs.class,
            [`${prefixCls.value}-item-only-child`]: (icon ? childrenLength + 1 : childrenLength) === 1
          }],
          "role": props.role || 'menuitem',
          "tabindex": props.disabled ? null : -1,
          "data-menu-id": key,
          "aria-disabled": props.disabled
        }, optionRoleProps), {}, {
          "onMouseenter": onMouseEnter,
          "onMouseleave": onMouseLeave,
          "onClick": onInternalClick,
          "onKeydown": onInternalKeyDown,
          "onFocus": onInternalFocus,
          "title": typeof title === 'string' ? title : undefined
        }), {
          default: () => [cloneElement(typeof icon === 'function' ? icon(props.originItemValue) : icon, {
            class: `${prefixCls.value}-item-icon`
          }, false), renderItemChildren(icon, children)]
        })]
      });
    };
  }
});