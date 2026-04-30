"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _default = exports.default = (0, _vue.defineComponent)({
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
    const domRef = (0, _vue.ref)();
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
      return (0, _vue.createVNode)("button", {
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