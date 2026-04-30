import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, Fragment as _Fragment, createVNode as _createVNode } from "vue";
import { onMounted, reactive, watch, defineComponent, computed, nextTick, shallowRef, watchEffect, onBeforeUnmount, toRaw } from 'vue';
import LoadingOutlined from "@ant-design/icons-vue/es/icons/LoadingOutlined";
import CloseCircleFilled from "@ant-design/icons-vue/es/icons/CloseCircleFilled";
import CheckCircleFilled from "@ant-design/icons-vue/es/icons/CheckCircleFilled";
import ExclamationCircleFilled from "@ant-design/icons-vue/es/icons/ExclamationCircleFilled";
import cloneDeep from 'lodash-es/cloneDeep';
import PropTypes from '../_util/vue-types';
import Row from '../grid/Row';
import { filterEmpty } from '../_util/props-util';
import { validateRules as validateRulesUtil } from './utils/validateUtil';
import { getNamePath } from './utils/valueUtil';
import { toArray } from './utils/typeUtil';
import { warning } from '../vc-util/warning';
import find from 'lodash-es/find';
import { tuple } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useInjectForm } from './context';
import FormItemLabel from './FormItemLabel';
import FormItemInput from './FormItemInput';
import { FormItemInputContext, useProvideFormItemContext } from './FormItemContext';
import useDebounce from './utils/useDebounce';
import classNames from '../_util/classNames';
import useStyle from './style';
const ValidateStatuses = tuple('success', 'warning', 'error', 'validating', '');
const iconMap = {
  success: CheckCircleFilled,
  warning: ExclamationCircleFilled,
  error: CloseCircleFilled,
  validating: LoadingOutlined
};
function getPropByPath(obj, namePathList, strict) {
  let tempObj = obj;
  const keyArr = namePathList;
  let i = 0;
  try {
    for (let len = keyArr.length; i < len - 1; ++i) {
      if (!tempObj && !strict) break;
      const key = keyArr[i];
      if (key in tempObj) {
        tempObj = tempObj[key];
      } else {
        if (strict) {
          throw Error('please transfer a valid name path to form item!');
        }
        break;
      }
    }
    if (strict && !tempObj) {
      throw Error('please transfer a valid name path to form item!');
    }
  } catch (error) {
    console.error('please transfer a valid name path to form item!');
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : undefined
  };
}
export const formItemProps = () => ({
  htmlFor: String,
  prefixCls: String,
  label: PropTypes.any,
  help: PropTypes.any,
  extra: PropTypes.any,
  labelCol: {
    type: Object
  },
  wrapperCol: {
    type: Object
  },
  hasFeedback: {
    type: Boolean,
    default: false
  },
  colon: {
    type: Boolean,
    default: undefined
  },
  labelAlign: String,
  prop: {
    type: [String, Number, Array]
  },
  name: {
    type: [String, Number, Array]
  },
  rules: [Array, Object],
  autoLink: {
    type: Boolean,
    default: true
  },
  required: {
    type: Boolean,
    default: undefined
  },
  validateFirst: {
    type: Boolean,
    default: undefined
  },
  validateStatus: PropTypes.oneOf(tuple('', 'success', 'warning', 'error', 'validating')),
  validateTrigger: {
    type: [String, Array]
  },
  messageVariables: {
    type: Object
  },
  hidden: Boolean,
  noStyle: Boolean,
  tooltip: String
});
let indexGuid = 0;
// default form item id prefix.
const defaultItemNamePrefixCls = 'form_item';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AFormItem',
  inheritAttrs: false,
  __ANT_NEW_FORM_ITEM: true,
  props: formItemProps(),
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      attrs,
      expose
    } = _ref;
    warning(props.prop === undefined, `\`prop\` is deprecated. Please use \`name\` instead.`);
    const eventKey = `form-item-${++indexGuid}`;
    const {
      prefixCls
    } = useConfigInject('form', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const itemRef = shallowRef();
    const formContext = useInjectForm();
    const fieldName = computed(() => props.name || props.prop);
    const errors = shallowRef([]);
    const validateDisabled = shallowRef(false);
    const inputRef = shallowRef();
    const namePath = computed(() => {
      const val = fieldName.value;
      return getNamePath(val);
    });
    const fieldId = computed(() => {
      if (!namePath.value.length) {
        return undefined;
      } else {
        const formName = formContext.name.value;
        const mergedId = namePath.value.join('_');
        return formName ? `${formName}_${mergedId}` : `${defaultItemNamePrefixCls}_${mergedId}`;
      }
    });
    const getNewFieldValue = () => {
      const model = formContext.model.value;
      if (!model || !fieldName.value) {
        return;
      } else {
        return getPropByPath(model, namePath.value, true).v;
      }
    };
    const fieldValue = computed(() => getNewFieldValue());
    const initialValue = shallowRef(cloneDeep(fieldValue.value));
    const mergedValidateTrigger = computed(() => {
      let validateTrigger = props.validateTrigger !== undefined ? props.validateTrigger : formContext.validateTrigger.value;
      validateTrigger = validateTrigger === undefined ? 'change' : validateTrigger;
      return toArray(validateTrigger);
    });
    const rulesRef = computed(() => {
      let formRules = formContext.rules.value;
      const selfRules = props.rules;
      const requiredRule = props.required !== undefined ? {
        required: !!props.required,
        trigger: mergedValidateTrigger.value
      } : [];
      const prop = getPropByPath(formRules, namePath.value);
      formRules = formRules ? prop.o[prop.k] || prop.v : [];
      const rules = [].concat(selfRules || formRules || []);
      if (find(rules, rule => rule.required)) {
        return rules;
      } else {
        return rules.concat(requiredRule);
      }
    });
    const isRequired = computed(() => {
      const rules = rulesRef.value;
      let isRequired = false;
      if (rules && rules.length) {
        rules.every(rule => {
          if (rule.required) {
            isRequired = true;
            return false;
          }
          return true;
        });
      }
      return isRequired || props.required;
    });
    const validateState = shallowRef();
    watchEffect(() => {
      validateState.value = props.validateStatus;
    });
    const messageVariables = computed(() => {
      let variables = {};
      if (typeof props.label === 'string') {
        variables.label = props.label;
      } else if (props.name) {
        variables.label = String(props.name);
      }
      if (props.messageVariables) {
        variables = _extends(_extends({}, variables), props.messageVariables);
      }
      return variables;
    });
    const validateRules = options => {
      // no name, no value, so the validate result is incorrect
      if (namePath.value.length === 0) {
        return;
      }
      const {
        validateFirst = false
      } = props;
      const {
        triggerName
      } = options || {};
      let filteredRules = rulesRef.value;
      if (triggerName) {
        filteredRules = filteredRules.filter(rule => {
          const {
            trigger
          } = rule;
          if (!trigger && !mergedValidateTrigger.value.length) {
            return true;
          }
          const triggerList = toArray(trigger || mergedValidateTrigger.value);
          return triggerList.includes(triggerName);
        });
      }
      if (!filteredRules.length) {
        return Promise.resolve();
      }
      const promise = validateRulesUtil(namePath.value, fieldValue.value, filteredRules, _extends({
        validateMessages: formContext.validateMessages.value
      }, options), validateFirst, messageVariables.value);
      validateState.value = 'validating';
      errors.value = [];
      promise.catch(e => e).then(function () {
        let results = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        if (validateState.value === 'validating') {
          const res = results.filter(result => result && result.errors.length);
          validateState.value = res.length ? 'error' : 'success';
          errors.value = res.map(r => r.errors);
          formContext.onValidate(fieldName.value, !errors.value.length, errors.value.length ? toRaw(errors.value[0]) : null);
        }
      });
      return promise;
    };
    const onFieldBlur = () => {
      validateRules({
        triggerName: 'blur'
      });
    };
    const onFieldChange = () => {
      if (validateDisabled.value) {
        validateDisabled.value = false;
        return;
      }
      validateRules({
        triggerName: 'change'
      });
    };
    const clearValidate = () => {
      validateState.value = props.validateStatus;
      validateDisabled.value = false;
      errors.value = [];
    };
    const resetField = () => {
      var _a;
      validateState.value = props.validateStatus;
      validateDisabled.value = true;
      errors.value = [];
      const model = formContext.model.value || {};
      const value = fieldValue.value;
      const prop = getPropByPath(model, namePath.value, true);
      if (Array.isArray(value)) {
        prop.o[prop.k] = [].concat((_a = initialValue.value) !== null && _a !== void 0 ? _a : []);
      } else {
        prop.o[prop.k] = initialValue.value;
      }
      // reset validateDisabled after onFieldChange triggered
      nextTick(() => {
        validateDisabled.value = false;
      });
    };
    const htmlFor = computed(() => {
      return props.htmlFor === undefined ? fieldId.value : props.htmlFor;
    });
    const onLabelClick = () => {
      const id = htmlFor.value;
      if (!id || !inputRef.value) {
        return;
      }
      const control = inputRef.value.$el.querySelector(`[id="${id}"]`);
      if (control && control.focus) {
        control.focus();
      }
    };
    expose({
      onFieldBlur,
      onFieldChange,
      clearValidate,
      resetField
    });
    useProvideFormItemContext({
      id: fieldId,
      onFieldBlur: () => {
        if (props.autoLink) {
          onFieldBlur();
        }
      },
      onFieldChange: () => {
        if (props.autoLink) {
          onFieldChange();
        }
      },
      clearValidate
    }, computed(() => {
      return !!(props.autoLink && formContext.model.value && fieldName.value);
    }));
    let registered = false;
    watch(fieldName, val => {
      if (val) {
        if (!registered) {
          registered = true;
          formContext.addField(eventKey, {
            fieldValue,
            fieldId,
            fieldName,
            resetField,
            clearValidate,
            namePath,
            validateRules,
            rules: rulesRef
          });
        }
      } else {
        registered = false;
        formContext.removeField(eventKey);
      }
    }, {
      immediate: true
    });
    onBeforeUnmount(() => {
      formContext.removeField(eventKey);
    });
    const debounceErrors = useDebounce(errors);
    const mergedValidateStatus = computed(() => {
      if (props.validateStatus !== undefined) {
        return props.validateStatus;
      } else if (debounceErrors.value.length) {
        return 'error';
      }
      return validateState.value;
    });
    const itemClassName = computed(() => ({
      [`${prefixCls.value}-item`]: true,
      [hashId.value]: true,
      // Status
      [`${prefixCls.value}-item-has-feedback`]: mergedValidateStatus.value && props.hasFeedback,
      [`${prefixCls.value}-item-has-success`]: mergedValidateStatus.value === 'success',
      [`${prefixCls.value}-item-has-warning`]: mergedValidateStatus.value === 'warning',
      [`${prefixCls.value}-item-has-error`]: mergedValidateStatus.value === 'error',
      [`${prefixCls.value}-item-is-validating`]: mergedValidateStatus.value === 'validating',
      [`${prefixCls.value}-item-hidden`]: props.hidden
    }));
    const formItemInputContext = reactive({});
    FormItemInputContext.useProvide(formItemInputContext);
    watchEffect(() => {
      let feedbackIcon;
      if (props.hasFeedback) {
        const IconNode = mergedValidateStatus.value && iconMap[mergedValidateStatus.value];
        feedbackIcon = IconNode ? _createVNode("span", {
          "class": classNames(`${prefixCls.value}-item-feedback-icon`, `${prefixCls.value}-item-feedback-icon-${mergedValidateStatus.value}`)
        }, [_createVNode(IconNode, null, null)]) : null;
      }
      _extends(formItemInputContext, {
        status: mergedValidateStatus.value,
        hasFeedback: props.hasFeedback,
        feedbackIcon,
        isFormItemInput: true
      });
    });
    const marginBottom = shallowRef(null);
    const showMarginOffset = shallowRef(false);
    const updateMarginBottom = () => {
      if (itemRef.value) {
        const itemStyle = getComputedStyle(itemRef.value);
        marginBottom.value = parseInt(itemStyle.marginBottom, 10);
      }
    };
    onMounted(() => {
      watch(showMarginOffset, () => {
        if (showMarginOffset.value) {
          updateMarginBottom();
        }
      }, {
        flush: 'post',
        immediate: true
      });
    });
    const onErrorVisibleChanged = nextVisible => {
      if (!nextVisible) {
        marginBottom.value = null;
      }
    };
    return () => {
      var _a, _b;
      if (props.noStyle) return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
      const help = (_b = props.help) !== null && _b !== void 0 ? _b : slots.help ? filterEmpty(slots.help()) : null;
      const withHelp = !!(help !== undefined && help !== null && Array.isArray(help) && help.length || debounceErrors.value.length);
      showMarginOffset.value = withHelp;
      return wrapSSR(_createVNode("div", {
        "class": [itemClassName.value, withHelp ? `${prefixCls.value}-item-with-help` : '', attrs.class],
        "ref": itemRef
      }, [_createVNode(Row, _objectSpread(_objectSpread({}, attrs), {}, {
        "class": `${prefixCls.value}-item-row`,
        "key": "row"
      }), {
        default: () => {
          var _a, _b;
          return _createVNode(_Fragment, null, [_createVNode(FormItemLabel, _objectSpread(_objectSpread({}, props), {}, {
            "htmlFor": htmlFor.value,
            "required": isRequired.value,
            "requiredMark": formContext.requiredMark.value,
            "prefixCls": prefixCls.value,
            "onClick": onLabelClick,
            "label": props.label
          }), {
            label: slots.label,
            tooltip: slots.tooltip
          }), _createVNode(FormItemInput, _objectSpread(_objectSpread({}, props), {}, {
            "errors": help !== undefined && help !== null ? toArray(help) : debounceErrors.value,
            "marginBottom": marginBottom.value,
            "prefixCls": prefixCls.value,
            "status": mergedValidateStatus.value,
            "ref": inputRef,
            "help": help,
            "extra": (_a = props.extra) !== null && _a !== void 0 ? _a : (_b = slots.extra) === null || _b === void 0 ? void 0 : _b.call(slots),
            "onErrorVisibleChanged": onErrorVisibleChanged
          }), {
            default: slots.default
          })]);
        }
      }), !!marginBottom.value && _createVNode("div", {
        "class": `${prefixCls.value}-margin-offset`,
        "style": {
          marginBottom: `-${marginBottom.value}px`
        }
      }, null)]));
    };
  }
});