import { createVNode as _createVNode } from "vue";
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'PresetPanel',
  props: {
    prefixCls: String,
    presets: {
      type: Array,
      default: () => []
    },
    onClick: Function,
    onHover: Function
  },
  setup(props) {
    return () => {
      if (!props.presets.length) {
        return null;
      }
      return _createVNode("div", {
        "class": `${props.prefixCls}-presets`
      }, [_createVNode("ul", null, [props.presets.map((_ref, index) => {
        let {
          label,
          value
        } = _ref;
        return _createVNode("li", {
          "key": index,
          "onClick": e => {
            e.stopPropagation();
            props.onClick(value);
          },
          "onMouseenter": () => {
            var _a;
            (_a = props.onHover) === null || _a === void 0 ? void 0 : _a.call(props, value);
          },
          "onMouseleave": () => {
            var _a;
            (_a = props.onHover) === null || _a === void 0 ? void 0 : _a.call(props, null);
          }
        }, [label]);
      })])]);
    };
  }
});