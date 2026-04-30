"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subMenuProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vueTypes = _interopRequireDefault(require("../../_util/vue-types"));
var _useKeyPath = _interopRequireWildcard(require("./hooks/useKeyPath"));
var _useMenuContext = require("./hooks/useMenuContext");
var _propsUtil = require("../../_util/props-util");
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _useDirectionStyle = _interopRequireDefault(require("./hooks/useDirectionStyle"));
var _PopupTrigger = _interopRequireDefault(require("./PopupTrigger"));
var _SubMenuList = _interopRequireDefault(require("./SubMenuList"));
var _InlineSubMenuList = _interopRequireDefault(require("./InlineSubMenuList"));
var _vnode = require("../../_util/vnode");
var _vcOverflow = _interopRequireDefault(require("../../vc-overflow"));
var _devWarning = _interopRequireDefault(require("../../vc-util/devWarning"));
var _isValid = _interopRequireDefault(require("../../_util/isValid"));
var _type = require("../../_util/type");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
let indexGuid = 0;
const subMenuProps = () => ({
  icon: _vueTypes.default.any,
  title: _vueTypes.default.any,
  disabled: Boolean,
  level: Number,
  popupClassName: String,
  popupOffset: Array,
  internalPopupClose: Boolean,
  eventKey: String,
  expandIcon: Function,
  theme: String,
  onMouseenter: Function,
  onMouseleave: Function,
  onTitleClick: Function,
  // Internal user prop
  originItemValue: (0, _type.objectType)()
});
exports.subMenuProps = subMenuProps;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ASubMenu',
  inheritAttrs: false,
  props: subMenuProps(),
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      attrs,
      emit
    } = _ref;
    var _a, _b;
    (0, _useMenuContext.useProvideFirstLevel)(false);
    const isMeasure = (0, _useKeyPath.useMeasure)();
    const instance = (0, _vue.getCurrentInstance)();
    const vnodeKey = typeof instance.vnode.key === 'symbol' ? String(instance.vnode.key) : instance.vnode.key;
    (0, _devWarning.default)(typeof instance.vnode.key !== 'symbol', 'SubMenu', `SubMenu \`:key="${String(vnodeKey)}"\` not support Symbol type`);
    const key = (0, _isValid.default)(vnodeKey) ? vnodeKey : `sub_menu_${++indexGuid}_$$_not_set_key`;
    const eventKey = (_a = props.eventKey) !== null && _a !== void 0 ? _a : (0, _isValid.default)(vnodeKey) ? `sub_menu_${++indexGuid}_$$_${vnodeKey}` : key;
    const {
      parentEventKeys,
      parentInfo,
      parentKeys
    } = (0, _useKeyPath.useInjectKeyPath)();
    const keysPath = (0, _vue.computed)(() => [...parentKeys.value, key]);
    const childrenEventKeys = (0, _vue.shallowRef)([]);
    const menuInfo = {
      eventKey,
      key,
      parentEventKeys,
      childrenEventKeys,
      parentKeys
    };
    (_b = parentInfo.childrenEventKeys) === null || _b === void 0 ? void 0 : _b.value.push(eventKey);
    (0, _vue.onBeforeUnmount)(() => {
      var _a;
      if (parentInfo.childrenEventKeys) {
        parentInfo.childrenEventKeys.value = (_a = parentInfo.childrenEventKeys) === null || _a === void 0 ? void 0 : _a.value.filter(k => k != eventKey);
      }
    });
    (0, _useKeyPath.default)(eventKey, key, menuInfo);
    const {
      prefixCls,
      activeKeys,
      disabled: contextDisabled,
      changeActiveKeys,
      mode,
      inlineCollapsed,
      openKeys,
      overflowDisabled,
      onOpenChange,
      registerMenuInfo,
      unRegisterMenuInfo,
      selectedSubMenuKeys,
      expandIcon: menuExpandIcon,
      theme
    } = (0, _useMenuContext.useInjectMenu)();
    const hasKey = vnodeKey !== undefined && vnodeKey !== null;
    // If not set key, use forceRender = true for children
    // 如果没有 key，强制 render 子元素
    const forceRender = !isMeasure && ((0, _useMenuContext.useInjectForceRender)() || !hasKey);
    (0, _useMenuContext.useProvideForceRender)(forceRender);
    if (isMeasure && hasKey || !isMeasure && !hasKey || forceRender) {
      registerMenuInfo(eventKey, menuInfo);
      (0, _vue.onBeforeUnmount)(() => {
        unRegisterMenuInfo(eventKey);
      });
    }
    const subMenuPrefixCls = (0, _vue.computed)(() => `${prefixCls.value}-submenu`);
    const mergedDisabled = (0, _vue.computed)(() => contextDisabled.value || props.disabled);
    const elementRef = (0, _vue.shallowRef)();
    const popupRef = (0, _vue.shallowRef)();
    // // ================================ Icon ================================
    // const mergedItemIcon = itemIcon || contextItemIcon;
    // const mergedExpandIcon = expandIcon || contextExpandIcon;
    // ================================ Open ================================
    const originOpen = (0, _vue.computed)(() => openKeys.value.includes(key));
    const open = (0, _vue.computed)(() => !overflowDisabled.value && originOpen.value);
    // =============================== Select ===============================
    const childrenSelected = (0, _vue.computed)(() => {
      return selectedSubMenuKeys.value.includes(key);
    });
    const isActive = (0, _vue.shallowRef)(false);
    (0, _vue.watch)(activeKeys, () => {
      isActive.value = !!activeKeys.value.find(val => val === key);
    }, {
      immediate: true
    });
    // =============================== Events ===============================
    // >>>> Title click
    const onInternalTitleClick = e => {
      // Skip if disabled
      if (mergedDisabled.value) {
        return;
      }
      emit('titleClick', e, key);
      // Trigger open by click when mode is `inline`
      if (mode.value === 'inline') {
        onOpenChange(key, !originOpen.value);
      }
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
    // ========================== DirectionStyle ==========================
    const directionStyle = (0, _useDirectionStyle.default)((0, _vue.computed)(() => keysPath.value.length));
    // >>>>> Visible change
    const onPopupVisibleChange = newVisible => {
      if (mode.value !== 'inline') {
        onOpenChange(key, newVisible);
      }
    };
    /**
     * Used for accessibility. Helper will focus element without key board.
     * We should manually trigger an active
     */
    const onInternalFocus = () => {
      changeActiveKeys(keysPath.value);
    };
    // =============================== Render ===============================
    const popupId = eventKey && `${eventKey}-popup`;
    const popupClassName = (0, _vue.computed)(() => (0, _classNames.default)(prefixCls.value, `${prefixCls.value}-${props.theme || theme.value}`, props.popupClassName));
    const renderTitle = (title, icon) => {
      if (!icon) {
        return inlineCollapsed.value && !parentKeys.value.length && title && typeof title === 'string' ? (0, _vue.createVNode)("div", {
          "class": `${prefixCls.value}-inline-collapsed-noicon`
        }, [title.charAt(0)]) : (0, _vue.createVNode)("span", {
          "class": `${prefixCls.value}-title-content`
        }, [title]);
      }
      // inline-collapsed.md demo 依赖 span 来隐藏文字,有 icon 属性，则内部包裹一个 span
      // ref: https://github.com/ant-design/ant-design/pull/23456
      const titleIsSpan = (0, _propsUtil.isValidElement)(title) && title.type === 'span';
      return (0, _vue.createVNode)(_vue.Fragment, null, [(0, _vnode.cloneElement)(typeof icon === 'function' ? icon(props.originItemValue) : icon, {
        class: `${prefixCls.value}-item-icon`
      }, false), titleIsSpan ? title : (0, _vue.createVNode)("span", {
        "class": `${prefixCls.value}-title-content`
      }, [title])]);
    };
    // Cache mode if it change to `inline` which do not have popup motion
    const triggerModeRef = (0, _vue.computed)(() => {
      return mode.value !== 'inline' && keysPath.value.length > 1 ? 'vertical' : mode.value;
    });
    const renderMode = (0, _vue.computed)(() => mode.value === 'horizontal' ? 'vertical' : mode.value);
    const subMenuTriggerModeRef = (0, _vue.computed)(() => triggerModeRef.value === 'horizontal' ? 'vertical' : triggerModeRef.value);
    const baseTitleNode = () => {
      var _a, _b;
      const subMenuPrefixClsValue = subMenuPrefixCls.value;
      const icon = (_a = props.icon) !== null && _a !== void 0 ? _a : (_b = slots.icon) === null || _b === void 0 ? void 0 : _b.call(slots, props);
      const expandIcon = props.expandIcon || slots.expandIcon || menuExpandIcon.value;
      const title = renderTitle((0, _propsUtil.getPropsSlot)(slots, props, 'title'), icon);
      return (0, _vue.createVNode)("div", {
        "style": directionStyle.value,
        "class": `${subMenuPrefixClsValue}-title`,
        "tabindex": mergedDisabled.value ? null : -1,
        "ref": elementRef,
        "title": typeof title === 'string' ? title : null,
        "data-menu-id": key,
        "aria-expanded": open.value,
        "aria-haspopup": true,
        "aria-controls": popupId,
        "aria-disabled": mergedDisabled.value,
        "onClick": onInternalTitleClick,
        "onFocus": onInternalFocus
      }, [title, mode.value !== 'horizontal' && expandIcon ? expandIcon((0, _extends2.default)((0, _extends2.default)({}, props), {
        isOpen: open.value
      })) : (0, _vue.createVNode)("i", {
        "class": `${subMenuPrefixClsValue}-arrow`
      }, null)]);
    };
    return () => {
      var _a;
      if (isMeasure) {
        if (!hasKey) {
          return null;
        }
        return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
      }
      const subMenuPrefixClsValue = subMenuPrefixCls.value;
      let titleNode = () => null;
      if (!overflowDisabled.value && mode.value !== 'inline') {
        const popupOffset = mode.value === 'horizontal' ? [0, 8] : [10, 0];
        titleNode = () => (0, _vue.createVNode)(_PopupTrigger.default, {
          "mode": triggerModeRef.value,
          "prefixCls": subMenuPrefixClsValue,
          "visible": !props.internalPopupClose && open.value,
          "popupClassName": popupClassName.value,
          "popupOffset": props.popupOffset || popupOffset,
          "disabled": mergedDisabled.value,
          "onVisibleChange": onPopupVisibleChange
        }, {
          default: () => [baseTitleNode()],
          popup: () => (0, _vue.createVNode)(_useMenuContext.MenuContextProvider, {
            "mode": subMenuTriggerModeRef.value
          }, {
            default: () => [(0, _vue.createVNode)(_SubMenuList.default, {
              "id": popupId,
              "ref": popupRef
            }, {
              default: slots.default
            })]
          })
        });
      } else {
        // 包裹一层，保持结构一致，防止动画丢失
        // https://github.com/vueComponent/ant-design-vue/issues/4325
        titleNode = () => (0, _vue.createVNode)(_PopupTrigger.default, null, {
          default: baseTitleNode
        });
      }
      return (0, _vue.createVNode)(_useMenuContext.MenuContextProvider, {
        "mode": renderMode.value
      }, {
        default: () => [(0, _vue.createVNode)(_vcOverflow.default.Item, (0, _objectSpread2.default)((0, _objectSpread2.default)({
          "component": "li"
        }, attrs), {}, {
          "role": "none",
          "class": (0, _classNames.default)(subMenuPrefixClsValue, `${subMenuPrefixClsValue}-${mode.value}`, attrs.class, {
            [`${subMenuPrefixClsValue}-open`]: open.value,
            [`${subMenuPrefixClsValue}-active`]: isActive.value,
            [`${subMenuPrefixClsValue}-selected`]: childrenSelected.value,
            [`${subMenuPrefixClsValue}-disabled`]: mergedDisabled.value
          }),
          "onMouseenter": onMouseEnter,
          "onMouseleave": onMouseLeave,
          "data-submenu-id": key
        }), {
          default: () => {
            return (0, _vue.createVNode)(_vue.Fragment, null, [titleNode(), !overflowDisabled.value && (0, _vue.createVNode)(_InlineSubMenuList.default, {
              "id": popupId,
              "open": open.value,
              "keyPath": keysPath.value
            }, {
              default: slots.default
            })]);
          }
        })]
      });
    };
  }
});