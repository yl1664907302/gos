"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buttonProps = void 0;
exports.convertLegacyProps = convertLegacyProps;
exports.default = void 0;
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _type = require("../_util/type");
function convertLegacyProps(type) {
  if (type === 'danger') {
    return {
      danger: true
    };
  }
  return {
    type
  };
}
const buttonProps = () => ({
  prefixCls: String,
  type: String,
  htmlType: {
    type: String,
    default: 'button'
  },
  shape: {
    type: String
  },
  size: {
    type: String
  },
  loading: {
    type: [Boolean, Object],
    default: () => false
  },
  disabled: {
    type: Boolean,
    default: undefined
  },
  ghost: {
    type: Boolean,
    default: undefined
  },
  block: {
    type: Boolean,
    default: undefined
  },
  danger: {
    type: Boolean,
    default: undefined
  },
  icon: _vueTypes.default.any,
  href: String,
  target: String,
  title: String,
  onClick: (0, _type.eventType)(),
  onMousedown: (0, _type.eventType)()
});
exports.buttonProps = buttonProps;
var _default = exports.default = buttonProps;