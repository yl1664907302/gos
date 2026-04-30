"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dropdownProps = exports.dropdownButtonProps = exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _buttonTypes = _interopRequireDefault(require("../button/buttonTypes"));
var _type = require("../_util/type");
const dropdownProps = () => ({
  arrow: (0, _type.someType)([Boolean, Object]),
  trigger: {
    type: [Array, String]
  },
  menu: (0, _type.objectType)(),
  overlay: _vueTypes.default.any,
  /** @deprecated Please use `open` instead */
  visible: (0, _type.booleanType)(),
  open: (0, _type.booleanType)(),
  disabled: (0, _type.booleanType)(),
  danger: (0, _type.booleanType)(),
  autofocus: (0, _type.booleanType)(),
  align: (0, _type.objectType)(),
  getPopupContainer: Function,
  prefixCls: String,
  transitionName: String,
  placement: String,
  overlayClassName: String,
  overlayStyle: (0, _type.objectType)(),
  forceRender: (0, _type.booleanType)(),
  mouseEnterDelay: Number,
  mouseLeaveDelay: Number,
  openClassName: String,
  minOverlayWidthMatchTrigger: (0, _type.booleanType)(),
  destroyPopupOnHide: (0, _type.booleanType)(),
  /** @deprecated Please use `onOpenChange` instead */
  onVisibleChange: {
    type: Function
  },
  /** @deprecated Please use `onUpdate:open` instead */
  'onUpdate:visible': {
    type: Function
  },
  onOpenChange: {
    type: Function
  },
  'onUpdate:open': {
    type: Function
  }
});
exports.dropdownProps = dropdownProps;
const buttonTypesProps = (0, _buttonTypes.default)();
const dropdownButtonProps = () => (0, _extends2.default)((0, _extends2.default)({}, dropdownProps()), {
  type: buttonTypesProps.type,
  size: String,
  htmlType: buttonTypesProps.htmlType,
  href: String,
  disabled: (0, _type.booleanType)(),
  prefixCls: String,
  icon: _vueTypes.default.any,
  title: String,
  loading: buttonTypesProps.loading,
  onClick: (0, _type.eventType)()
});
exports.dropdownButtonProps = dropdownButtonProps;
var _default = exports.default = dropdownProps;