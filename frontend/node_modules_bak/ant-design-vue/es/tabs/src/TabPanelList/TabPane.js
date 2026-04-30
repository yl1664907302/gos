import { createVNode as _createVNode } from "vue";
import { defineComponent, ref, watch, computed } from 'vue';
import PropTypes from '../../../_util/vue-types';
const tabPaneProps = () => ({
  tab: PropTypes.any,
  disabled: {
    type: Boolean
  },
  forceRender: {
    type: Boolean
  },
  closable: {
    type: Boolean
  },
  animated: {
    type: Boolean
  },
  active: {
    type: Boolean
  },
  destroyInactiveTabPane: {
    type: Boolean
  },
  // Pass by TabPaneList
  prefixCls: {
    type: String
  },
  tabKey: {
    type: [String, Number]
  },
  id: {
    type: String
  }
  // closeIcon: PropTypes.any,
});
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ATabPane',
  inheritAttrs: false,
  __ANT_TAB_PANE: true,
  props: tabPaneProps(),
  slots: Object,
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const visited = ref(props.forceRender);
    watch([() => props.active, () => props.destroyInactiveTabPane], () => {
      if (props.active) {
        visited.value = true;
      } else if (props.destroyInactiveTabPane) {
        visited.value = false;
      }
    }, {
      immediate: true
    });
    const mergedStyle = computed(() => {
      if (!props.active) {
        if (props.animated) {
          return {
            visibility: 'hidden',
            height: 0,
            overflowY: 'hidden'
          };
        } else {
          return {
            display: 'none'
          };
        }
      }
      return {};
    });
    return () => {
      var _a;
      const {
        prefixCls,
        forceRender,
        id,
        active,
        tabKey
      } = props;
      return _createVNode("div", {
        "id": id && `${id}-panel-${tabKey}`,
        "role": "tabpanel",
        "tabindex": active ? 0 : -1,
        "aria-labelledby": id && `${id}-tab-${tabKey}`,
        "aria-hidden": !active,
        "style": [mergedStyle.value, attrs.style],
        "class": [`${prefixCls}-tabpane`, active && `${prefixCls}-tabpane-active`, attrs.class]
      }, [(active || visited.value || forceRender) && ((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots))]);
    };
  }
});