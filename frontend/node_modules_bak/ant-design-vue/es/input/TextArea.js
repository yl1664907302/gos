import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import { computed, defineComponent, getCurrentInstance, nextTick, shallowRef, watch, watchEffect } from 'vue';
import ClearableLabeledInput from './ClearableLabeledInput';
import ResizableTextArea from './ResizableTextArea';
import { textAreaProps } from './inputProps';
import { fixControlledValue, resolveOnChange, triggerFocus } from '../vc-input/utils/commonUtils';
import classNames from '../_util/classNames';
import { FormItemInputContext, useInjectFormItemContext } from '../form/FormItemContext';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import omit from '../_util/omit';
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils';
// CSSINJS
import useStyle from './style';
import { useInjectDisabled } from '../config-provider/DisabledContext';
function fixEmojiLength(value, maxLength) {
  return [...(value || '')].slice(0, maxLength).join('');
}
function setTriggerValue(isCursorInEnd, preValue, triggerValue, maxLength) {
  let newTriggerValue = triggerValue;
  if (isCursorInEnd) {
    // 光标在尾部，直接截断
    newTriggerValue = fixEmojiLength(triggerValue, maxLength);
  } else if ([...(preValue || '')].length < triggerValue.length && [...(triggerValue || '')].length > maxLength) {
    // 光标在中间，如果最后的值超过最大值，则采用原先的值
    newTriggerValue = preValue;
  }
  return newTriggerValue;
}
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ATextarea',
  inheritAttrs: false,
  props: textAreaProps(),
  setup(props, _ref) {
    let {
      attrs,
      expose,
      emit
    } = _ref;
    var _a;
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));
    const stateValue = shallowRef((_a = props.value) !== null && _a !== void 0 ? _a : props.defaultValue);
    const resizableTextArea = shallowRef();
    const mergedValue = shallowRef('');
    const {
      prefixCls,
      size,
      direction
    } = useConfigInject('input', props);
    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const disabled = useInjectDisabled();
    const showCount = computed(() => {
      return props.showCount === '' || props.showCount || false;
    });
    // Max length value
    const hasMaxLength = computed(() => Number(props.maxlength) > 0);
    const compositing = shallowRef(false);
    const oldCompositionValueRef = shallowRef();
    const oldSelectionStartRef = shallowRef(0);
    const onInternalCompositionStart = e => {
      compositing.value = true;
      // 拼音输入前保存一份旧值
      oldCompositionValueRef.value = mergedValue.value;
      // 保存旧的光标位置
      oldSelectionStartRef.value = e.currentTarget.selectionStart;
      emit('compositionstart', e);
    };
    const onInternalCompositionEnd = e => {
      var _a;
      compositing.value = false;
      let triggerValue = e.currentTarget.value;
      if (hasMaxLength.value) {
        const isCursorInEnd = oldSelectionStartRef.value >= props.maxlength + 1 || oldSelectionStartRef.value === ((_a = oldCompositionValueRef.value) === null || _a === void 0 ? void 0 : _a.length);
        triggerValue = setTriggerValue(isCursorInEnd, oldCompositionValueRef.value, triggerValue, props.maxlength);
      }
      // Patch composition onChange when value changed
      if (triggerValue !== mergedValue.value) {
        setValue(triggerValue);
        resolveOnChange(e.currentTarget, e, triggerChange, triggerValue);
      }
      emit('compositionend', e);
    };
    const instance = getCurrentInstance();
    watch(() => props.value, () => {
      var _a;
      if ('value' in instance.vnode.props || {}) {
        stateValue.value = (_a = props.value) !== null && _a !== void 0 ? _a : '';
      }
    });
    const focus = option => {
      var _a;
      triggerFocus((_a = resizableTextArea.value) === null || _a === void 0 ? void 0 : _a.textArea, option);
    };
    const blur = () => {
      var _a, _b;
      (_b = (_a = resizableTextArea.value) === null || _a === void 0 ? void 0 : _a.textArea) === null || _b === void 0 ? void 0 : _b.blur();
    };
    const setValue = (value, callback) => {
      if (stateValue.value === value) {
        return;
      }
      if (props.value === undefined) {
        stateValue.value = value;
      } else {
        nextTick(() => {
          var _a, _b, _c;
          if (resizableTextArea.value.textArea.value !== mergedValue.value) {
            (_c = (_a = resizableTextArea.value) === null || _a === void 0 ? void 0 : (_b = _a.instance).update) === null || _c === void 0 ? void 0 : _c.call(_b);
          }
        });
      }
      nextTick(() => {
        callback && callback();
      });
    };
    const handleKeyDown = e => {
      if (e.keyCode === 13) {
        emit('pressEnter', e);
      }
      emit('keydown', e);
    };
    const onBlur = e => {
      const {
        onBlur
      } = props;
      onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
      formItemContext.onFieldBlur();
    };
    const triggerChange = e => {
      emit('update:value', e.target.value);
      emit('change', e);
      emit('input', e);
      formItemContext.onFieldChange();
    };
    const handleReset = e => {
      resolveOnChange(resizableTextArea.value.textArea, e, triggerChange);
      setValue('', () => {
        focus();
      });
    };
    const handleChange = e => {
      let triggerValue = e.target.value;
      if (stateValue.value === triggerValue) return;
      if (hasMaxLength.value) {
        // 1. 复制粘贴超过maxlength的情况 2.未超过maxlength的情况
        const target = e.target;
        const isCursorInEnd = target.selectionStart >= props.maxlength + 1 || target.selectionStart === triggerValue.length || !target.selectionStart;
        triggerValue = setTriggerValue(isCursorInEnd, mergedValue.value, triggerValue, props.maxlength);
      }
      resolveOnChange(e.currentTarget, e, triggerChange, triggerValue);
      setValue(triggerValue);
    };
    const renderTextArea = () => {
      var _a, _b;
      const {
        class: customClass
      } = attrs;
      const {
        bordered = true
      } = props;
      const resizeProps = _extends(_extends(_extends({}, omit(props, ['allowClear'])), attrs), {
        class: [{
          [`${prefixCls.value}-borderless`]: !bordered,
          [`${customClass}`]: customClass && !showCount.value,
          [`${prefixCls.value}-sm`]: size.value === 'small',
          [`${prefixCls.value}-lg`]: size.value === 'large'
        }, getStatusClassNames(prefixCls.value, mergedStatus.value), hashId.value],
        disabled: disabled.value,
        showCount: null,
        prefixCls: prefixCls.value,
        onInput: handleChange,
        onChange: handleChange,
        onBlur,
        onKeydown: handleKeyDown,
        onCompositionstart: onInternalCompositionStart,
        onCompositionend: onInternalCompositionEnd
      });
      if ((_a = props.valueModifiers) === null || _a === void 0 ? void 0 : _a.lazy) {
        delete resizeProps.onInput;
      }
      return _createVNode(ResizableTextArea, _objectSpread(_objectSpread({}, resizeProps), {}, {
        "id": (_b = resizeProps === null || resizeProps === void 0 ? void 0 : resizeProps.id) !== null && _b !== void 0 ? _b : formItemContext.id.value,
        "ref": resizableTextArea,
        "maxlength": props.maxlength,
        "lazy": props.lazy
      }), null);
    };
    expose({
      focus,
      blur,
      resizableTextArea
    });
    watchEffect(() => {
      let val = fixControlledValue(stateValue.value);
      if (!compositing.value && hasMaxLength.value && (props.value === null || props.value === undefined)) {
        // fix #27612 将value转为数组进行截取，解决 '😂'.length === 2 等emoji表情导致的截取乱码的问题
        val = fixEmojiLength(val, props.maxlength);
      }
      mergedValue.value = val;
    });
    return () => {
      var _a;
      const {
        maxlength,
        bordered = true,
        hidden
      } = props;
      const {
        style,
        class: customClass
      } = attrs;
      const inputProps = _extends(_extends(_extends({}, props), attrs), {
        prefixCls: prefixCls.value,
        inputType: 'text',
        handleReset,
        direction: direction.value,
        bordered,
        style: showCount.value ? undefined : style,
        hashId: hashId.value,
        disabled: (_a = props.disabled) !== null && _a !== void 0 ? _a : disabled.value
      });
      let textareaNode = _createVNode(ClearableLabeledInput, _objectSpread(_objectSpread({}, inputProps), {}, {
        "value": mergedValue.value,
        "status": props.status
      }), {
        element: renderTextArea
      });
      if (showCount.value || formItemInputContext.hasFeedback) {
        const valueLength = [...mergedValue.value].length;
        let dataCount = '';
        if (typeof showCount.value === 'object') {
          dataCount = showCount.value.formatter({
            value: mergedValue.value,
            count: valueLength,
            maxlength
          });
        } else {
          dataCount = `${valueLength}${hasMaxLength.value ? ` / ${maxlength}` : ''}`;
        }
        textareaNode = _createVNode("div", {
          "hidden": hidden,
          "class": classNames(`${prefixCls.value}-textarea`, {
            [`${prefixCls.value}-textarea-rtl`]: direction.value === 'rtl',
            [`${prefixCls.value}-textarea-show-count`]: showCount.value,
            [`${prefixCls.value}-textarea-in-form-item`]: formItemInputContext.isFormItemInput
          }, `${prefixCls.value}-textarea-show-count`, customClass, hashId.value),
          "style": style,
          "data-count": typeof dataCount !== 'object' ? dataCount : undefined
        }, [textareaNode, formItemInputContext.hasFeedback && _createVNode("span", {
          "class": `${prefixCls.value}-textarea-suffix`
        }, [formItemInputContext.feedbackIcon])]);
      }
      return wrapSSR(textareaNode);
    };
  }
});