import { createVNode as _createVNode } from "vue";
import { useInjectTabs } from '../TabContext';
import { defineComponent } from 'vue';
import { cloneElement } from '../../../_util/vnode';
export default defineComponent({
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
    } = useInjectTabs();
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
      return _createVNode("div", {
        "class": `${pre}-content-holder`
      }, [_createVNode("div", {
        "class": [`${pre}-content`, `${pre}-content-${tabPosition}`, {
          [`${pre}-content-animated`]: tabPaneAnimated
        }],
        "style": activeIndex && tabPaneAnimated ? {
          [rtl ? 'marginRight' : 'marginLeft']: `-${activeIndex}00%`
        } : null
      }, [tabs.value.map(tab => {
        return cloneElement(tab.node, {
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