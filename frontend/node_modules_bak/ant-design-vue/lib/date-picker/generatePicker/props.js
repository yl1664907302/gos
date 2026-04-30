"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commonProps = commonProps;
exports.datePickerProps = datePickerProps;
exports.rangePickerProps = rangePickerProps;
var _type = require("../../_util/type");
const DataPickerPlacements = ['bottomLeft', 'bottomRight', 'topLeft', 'topRight'];
function commonProps() {
  return {
    id: String,
    /**
     * @deprecated `dropdownClassName` is deprecated which will be removed in next major
     *   version.Please use `popupClassName` instead.
     */
    dropdownClassName: String,
    popupClassName: String,
    popupStyle: (0, _type.objectType)(),
    transitionName: String,
    placeholder: String,
    allowClear: (0, _type.booleanType)(),
    autofocus: (0, _type.booleanType)(),
    disabled: (0, _type.booleanType)(),
    tabindex: Number,
    open: (0, _type.booleanType)(),
    defaultOpen: (0, _type.booleanType)(),
    /** Make input readOnly to avoid popup keyboard in mobile */
    inputReadOnly: (0, _type.booleanType)(),
    format: (0, _type.someType)([String, Function, Array]),
    // Value
    // format:  string | CustomFormat<DateType> | (string | CustomFormat<DateType>)[];
    // Render
    // suffixIcon?: VueNode;
    // clearIcon?: VueNode;
    // prevIcon?: VueNode;
    // nextIcon?: VueNode;
    // superPrevIcon?: VueNode;
    // superNextIcon?: VueNode;
    getPopupContainer: (0, _type.functionType)(),
    panelRender: (0, _type.functionType)(),
    // // Events
    onChange: (0, _type.functionType)(),
    'onUpdate:value': (0, _type.functionType)(),
    onOk: (0, _type.functionType)(),
    onOpenChange: (0, _type.functionType)(),
    'onUpdate:open': (0, _type.functionType)(),
    onFocus: (0, _type.functionType)(),
    onBlur: (0, _type.functionType)(),
    onMousedown: (0, _type.functionType)(),
    onMouseup: (0, _type.functionType)(),
    onMouseenter: (0, _type.functionType)(),
    onMouseleave: (0, _type.functionType)(),
    onClick: (0, _type.functionType)(),
    onContextmenu: (0, _type.functionType)(),
    onKeydown: (0, _type.functionType)(),
    // WAI-ARIA
    role: String,
    name: String,
    autocomplete: String,
    direction: (0, _type.stringType)(),
    showToday: (0, _type.booleanType)(),
    showTime: (0, _type.someType)([Boolean, Object]),
    locale: (0, _type.objectType)(),
    size: (0, _type.stringType)(),
    bordered: (0, _type.booleanType)(),
    dateRender: (0, _type.functionType)(),
    disabledDate: (0, _type.functionType)(),
    mode: (0, _type.stringType)(),
    picker: (0, _type.stringType)(),
    valueFormat: String,
    placement: (0, _type.stringType)(),
    status: (0, _type.stringType)(),
    /** @deprecated Please use `disabledTime` instead. */
    disabledHours: (0, _type.functionType)(),
    /** @deprecated Please use `disabledTime` instead. */
    disabledMinutes: (0, _type.functionType)(),
    /** @deprecated Please use `disabledTime` instead. */
    disabledSeconds: (0, _type.functionType)()
  };
}
function datePickerProps() {
  return {
    defaultPickerValue: (0, _type.someType)([Object, String]),
    defaultValue: (0, _type.someType)([Object, String]),
    value: (0, _type.someType)([Object, String]),
    presets: (0, _type.arrayType)(),
    disabledTime: (0, _type.functionType)(),
    renderExtraFooter: (0, _type.functionType)(),
    showNow: (0, _type.booleanType)(),
    monthCellRender: (0, _type.functionType)(),
    // deprecated  Please use `monthCellRender"` instead.',
    monthCellContentRender: (0, _type.functionType)()
  };
}
function rangePickerProps() {
  return {
    allowEmpty: (0, _type.arrayType)(),
    dateRender: (0, _type.functionType)(),
    defaultPickerValue: (0, _type.arrayType)(),
    defaultValue: (0, _type.arrayType)(),
    value: (0, _type.arrayType)(),
    presets: (0, _type.arrayType)(),
    disabledTime: (0, _type.functionType)(),
    disabled: (0, _type.someType)([Boolean, Array]),
    renderExtraFooter: (0, _type.functionType)(),
    separator: {
      type: String
    },
    showTime: (0, _type.someType)([Boolean, Object]),
    ranges: (0, _type.objectType)(),
    placeholder: (0, _type.arrayType)(),
    mode: (0, _type.arrayType)(),
    onChange: (0, _type.functionType)(),
    'onUpdate:value': (0, _type.functionType)(),
    onCalendarChange: (0, _type.functionType)(),
    onPanelChange: (0, _type.functionType)(),
    onOk: (0, _type.functionType)()
  };
}