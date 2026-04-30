import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import initDefaultProps from '../_util/props-util/initDefaultProps';
import SearchOutlined from "@ant-design/icons-vue/es/icons/SearchOutlined";
import Input from '../input';
import { defineComponent } from 'vue';
export const transferSearchProps = {
  prefixCls: String,
  placeholder: String,
  value: String,
  handleClear: Function,
  disabled: {
    type: Boolean,
    default: undefined
  },
  onChange: Function
};
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'Search',
  inheritAttrs: false,
  props: initDefaultProps(transferSearchProps, {
    placeholder: ''
  }),
  emits: ['change'],
  setup(props, _ref) {
    let {
      emit
    } = _ref;
    const handleChange = e => {
      var _a;
      emit('change', e);
      if (e.target.value === '') {
        (_a = props.handleClear) === null || _a === void 0 ? void 0 : _a.call(props);
      }
    };
    return () => {
      const {
        placeholder,
        value,
        prefixCls,
        disabled
      } = props;
      return _createVNode(Input, {
        "placeholder": placeholder,
        "class": prefixCls,
        "value": value,
        "onChange": handleChange,
        "disabled": disabled,
        "allowClear": true
      }, {
        prefix: () => _createVNode(SearchOutlined, null, null)
      });
    };
  }
});