"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _vcTrigger = _interopRequireDefault(require("../vc-trigger"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _useMergeProps = _interopRequireDefault(require("./hooks/useMergeProps"));
const BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  },
  bottomRight: {
    points: ['tr', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  },
  topRight: {
    points: ['br', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  }
};
function PickerTrigger(props, _ref) {
  let {
    slots
  } = _ref;
  const {
    prefixCls,
    popupStyle,
    visible,
    dropdownClassName,
    dropdownAlign,
    transitionName,
    getPopupContainer,
    range,
    popupPlacement,
    direction
  } = (0, _useMergeProps.default)(props);
  const dropdownPrefixCls = `${prefixCls}-dropdown`;
  const getPopupPlacement = () => {
    if (popupPlacement !== undefined) {
      return popupPlacement;
    }
    return direction === 'rtl' ? 'bottomRight' : 'bottomLeft';
  };
  return (0, _vue.createVNode)(_vcTrigger.default, {
    "showAction": [],
    "hideAction": [],
    "popupPlacement": getPopupPlacement(),
    "builtinPlacements": BUILT_IN_PLACEMENTS,
    "prefixCls": dropdownPrefixCls,
    "popupTransitionName": transitionName,
    "popupAlign": dropdownAlign,
    "popupVisible": visible,
    "popupClassName": (0, _classNames.default)(dropdownClassName, {
      [`${dropdownPrefixCls}-range`]: range,
      [`${dropdownPrefixCls}-rtl`]: direction === 'rtl'
    }),
    "popupStyle": popupStyle,
    "getPopupContainer": getPopupContainer
  }, {
    default: slots.default,
    popup: slots.popupElement
  });
}
var _default = exports.default = PickerTrigger;