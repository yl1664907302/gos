"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tabsProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _TabNavList = _interopRequireDefault(require("./TabNavList"));
var _TabPanelList = _interopRequireDefault(require("./TabPanelList"));
var _propsUtil = require("../../_util/props-util");
var _useConfigInject = _interopRequireDefault(require("../../config-provider/hooks/useConfigInject"));
var _useState = _interopRequireDefault(require("../../_util/hooks/useState"));
var _isMobile = _interopRequireDefault(require("../../vc-util/isMobile"));
var _useMergedState = _interopRequireDefault(require("../../_util/hooks/useMergedState"));
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _CloseOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseOutlined"));
var _PlusOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/PlusOutlined"));
var _devWarning = _interopRequireDefault(require("../../vc-util/devWarning"));
var _TabContext = require("./TabContext");
var _type = require("../../_util/type");
var _pick = _interopRequireDefault(require("lodash/pick"));
var _vueTypes = _interopRequireDefault(require("../../_util/vue-types"));
var _omit = _interopRequireDefault(require("../../_util/omit"));
var _style = _interopRequireDefault(require("../style"));
// Accessibility https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tab_Role

// Used for accessibility
let uuid = 0;
const tabsProps = () => {
  return {
    prefixCls: {
      type: String
    },
    id: {
      type: String
    },
    popupClassName: String,
    getPopupContainer: (0, _type.functionType)(),
    activeKey: {
      type: [String, Number]
    },
    defaultActiveKey: {
      type: [String, Number]
    },
    direction: (0, _type.stringType)(),
    animated: (0, _type.someType)([Boolean, Object]),
    renderTabBar: (0, _type.functionType)(),
    tabBarGutter: {
      type: Number
    },
    tabBarStyle: (0, _type.objectType)(),
    tabPosition: (0, _type.stringType)(),
    destroyInactiveTabPane: (0, _type.booleanType)(),
    hideAdd: Boolean,
    type: (0, _type.stringType)(),
    size: (0, _type.stringType)(),
    centered: Boolean,
    onEdit: (0, _type.functionType)(),
    onChange: (0, _type.functionType)(),
    onTabClick: (0, _type.functionType)(),
    onTabScroll: (0, _type.functionType)(),
    'onUpdate:activeKey': (0, _type.functionType)(),
    // Accessibility
    locale: (0, _type.objectType)(),
    onPrevClick: (0, _type.functionType)(),
    onNextClick: (0, _type.functionType)(),
    tabBarExtraContent: _vueTypes.default.any
  };
};
exports.tabsProps = tabsProps;
function parseTabList(children) {
  return children.map(node => {
    if ((0, _propsUtil.isValidElement)(node)) {
      const props = (0, _extends2.default)({}, node.props || {});
      for (const [k, v] of Object.entries(props)) {
        delete props[k];
        props[(0, _propsUtil.camelize)(k)] = v;
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
      return (0, _extends2.default)((0, _extends2.default)({
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
const InternalTabs = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'InternalTabs',
  inheritAttrs: false,
  props: (0, _extends2.default)((0, _extends2.default)({}, (0, _propsUtil.initDefaultProps)(tabsProps(), {
    tabPosition: 'top',
    animated: {
      inkBar: true,
      tabPane: false
    }
  })), {
    tabs: (0, _type.arrayType)()
  }),
  slots: Object,
  // emits: ['tabClick', 'tabScroll', 'change', 'update:activeKey'],
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    (0, _devWarning.default)(!(props.onPrevClick !== undefined) && !(props.onNextClick !== undefined), 'Tabs', '`onPrevClick / @prevClick` and `onNextClick / @nextClick` has been removed. Please use `onTabScroll / @tabScroll` instead.');
    (0, _devWarning.default)(!(props.tabBarExtraContent !== undefined), 'Tabs', '`tabBarExtraContent` prop has been removed. Please use `rightExtra` slot instead.');
    (0, _devWarning.default)(!(slots.tabBarExtraContent !== undefined), 'Tabs', '`tabBarExtraContent` slot is deprecated. Please use `rightExtra` slot instead.');
    const {
      prefixCls,
      direction,
      size,
      rootPrefixCls,
      getPopupContainer
    } = (0, _useConfigInject.default)('tabs', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const rtl = (0, _vue.computed)(() => direction.value === 'rtl');
    const mergedAnimated = (0, _vue.computed)(() => {
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
        return (0, _extends2.default)({
          inkBar: true,
          tabPane: false
        }, typeof animated === 'object' ? animated : {});
      }
    });
    // ======================== Mobile ========================
    const [mobile, setMobile] = (0, _useState.default)(false);
    (0, _vue.onMounted)(() => {
      // Only update on the client side
      setMobile((0, _isMobile.default)());
    });
    // ====================== Active Key ======================
    const [mergedActiveKey, setMergedActiveKey] = (0, _useMergedState.default)(() => {
      var _a;
      return (_a = props.tabs[0]) === null || _a === void 0 ? void 0 : _a.key;
    }, {
      value: (0, _vue.computed)(() => props.activeKey),
      defaultValue: props.defaultActiveKey
    });
    const [activeIndex, setActiveIndex] = (0, _useState.default)(() => props.tabs.findIndex(tab => tab.key === mergedActiveKey.value));
    (0, _vue.watchEffect)(() => {
      var _a;
      let newActiveIndex = props.tabs.findIndex(tab => tab.key === mergedActiveKey.value);
      if (newActiveIndex === -1) {
        newActiveIndex = Math.max(0, Math.min(activeIndex.value, props.tabs.length - 1));
        setMergedActiveKey((_a = props.tabs[newActiveIndex]) === null || _a === void 0 ? void 0 : _a.key);
      }
      setActiveIndex(newActiveIndex);
    });
    // ===================== Accessibility ====================
    const [mergedId, setMergedId] = (0, _useMergedState.default)(null, {
      value: (0, _vue.computed)(() => props.id)
    });
    const mergedTabPosition = (0, _vue.computed)(() => {
      if (mobile.value && !['left', 'right'].includes(props.tabPosition)) {
        return 'top';
      } else {
        return props.tabPosition;
      }
    });
    (0, _vue.onMounted)(() => {
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
    (0, _TabContext.useProvideTabs)({
      tabs: (0, _vue.computed)(() => props.tabs),
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
          removeIcon: () => (0, _vue.createVNode)(_CloseOutlined.default, null, null),
          addIcon: slots.addIcon ? slots.addIcon : () => (0, _vue.createVNode)(_PlusOutlined.default, null, null),
          showAdd: hideAdd !== true
        };
      }
      let tabNavBar;
      const tabNavBarProps = (0, _extends2.default)((0, _extends2.default)({}, sharedProps), {
        moreTransitionName: `${rootPrefixCls.value}-slide-up`,
        editable,
        locale,
        tabBarGutter,
        onTabClick: onInternalTabClick,
        onTabScroll,
        style: tabBarStyle,
        getPopupContainer: getPopupContainer.value,
        popupClassName: (0, _classNames.default)(props.popupClassName, hashId.value)
      });
      if (renderTabBar) {
        tabNavBar = renderTabBar((0, _extends2.default)((0, _extends2.default)({}, tabNavBarProps), {
          DefaultTabBar: _TabNavList.default
        }));
      } else {
        tabNavBar = (0, _vue.createVNode)(_TabNavList.default, tabNavBarProps, (0, _pick.default)(slots, ['moreIcon', 'leftExtra', 'rightExtra', 'tabBarExtraContent']));
      }
      const pre = prefixCls.value;
      return wrapSSR((0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "id": id,
        "class": (0, _classNames.default)(pre, `${pre}-${mergedTabPosition.value}`, {
          [hashId.value]: true,
          [`${pre}-${size.value}`]: size.value,
          [`${pre}-card`]: ['card', 'editable-card'].includes(type),
          [`${pre}-editable-card`]: type === 'editable-card',
          [`${pre}-centered`]: centered,
          [`${pre}-mobile`]: mobile.value,
          [`${pre}-editable`]: type === 'editable-card',
          [`${pre}-rtl`]: rtl.value
        }, attrs.class)
      }), [tabNavBar, (0, _vue.createVNode)(_TabPanelList.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({
        "destroyInactiveTabPane": destroyInactiveTabPane
      }, sharedProps), {}, {
        "animated": mergedAnimated.value
      }), null)]));
    };
  }
});
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ATabs',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)(tabsProps(), {
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
      const tabs = parseTabList((0, _propsUtil.flattenChildren)((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)));
      return (0, _vue.createVNode)(InternalTabs, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, (0, _omit.default)(props, ['onUpdate:activeKey'])), attrs), {}, {
        "onChange": handleChange,
        "tabs": tabs
      }), slots);
    };
  }
});