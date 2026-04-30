"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.menuProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _shallowequal = _interopRequireDefault(require("../../_util/shallowequal"));
var _useMenuContext = _interopRequireWildcard(require("./hooks/useMenuContext"));
var _useConfigInject = _interopRequireDefault(require("../../config-provider/hooks/useConfigInject"));
var _devWarning = _interopRequireDefault(require("../../vc-util/devWarning"));
var _uniq = _interopRequireDefault(require("lodash/uniq"));
var _injectionKey = require("../../layout/injectionKey");
var _propsUtil = require("../../_util/props-util");
var _vcOverflow = _interopRequireDefault(require("../../vc-overflow"));
var _MenuItem = _interopRequireDefault(require("./MenuItem"));
var _SubMenu = _interopRequireDefault(require("./SubMenu"));
var _EllipsisOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/EllipsisOutlined"));
var _vnode = require("../../_util/vnode");
var _useKeyPath = require("./hooks/useKeyPath");
var _collapseMotion = _interopRequireDefault(require("../../_util/collapseMotion"));
var _useItems = _interopRequireDefault(require("./hooks/useItems"));
var _style = _interopRequireDefault(require("../style"));
var _OverrideContext = require("./OverrideContext");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const menuProps = () => ({
  id: String,
  prefixCls: String,
  // donot use items, now only support inner use
  items: Array,
  disabled: Boolean,
  inlineCollapsed: Boolean,
  disabledOverflow: Boolean,
  forceSubMenuRender: Boolean,
  openKeys: Array,
  selectedKeys: Array,
  activeKey: String,
  selectable: {
    type: Boolean,
    default: true
  },
  multiple: {
    type: Boolean,
    default: false
  },
  tabindex: {
    type: [Number, String]
  },
  motion: Object,
  role: String,
  theme: {
    type: String,
    default: 'light'
  },
  mode: {
    type: String,
    default: 'vertical'
  },
  inlineIndent: {
    type: Number,
    default: 24
  },
  subMenuOpenDelay: {
    type: Number,
    default: 0
  },
  subMenuCloseDelay: {
    type: Number,
    default: 0.1
  },
  builtinPlacements: {
    type: Object
  },
  triggerSubMenuAction: {
    type: String,
    default: 'hover'
  },
  getPopupContainer: Function,
  expandIcon: Function,
  onOpenChange: Function,
  onSelect: Function,
  onDeselect: Function,
  onClick: [Function, Array],
  onFocus: Function,
  onBlur: Function,
  onMousedown: Function,
  'onUpdate:openKeys': Function,
  'onUpdate:selectedKeys': Function,
  'onUpdate:activeKey': Function
});
exports.menuProps = menuProps;
const EMPTY_LIST = [];
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AMenu',
  inheritAttrs: false,
  props: menuProps(),
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      emit,
      attrs
    } = _ref;
    const {
      direction,
      getPrefixCls
    } = (0, _useConfigInject.default)('menu', props);
    const override = (0, _OverrideContext.useInjectOverride)();
    const prefixCls = (0, _vue.computed)(() => {
      var _a;
      return getPrefixCls('menu', props.prefixCls || ((_a = override === null || override === void 0 ? void 0 : override.prefixCls) === null || _a === void 0 ? void 0 : _a.value));
    });
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls, (0, _vue.computed)(() => {
      return !override;
    }));
    const store = (0, _vue.shallowRef)(new Map());
    const siderCollapsed = (0, _vue.inject)(_injectionKey.SiderCollapsedKey, (0, _vue.ref)(undefined));
    const inlineCollapsed = (0, _vue.computed)(() => {
      if (siderCollapsed.value !== undefined) {
        return siderCollapsed.value;
      }
      return props.inlineCollapsed;
    });
    const {
      itemsNodes
    } = (0, _useItems.default)(props);
    const isMounted = (0, _vue.shallowRef)(false);
    (0, _vue.onMounted)(() => {
      isMounted.value = true;
    });
    (0, _vue.watchEffect)(() => {
      (0, _devWarning.default)(!(props.inlineCollapsed === true && props.mode !== 'inline'), 'Menu', '`inlineCollapsed` should only be used when `mode` is inline.');
      (0, _devWarning.default)(!(siderCollapsed.value !== undefined && props.inlineCollapsed === true), 'Menu', '`inlineCollapsed` not control Menu under Sider. Should set `collapsed` on Sider instead.');
      // devWarning(
      //   !!props.items && !slots.default,
      //   'Menu',
      //   '`children` will be removed in next major version. Please use `items` instead.',
      // );
    });
    const activeKeys = (0, _vue.ref)([]);
    const mergedSelectedKeys = (0, _vue.ref)([]);
    const keyMapStore = (0, _vue.ref)({});
    (0, _vue.watch)(store, () => {
      const newKeyMapStore = {};
      for (const menuInfo of store.value.values()) {
        newKeyMapStore[menuInfo.key] = menuInfo;
      }
      keyMapStore.value = newKeyMapStore;
    }, {
      flush: 'post'
    });
    (0, _vue.watchEffect)(() => {
      if (props.activeKey !== undefined) {
        let keys = [];
        const menuInfo = props.activeKey ? keyMapStore.value[props.activeKey] : undefined;
        if (menuInfo && props.activeKey !== undefined) {
          keys = (0, _uniq.default)([].concat((0, _vue.unref)(menuInfo.parentKeys), props.activeKey));
        } else {
          keys = [];
        }
        if (!(0, _shallowequal.default)(activeKeys.value, keys)) {
          activeKeys.value = keys;
        }
      }
    });
    (0, _vue.watch)(() => props.selectedKeys, selectedKeys => {
      if (selectedKeys) {
        mergedSelectedKeys.value = selectedKeys.slice();
      }
    }, {
      immediate: true,
      deep: true
    });
    const selectedSubMenuKeys = (0, _vue.ref)([]);
    (0, _vue.watch)([keyMapStore, mergedSelectedKeys], () => {
      let subMenuParentKeys = [];
      mergedSelectedKeys.value.forEach(key => {
        const menuInfo = keyMapStore.value[key];
        if (menuInfo) {
          subMenuParentKeys = subMenuParentKeys.concat((0, _vue.unref)(menuInfo.parentKeys));
        }
      });
      subMenuParentKeys = (0, _uniq.default)(subMenuParentKeys);
      if (!(0, _shallowequal.default)(selectedSubMenuKeys.value, subMenuParentKeys)) {
        selectedSubMenuKeys.value = subMenuParentKeys;
      }
    }, {
      immediate: true
    });
    // >>>>> Trigger select
    const triggerSelection = info => {
      if (props.selectable) {
        // Insert or Remove
        const {
          key: targetKey
        } = info;
        const exist = mergedSelectedKeys.value.includes(targetKey);
        let newSelectedKeys;
        if (props.multiple) {
          if (exist) {
            newSelectedKeys = mergedSelectedKeys.value.filter(key => key !== targetKey);
          } else {
            newSelectedKeys = [...mergedSelectedKeys.value, targetKey];
          }
        } else {
          newSelectedKeys = [targetKey];
        }
        // Trigger event
        const selectInfo = (0, _extends2.default)((0, _extends2.default)({}, info), {
          selectedKeys: newSelectedKeys
        });
        if (!(0, _shallowequal.default)(newSelectedKeys, mergedSelectedKeys.value)) {
          if (props.selectedKeys === undefined) {
            mergedSelectedKeys.value = newSelectedKeys;
          }
          emit('update:selectedKeys', newSelectedKeys);
          if (exist && props.multiple) {
            emit('deselect', selectInfo);
          } else {
            emit('select', selectInfo);
          }
        }
      }
      // Whatever selectable, always close it
      if (mergedMode.value !== 'inline' && !props.multiple && mergedOpenKeys.value.length) {
        triggerOpenKeys(EMPTY_LIST);
      }
    };
    const mergedOpenKeys = (0, _vue.ref)([]);
    (0, _vue.watch)(() => props.openKeys, function () {
      let openKeys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mergedOpenKeys.value;
      if (!(0, _shallowequal.default)(mergedOpenKeys.value, openKeys)) {
        mergedOpenKeys.value = openKeys.slice();
      }
    }, {
      immediate: true,
      deep: true
    });
    let timeout;
    const changeActiveKeys = keys => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (props.activeKey === undefined) {
          activeKeys.value = keys;
        }
        emit('update:activeKey', keys[keys.length - 1]);
      });
    };
    const disabled = (0, _vue.computed)(() => !!props.disabled);
    const isRtl = (0, _vue.computed)(() => direction.value === 'rtl');
    const mergedMode = (0, _vue.ref)('vertical');
    const mergedInlineCollapsed = (0, _vue.shallowRef)(false);
    (0, _vue.watchEffect)(() => {
      var _a;
      if ((props.mode === 'inline' || props.mode === 'vertical') && inlineCollapsed.value) {
        mergedMode.value = 'vertical';
        mergedInlineCollapsed.value = inlineCollapsed.value;
      } else {
        mergedMode.value = props.mode;
        mergedInlineCollapsed.value = false;
      }
      if ((_a = override === null || override === void 0 ? void 0 : override.mode) === null || _a === void 0 ? void 0 : _a.value) {
        mergedMode.value = override.mode.value;
      }
    });
    const isInlineMode = (0, _vue.computed)(() => mergedMode.value === 'inline');
    const triggerOpenKeys = keys => {
      mergedOpenKeys.value = keys;
      emit('update:openKeys', keys);
      emit('openChange', keys);
    };
    // >>>>> Cache & Reset open keys when inlineCollapsed changed
    const inlineCacheOpenKeys = (0, _vue.ref)(mergedOpenKeys.value);
    const mountRef = (0, _vue.shallowRef)(false);
    // Cache
    (0, _vue.watch)(mergedOpenKeys, () => {
      if (isInlineMode.value) {
        inlineCacheOpenKeys.value = mergedOpenKeys.value;
      }
    }, {
      immediate: true
    });
    // Restore
    (0, _vue.watch)(isInlineMode, () => {
      if (!mountRef.value) {
        mountRef.value = true;
        return;
      }
      if (isInlineMode.value) {
        mergedOpenKeys.value = inlineCacheOpenKeys.value;
      } else {
        // Trigger open event in case its in control
        triggerOpenKeys(EMPTY_LIST);
      }
    }, {
      immediate: true
    });
    const className = (0, _vue.computed)(() => {
      return {
        [`${prefixCls.value}`]: true,
        [`${prefixCls.value}-root`]: true,
        [`${prefixCls.value}-${mergedMode.value}`]: true,
        [`${prefixCls.value}-inline-collapsed`]: mergedInlineCollapsed.value,
        [`${prefixCls.value}-rtl`]: isRtl.value,
        [`${prefixCls.value}-${props.theme}`]: true
      };
    });
    const rootPrefixCls = (0, _vue.computed)(() => getPrefixCls());
    const defaultMotions = (0, _vue.computed)(() => ({
      horizontal: {
        name: `${rootPrefixCls.value}-slide-up`
      },
      inline: (0, _collapseMotion.default)(`${rootPrefixCls.value}-motion-collapse`),
      other: {
        name: `${rootPrefixCls.value}-zoom-big`
      }
    }));
    (0, _useMenuContext.useProvideFirstLevel)(true);
    const getChildrenKeys = function () {
      let eventKeys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      const keys = [];
      const storeValue = store.value;
      eventKeys.forEach(eventKey => {
        const {
          key,
          childrenEventKeys
        } = storeValue.get(eventKey);
        keys.push(key, ...getChildrenKeys((0, _vue.unref)(childrenEventKeys)));
      });
      return keys;
    };
    // ========================= Open =========================
    /**
     * Click for item. SubMenu do not have selection status
     */
    const onInternalClick = info => {
      var _a;
      emit('click', info);
      triggerSelection(info);
      (_a = override === null || override === void 0 ? void 0 : override.onClick) === null || _a === void 0 ? void 0 : _a.call(override);
    };
    const onInternalOpenChange = (key, open) => {
      var _a;
      const childrenEventKeys = ((_a = keyMapStore.value[key]) === null || _a === void 0 ? void 0 : _a.childrenEventKeys) || [];
      let newOpenKeys = mergedOpenKeys.value.filter(k => k !== key);
      if (open) {
        newOpenKeys.push(key);
      } else if (mergedMode.value !== 'inline') {
        // We need find all related popup to close
        const subPathKeys = getChildrenKeys((0, _vue.unref)(childrenEventKeys));
        newOpenKeys = (0, _uniq.default)(newOpenKeys.filter(k => !subPathKeys.includes(k)));
      }
      if (!(0, _shallowequal.default)(mergedOpenKeys, newOpenKeys)) {
        triggerOpenKeys(newOpenKeys);
      }
    };
    const registerMenuInfo = (key, info) => {
      store.value.set(key, info);
      store.value = new Map(store.value);
    };
    const unRegisterMenuInfo = key => {
      store.value.delete(key);
      store.value = new Map(store.value);
    };
    const lastVisibleIndex = (0, _vue.ref)(0);
    const expandIcon = (0, _vue.computed)(() => {
      var _a;
      return props.expandIcon || slots.expandIcon || ((_a = override === null || override === void 0 ? void 0 : override.expandIcon) === null || _a === void 0 ? void 0 : _a.value) ? opt => {
        let icon = props.expandIcon || slots.expandIcon;
        icon = typeof icon === 'function' ? icon(opt) : icon;
        return (0, _vnode.cloneElement)(icon, {
          class: `${prefixCls.value}-submenu-expand-icon`
        }, false);
      } : null;
    });
    (0, _useMenuContext.default)({
      prefixCls,
      activeKeys,
      openKeys: mergedOpenKeys,
      selectedKeys: mergedSelectedKeys,
      changeActiveKeys,
      disabled,
      rtl: isRtl,
      mode: mergedMode,
      inlineIndent: (0, _vue.computed)(() => props.inlineIndent),
      subMenuCloseDelay: (0, _vue.computed)(() => props.subMenuCloseDelay),
      subMenuOpenDelay: (0, _vue.computed)(() => props.subMenuOpenDelay),
      builtinPlacements: (0, _vue.computed)(() => props.builtinPlacements),
      triggerSubMenuAction: (0, _vue.computed)(() => props.triggerSubMenuAction),
      getPopupContainer: (0, _vue.computed)(() => props.getPopupContainer),
      inlineCollapsed: mergedInlineCollapsed,
      theme: (0, _vue.computed)(() => props.theme),
      siderCollapsed,
      defaultMotions: (0, _vue.computed)(() => isMounted.value ? defaultMotions.value : null),
      motion: (0, _vue.computed)(() => isMounted.value ? props.motion : null),
      overflowDisabled: (0, _vue.shallowRef)(undefined),
      onOpenChange: onInternalOpenChange,
      onItemClick: onInternalClick,
      registerMenuInfo,
      unRegisterMenuInfo,
      selectedSubMenuKeys,
      expandIcon,
      forceSubMenuRender: (0, _vue.computed)(() => props.forceSubMenuRender),
      rootClassName: hashId
    });
    const getChildrenList = () => {
      var _a;
      return itemsNodes.value || (0, _propsUtil.flattenChildren)((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots));
    };
    return () => {
      var _a;
      const childList = getChildrenList();
      const allVisible = lastVisibleIndex.value >= childList.length - 1 || mergedMode.value !== 'horizontal' || props.disabledOverflow;
      // >>>>> Children
      const getWrapperList = childList => {
        return mergedMode.value !== 'horizontal' || props.disabledOverflow ? childList :
        // Need wrap for overflow dropdown that do not response for open
        childList.map((child, index) => // Always wrap provider to avoid sub node re-mount
        (0, _vue.createVNode)(_useMenuContext.MenuContextProvider, {
          "key": child.key,
          "overflowDisabled": index > lastVisibleIndex.value
        }, {
          default: () => child
        }));
      };
      const overflowedIndicator = ((_a = slots.overflowedIndicator) === null || _a === void 0 ? void 0 : _a.call(slots)) || (0, _vue.createVNode)(_EllipsisOutlined.default, null, null);
      return wrapSSR((0, _vue.createVNode)(_vcOverflow.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "onMousedown": props.onMousedown,
        "prefixCls": `${prefixCls.value}-overflow`,
        "component": "ul",
        "itemComponent": _MenuItem.default,
        "class": [className.value, attrs.class, hashId.value],
        "role": "menu",
        "id": props.id,
        "data": getWrapperList(childList),
        "renderRawItem": node => node,
        "renderRawRest": omitItems => {
          // We use origin list since wrapped list use context to prevent open
          const len = omitItems.length;
          const originOmitItems = len ? childList.slice(-len) : null;
          return (0, _vue.createVNode)(_vue.Fragment, null, [(0, _vue.createVNode)(_SubMenu.default, {
            "eventKey": _useKeyPath.OVERFLOW_KEY,
            "key": _useKeyPath.OVERFLOW_KEY,
            "title": overflowedIndicator,
            "disabled": allVisible,
            "internalPopupClose": len === 0
          }, {
            default: () => originOmitItems
          }), (0, _vue.createVNode)(_useKeyPath.PathContext, null, {
            default: () => [(0, _vue.createVNode)(_SubMenu.default, {
              "eventKey": _useKeyPath.OVERFLOW_KEY,
              "key": _useKeyPath.OVERFLOW_KEY,
              "title": overflowedIndicator,
              "disabled": allVisible,
              "internalPopupClose": len === 0
            }, {
              default: () => originOmitItems
            })]
          })]);
        },
        "maxCount": mergedMode.value !== 'horizontal' || props.disabledOverflow ? _vcOverflow.default.INVALIDATE : _vcOverflow.default.RESPONSIVE,
        "ssr": "full",
        "data-menu-list": true,
        "onVisibleChange": newLastIndex => {
          lastVisibleIndex.value = newLastIndex;
        }
      }), {
        default: () => [(0, _vue.createVNode)(_vue.Teleport, {
          "to": "body"
        }, {
          default: () => [(0, _vue.createVNode)("div", {
            "style": {
              display: 'none'
            },
            "aria-hidden": true
          }, [(0, _vue.createVNode)(_useKeyPath.PathContext, null, {
            default: () => [getWrapperList(getChildrenList())]
          })])]
        })]
      }));
    };
  }
});