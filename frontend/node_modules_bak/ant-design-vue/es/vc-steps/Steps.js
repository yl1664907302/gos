import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import PropTypes from '../_util/vue-types';
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import Step from './Step';
import { functionType, stringType } from '../_util/type';
import { filterEmpty } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'Steps',
  props: {
    type: PropTypes.string.def('default'),
    prefixCls: PropTypes.string.def('vc-steps'),
    iconPrefix: PropTypes.string.def('vc'),
    direction: PropTypes.string.def('horizontal'),
    labelPlacement: PropTypes.string.def('horizontal'),
    status: stringType('process'),
    size: PropTypes.string.def(''),
    progressDot: PropTypes.oneOfType([PropTypes.looseBool, PropTypes.func]).def(undefined),
    initial: PropTypes.number.def(0),
    current: PropTypes.number.def(0),
    items: PropTypes.array.def(() => []),
    icons: PropTypes.shape({
      finish: PropTypes.any,
      error: PropTypes.any
    }).loose,
    stepIcon: functionType(),
    isInline: PropTypes.looseBool,
    itemRender: functionType()
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
      const mergedItem = _extends(_extends({}, item), {
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
        return legacyRender(_extends(_extends({}, mergedItem), commonProps));
      }
      if (itemRender) {
        mergedItem.itemRender = stepItem => itemRender(mergedItem, stepItem);
      }
      return _createVNode(Step, _objectSpread(_objectSpread(_objectSpread({}, mergedItem), commonProps), {}, {
        "__legacy": false
      }), null);
    };
    const renderStepWithNode = (node, index) => {
      return renderStep(_extends({}, node.props), index, stepProps => {
        const stepNode = cloneElement(node, stepProps);
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
      const classString = classNames(prefixCls, `${prefixCls}-${direction}`, {
        [`${prefixCls}-${mergedSize}`]: mergedSize,
        [`${prefixCls}-label-${adjustedLabelPlacement}`]: mergedDirection === 'horizontal',
        [`${prefixCls}-dot`]: !!mergedProgressDot,
        [`${prefixCls}-navigation`]: isNav,
        [`${prefixCls}-inline`]: isInline
      });
      return _createVNode("div", _objectSpread({
        "class": classString
      }, restProps), [items.filter(item => item).map((item, index) => renderStep(item, index)), filterEmpty((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)).map(renderStepWithNode)]);
    };
  }
});