import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { Fragment as _Fragment, createVNode as _createVNode } from "vue";
import Col from '../grid/Col';
import { useInjectForm } from './context';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale/en_US';
import classNames from '../_util/classNames';
import Tooltip from '../tooltip';
import QuestionCircleOutlined from "@ant-design/icons-vue/es/icons/QuestionCircleOutlined";
const FormItemLabel = (props, _ref) => {
  let {
    slots,
    emit,
    attrs
  } = _ref;
  var _a, _b, _c, _d, _e;
  const {
    prefixCls,
    htmlFor,
    labelCol,
    labelAlign,
    colon,
    required,
    requiredMark
  } = _extends(_extends({}, props), attrs);
  const [formLocale] = useLocaleReceiver('Form');
  const label = (_a = props.label) !== null && _a !== void 0 ? _a : (_b = slots.label) === null || _b === void 0 ? void 0 : _b.call(slots);
  if (!label) return null;
  const {
    vertical,
    labelAlign: contextLabelAlign,
    labelCol: contextLabelCol,
    labelWrap,
    colon: contextColon
  } = useInjectForm();
  const mergedLabelCol = labelCol || (contextLabelCol === null || contextLabelCol === void 0 ? void 0 : contextLabelCol.value) || {};
  const mergedLabelAlign = labelAlign || (contextLabelAlign === null || contextLabelAlign === void 0 ? void 0 : contextLabelAlign.value);
  const labelClsBasic = `${prefixCls}-item-label`;
  const labelColClassName = classNames(labelClsBasic, mergedLabelAlign === 'left' && `${labelClsBasic}-left`, mergedLabelCol.class, {
    [`${labelClsBasic}-wrap`]: !!labelWrap.value
  });
  let labelChildren = label;
  // Keep label is original where there should have no colon
  const computedColon = colon === true || (contextColon === null || contextColon === void 0 ? void 0 : contextColon.value) !== false && colon !== false;
  const haveColon = computedColon && !vertical.value;
  // Remove duplicated user input colon
  if (haveColon && typeof label === 'string' && label.trim() !== '') {
    labelChildren = label.replace(/[:|：]\s*$/, '');
  }
  // Tooltip
  if (props.tooltip || slots.tooltip) {
    const tooltipNode = _createVNode("span", {
      "class": `${prefixCls}-item-tooltip`
    }, [_createVNode(Tooltip, {
      "title": props.tooltip
    }, {
      default: () => [_createVNode(QuestionCircleOutlined, null, null)]
    })]);
    labelChildren = _createVNode(_Fragment, null, [labelChildren, slots.tooltip ? (_c = slots.tooltip) === null || _c === void 0 ? void 0 : _c.call(slots, {
      class: `${prefixCls}-item-tooltip`
    }) : tooltipNode]);
  }
  // Add required mark if optional
  if (requiredMark === 'optional' && !required) {
    labelChildren = _createVNode(_Fragment, null, [labelChildren, _createVNode("span", {
      "class": `${prefixCls}-item-optional`
    }, [((_d = formLocale.value) === null || _d === void 0 ? void 0 : _d.optional) || ((_e = defaultLocale.Form) === null || _e === void 0 ? void 0 : _e.optional)])]);
  }
  const labelClassName = classNames({
    [`${prefixCls}-item-required`]: required,
    [`${prefixCls}-item-required-mark-optional`]: requiredMark === 'optional',
    [`${prefixCls}-item-no-colon`]: !computedColon
  });
  return _createVNode(Col, _objectSpread(_objectSpread({}, mergedLabelCol), {}, {
    "class": labelColClassName
  }), {
    default: () => [_createVNode("label", {
      "for": htmlFor,
      "class": labelClassName,
      "title": typeof label === 'string' ? label : '',
      "onClick": e => emit('click', e)
    }, [labelChildren])]
  });
};
FormItemLabel.displayName = 'FormItemLabel';
FormItemLabel.inheritAttrs = false;
export default FormItemLabel;