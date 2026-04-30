import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
// Accessibility https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tab_Role
import TabNavList from './TabNavList';
import TabPanelList from './TabPanelList';
import { defineComponent, computed, onMounted, watchEffect } from 'vue';
import { camelize, flattenChildren, initDefaultProps, isValidElement } from '../../_util/props-util';
import useConfigInject from '../../config-provider/hooks/useConfigInject';
import useState from '../../_util/hooks/useState';
import isMobile from '../../vc-util/isMobile';
import useMergedState from '../../_util/hooks/useMergedState';
import classNames from '../../_util/classNames';
import CloseOutlined from "@ant-design/icons-vue/es/icons/CloseOutlined";
import PlusOutlined from "@ant-design/icons-vue/es/icons/PlusOutlined";
import devWarning from '../../vc-util/devWarning';
import { useProvideTabs } from './TabContext';
import { arrayType, stringType, someType, functionType, objectType, booleanType } from '../../_util/type';
import pick from 'lodash-es/pick';
import PropTypes from '../../_util/vue-types';
import omit from '../../_util/omit';
import useStyle from '../style';
// Used for accessibility
let uuid = 0;
export const tabsProps = () => {
  return {
    prefixCls: {
      type: String
    },
    id: {
      type: String
    },
    popupClassName: String,
    getPopupContainer: functionType(),
    activeKey: {
      type: [String, Number]
    },
    defaultActiveKey: {
      type: [String, Number]
    },
    direction: stringType(),
    animated: someType([Boolean, Object]),
    renderTabBar: functionType(),
    tabBarGutter: {
      type: Number
    },
    tabBarStyle: objectType(),
    tabPosition: stringType(),
    destroyInactiveTabPane: booleanType(),
    hideAdd: Boolean,
    type: stringType(),
    size: stringType(),
    centered: Boolean,
    onEdit: functionType(),
    onChange: functionType(),
    onTabClick: functionType(),
    onTabScroll: functionType(),
    'onUpdate:activeKey': functionType(),
    // Accessibility
    locale: objectType(),
    onPrevClick: functionType(),
    onNextClick: functionType(),
    tabBarExtraContent: PropTypes.any
  };
};
function parseTabList(children) {
  return children.map(node => {
    if (isValidElement(node)) {
      const props = _extends({}, node.props || {});
      for (const [k, v] of Object.entries(props)) {
        delete props[k];
        props[camelize(k)] = v;
      }
      const slots = node.children || {};
      const key = node.key !== undefined ? node.key : undefined;
      const {
        tab = slots.tab,
        disabled,
        forceRender,
        closable,
        animated,
        active,
        destroyInactiveTabPane
      } = props;
      return _extends(_extends({
        key
      }, props), {
        node,
        closeIcon: slots.closeIcon,
        tab,
        disabled: disabled === '' || disabled,
        forceRender: forceRender === '' || forceRender,
        closable: closable === '' || closable,
        animated: animated === '' || animated,
        active: active === '' || active,
        destroyInactiveTabPane: destroyInactiveTabPane === '' || destroyInactiveTabPane
      });
    }
    return null;
  }).filter(tab => tab);
}
const InternalTabs = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'InternalTabs',
  inheritAttrs: false,
  props: _extends(_extends({}, initDefaultProps(tabsProps(), {
    tabPosition: 'top',
    animated: {
      inkBar: true,
      tabPane: false
    }
  })), {
    tabs: arrayType()
  }),
  slots: Object,
  // emits: ['tabClick', 'tabScroll', 'change', 'update:activeKey'],
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    devWarning(!(props.onPrevClick !== undefined) && !(props.onNextClick !== undefined), 'Tabs', '`onPrevClick / @prevClick` and `onNextClick / @nextClick` has been removed. Please use `onTabScroll / @tabScroll` instead.');
    devWarning(!(props.tabBarExtraContent !== undefined), 'Tabs', '`tabBarExtraContent` prop has been removed. Please use `rightExtra` slot instead.');
    devWarning(!(slots.tabBarExtraContent !== undefined), 'Tabs', '`tabBarExtraContent` slot is deprecated. Please use `rightExtra` slot instead.');
    const {
      prefixCls,
      direction,
      size,
      rootPrefixCls,
      getPopupContainer
    } = useConfigInject('tabs', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const rtl = computed(() => direction.value === 'rtl');
    const mergedAnimated = computed(() => {
      const {
        animated,
        tabPosition
      } = props;
      if (animated === false || ['left', 'right'].includes(tabPosition)) {
        return {
          inkBar: false,
          tabPane: false
        };
      } else if (animated === true) {
        return {
          inkBar: true,
          tabPane: true
        };
      } else {
        return _extends({
          inkBar: true,
          tabPane: false
        }, typeof animated === 'object' ? animated : {});
      }
    });
    // ======================== Mobile ========================
    const [mobile, setMobile] = useState(false);
    onMounted(() => {
      // Only update on the client side
      setMobile(isMobile());
    });
    // ====================== Active Key ======================
    const [mergedActiveKey, setMergedActiveKey] = useMergedState(() => {
      var _a;
      return (_a = props.tabs[0]) === null || _a === void 0 ? void 0 : _a.key;
    }, {
      value: computed(() => props.activeKey),
      defaultValue: props.defaultActiveKey
    });
    const [activeIndex, setActiveIndex] = useState(() => props.tabs.findIndex(tab => tab.key === mergedActiveKey.value));
    watchEffect(() => {
      var _a;
      let newActiveIndex = props.tabs.findIndex(tab => tab.key === mergedActiveKey.value);
      if (newActiveIndex === -1) {
        newActiveIndex = Math.max(0, Math.min(activeIndex.value, props.tabs.length - 1));
        setMergedActiveKey((_a = props.tabs[newActiveIndex]) === null || _a === void 0 ? void 0 : _a.key);
      }
      setActiveIndex(newActiveIndex);
    });
    // ===================== Accessibility ====================
    const [mergedId, setMergedId] = useMergedState(null, {
      value: computed(() => props.id)
    });
    const mergedTabPosition = computed(() => {
      if (mobile.value && !['left', 'right'].includes(props.tabPosition)) {
        return 'top';
      } else {
        return props.tabPosition;
      }
    });
    onMounted(() => {
      if (!props.id) {
        setMergedId(`rc-tabs-${process.env.NODE_ENV === 'test' ? 'test' : uuid}`);
        uuid += 1;
      }
    });
    // ======================== Events ========================
    const onInternalTabClick = (key, e) => {
      var _a, _b;
      (_a = props.onTabClick) === null || _a === void 0 ? void 0 : _a.call(props, key, e);
      const isActiveChanged = key !== mergedActiveKey.value;
      setMergedActiveKey(key);
      if (isActiveChanged) {
        (_b = props.onChange) === null || _b === void 0 ? void 0 : _b.call(props, key);
      }
    };
    useProvideTabs({
      tabs: computed(() => props.tabs),
      prefixCls
    });
    return () => {
      const {
        id,
        type,
        tabBarGutter,
        tabBarStyle,
        locale,
        destroyInactiveTabPane,
        renderTabBar = slots.renderTabBar,
        onTabScroll,
        hideAdd,
        centered
      } = props;
      // ======================== Render ========================
      const sharedProps = {
        id: mergedId.value,
        activeKey: mergedActiveKey.value,
        animated: mergedAnimated.value,
        tabPosition: mergedTabPosition.value,
        rtl: rtl.value,
        mobile: mobile.value
      };
      let editable;
      if (type === 'editable-card') {
        editable = {
          onEdit: (editType, _ref2) => {
            let {
              key,
              event
            } = _ref2;
            var _a;
            (_a = props.onEdit) === null || _a === void 0 ? void 0 : _a.call(props, editType === 'add' ? event : key, editType);
          },
          removeIcon: () => _createVNode(CloseOutlined, null, null),
          addIcon: slots.addIcon ? slots.addIcon : () => _createVNode(PlusOutlined, null, null),
          showAdd: hideAdd !== true
        };
      }
      let tabNavBar;
      const tabNavBarProps = _extends(_extends({}, sharedProps), {
        moreTransitionName: `${rootPrefixCls.value}-slide-up`,
        editable,
        locale,
        tabBarGutter,
        onTabClick: onInternalTabClick,
        onTabScroll,
        style: tabBarStyle,
        getPopupContainer: getPopupContainer.value,
        popupClassName: classNames(props.popupClassName, hashId.value)
      });
      if (renderTabBar) {
        tabNavBar = renderTabBar(_extends(_extends({}, tabNavBarProps), {
          DefaultTabBar: TabNavList
        }));
      } else {
        tabNavBar = _createVNode(TabNavList, tabNavBarProps, pick(slots, ['moreIcon', 'leftExtra', 'rightExtra', 'tabBarExtraContent']));
      }
      const pre = prefixCls.value;
      return wrapSSR(_createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
        "id": id,
        "class": classNames(pre, `${pre}-${mergedTabPosition.value}`, {
          [hashId.value]: true,
          [`${pre}-${size.value}`]: size.value,
          [`${pre}-card`]: ['card', 'editable-card'].includes(type),
          [`${pre}-editable-card`]: type === 'editable-card',
          [`${pre}-centered`]: centered,
          [`${pre}-mobile`]: mobile.value,
          [`${pre}-editable`]: type === 'editable-card',
          [`${pre}-rtl`]: rtl.value
        }, attrs.class)
      }), [tabNavBar, _createVNode(TabPanelList, _objectSpread(_objectSpread({
        "destroyInactiveTabPane": destroyInactiveTabPane
      }, sharedProps), {}, {
        "animated": mergedAnimated.value
      }), null)]));
    };
  }
});
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ATabs',
  inheritAttrs: false,
  props: initDefaultProps(tabsProps(), {
    tabPosition: 'top',
    animated: {
      inkBar: true,
      tabPane: false
    }
  }),
  slots: Object,
  // emits: ['tabClick', 'tabScroll', 'change', 'update:activeKey'],
  setup(props, _ref3) {
    let {
      attrs,
      slots,
      emit
    } = _ref3;
    const handleChange = key => {
      emit('update:activeKey', key);
      emit('change', key);
    };
    return () => {
      var _a;
      const tabs = parseTabList(flattenChildren((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)));
      return _createVNode(InternalTabs, _objectSpread(_objectSpread(_objectSpread({}, omit(props, ['onUpdate:activeKey'])), attrs), {}, {
        "onChange": handleChange,
        "tabs": tabs
      }), slots);
    };
  }
});