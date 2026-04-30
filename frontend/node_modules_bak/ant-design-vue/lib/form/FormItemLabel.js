"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _Col = _interopRequireDefault(require("../grid/Col"));
var _context = require("./context");
var _LocaleReceiver = require("../locale-provider/LocaleReceiver");
var _en_US = _interopRequireDefault(require("../locale/en_US"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _tooltip = _interopRequireDefault(require("../tooltip"));
var _QuestionCircleOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/QuestionCircleOutlined"));
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
  } = (0, _extends2.default)((0, _extends2.default)({}, props), attrs);
  const [formLocale] = (0, _LocaleReceiver.useLocaleReceiver)('Form');
  const label = (_a = props.label) !== null && _a !== void 0 ? _a : (_b = slots.label) === null || _b === void 0 ? void 0 : _b.call(slots);
  if (!label) return null;
  const {
    vertical,
    labelAlign: contextLabelAlign,
    labelCol: contextLabelCol,
    labelWrap,
    colon: contextColon
  } = (0, _context.useInjectForm)();
  const mergedLabelCol = labelCol || (contextLabelCol === null || contextLabelCol === void 0 ? void 0 : contextLabelCol.value) || {};
  const mergedLabelAlign = labelAlign || (contextLabelAlign === null || contextLabelAlign === void 0 ? void 0 : contextLabelAlign.value);
  const labelClsBasic = `${prefixCls}-item-label`;
  const labelColClassName = (0, _classNames.default)(labelClsBasic, mergedLabelAlign === 'left' && `${labelClsBasic}-left`, mergedLabelCol.class, {
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
    const tooltipNode = (0, _vue.createVNode)("span", {
      "class": `${prefixCls}-item-tooltip`
    }, [(0, _vue.createVNode)(_tooltip.default, {
      "title": props.tooltip
    }, {
      default: () => [(0, _vue.createVNode)(_QuestionCircleOutlined.default, null, null)]
    })]);
    labelChildren = (0, _vue.createVNode)(_vue.Fragment, null, [labelChildren, slots.tooltip ? (_c = slots.tooltip) === null || _c === void 0 ? void 0 : _c.call(slots, {
      class: `${prefixCls}-item-tooltip`
    }) : tooltipNode]);
  }
  // Add required mark if optional
  if (requiredMark === 'optional' && !required) {
    labelChildren = (0, _vue.createVNode)(_vue.Fragment, null, [labelChildren, (0, _vue.createVNode)("span", {
      "class": `${prefixCls}-item-optional`
    }, [((_d = formLocale.value) === null || _d === void 0 ? void 0 : _d.optional) || ((_e = _en_US.default.Form) === null || _e === void 0 ? void 0 : _e.optional)])]);
  }
  const labelClassName = (0, _classNames.default)({
    [`${prefixCls}-item-required`]: required,
    [`${prefixCls}-item-required-mark-optional`]: requiredMark === 'optional',
    [`${prefixCls}-item-no-colon`]: !computedColon
  });
  return (0, _vue.createVNode)(_Col.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, mergedLabelCol), {}, {
    "class": labelColClassName
  }), {
    default: () => [(0, _vue.createVNode)("label", {
      "for": htmlFor,
      "class": labelClassName,
      "title": typeof label === 'string' ? label : '',
      "onClick": e => emit('click', e)
    }, [labelChildren])]
  });
};
FormItemLabel.displayName = 'FormItemLabel';
FormItemLabel.inheritAttrs = false;
var _default = exports.default = FormItemLabel;