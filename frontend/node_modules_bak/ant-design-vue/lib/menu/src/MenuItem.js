"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.menuItemProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _propsUtil = require("../../_util/props-util");
var _vueTypes = _interopRequireDefault(require("../../_util/vue-types"));
var _useKeyPath = require("./hooks/useKeyPath");
var _useMenuContext = require("./hooks/useMenuContext");
var _vnode = require("../../_util/vnode");
var _tooltip = _interopRequireDefault(require("../../tooltip"));
var _KeyCode = _interopRequireDefault(require("../../_util/KeyCode"));
var _useDirectionStyle = _interopRequireDefault(require("./hooks/useDirectionStyle"));
var _vcOverflow = _interopRequireDefault(require("../../vc-overflow"));
var _devWarning = _interopRequireDefault(require("../../vc-util/devWarning"));
var _type = require("../../_util/type");
let indexGuid = 0;
const menuItemProps = () => ({
  id: String,
  role: String,
  disabled: Boolean,
  danger: Boolean,
  title: {
    type: [String, Boolean],
    default: undefined
  },
  icon: _vueTypes.default.any,
  onMouseenter: Function,
  onMouseleave: Function,
  onClick: Function,
  onKeydown: Function,
  onFocus: Function,
  // Internal user prop
  originItemValue: (0, _type.objectType)()
});
exports.menuItemProps = menuItemProps;
var _default = exports.default = (0, _vue.defineComponent)({
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
    const instance = (0, _vue.getCurrentInstance)();
    const isMeasure = (0, _useKeyPath.useMeasure)();
    const key = typeof instance.vnode.key === 'symbol' ? String(instance.vnode.key) : instance.vnode.key;
    (0, _devWarning.default)(typeof instance.vnode.key !== 'symbol', 'MenuItem', `MenuItem \`:key="${String(key)}"\` not support Symbol type`);
    const eventKey = `menu_item_${++indexGuid}_$$_${key}`;
    const {
      parentEventKeys,
      parentKeys
    } = (0, _useKeyPath.useInjectKeyPath)();
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
    } = (0, _useMenuContext.useInjectMenu)();
    const firstLevel = (0, _useMenuContext.useInjectFirstLevel)();
    const isActive = (0, _vue.shallowRef)(false);
    const keysPath = (0, _vue.computed)(() => {
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
    (0, _vue.onBeforeUnmount)(() => {
      unRegisterMenuInfo(eventKey);
    });
    (0, _vue.watch)(activeKeys, () => {
      isActive.value = !!activeKeys.value.find(val => val === key);
    }, {
      immediate: true
    });
    const mergedDisabled = (0, _vue.computed)(() => disabled.value || props.disabled);
    const selected = (0, _vue.computed)(() => selectedKeys.value.includes(key));
    const classNames = (0, _vue.computed)(() => {
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
        item: (0, _extends2.default)((0, _extends2.default)({}, props), attrs)
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
      if (e.which === _KeyCode.default.ENTER) {
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
      const wrapNode = (0, _vue.createVNode)("span", {
        "class": `${prefixCls.value}-title-content`
      }, [children]);
      // inline-collapsed.md demo 依赖 span 来隐藏文字,有 icon 属性，则内部包裹一个 span
      // ref: https://github.com/ant-design/ant-design/pull/23456
      if (!icon || (0, _propsUtil.isValidElement)(children) && children.type === 'span') {
        if (children && inlineCollapsed.value && firstLevel && typeof children === 'string') {
          return (0, _vue.createVNode)("div", {
            "class": `${prefixCls.value}-inline-collapsed-noicon`
          }, [children.charAt(0)]);
        }
      }
      return wrapNode;
    };
    // ========================== DirectionStyle ==========================
    const directionStyle = (0, _useDirectionStyle.default)((0, _vue.computed)(() => keysPath.value.length));
    return () => {
      var _a, _b, _c, _d, _e;
      if (isMeasure) return null;
      const title = (_a = props.title) !== null && _a !== void 0 ? _a : (_b = slots.title) === null || _b === void 0 ? void 0 : _b.call(slots);
      const children = (0, _propsUtil.flattenChildren)((_c = slots.default) === null || _c === void 0 ? void 0 : _c.call(slots));
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
      return (0, _vue.createVNode)(_tooltip.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, tooltipProps), {}, {
        "placement": rtl.value ? 'left' : 'right',
        "overlayClassName": `${prefixCls.value}-inline-collapsed-tooltip`
      }), {
        default: () => [(0, _vue.createVNode)(_vcOverflow.default.Item, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({
          "component": "li"
        }, attrs), {}, {
          "id": props.id,
          "style": (0, _extends2.default)((0, _extends2.default)({}, attrs.style || {}), directionStyle.value),
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
          default: () => [(0, _vnode.cloneElement)(typeof icon === 'function' ? icon(props.originItemValue) : icon, {
            class: `${prefixCls.value}-item-icon`
          }, false), renderItemChildren(icon, children)]
        })]
      });
    };
  }
});