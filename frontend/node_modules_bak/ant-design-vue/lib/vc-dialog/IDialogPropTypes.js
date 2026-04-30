"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.dialogPropTypes = dialogPropTypes;
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
function dialogPropTypes() {
  return {
    keyboard: {
      type: Boolean,
      default: undefined
    },
    mask: {
      type: Boolean,
      default: undefined
    },
    afterClose: Function,
    closable: {
      type: Boolean,
      default: undefined
    },
    maskClosable: {
      type: Boolean,
      default: undefined
    },
    visible: {
      type: Boolean,
      default: undefined
    },
    destroyOnClose: {
      type: Boolean,
      default: undefined
    },
    mousePosition: _vueTypes.default.shape({
      x: Number,
      y: Number
    }).loose,
    title: _vueTypes.default.any,
    footer: _vueTypes.default.any,
    transitionName: String,
    maskTransitionName: String,
    animation: _vueTypes.default.any,
    maskAnimation: _vueTypes.default.any,
    wrapStyle: {
      type: Object,
      default: undefined
    },
    bodyStyle: {
      type: Object,
      default: undefined
    },
    maskStyle: {
      type: Object,
      default: undefined
    },
    prefixCls: String,
    wrapClassName: String,
    rootClassName: String,
    width: [String, Number],
    height: [String, Number],
    zIndex: Number,
    bodyProps: _vueTypes.default.any,
    maskProps: _vueTypes.default.any,
    wrapProps: _vueTypes.default.any,
    getContainer: _vueTypes.default.any,
    dialogStyle: {
      type: Object,
      default: undefined
    },
    dialogClass: String,
    closeIcon: _vueTypes.default.any,
    forceRender: {
      type: Boolean,
      default: undefined
    },
    getOpenCount: Function,
    // https://github.com/ant-design/ant-design/issues/19771
    // https://github.com/react-component/dialog/issues/95
    focusTriggerAfterClose: {
      type: Boolean,
      default: undefined
    },
    onClose: Function,
    modalRender: Function
  };
}
var _default = exports.default = dialogPropTypes;