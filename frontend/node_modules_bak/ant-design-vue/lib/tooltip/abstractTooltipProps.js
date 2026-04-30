"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _type = require("../_util/type");
var _default = () => ({
  trigger: [String, Array],
  open: {
    type: Boolean,
    default: undefined
  },
  /** @deprecated Please use `open` instead. */
  visible: {
    type: Boolean,
    default: undefined
  },
  placement: String,
  color: String,
  transitionName: String,
  overlayStyle: (0, _type.objectType)(),
  overlayInnerStyle: (0, _type.objectType)(),
  overlayClassName: String,
  openClassName: String,
  prefixCls: String,
  mouseEnterDelay: Number,
  mouseLeaveDelay: Number,
  getPopupContainer: Function,
  /**@deprecated Please use `arrow={{ pointAtCenter: true }}` instead. */
  arrowPointAtCenter: {
    type: Boolean,
    default: undefined
  },
  arrow: {
    type: [Boolean, Object],
    default: true
  },
  autoAdjustOverflow: {
    type: [Boolean, Object],
    default: undefined
  },
  destroyTooltipOnHide: {
    type: Boolean,
    default: undefined
  },
  align: (0, _type.objectType)(),
  builtinPlacements: (0, _type.objectType)(),
  children: Array,
  /** @deprecated Please use `onOpenChange` instead. */
  onVisibleChange: Function,
  /** @deprecated Please use `onUpdate:open` instead. */
  'onUpdate:visible': Function,
  onOpenChange: Function,
  'onUpdate:open': Function
});
exports.default = _default;