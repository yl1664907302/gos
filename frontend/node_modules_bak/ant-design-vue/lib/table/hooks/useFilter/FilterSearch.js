"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _SearchOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/SearchOutlined"));
var _input = _interopRequireDefault(require("../../../input"));
var _type = require("../../../_util/type");
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'FilterSearch',
  inheritAttrs: false,
  props: {
    value: (0, _type.stringType)(),
    onChange: (0, _type.functionType)(),
    filterSearch: (0, _type.someType)([Boolean, Function]),
    tablePrefixCls: (0, _type.stringType)(),
    locale: (0, _type.objectType)()
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
      return (0, _vue.createVNode)("div", {
        "class": `${tablePrefixCls}-filter-dropdown-search`
      }, [(0, _vue.createVNode)(_input.default, {
        "placeholder": locale.filterSearchPlaceholder,
        "onChange": onChange,
        "value": value,
        "htmlSize": 1,
        "class": `${tablePrefixCls}-filter-dropdown-search-input`
      }, {
        prefix: () => (0, _vue.createVNode)(_SearchOutlined.default, null, null)
      })]);
    };
  }
});