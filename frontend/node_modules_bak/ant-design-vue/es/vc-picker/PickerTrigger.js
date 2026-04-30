import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
import Trigger from '../vc-trigger';
import classNames from '../_util/classNames';
import useMergeProps from './hooks/useMergeProps';
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
  } = useMergeProps(props);
  const dropdownPrefixCls = `${prefixCls}-dropdown`;
  const getPopupPlacement = () => {
    if (popupPlacement !== undefined) {
      return popupPlacement;
    }
    return direction === 'rtl' ? 'bottomRight' : 'bottomLeft';
  };
  return _createVNode(Trigger, {
    "showAction": [],
    "hideAction": [],
    "popupPlacement": getPopupPlacement(),
    "builtinPlacements": BUILT_IN_PLACEMENTS,
    "prefixCls": dropdownPrefixCls,
    "popupTransitionName": transitionName,
    "popupAlign": dropdownAlign,
    "popupVisible": visible,
    "popupClassName": classNames(dropdownClassName, {
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
export default PickerTrigger;