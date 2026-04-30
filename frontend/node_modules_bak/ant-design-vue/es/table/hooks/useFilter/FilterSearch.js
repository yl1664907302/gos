import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import { defineComponent } from 'vue';
import SearchOutlined from "@ant-design/icons-vue/es/icons/SearchOutlined";
import Input from '../../../input';
import { stringType, someType, functionType, objectType } from '../../../_util/type';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'FilterSearch',
  inheritAttrs: false,
  props: {
    value: stringType(),
    onChange: functionType(),
    filterSearch: someType([Boolean, Function]),
    tablePrefixCls: stringType(),
    locale: objectType()
  },
  setup(props) {
    return () => {
      const {
        value,
        onChange,
        filterSearch,
        tablePrefixCls,
        locale
      } = props;
      if (!filterSearch) {
        return null;
      }
      return _createVNode("div", {
        "class": `${tablePrefixCls}-filter-dropdown-search`
      }, [_createVNode(Input, {
        "placeholder": locale.filterSearchPlaceholder,
        "onChange": onChange,
        "value": value,
        "htmlSize": 1,
        "class": `${tablePrefixCls}-filter-dropdown-search-input`
      }, {
        prefix: () => _createVNode(SearchOutlined, null, null)
      })]);
    };
  }
});