import { createVNode as _createVNode } from "vue";
import { defineComponent, ref } from 'vue';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AddButton',
  inheritAttrs: false,
  props: {
    prefixCls: String,
    editable: {
      type: Object
    },
    locale: {
      type: Object,
      default: undefined
    }
  },
  setup(props, _ref) {
    let {
      expose,
      attrs
    } = _ref;
    const domRef = ref();
    expose({
      domRef
    });
    return () => {
      const {
        prefixCls,
        editable,
        locale
      } = props;
      if (!editable || editable.showAdd === false) {
        return null;
      }
      return _createVNode("button", {
        "ref": domRef,
        "type": "button",
        "class": `${prefixCls}-nav-add`,
        "style": attrs.style,
        "aria-label": (locale === null || locale === void 0 ? void 0 : locale.addAriaLabel) || 'Add tab',
        "onClick": event => {
          editable.onEdit('add', {
            event
          });
        }
      }, [editable.addIcon ? editable.addIcon() : '+']);
    };
  }
});