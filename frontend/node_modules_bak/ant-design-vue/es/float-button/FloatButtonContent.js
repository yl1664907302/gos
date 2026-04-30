import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode, Fragment as _Fragment } from "vue";
import { defineComponent } from 'vue';
import FileTextOutlined from "@ant-design/icons-vue/es/icons/FileTextOutlined";
import { floatButtonContentProps } from './interface';
import { filterEmpty } from '../_util/props-util';
const FloatButtonContent = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AFloatButtonContent',
  inheritAttrs: false,
  props: floatButtonContentProps(),
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    return () => {
      var _a;
      const {
        prefixCls
      } = props;
      const description = filterEmpty((_a = slots.description) === null || _a === void 0 ? void 0 : _a.call(slots));
      return _createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": [attrs.class, `${prefixCls}-content`]
      }), [slots.icon || description.length ? _createVNode(_Fragment, null, [slots.icon && _createVNode("div", {
        "class": `${prefixCls}-icon`
      }, [slots.icon()]), description.length ? _createVNode("div", {
        "class": `${prefixCls}-description`
      }, [description]) : null]) : _createVNode("div", {
        "class": `${prefixCls}-icon`
      }, [_createVNode(FileTextOutlined, null, null)])]);
    };
  }
});
export default FloatButtonContent;