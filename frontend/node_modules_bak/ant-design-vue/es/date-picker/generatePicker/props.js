import { stringType, arrayType, someType, booleanType, objectType, functionType } from '../../_util/type';
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
    popupStyle: objectType(),
    transitionName: String,
    placeholder: String,
    allowClear: booleanType(),
    autofocus: booleanType(),
    disabled: booleanType(),
    tabindex: Number,
    open: booleanType(),
    defaultOpen: booleanType(),
    /** Make input readOnly to avoid popup keyboard in mobile */
    inputReadOnly: booleanType(),
    format: someType([String, Function, Array]),
    // Value
    // format:  string | CustomFormat<DateType> | (string | CustomFormat<DateType>)[];
    // Render
    // suffixIcon?: VueNode;
    // clearIcon?: VueNode;
    // prevIcon?: VueNode;
    // nextIcon?: VueNode;
    // superPrevIcon?: VueNode;
    // superNextIcon?: VueNode;
    getPopupContainer: functionType(),
    panelRender: functionType(),
    // // Events
    onChange: functionType(),
    'onUpdate:value': functionType(),
    onOk: functionType(),
    onOpenChange: functionType(),
    'onUpdate:open': functionType(),
    onFocus: functionType(),
    onBlur: functionType(),
    onMousedown: functionType(),
    onMouseup: functionType(),
    onMouseenter: functionType(),
    onMouseleave: functionType(),
    onClick: functionType(),
    onContextmenu: functionType(),
    onKeydown: functionType(),
    // WAI-ARIA
    role: String,
    name: String,
    autocomplete: String,
    direction: stringType(),
    showToday: booleanType(),
    showTime: someType([Boolean, Object]),
    locale: objectType(),
    size: stringType(),
    bordered: booleanType(),
    dateRender: functionType(),
    disabledDate: functionType(),
    mode: stringType(),
    picker: stringType(),
    valueFormat: String,
    placement: stringType(),
    status: stringType(),
    /** @deprecated Please use `disabledTime` instead. */
    disabledHours: functionType(),
    /** @deprecated Please use `disabledTime` instead. */
    disabledMinutes: functionType(),
    /** @deprecated Please use `disabledTime` instead. */
    disabledSeconds: functionType()
  };
}
function datePickerProps() {
  return {
    defaultPickerValue: someType([Object, String]),
    defaultValue: someType([Object, String]),
    value: someType([Object, String]),
    presets: arrayType(),
    disabledTime: functionType(),
    renderExtraFooter: functionType(),
    showNow: booleanType(),
    monthCellRender: functionType(),
    // deprecated  Please use `monthCellRender"` instead.',
    monthCellContentRender: functionType()
  };
}
function rangePickerProps() {
  return {
    allowEmpty: arrayType(),
    dateRender: functionType(),
    defaultPickerValue: arrayType(),
    defaultValue: arrayType(),
    value: arrayType(),
    presets: arrayType(),
    disabledTime: functionType(),
    disabled: someType([Boolean, Array]),
    renderExtraFooter: functionType(),
    separator: {
      type: String
    },
    showTime: someType([Boolean, Object]),
    ranges: objectType(),
    placeholder: arrayType(),
    mode: arrayType(),
    onChange: functionType(),
    'onUpdate:value': functionType(),
    onCalendarChange: functionType(),
    onPanelChange: functionType(),
    onOk: functionType()
  };
}
export { commonProps, datePickerProps, rangePickerProps };