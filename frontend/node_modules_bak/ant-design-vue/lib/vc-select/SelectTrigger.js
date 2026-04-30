"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vcTrigger = _interopRequireDefault(require("../vc-trigger"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const getBuiltInPlacements = dropdownMatchSelectWidth => {
  // Enable horizontal overflow auto-adjustment when a custom dropdown width is provided
  const adjustX = dropdownMatchSelectWidth === true ? 0 : 1;
  return {
    bottomLeft: {
      points: ['tl', 'bl'],
      offset: [0, 4],
      overflow: {
        adjustX,
        adjustY: 1
      }
    },
    bottomRight: {
      points: ['tr', 'br'],
      offset: [0, 4],
      overflow: {
        adjustX,
        adjustY: 1
      }
    },
    topLeft: {
      points: ['bl', 'tl'],
      offset: [0, -4],
      overflow: {
        adjustX,
        adjustY: 1
      }
    },
    topRight: {
      points: ['br', 'tr'],
      offset: [0, -4],
      overflow: {
        adjustX,
        adjustY: 1
      }
    }
  };
};
const SelectTrigger = (0, _vue.defineComponent)({
  name: 'SelectTrigger',
  inheritAttrs: false,
  props: {
    dropdownAlign: Object,
    visible: {
      type: Boolean,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: undefined
    },
    dropdownClassName: String,
    dropdownStyle: _vueTypes.default.object,
    placement: String,
    empty: {
      type: Boolean,
      default: undefined
    },
    prefixCls: String,
    popupClassName: String,
    animation: String,
    transitionName: String,
    getPopupContainer: Function,
    dropdownRender: Function,
    containerWidth: Number,
    dropdownMatchSelectWidth: _vueTypes.default.oneOfType([Number, Boolean]).def(true),
    popupElement: _vueTypes.default.any,
    direction: String,
    getTriggerDOMNode: Function,
    onPopupVisibleChange: Function,
    onPopupMouseEnter: Function,
    onPopupFocusin: Function,
    onPopupFocusout: Function
  },
  setup(props, _ref) {
    let {
      slots,
      attrs,
      expose
    } = _ref;
    const builtInPlacements = (0, _vue.computed)(() => {
      const {
        dropdownMatchSelectWidth
      } = props;
      return getBuiltInPlacements(dropdownMatchSelectWidth);
    });
    const popupRef = (0, _vue.ref)();
    expose({
      getPopupElement: () => {
        return popupRef.value;
      }
    });
    return () => {
      const _a = (0, _extends2.default)((0, _extends2.default)({}, props), attrs),
        {
          empty = false
        } = _a,
        restProps = __rest(_a, ["empty"]);
      const {
        visible,
        dropdownAlign,
        prefixCls,
        popupElement,
        dropdownClassName,
        dropdownStyle,
        direction = 'ltr',
        placement,
        dropdownMatchSelectWidth,
        containerWidth,
        dropdownRender,
        animation,
        transitionName,
        getPopupContainer,
        getTriggerDOMNode,
        onPopupVisibleChange,
        onPopupMouseEnter,
        onPopupFocusin,
        onPopupFocusout
      } = restProps;
      const dropdownPrefixCls = `${prefixCls}-dropdown`;
      let popupNode = popupElement;
      if (dropdownRender) {
        popupNode = dropdownRender({
          menuNode: popupElement,
          props
        });
      }
      const mergedTransitionName = animation ? `${dropdownPrefixCls}-${animation}` : transitionName;
      const popupStyle = (0, _extends2.default)({
        minWidth: `${containerWidth}px`
      }, dropdownStyle);
      if (typeof dropdownMatchSelectWidth === 'number') {
        popupStyle.width = `${dropdownMatchSelectWidth}px`;
      } else if (dropdownMatchSelectWidth) {
        popupStyle.width = `${containerWidth}px`;
      }
      return (0, _vue.createVNode)(_vcTrigger.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
        "showAction": onPopupVisibleChange ? ['click'] : [],
        "hideAction": onPopupVisibleChange ? ['click'] : [],
        "popupPlacement": placement || (direction === 'rtl' ? 'bottomRight' : 'bottomLeft'),
        "builtinPlacements": builtInPlacements.value,
        "prefixCls": dropdownPrefixCls,
        "popupTransitionName": mergedTransitionName,
        "popupAlign": dropdownAlign,
        "popupVisible": visible,
        "getPopupContainer": getPopupContainer,
        "popupClassName": (0, _classNames.default)(dropdownClassName, {
          [`${dropdownPrefixCls}-empty`]: empty
        }),
        "popupStyle": popupStyle,
        "getTriggerDOMNode": getTriggerDOMNode,
        "onPopupVisibleChange": onPopupVisibleChange
      }), {
        default: slots.default,
        popup: () => (0, _vue.createVNode)("div", {
          "ref": popupRef,
          "onMouseenter": onPopupMouseEnter,
          "onFocusin": onPopupFocusin,
          "onFocusout": onPopupFocusout
        }, [popupNode])
      });
    };
  }
});
var _default = exports.default = SelectTrigger;