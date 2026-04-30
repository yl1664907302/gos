"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _Step = _interopRequireDefault(require("./Step"));
var _type = require("../_util/type");
var _propsUtil = require("../_util/props-util");
var _vnode = require("../_util/vnode");
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'Steps',
  props: {
    type: _vueTypes.default.string.def('default'),
    prefixCls: _vueTypes.default.string.def('vc-steps'),
    iconPrefix: _vueTypes.default.string.def('vc'),
    direction: _vueTypes.default.string.def('horizontal'),
    labelPlacement: _vueTypes.default.string.def('horizontal'),
    status: (0, _type.stringType)('process'),
    size: _vueTypes.default.string.def(''),
    progressDot: _vueTypes.default.oneOfType([_vueTypes.default.looseBool, _vueTypes.default.func]).def(undefined),
    initial: _vueTypes.default.number.def(0),
    current: _vueTypes.default.number.def(0),
    items: _vueTypes.default.array.def(() => []),
    icons: _vueTypes.default.shape({
      finish: _vueTypes.default.any,
      error: _vueTypes.default.any
    }).loose,
    stepIcon: (0, _type.functionType)(),
    isInline: _vueTypes.default.looseBool,
    itemRender: (0, _type.functionType)()
  },
  emits: ['change'],
  setup(props, _ref) {
    let {
      slots,
      emit
    } = _ref;
    const onStepClick = next => {
      const {
        current
      } = props;
      if (current !== next) {
        emit('change', next);
      }
    };
    const renderStep = (item, index, legacyRender) => {
      const {
        prefixCls,
        iconPrefix,
        status,
        current,
        initial,
        icons,
        stepIcon = slots.stepIcon,
        isInline,
        itemRender,
        progressDot = slots.progressDot
      } = props;
      const mergedProgressDot = isInline || progressDot;
      const mergedItem = (0, _extends2.default)((0, _extends2.default)({}, item), {
        class: ''
      });
      const stepNumber = initial + index;
      const commonProps = {
        active: stepNumber === current,
        stepNumber: stepNumber + 1,
        stepIndex: stepNumber,
        key: stepNumber,
        prefixCls,
        iconPrefix,
        progressDot: mergedProgressDot,
        stepIcon,
        icons,
        onStepClick
      };
      // fix tail color
      if (status === 'error' && index === current - 1) {
        mergedItem.class = `${prefixCls}-next-error`;
      }
      if (!mergedItem.status) {
        if (stepNumber === current) {
          mergedItem.status = status;
        } else if (stepNumber < current) {
          mergedItem.status = 'finish';
        } else {
          mergedItem.status = 'wait';
        }
      }
      if (isInline) {
        mergedItem.icon = undefined;
        mergedItem.subTitle = undefined;
      }
      if (legacyRender) {
        return legacyRender((0, _extends2.default)((0, _extends2.default)({}, mergedItem), commonProps));
      }
      if (itemRender) {
        mergedItem.itemRender = stepItem => itemRender(mergedItem, stepItem);
      }
      return (0, _vue.createVNode)(_Step.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, mergedItem), commonProps), {}, {
        "__legacy": false
      }), null);
    };
    const renderStepWithNode = (node, index) => {
      return renderStep((0, _extends2.default)({}, node.props), index, stepProps => {
        const stepNode = (0, _vnode.cloneElement)(node, stepProps);
        return stepNode;
      });
    };
    return () => {
      var _a;
      const {
          prefixCls,
          direction,
          type,
          labelPlacement,
          iconPrefix,
          status,
          size,
          current,
          progressDot = slots.progressDot,
          initial,
          icons,
          items,
          isInline,
          itemRender
        } = props,
        restProps = __rest(props, ["prefixCls", "direction", "type", "labelPlacement", "iconPrefix", "status", "size", "current", "progressDot", "initial", "icons", "items", "isInline", "itemRender"]);
      const isNav = type === 'navigation';
      const mergedProgressDot = isInline || progressDot;
      const mergedDirection = isInline ? 'horizontal' : direction;
      const mergedSize = isInline ? undefined : size;
      const adjustedLabelPlacement = mergedProgressDot ? 'vertical' : labelPlacement;
      const classString = (0, _classNames.default)(prefixCls, `${prefixCls}-${direction}`, {
        [`${prefixCls}-${mergedSize}`]: mergedSize,
        [`${prefixCls}-label-${adjustedLabelPlacement}`]: mergedDirection === 'horizontal',
        [`${prefixCls}-dot`]: !!mergedProgressDot,
        [`${prefixCls}-navigation`]: isNav,
        [`${prefixCls}-inline`]: isInline
      });
      return (0, _vue.createVNode)("div", (0, _objectSpread2.default)({
        "class": classString
      }, restProps), [items.filter(item => item).map((item, index) => renderStep(item, index)), (0, _propsUtil.filterEmpty)((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)).map(renderStepWithNode)]);
    };
  }
});