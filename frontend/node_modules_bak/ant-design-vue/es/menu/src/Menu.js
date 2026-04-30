import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { Fragment as _Fragment, createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
import { shallowRef, Teleport, computed, defineComponent, ref, inject, watchEffect, watch, onMounted, unref } from 'vue';
import shallowEqual from '../../_util/shallowequal';
import useProvideMenu, { MenuContextProvider, useProvideFirstLevel } from './hooks/useMenuContext';
import useConfigInject from '../../config-provider/hooks/useConfigInject';
import devWarning from '../../vc-util/devWarning';
import uniq from 'lodash-es/uniq';
import { SiderCollapsedKey } from '../../layout/injectionKey';
import { flattenChildren } from '../../_util/props-util';
import Overflow from '../../vc-overflow';
import MenuItem from './MenuItem';
import SubMenu from './SubMenu';
import EllipsisOutlined from "@ant-design/icons-vue/es/icons/EllipsisOutlined";
import { cloneElement } from '../../_util/vnode';
import { OVERFLOW_KEY, PathContext } from './hooks/useKeyPath';
import collapseMotion from '../../_util/collapseMotion';
import useItems from './hooks/useItems';
import useStyle from '../style';
import { useInjectOverride } from './OverrideContext';
export const menuProps = () => ({
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
const EMPTY_LIST = [];
export default defineComponent({
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
    } = useConfigInject('menu', props);
    const override = useInjectOverride();
    const prefixCls = computed(() => {
      var _a;
      return getPrefixCls('menu', props.prefixCls || ((_a = override === null || override === void 0 ? void 0 : override.prefixCls) === null || _a === void 0 ? void 0 : _a.value));
    });
    const [wrapSSR, hashId] = useStyle(prefixCls, computed(() => {
      return !override;
    }));
    const store = shallowRef(new Map());
    const siderCollapsed = inject(SiderCollapsedKey, ref(undefined));
    const inlineCollapsed = computed(() => {
      if (siderCollapsed.value !== undefined) {
        return siderCollapsed.value;
      }
      return props.inlineCollapsed;
    });
    const {
      itemsNodes
    } = useItems(props);
    const isMounted = shallowRef(false);
    onMounted(() => {
      isMounted.value = true;
    });
    watchEffect(() => {
      devWarning(!(props.inlineCollapsed === true && props.mode !== 'inline'), 'Menu', '`inlineCollapsed` should only be used when `mode` is inline.');
      devWarning(!(siderCollapsed.value !== undefined && props.inlineCollapsed === true), 'Menu', '`inlineCollapsed` not control Menu under Sider. Should set `collapsed` on Sider instead.');
      // devWarning(
      //   !!props.items && !slots.default,
      //   'Menu',
      //   '`children` will be removed in next major version. Please use `items` instead.',
      // );
    });
    const activeKeys = ref([]);
    const mergedSelectedKeys = ref([]);
    const keyMapStore = ref({});
    watch(store, () => {
      const newKeyMapStore = {};
      for (const menuInfo of store.value.values()) {
        newKeyMapStore[menuInfo.key] = menuInfo;
      }
      keyMapStore.value = newKeyMapStore;
    }, {
      flush: 'post'
    });
    watchEffect(() => {
      if (props.activeKey !== undefined) {
        let keys = [];
        const menuInfo = props.activeKey ? keyMapStore.value[props.activeKey] : undefined;
        if (menuInfo && props.activeKey !== undefined) {
          keys = uniq([].concat(unref(menuInfo.parentKeys), props.activeKey));
        } else {
          keys = [];
        }
        if (!shallowEqual(activeKeys.value, keys)) {
          activeKeys.value = keys;
        }
      }
    });
    watch(() => props.selectedKeys, selectedKeys => {
      if (selectedKeys) {
        mergedSelectedKeys.value = selectedKeys.slice();
      }
    }, {
      immediate: true,
      deep: true
    });
    const selectedSubMenuKeys = ref([]);
    watch([keyMapStore, mergedSelectedKeys], () => {
      let subMenuParentKeys = [];
      mergedSelectedKeys.value.forEach(key => {
        const menuInfo = keyMapStore.value[key];
        if (menuInfo) {
          subMenuParentKeys = subMenuParentKeys.concat(unref(menuInfo.parentKeys));
        }
      });
      subMenuParentKeys = uniq(subMenuParentKeys);
      if (!shallowEqual(selectedSubMenuKeys.value, subMenuParentKeys)) {
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
        const selectInfo = _extends(_extends({}, info), {
          selectedKeys: newSelectedKeys
        });
        if (!shallowEqual(newSelectedKeys, mergedSelectedKeys.value)) {
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
    const mergedOpenKeys = ref([]);
    watch(() => props.openKeys, function () {
      let openKeys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mergedOpenKeys.value;
      if (!shallowEqual(mergedOpenKeys.value, openKeys)) {
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
    const disabled = computed(() => !!props.disabled);
    const isRtl = computed(() => direction.value === 'rtl');
    const mergedMode = ref('vertical');
    const mergedInlineCollapsed = shallowRef(false);
    watchEffect(() => {
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
    const isInlineMode = computed(() => mergedMode.value === 'inline');
    const triggerOpenKeys = keys => {
      mergedOpenKeys.value = keys;
      emit('update:openKeys', keys);
      emit('openChange', keys);
    };
    // >>>>> Cache & Reset open keys when inlineCollapsed changed
    const inlineCacheOpenKeys = ref(mergedOpenKeys.value);
    const mountRef = shallowRef(false);
    // Cache
    watch(mergedOpenKeys, () => {
      if (isInlineMode.value) {
        inlineCacheOpenKeys.value = mergedOpenKeys.value;
      }
    }, {
      immediate: true
    });
    // Restore
    watch(isInlineMode, () => {
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
    const className = computed(() => {
      return {
        [`${prefixCls.value}`]: true,
        [`${prefixCls.value}-root`]: true,
        [`${prefixCls.value}-${mergedMode.value}`]: true,
        [`${prefixCls.value}-inline-collapsed`]: mergedInlineCollapsed.value,
        [`${prefixCls.value}-rtl`]: isRtl.value,
        [`${prefixCls.value}-${props.theme}`]: true
      };
    });
    const rootPrefixCls = computed(() => getPrefixCls());
    const defaultMotions = computed(() => ({
      horizontal: {
        name: `${rootPrefixCls.value}-slide-up`
      },
      inline: collapseMotion(`${rootPrefixCls.value}-motion-collapse`),
      other: {
        name: `${rootPrefixCls.value}-zoom-big`
      }
    }));
    useProvideFirstLevel(true);
    const getChildrenKeys = function () {
      let eventKeys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      const keys = [];
      const storeValue = store.value;
      eventKeys.forEach(eventKey => {
        const {
          key,
          childrenEventKeys
        } = storeValue.get(eventKey);
        keys.push(key, ...getChildrenKeys(unref(childrenEventKeys)));
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
        const subPathKeys = getChildrenKeys(unref(childrenEventKeys));
        newOpenKeys = uniq(newOpenKeys.filter(k => !subPathKeys.includes(k)));
      }
      if (!shallowEqual(mergedOpenKeys, newOpenKeys)) {
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
    const lastVisibleIndex = ref(0);
    const expandIcon = computed(() => {
      var _a;
      return props.expandIcon || slots.expandIcon || ((_a = override === null || override === void 0 ? void 0 : override.expandIcon) === null || _a === void 0 ? void 0 : _a.value) ? opt => {
        let icon = props.expandIcon || slots.expandIcon;
        icon = typeof icon === 'function' ? icon(opt) : icon;
        return cloneElement(icon, {
          class: `${prefixCls.value}-submenu-expand-icon`
        }, false);
      } : null;
    });
    useProvideMenu({
      prefixCls,
      activeKeys,
      openKeys: mergedOpenKeys,
      selectedKeys: mergedSelectedKeys,
      changeActiveKeys,
      disabled,
      rtl: isRtl,
      mode: mergedMode,
      inlineIndent: computed(() => props.inlineIndent),
      subMenuCloseDelay: computed(() => props.subMenuCloseDelay),
      subMenuOpenDelay: computed(() => props.subMenuOpenDelay),
      builtinPlacements: computed(() => props.builtinPlacements),
      triggerSubMenuAction: computed(() => props.triggerSubMenuAction),
      getPopupContainer: computed(() => props.getPopupContainer),
      inlineCollapsed: mergedInlineCollapsed,
      theme: computed(() => props.theme),
      siderCollapsed,
      defaultMotions: computed(() => isMounted.value ? defaultMotions.value : null),
      motion: computed(() => isMounted.value ? props.motion : null),
      overflowDisabled: shallowRef(undefined),
      onOpenChange: onInternalOpenChange,
      onItemClick: onInternalClick,
      registerMenuInfo,
      unRegisterMenuInfo,
      selectedSubMenuKeys,
      expandIcon,
      forceSubMenuRender: computed(() => props.forceSubMenuRender),
      rootClassName: hashId
    });
    const getChildrenList = () => {
      var _a;
      return itemsNodes.value || flattenChildren((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots));
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
        _createVNode(MenuContextProvider, {
          "key": child.key,
          "overflowDisabled": index > lastVisibleIndex.value
        }, {
          default: () => child
        }));
      };
      const overflowedIndicator = ((_a = slots.overflowedIndicator) === null || _a === void 0 ? void 0 : _a.call(slots)) || _createVNode(EllipsisOutlined, null, null);
      return wrapSSR(_createVNode(Overflow, _objectSpread(_objectSpread({}, attrs), {}, {
        "onMousedown": props.onMousedown,
        "prefixCls": `${prefixCls.value}-overflow`,
        "component": "ul",
        "itemComponent": MenuItem,
        "class": [className.value, attrs.class, hashId.value],
        "role": "menu",
        "id": props.id,
        "data": getWrapperList(childList),
        "renderRawItem": node => node,
        "renderRawRest": omitItems => {
          // We use origin list since wrapped list use context to prevent open
          const len = omitItems.length;
          const originOmitItems = len ? childList.slice(-len) : null;
          return _createVNode(_Fragment, null, [_createVNode(SubMenu, {
            "eventKey": OVERFLOW_KEY,
            "key": OVERFLOW_KEY,
            "title": overflowedIndicator,
            "disabled": allVisible,
            "internalPopupClose": len === 0
          }, {
            default: () => originOmitItems
          }), _createVNode(PathContext, null, {
            default: () => [_createVNode(SubMenu, {
              "eventKey": OVERFLOW_KEY,
              "key": OVERFLOW_KEY,
              "title": overflowedIndicator,
              "disabled": allVisible,
              "internalPopupClose": len === 0
            }, {
              default: () => originOmitItems
            })]
          })]);
        },
        "maxCount": mergedMode.value !== 'horizontal' || props.disabledOverflow ? Overflow.INVALIDATE : Overflow.RESPONSIVE,
        "ssr": "full",
        "data-menu-list": true,
        "onVisibleChange": newLastIndex => {
          lastVisibleIndex.value = newLastIndex;
        }
      }), {
        default: () => [_createVNode(Teleport, {
          "to": "body"
        }, {
          default: () => [_createVNode("div", {
            "style": {
              display: 'none'
            },
            "aria-hidden": true
          }, [_createVNode(PathContext, null, {
            default: () => [getWrapperList(getChildrenList())]
          })])]
        })]
      }));
    };
  }
});