"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _TabContext = require("../TabContext");
var _vnode = require("../../../_util/vnode");
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'TabPanelList',
  inheritAttrs: false,
  props: {
    activeKey: {
      type: [String, Number]
    },
    id: {
      type: String
    },
    rtl: {
      type: Boolean
    },
    animated: {
      type: Object,
      default: undefined
    },
    tabPosition: {
      type: String
    },
    destroyInactiveTabPane: {
      type: Boolean
    }
  },
  setup(props) {
    const {
      tabs,
      prefixCls
    } = (0, _TabContext.useInjectTabs)();
    return () => {
      const {
        id,
        activeKey,
        animated,
        tabPosition,
        rtl,
        destroyInactiveTabPane
      } = props;
      const tabPaneAnimated = animated.tabPane;
      const pre = prefixCls.value;
      const activeIndex = tabs.value.findIndex(tab => tab.key === activeKey);
      return (0, _vue.createVNode)("div", {
        "class": `${pre}-content-holder`
      }, [(0, _vue.createVNode)("div", {
        "class": [`${pre}-content`, `${pre}-content-${tabPosition}`, {
          [`${pre}-content-animated`]: tabPaneAnimated
        }],
        "style": activeIndex && tabPaneAnimated ? {
          [rtl ? 'marginRight' : 'marginLeft']: `-${activeIndex}00%`
        } : null
      }, [tabs.value.map(tab => {
        return (0, _vnode.cloneElement)(tab.node, {
          key: tab.key,
          prefixCls: pre,
          tabKey: tab.key,
          id,
          animated: tabPaneAnimated,
          active: tab.key === activeKey,
          destroyInactiveTabPane
        });
      })])]);
    };
  }
});