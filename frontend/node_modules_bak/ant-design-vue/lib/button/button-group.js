"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.buttonGroupProps = exports.GroupSizeContext = void 0;
var _vue = require("vue");
var _propsUtil = require("../_util/props-util");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _internal = require("../theme/internal");
var _devWarning = _interopRequireDefault(require("../vc-util/devWarning"));
var _createContext = _interopRequireDefault(require("../_util/createContext"));
const buttonGroupProps = () => ({
  prefixCls: String,
  size: {
    type: String
  }
});
exports.buttonGroupProps = buttonGroupProps;
const GroupSizeContext = exports.GroupSizeContext = (0, _createContext.default)();
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AButtonGroup',
  props: buttonGroupProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)('btn-group', props);
    const [,, hashId] = (0, _internal.useToken)();
    GroupSizeContext.useProvide((0, _vue.reactive)({
      size: (0, _vue.computed)(() => props.size)
    }));
    const classes = (0, _vue.computed)(() => {
      const {
        size
      } = props;
      let sizeCls = '';
      switch (size) {
        case 'large':
          sizeCls = 'lg';
          break;
        case 'small':
          sizeCls = 'sm';
          break;
        case 'middle':
        case undefined:
          break;
        default:
          // eslint-disable-next-line no-console
          (0, _devWarning.default)(!size, 'Button.Group', 'Invalid prop `size`.');
      }
      return {
        [`${prefixCls.value}`]: true,
        [`${prefixCls.value}-${sizeCls}`]: sizeCls,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [hashId.value]: true
      };
    });
    return () => {
      var _a;
      return (0, _vue.createVNode)("div", {
        "class": classes.value
      }, [(0, _propsUtil.flattenChildren)((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots))]);
    };
  }
});