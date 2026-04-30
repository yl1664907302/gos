"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noop = noop;
exports.triggerProps = void 0;
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
function returnEmptyString() {
  return '';
}
function returnDocument(element) {
  if (element) {
    return element.ownerDocument;
  }
  return window.document;
}
function noop() {}
const triggerProps = () => ({
  action: _vueTypes.default.oneOfType([_vueTypes.default.string, _vueTypes.default.arrayOf(_vueTypes.default.string)]).def([]),
  showAction: _vueTypes.default.any.def([]),
  hideAction: _vueTypes.default.any.def([]),
  getPopupClassNameFromAlign: _vueTypes.default.any.def(returnEmptyString),
  onPopupVisibleChange: Function,
  afterPopupVisibleChange: _vueTypes.default.func.def(noop),
  popup: _vueTypes.default.any,
  arrow: _vueTypes.default.bool.def(true),
  popupStyle: {
    type: Object,
    default: undefined
  },
  prefixCls: _vueTypes.default.string.def('rc-trigger-popup'),
  popupClassName: _vueTypes.default.string.def(''),
  popupPlacement: String,
  builtinPlacements: _vueTypes.default.object,
  popupTransitionName: String,
  popupAnimation: _vueTypes.default.any,
  mouseEnterDelay: _vueTypes.default.number.def(0),
  mouseLeaveDelay: _vueTypes.default.number.def(0.1),
  zIndex: Number,
  focusDelay: _vueTypes.default.number.def(0),
  blurDelay: _vueTypes.default.number.def(0.15),
  getPopupContainer: Function,
  getDocument: _vueTypes.default.func.def(returnDocument),
  forceRender: {
    type: Boolean,
    default: undefined
  },
  destroyPopupOnHide: {
    type: Boolean,
    default: false
  },
  mask: {
    type: Boolean,
    default: false
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  // onPopupAlign: PropTypes.func.def(noop),
  popupAlign: _vueTypes.default.object.def(() => ({})),
  popupVisible: {
    type: Boolean,
    default: undefined
  },
  defaultPopupVisible: {
    type: Boolean,
    default: false
  },
  maskTransitionName: String,
  maskAnimation: String,
  stretch: String,
  alignPoint: {
    type: Boolean,
    default: undefined
  },
  autoDestroy: {
    type: Boolean,
    default: false
  },
  mobile: Object,
  getTriggerDOMNode: Function
});
exports.triggerProps = triggerProps;