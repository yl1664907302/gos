import { createVNode as _createVNode } from "vue";
import Menu, { Item as MenuItem } from '../../menu';
import { onBeforeUnmount, defineComponent, inject, shallowRef } from 'vue';
import MentionsContextKey from './MentionsContext';
import Spin from '../../spin';
function noop() {}
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'DropdownMenu',
  props: {
    prefixCls: String,
    options: {
      type: Array,
      default: () => []
    }
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      activeIndex,
      setActiveIndex,
      selectOption,
      onFocus = noop,
      loading
    } = inject(MentionsContextKey, {
      activeIndex: shallowRef(),
      loading: shallowRef(false)
    });
    let timeoutId;
    const onMousedown = e => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        onFocus(e);
      });
    };
    onBeforeUnmount(() => {
      clearTimeout(timeoutId);
    });
    return () => {
      var _a;
      const {
        prefixCls,
        options
      } = props;
      const activeOption = options[activeIndex.value] || {};
      return _createVNode(Menu, {
        "prefixCls": `${prefixCls}-menu`,
        "activeKey": activeOption.value,
        "onSelect": _ref2 => {
          let {
            key
          } = _ref2;
          const option = options.find(_ref3 => {
            let {
              value
            } = _ref3;
            return value === key;
          });
          selectOption(option);
        },
        "onMousedown": onMousedown
      }, {
        default: () => [!loading.value && options.map((option, index) => {
          var _a, _b;
          const {
            value,
            disabled,
            label = option.value,
            class: className,
            style
          } = option;
          return _createVNode(MenuItem, {
            "key": value,
            "disabled": disabled,
            "onMouseenter": () => {
              setActiveIndex(index);
            },
            "class": className,
            "style": style
          }, {
            default: () => [(_b = (_a = slots.option) === null || _a === void 0 ? void 0 : _a.call(slots, option)) !== null && _b !== void 0 ? _b : typeof label === 'function' ? label(option) : label]
          });
        }), !loading.value && options.length === 0 ? _createVNode(MenuItem, {
          "key": "notFoundContent",
          "disabled": true
        }, {
          default: () => [(_a = slots.notFoundContent) === null || _a === void 0 ? void 0 : _a.call(slots)]
        }) : null, loading.value && _createVNode(MenuItem, {
          "key": "loading",
          "disabled": true
        }, {
          default: () => [_createVNode(Spin, {
            "size": "small"
          }, null)]
        })]
      });
    };
  }
});