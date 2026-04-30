"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _Upload = _interopRequireDefault(require("./Upload"));
var _interface = require("./interface");
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AUploadDragger',
  inheritAttrs: false,
  props: (0, _interface.uploadProps)(),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    return () => {
      const {
          height
        } = props,
        restProps = __rest(props, ["height"]);
      const {
          style
        } = attrs,
        restAttrs = __rest(attrs, ["style"]);
      const draggerProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, restProps), restAttrs), {
        type: 'drag',
        style: (0, _extends2.default)((0, _extends2.default)({}, style), {
          height: typeof height === 'number' ? `${height}px` : height
        })
      });
      return (0, _vue.createVNode)(_Upload.default, draggerProps, slots);
    };
  }
});