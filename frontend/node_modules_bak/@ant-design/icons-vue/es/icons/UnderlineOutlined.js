import { createVNode as _createVNode } from "vue";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY
import UnderlineOutlinedSvg from "@ant-design/icons-svg/es/asn/UnderlineOutlined";
import AntdIcon from '../components/AntdIcon';

var UnderlineOutlined = function UnderlineOutlined(props, context) {
  var p = _objectSpread({}, props, context.attrs);

  return _createVNode(AntdIcon, _objectSpread({}, p, {
    "icon": UnderlineOutlinedSvg
  }), null);
};

UnderlineOutlined.displayName = 'UnderlineOutlined';
UnderlineOutlined.inheritAttrs = false;
export default UnderlineOutlined;