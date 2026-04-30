"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transferSearchProps = exports.default = void 0;
var _vue = require("vue");
var _initDefaultProps = _interopRequireDefault(require("../_util/props-util/initDefaultProps"));
var _SearchOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/SearchOutlined"));
var _input = _interopRequireDefault(require("../input"));
const transferSearchProps = exports.transferSearchProps = {
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
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'Search',
  inheritAttrs: false,
  props: (0, _initDefaultProps.default)(transferSearchProps, {
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
      return (0, _vue.createVNode)(_input.default, {
        "placeholder": placeholder,
        "class": prefixCls,
        "value": value,
        "onChange": handleChange,
        "disabled": disabled,
        "allowClear": true
      }, {
        prefix: () => (0, _vue.createVNode)(_SearchOutlined.default, null, null)
      });
    };
  }
});