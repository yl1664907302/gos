import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
/**
 * Removed:
 *  - getCalendarContainer: use `getPopupContainer` instead
 *  - onOk
 *
 * New Feature:
 *  - picker
 *  - allowEmpty
 *  - selectable
 *
 * Tips: Should add faq about `datetime` mode with `defaultValue`
 */
import PickerPanel from './PickerPanel';
import PickerTrigger from './PickerTrigger';
import PresetPanel from './PresetPanel';
import { formatValue, isEqual, parseValue } from './utils/dateUtil';
import getDataOrAriaProps, { toArray } from './utils/miscUtil';
import { useProvidePanel } from './PanelContext';
import { getDefaultFormat, getInputSize, elementsContains } from './utils/uiUtil';
import usePickerInput from './hooks/usePickerInput';
import useTextValueMapping from './hooks/useTextValueMapping';
import useValueTexts from './hooks/useValueTexts';
import useHoverValue from './hooks/useHoverValue';
import usePresets from './hooks/usePresets';
import { computed, defineComponent, ref, toRef, watch } from 'vue';
import useMergedState from '../_util/hooks/useMergedState';
import { warning } from '../vc-util/warning';
import classNames from '../_util/classNames';
import { legacyPropsWarning } from './utils/warnUtil';
function Picker() {
  return defineComponent({
    name: 'Picker',
    inheritAttrs: false,
    props: ['prefixCls', 'id', 'tabindex', 'dropdownClassName', 'dropdownAlign', 'popupStyle', 'transitionName', 'generateConfig', 'locale', 'inputReadOnly', 'allowClear', 'autofocus', 'showTime', 'showNow', 'showHour', 'showMinute', 'showSecond', 'picker', 'format', 'use12Hours', 'value', 'defaultValue', 'open', 'defaultOpen', 'defaultOpenValue', 'suffixIcon', 'presets', 'clearIcon', 'disabled', 'disabledDate', 'placeholder', 'getPopupContainer', 'panelRender', 'inputRender', 'onChange', 'onOpenChange', 'onPanelChange', 'onFocus', 'onBlur', 'onMousedown', 'onMouseup', 'onMouseenter', 'onMouseleave', 'onContextmenu', 'onClick', 'onKeydown', 'onSelect', 'direction', 'autocomplete', 'showToday', 'renderExtraFooter', 'dateRender', 'minuteStep', 'hourStep', 'secondStep', 'hideDisabledOptions'],
    setup(props, _ref) {
      let {
        attrs,
        expose
      } = _ref;
      const inputRef = ref(null);
      const presets = computed(() => props.presets);
      const presetList = usePresets(presets);
      const picker = computed(() => {
        var _a;
        return (_a = props.picker) !== null && _a !== void 0 ? _a : 'date';
      });
      const needConfirmButton = computed(() => picker.value === 'date' && !!props.showTime || picker.value === 'time');
      // ============================ Warning ============================
      if (process.env.NODE_ENV !== 'production') {
        legacyPropsWarning(props);
      }
      // ============================= State =============================
      const formatList = computed(() => toArray(getDefaultFormat(props.format, picker.value, props.showTime, props.use12Hours)));
      // Panel ref
      const panelDivRef = ref(null);
      const inputDivRef = ref(null);
      const containerRef = ref(null);
      // Real value
      const [mergedValue, setInnerValue] = useMergedState(null, {
        value: toRef(props, 'value'),
        defaultValue: props.defaultValue
      });
      const selectedValue = ref(mergedValue.value);
      const setSelectedValue = val => {
        selectedValue.value = val;
      };
      // Operation ref
      const operationRef = ref(null);
      // Open
      const [mergedOpen, triggerInnerOpen] = useMergedState(false, {
        value: toRef(props, 'open'),
        defaultValue: props.defaultOpen,
        postState: postOpen => props.disabled ? false : postOpen,
        onChange: newOpen => {
          if (props.onOpenChange) {
            props.onOpenChange(newOpen);
          }
          if (!newOpen && operationRef.value && operationRef.value.onClose) {
            operationRef.value.onClose();
          }
        }
      });
      // ============================= Text ==============================
      const [valueTexts, firstValueText] = useValueTexts(selectedValue, {
        formatList,
        generateConfig: toRef(props, 'generateConfig'),
        locale: toRef(props, 'locale')
      });
      const [text, triggerTextChange, resetText] = useTextValueMapping({
        valueTexts,
        onTextChange: newText => {
          const inputDate = parseValue(newText, {
            locale: props.locale,
            formatList: formatList.value,
            generateConfig: props.generateConfig
          });
          if (inputDate && (!props.disabledDate || !props.disabledDate(inputDate))) {
            setSelectedValue(inputDate);
          }
        }
      });
      // ============================ Trigger ============================
      const triggerChange = newValue => {
        const {
          onChange,
          generateConfig,
          locale
        } = props;
        setSelectedValue(newValue);
        setInnerValue(newValue);
        if (onChange && !isEqual(generateConfig, mergedValue.value, newValue)) {
          onChange(newValue, newValue ? formatValue(newValue, {
            generateConfig,
            locale,
            format: formatList.value[0]
          }) : '');
        }
      };
      const triggerOpen = newOpen => {
        if (props.disabled && newOpen) {
          return;
        }
        triggerInnerOpen(newOpen);
      };
      const forwardKeydown = e => {
        if (mergedOpen.value && operationRef.value && operationRef.value.onKeydown) {
          // Let popup panel handle keyboard
          return operationRef.value.onKeydown(e);
        }
        /* istanbul ignore next */
        /* eslint-disable no-lone-blocks */
        {
          warning(false, 'Picker not correct forward Keydown operation. Please help to fire issue about this.');
          return false;
        }
      };
      const onInternalMouseup = function () {
        if (props.onMouseup) {
          props.onMouseup(...arguments);
        }
        if (inputRef.value) {
          inputRef.value.focus();
          triggerOpen(true);
        }
      };
      // ============================= Input =============================
      const [inputProps, {
        focused,
        typing
      }] = usePickerInput({
        blurToCancel: needConfirmButton,
        open: mergedOpen,
        value: text,
        triggerOpen,
        forwardKeydown,
        isClickOutside: target => !elementsContains([panelDivRef.value, inputDivRef.value, containerRef.value], target),
        onSubmit: () => {
          if (
          // When user typing disabledDate with keyboard and enter, this value will be empty
          !selectedValue.value ||
          // Normal disabled check
          props.disabledDate && props.disabledDate(selectedValue.value)) {
            return false;
          }
          triggerChange(selectedValue.value);
          triggerOpen(false);
          resetText();
          return true;
        },
        onCancel: () => {
          triggerOpen(false);
          setSelectedValue(mergedValue.value);
          resetText();
        },
        onKeydown: (e, preventDefault) => {
          var _a;
          (_a = props.onKeydown) === null || _a === void 0 ? void 0 : _a.call(props, e, preventDefault);
        },
        onFocus: e => {
          var _a;
          (_a = props.onFocus) === null || _a === void 0 ? void 0 : _a.call(props, e);
        },
        onBlur: e => {
          var _a;
          (_a = props.onBlur) === null || _a === void 0 ? void 0 : _a.call(props, e);
        }
      });
      // ============================= Sync ==============================
      // Close should sync back with text value
      watch([mergedOpen, valueTexts], () => {
        if (!mergedOpen.value) {
          setSelectedValue(mergedValue.value);
          if (!valueTexts.value.length || valueTexts.value[0] === '') {
            triggerTextChange('');
          } else if (firstValueText.value !== text.value) {
            resetText();
          }
        }
      });
      // Change picker should sync back with text value
      watch(picker, () => {
        if (!mergedOpen.value) {
          resetText();
        }
      });
      // Sync innerValue with control mode
      watch(mergedValue, () => {
        // Sync select value
        setSelectedValue(mergedValue.value);
      });
      const [hoverValue, onEnter, onLeave] = useHoverValue(text, {
        formatList,
        generateConfig: toRef(props, 'generateConfig'),
        locale: toRef(props, 'locale')
      });
      const onContextSelect = (date, type) => {
        if (type === 'submit' || type !== 'key' && !needConfirmButton.value) {
          // triggerChange will also update selected values
          triggerChange(date);
          triggerOpen(false);
        }
      };
      useProvidePanel({
        operationRef,
        hideHeader: computed(() => picker.value === 'time'),
        onSelect: onContextSelect,
        open: mergedOpen,
        defaultOpenValue: toRef(props, 'defaultOpenValue'),
        onDateMouseenter: onEnter,
        onDateMouseleave: onLeave
      });
      expose({
        focus: () => {
          if (inputRef.value) {
            inputRef.value.focus();
          }
        },
        blur: () => {
          if (inputRef.value) {
            inputRef.value.blur();
          }
        }
      });
      return () => {
        const {
          prefixCls = 'rc-picker',
          id,
          tabindex,
          dropdownClassName,
          dropdownAlign,
          popupStyle,
          transitionName,
          generateConfig,
          locale,
          inputReadOnly,
          allowClear,
          autofocus,
          picker = 'date',
          defaultOpenValue,
          suffixIcon,
          clearIcon,
          disabled,
          placeholder,
          getPopupContainer,
          panelRender,
          onMousedown,
          onMouseenter,
          onMouseleave,
          onContextmenu,
          onClick,
          onSelect,
          direction,
          autocomplete = 'off'
        } = props;
        // ============================= Panel =============================
        const panelProps = _extends(_extends(_extends({}, props), attrs), {
          class: classNames({
            [`${prefixCls}-panel-focused`]: !typing.value
          }),
          style: undefined,
          pickerValue: undefined,
          onPickerValueChange: undefined,
          onChange: null
        });
        let panelNode = _createVNode("div", {
          "class": `${prefixCls}-panel-layout`
        }, [_createVNode(PresetPanel, {
          "prefixCls": prefixCls,
          "presets": presetList.value,
          "onClick": nextValue => {
            triggerChange(nextValue);
            triggerOpen(false);
          }
        }, null), _createVNode(PickerPanel, _objectSpread(_objectSpread({}, panelProps), {}, {
          "generateConfig": generateConfig,
          "value": selectedValue.value,
          "locale": locale,
          "tabindex": -1,
          "onSelect": date => {
            onSelect === null || onSelect === void 0 ? void 0 : onSelect(date);
            setSelectedValue(date);
          },
          "direction": direction,
          "onPanelChange": (viewDate, mode) => {
            const {
              onPanelChange
            } = props;
            onLeave(true);
            onPanelChange === null || onPanelChange === void 0 ? void 0 : onPanelChange(viewDate, mode);
          }
        }), null)]);
        if (panelRender) {
          panelNode = panelRender(panelNode);
        }
        const panel = _createVNode("div", {
          "class": `${prefixCls}-panel-container`,
          "ref": panelDivRef,
          "onMousedown": e => {
            e.preventDefault();
          }
        }, [panelNode]);
        let suffixNode;
        if (suffixIcon) {
          suffixNode = _createVNode("span", {
            "class": `${prefixCls}-suffix`
          }, [suffixIcon]);
        }
        let clearNode;
        if (allowClear && mergedValue.value && !disabled) {
          clearNode = _createVNode("span", {
            "onMousedown": e => {
              e.preventDefault();
              e.stopPropagation();
            },
            "onMouseup": e => {
              e.preventDefault();
              e.stopPropagation();
              triggerChange(null);
              triggerOpen(false);
            },
            "class": `${prefixCls}-clear`,
            "role": "button"
          }, [clearIcon || _createVNode("span", {
            "class": `${prefixCls}-clear-btn`
          }, null)]);
        }
        const mergedInputProps = _extends(_extends(_extends(_extends({
          id,
          tabindex,
          disabled,
          readonly: inputReadOnly || typeof formatList.value[0] === 'function' || !typing.value,
          value: hoverValue.value || text.value,
          onInput: e => {
            triggerTextChange(e.target.value);
          },
          autofocus,
          placeholder,
          ref: inputRef,
          title: text.value
        }, inputProps.value), {
          size: getInputSize(picker, formatList.value[0], generateConfig)
        }), getDataOrAriaProps(props)), {
          autocomplete
        });
        const inputNode = props.inputRender ? props.inputRender(mergedInputProps) : _createVNode("input", mergedInputProps, null);
        // ============================ Warning ============================
        if (process.env.NODE_ENV !== 'production') {
          warning(!defaultOpenValue, '`defaultOpenValue` may confuse user for the current value status. Please use `defaultValue` instead.');
        }
        // ============================ Return =============================
        const popupPlacement = direction === 'rtl' ? 'bottomRight' : 'bottomLeft';
        return _createVNode("div", {
          "ref": containerRef,
          "class": classNames(prefixCls, attrs.class, {
            [`${prefixCls}-disabled`]: disabled,
            [`${prefixCls}-focused`]: focused.value,
            [`${prefixCls}-rtl`]: direction === 'rtl'
          }),
          "style": attrs.style,
          "onMousedown": onMousedown,
          "onMouseup": onInternalMouseup,
          "onMouseenter": onMouseenter,
          "onMouseleave": onMouseleave,
          "onContextmenu": onContextmenu,
          "onClick": onClick
        }, [_createVNode("div", {
          "class": classNames(`${prefixCls}-input`, {
            [`${prefixCls}-input-placeholder`]: !!hoverValue.value
          }),
          "ref": inputDivRef
        }, [inputNode, suffixNode, clearNode]), _createVNode(PickerTrigger, {
          "visible": mergedOpen.value,
          "popupStyle": popupStyle,
          "prefixCls": prefixCls,
          "dropdownClassName": dropdownClassName,
          "dropdownAlign": dropdownAlign,
          "getPopupContainer": getPopupContainer,
          "transitionName": transitionName,
          "popupPlacement": popupPlacement,
          "direction": direction
        }, {
          default: () => [_createVNode("div", {
            "style": {
              pointerEvents: 'none',
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0
            }
          }, null)],
          popupElement: () => panel
        })]);
      };
    }
  });
}
export default Picker();