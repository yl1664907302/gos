"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _vcTour = _interopRequireDefault(require("../vc-tour"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _panelRender = _interopRequireDefault(require("./panelRender"));
var _interface = require("./interface");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _type = require("../_util/type");
var _useMergedType = _interopRequireDefault(require("./useMergedType"));
var _style = _interopRequireDefault(require("./style"));
var _placements = _interopRequireDefault(require("../_util/placements"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

// CSSINJS

const Tour = (0, _vue.defineComponent)({
  name: 'ATour',
  inheritAttrs: false,
  props: (0, _interface.tourProps)(),
  setup(props, _ref) {
    let {
      attrs,
      emit,
      slots
    } = _ref;
    const {
      current,
      type,
      steps,
      defaultCurrent
    } = (0, _vue.toRefs)(props);
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)('tour', props);
    // style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const {
      currentMergedType,
      updateInnerCurrent
    } = (0, _useMergedType.default)({
      defaultType: type,
      steps,
      current,
      defaultCurrent
    });
    return () => {
      const {
          steps,
          current,
          type,
          rootClassName
        } = props,
        restProps = __rest(props, ["steps", "current", "type", "rootClassName"]);
      const customClassName = (0, _classNames.default)({
        [`${prefixCls.value}-primary`]: currentMergedType.value === 'primary',
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
      }, hashId.value, rootClassName);
      const mergedRenderPanel = (stepProps, stepCurrent) => {
        return (0, _vue.createVNode)(_panelRender.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, stepProps), {}, {
          "type": type,
          "current": stepCurrent
        }), {
          indicatorsRender: slots.indicatorsRender
        });
      };
      const onStepChange = stepCurrent => {
        updateInnerCurrent(stepCurrent);
        emit('update:current', stepCurrent);
        emit('change', stepCurrent);
      };
      const builtinPlacements = (0, _vue.computed)(() => (0, _placements.default)({
        arrowPointAtCenter: true,
        autoAdjustOverflow: true
      }));
      return wrapSSR((0, _vue.createVNode)(_vcTour.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), restProps), {}, {
        "rootClassName": customClassName,
        "prefixCls": prefixCls.value,
        "current": current,
        "defaultCurrent": props.defaultCurrent,
        "animated": true,
        "renderPanel": mergedRenderPanel,
        "onChange": onStepChange,
        "steps": steps,
        "builtinPlacements": builtinPlacements.value
      }), null));
    };
  }
});
var _default = exports.default = (0, _type.withInstall)(Tour);