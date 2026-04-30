"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tourProps = exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _vcTrigger = _interopRequireWildcard(require("../vc-trigger"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _useMergedState = _interopRequireDefault(require("../_util/hooks/useMergedState"));
var _useTarget = _interopRequireDefault(require("./hooks/useTarget"));
var _TourStep = _interopRequireDefault(require("./TourStep"));
var _Mask = _interopRequireDefault(require("./Mask"));
var _placements = require("./placements");
var _propsUtil = require("../_util/props-util");
var _type = require("../_util/type");
var _PortalWrapper = _interopRequireDefault(require("../_util/PortalWrapper"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const CENTER_PLACEHOLDER = {
  left: '50%',
  top: '50%',
  width: '1px',
  height: '1px'
};
const tourProps = () => {
  const {
    builtinPlacements,
    popupAlign
  } = (0, _vcTrigger.triggerProps)();
  return {
    builtinPlacements,
    popupAlign,
    steps: (0, _type.arrayType)(),
    open: (0, _type.booleanType)(),
    defaultCurrent: {
      type: Number
    },
    current: {
      type: Number
    },
    onChange: (0, _type.functionType)(),
    onClose: (0, _type.functionType)(),
    onFinish: (0, _type.functionType)(),
    mask: (0, _type.someType)([Boolean, Object], true),
    arrow: (0, _type.someType)([Boolean, Object], true),
    rootClassName: {
      type: String
    },
    placement: (0, _type.stringType)('bottom'),
    prefixCls: {
      type: String,
      default: 'rc-tour'
    },
    renderPanel: (0, _type.functionType)(),
    gap: (0, _type.objectType)(),
    animated: (0, _type.someType)([Boolean, Object]),
    scrollIntoViewOptions: (0, _type.someType)([Boolean, Object], true),
    zIndex: {
      type: Number,
      default: 1001
    }
  };
};
exports.tourProps = tourProps;
const Tour = (0, _vue.defineComponent)({
  name: 'Tour',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)(tourProps(), {}),
  setup(props) {
    const {
      defaultCurrent,
      placement,
      mask,
      scrollIntoViewOptions,
      open,
      gap,
      arrow
    } = (0, _vue.toRefs)(props);
    const triggerRef = (0, _vue.ref)();
    const [mergedCurrent, setMergedCurrent] = (0, _useMergedState.default)(0, {
      value: (0, _vue.computed)(() => props.current),
      defaultValue: defaultCurrent.value
    });
    const [mergedOpen, setMergedOpen] = (0, _useMergedState.default)(undefined, {
      value: (0, _vue.computed)(() => props.open),
      postState: origin => mergedCurrent.value < 0 || mergedCurrent.value >= props.steps.length ? false : origin !== null && origin !== void 0 ? origin : true
    });
    const openRef = (0, _vue.shallowRef)(mergedOpen.value);
    (0, _vue.watchEffect)(() => {
      if (mergedOpen.value && !openRef.value) {
        setMergedCurrent(0);
      }
      openRef.value = mergedOpen.value;
    });
    const curStep = (0, _vue.computed)(() => props.steps[mergedCurrent.value] || {});
    const mergedPlacement = (0, _vue.computed)(() => {
      var _a;
      return (_a = curStep.value.placement) !== null && _a !== void 0 ? _a : placement.value;
    });
    const mergedMask = (0, _vue.computed)(() => {
      var _a;
      return mergedOpen.value && ((_a = curStep.value.mask) !== null && _a !== void 0 ? _a : mask.value);
    });
    const mergedScrollIntoViewOptions = (0, _vue.computed)(() => {
      var _a;
      return (_a = curStep.value.scrollIntoViewOptions) !== null && _a !== void 0 ? _a : scrollIntoViewOptions.value;
    });
    const [posInfo, targetElement] = (0, _useTarget.default)((0, _vue.computed)(() => curStep.value.target), open, gap, mergedScrollIntoViewOptions);
    // ========================= arrow =========================
    const mergedArrow = (0, _vue.computed)(() => targetElement.value ? typeof curStep.value.arrow === 'undefined' ? arrow.value : curStep.value.arrow : false);
    const arrowPointAtCenter = (0, _vue.computed)(() => typeof mergedArrow.value === 'object' ? mergedArrow.value.pointAtCenter : false);
    (0, _vue.watch)(arrowPointAtCenter, () => {
      var _a;
      (_a = triggerRef.value) === null || _a === void 0 ? void 0 : _a.forcePopupAlign();
    });
    (0, _vue.watch)(mergedCurrent, () => {
      var _a;
      (_a = triggerRef.value) === null || _a === void 0 ? void 0 : _a.forcePopupAlign();
    });
    // ========================= Change =========================
    const onInternalChange = nextCurrent => {
      var _a;
      setMergedCurrent(nextCurrent);
      (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, nextCurrent);
    };
    return () => {
      var _a;
      const {
          prefixCls,
          steps,
          onClose,
          onFinish,
          rootClassName,
          renderPanel,
          animated,
          zIndex
        } = props,
        restProps = __rest(props, ["prefixCls", "steps", "onClose", "onFinish", "rootClassName", "renderPanel", "animated", "zIndex"]);
      // ========================= Render =========================
      // Skip if not init yet
      if (targetElement.value === undefined) {
        return null;
      }
      const handleClose = () => {
        setMergedOpen(false);
        onClose === null || onClose === void 0 ? void 0 : onClose(mergedCurrent.value);
      };
      const mergedShowMask = typeof mergedMask.value === 'boolean' ? mergedMask.value : !!mergedMask.value;
      const mergedMaskStyle = typeof mergedMask.value === 'boolean' ? undefined : mergedMask.value;
      // when targetElement is not exist, use body as triggerDOMNode
      const getTriggerDOMNode = () => {
        return targetElement.value || document.body;
      };
      const getPopupElement = () => (0, _vue.createVNode)(_TourStep.default, (0, _objectSpread2.default)({
        "arrow": mergedArrow.value,
        "key": "content",
        "prefixCls": prefixCls,
        "total": steps.length,
        "renderPanel": renderPanel,
        "onPrev": () => {
          onInternalChange(mergedCurrent.value - 1);
        },
        "onNext": () => {
          onInternalChange(mergedCurrent.value + 1);
        },
        "onClose": handleClose,
        "current": mergedCurrent.value,
        "onFinish": () => {
          handleClose();
          onFinish === null || onFinish === void 0 ? void 0 : onFinish();
        }
      }, curStep.value), null);
      const posInfoStyle = (0, _vue.computed)(() => {
        const info = posInfo.value || CENTER_PLACEHOLDER;
        // 如果info[key] 是number，添加 px
        const style = {};
        Object.keys(info).forEach(key => {
          if (typeof info[key] === 'number') {
            style[key] = `${info[key]}px`;
          } else {
            style[key] = info[key];
          }
        });
        return style;
      });
      return mergedOpen.value ? (0, _vue.createVNode)(_vue.Fragment, null, [(0, _vue.createVNode)(_Mask.default, {
        "zIndex": zIndex,
        "prefixCls": prefixCls,
        "pos": posInfo.value,
        "showMask": mergedShowMask,
        "style": mergedMaskStyle === null || mergedMaskStyle === void 0 ? void 0 : mergedMaskStyle.style,
        "fill": mergedMaskStyle === null || mergedMaskStyle === void 0 ? void 0 : mergedMaskStyle.color,
        "open": mergedOpen.value,
        "animated": animated,
        "rootClassName": rootClassName
      }, null), (0, _vue.createVNode)(_vcTrigger.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, restProps), {}, {
        "arrow": !!restProps.arrow,
        "builtinPlacements": !curStep.value.target ? undefined : (_a = restProps.builtinPlacements) !== null && _a !== void 0 ? _a : (0, _placements.getPlacements)(arrowPointAtCenter.value),
        "ref": triggerRef,
        "popupStyle": !curStep.value.target ? (0, _extends2.default)((0, _extends2.default)({}, curStep.value.style), {
          position: 'fixed',
          left: CENTER_PLACEHOLDER.left,
          top: CENTER_PLACEHOLDER.top,
          transform: 'translate(-50%, -50%)'
        }) : curStep.value.style,
        "popupPlacement": mergedPlacement.value,
        "popupVisible": mergedOpen.value,
        "popupClassName": (0, _classNames.default)(rootClassName, curStep.value.className),
        "prefixCls": prefixCls,
        "popup": getPopupElement,
        "forceRender": false,
        "destroyPopupOnHide": true,
        "zIndex": zIndex,
        "mask": false,
        "getTriggerDOMNode": getTriggerDOMNode
      }), {
        default: () => [(0, _vue.createVNode)(_PortalWrapper.default, {
          "visible": mergedOpen.value,
          "autoLock": true
        }, {
          default: () => [(0, _vue.createVNode)("div", {
            "class": (0, _classNames.default)(rootClassName, `${prefixCls}-target-placeholder`),
            "style": (0, _extends2.default)((0, _extends2.default)({}, posInfoStyle.value), {
              position: 'fixed',
              pointerEvents: 'none'
            })
          }, null)]
        })]
      })]) : null;
    };
  }
});
var _default = exports.default = Tour;