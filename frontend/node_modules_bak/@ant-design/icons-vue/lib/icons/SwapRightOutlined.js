"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = require("vue");

var _SwapRightOutlined = _interopRequireDefault(require("@ant-design/icons-svg/lib/asn/SwapRightOutlined"));

var _AntdIcon = _interopRequireDefault(require("../components/AntdIcon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SwapRightOutlined = function SwapRightOutlined(props, context) {
  var p = _objectSpread({}, props, context.attrs);

  return (0, _vue.createVNode)(_AntdIcon["default"], _objectSpread({}, p, {
    "icon": _SwapRightOutlined["default"]
  }), null);
};

SwapRightOutlined.displayName = 'SwapRightOutlined';
SwapRightOutlined.inheritAttrs = false;
var _default = SwapRightOutlined;
exports["default"] = _default;