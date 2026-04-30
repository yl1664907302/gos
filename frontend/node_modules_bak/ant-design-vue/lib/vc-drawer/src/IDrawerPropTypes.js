"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawerProps = exports.drawerChildProps = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vueTypes = _interopRequireDefault(require("../../_util/vue-types"));
var _type = require("../../_util/type");
const props = () => ({
  prefixCls: String,
  width: _vueTypes.default.oneOfType([_vueTypes.default.string, _vueTypes.default.number]),
  height: _vueTypes.default.oneOfType([_vueTypes.default.string, _vueTypes.default.number]),
  style: {
    type: Object,
    default: undefined
  },
  class: String,
  rootClassName: String,
  rootStyle: (0, _type.objectType)(),
  placement: {
    type: String
  },
  wrapperClassName: String,
  level: {
    type: [String, Array]
  },
  levelMove: {
    type: [Number, Function, Array]
  },
  duration: String,
  ease: String,
  showMask: {
    type: Boolean,
    default: undefined
  },
  maskClosable: {
    type: Boolean,
    default: undefined
  },
  maskStyle: {
    type: Object,
    default: undefined
  },
  afterVisibleChange: Function,
  keyboard: {
    type: Boolean,
    default: undefined
  },
  contentWrapperStyle: (0, _type.arrayType)(),
  autofocus: {
    type: Boolean,
    default: undefined
  },
  open: {
    type: Boolean,
    default: undefined
  },
  // Motion
  motion: (0, _type.functionType)(),
  maskMotion: (0, _type.objectType)()
});
const drawerProps = () => (0, _extends2.default)((0, _extends2.default)({}, props()), {
  forceRender: {
    type: Boolean,
    default: undefined
  },
  getContainer: _vueTypes.default.oneOfType([_vueTypes.default.string, _vueTypes.default.func, _vueTypes.default.object, _vueTypes.default.looseBool])
});
exports.drawerProps = drawerProps;
const drawerChildProps = () => (0, _extends2.default)((0, _extends2.default)({}, props()), {
  getContainer: Function,
  getOpenCount: Function,
  scrollLocker: _vueTypes.default.any,
  inline: Boolean
});
exports.drawerChildProps = drawerChildProps;