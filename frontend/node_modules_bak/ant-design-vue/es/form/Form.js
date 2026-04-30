import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { defineComponent, computed, watch, ref } from 'vue';
import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import warning from '../_util/warning';
import FormItem from './FormItem';
import { getNamePath, containsNamePath, cloneByNamePathList } from './utils/valueUtil';
import { defaultValidateMessages } from './utils/messages';
import { allPromiseFinish } from './utils/asyncUtil';
import { toArray } from './utils/typeUtil';
import isEqual from 'lodash-es/isEqual';
import scrollIntoView from 'scroll-into-view-if-needed';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import { anyType, booleanType, functionType, objectType, someType, stringType, tuple } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useProvideForm } from './context';
import useForm from './useForm';
import { useInjectGlobalForm } from '../config-provider/context';
import useStyle from './style';
import { useProviderSize } from '../config-provider/SizeContext';
import { useProviderDisabled } from '../config-provider/DisabledContext';
export const formProps = () => ({
  layout: PropTypes.oneOf(tuple('horizontal', 'inline', 'vertical')),
  labelCol: objectType(),
  wrapperCol: objectType(),
  colon: booleanType(),
  labelAlign: stringType(),
  labelWrap: booleanType(),
  prefixCls: String,
  requiredMark: someType([String, Boolean]),
  /** @deprecated Will warning in future branch. Pls use `requiredMark` instead. */
  hideRequiredMark: booleanType(),
  model: PropTypes.object,
  rules: objectType(),
  validateMessages: objectType(),
  validateOnRuleChange: booleanType(),
  // 提交失败自动滚动到第一个错误字段
  scrollToFirstError: anyType(),
  onSubmit: functionType(),
  name: String,
  validateTrigger: someType([String, Array]),
  size: stringType(),
  disabled: booleanType(),
  onValuesChange: functionType(),
  onFieldsChange: functionType(),
  onFinish: functionType(),
  onFinishFailed: functionType(),
  onValidate: functionType()
});
function isEqualName(name1, name2) {
  return isEqual(toArray(name1), toArray(name2));
}
const Form = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AForm',
  inheritAttrs: false,
  props: initDefaultProps(formProps(), {
    layout: 'horizontal',
    hideRequiredMark: false,
    colon: true
  }),
  Item: FormItem,
  useForm,
  // emits: ['finishFailed', 'submit', 'finish', 'validate'],
  setup(props, _ref) {
    let {
      emit,
      slots,
      expose,
      attrs
    } = _ref;
    const {
      prefixCls,
      direction,
      form: contextForm,
      size,
      disabled
    } = useConfigInject('form', props);
    const requiredMark = computed(() => props.requiredMark === '' || props.requiredMark);
    const mergedRequiredMark = computed(() => {
      var _a;
      if (requiredMark.value !== undefined) {
        return requiredMark.value;
      }
      if (contextForm && ((_a = contextForm.value) === null || _a === void 0 ? void 0 : _a.requiredMark) !== undefined) {
        return contextForm.value.requiredMark;
      }
      if (props.hideRequiredMark) {
        return false;
      }
      return true;
    });
    useProviderSize(size);
    useProviderDisabled(disabled);
    const mergedColon = computed(() => {
      var _a, _b;
      return (_a = props.colon) !== null && _a !== void 0 ? _a : (_b = contextForm.value) === null || _b === void 0 ? void 0 : _b.colon;
    });
    const {
      validateMessages: globalValidateMessages
    } = useInjectGlobalForm();
    const validateMessages = computed(() => {
      return _extends(_extends(_extends({}, defaultValidateMessages), globalValidateMessages.value), props.validateMessages);
    });
    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const formClassName = computed(() => classNames(prefixCls.value, {
      [`${prefixCls.value}-${props.layout}`]: true,
      [`${prefixCls.value}-hide-required-mark`]: mergedRequiredMark.value === false,
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      [`${prefixCls.value}-${size.value}`]: size.value
    }, hashId.value));
    const lastValidatePromise = ref();
    const fields = {};
    const addField = (eventKey, field) => {
      fields[eventKey] = field;
    };
    const removeField = eventKey => {
      delete fields[eventKey];
    };
    const getFieldsByNameList = nameList => {
      const provideNameList = !!nameList;
      const namePathList = provideNameList ? toArray(nameList).map(getNamePath) : [];
      if (!provideNameList) {
        return Object.values(fields);
      } else {
        return Object.values(fields).filter(field => namePathList.findIndex(namePath => isEqualName(namePath, field.fieldName.value)) > -1);
      }
    };
    const resetFields = name => {
      if (!props.model) {
        warning(false, 'Form', 'model is required for resetFields to work.');
        return;
      }
      getFieldsByNameList(name).forEach(field => {
        field.resetField();
      });
    };
    const clearValidate = name => {
      getFieldsByNameList(name).forEach(field => {
        field.clearValidate();
      });
    };
    const handleFinishFailed = errorInfo => {
      const {
        scrollToFirstError
      } = props;
      emit('finishFailed', errorInfo);
      if (scrollToFirstError && errorInfo.errorFields.length) {
        let scrollToFieldOptions = {};
        if (typeof scrollToFirstError === 'object') {
          scrollToFieldOptions = scrollToFirstError;
        }
        scrollToField(errorInfo.errorFields[0].name, scrollToFieldOptions);
      }
    };
    const validate = function () {
      return validateField(...arguments);
    };
    const scrollToField = function (name) {
      let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      const fields = getFieldsByNameList(name ? [name] : undefined);
      if (fields.length) {
        const fieldId = fields[0].fieldId.value;
        const node = fieldId ? document.getElementById(fieldId) : null;
        if (node) {
          scrollIntoView(node, _extends({
            scrollMode: 'if-needed',
            block: 'nearest'
          }, options));
        }
      }
    };
    // eslint-disable-next-line no-unused-vars
    const getFieldsValue = function () {
      let nameList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (nameList === true) {
        const allNameList = [];
        Object.values(fields).forEach(_ref2 => {
          let {
            namePath
          } = _ref2;
          allNameList.push(namePath.value);
        });
        return cloneByNamePathList(props.model, allNameList);
      } else {
        return cloneByNamePathList(props.model, nameList);
      }
    };
    const validateFields = (nameList, options) => {
      warning(!(nameList instanceof Function), 'Form', 'validateFields/validateField/validate not support callback, please use promise instead');
      if (!props.model) {
        warning(false, 'Form', 'model is required for validateFields to work.');
        return Promise.reject('Form `model` is required for validateFields to work.');
      }
      const provideNameList = !!nameList;
      const namePathList = provideNameList ? toArray(nameList).map(getNamePath) : [];
      // Collect result in promise list
      const promiseList = [];
      Object.values(fields).forEach(field => {
        var _a;
        // Add field if not provide `nameList`
        if (!provideNameList) {
          namePathList.push(field.namePath.value);
        }
        // Skip if without rule
        if (!((_a = field.rules) === null || _a === void 0 ? void 0 : _a.value.length)) {
          return;
        }
        const fieldNamePath = field.namePath.value;
        // Add field validate rule in to promise list
        if (!provideNameList || containsNamePath(namePathList, fieldNamePath)) {
          const promise = field.validateRules(_extends({
            validateMessages: validateMessages.value
          }, options));
          // Wrap promise with field
          promiseList.push(promise.then(() => ({
            name: fieldNamePath,
            errors: [],
            warnings: []
          })).catch(ruleErrors => {
            const mergedErrors = [];
            const mergedWarnings = [];
            ruleErrors.forEach(_ref3 => {
              let {
                rule: {
                  warningOnly
                },
                errors
              } = _ref3;
              if (warningOnly) {
                mergedWarnings.push(...errors);
              } else {
                mergedErrors.push(...errors);
              }
            });
            if (mergedErrors.length) {
              return Promise.reject({
                name: fieldNamePath,
                errors: mergedErrors,
                warnings: mergedWarnings
              });
            }
            return {
              name: fieldNamePath,
              errors: mergedErrors,
              warnings: mergedWarnings
            };
          }));
        }
      });
      const summaryPromise = allPromiseFinish(promiseList);
      lastValidatePromise.value = summaryPromise;
      const returnPromise = summaryPromise.then(() => {
        if (lastValidatePromise.value === summaryPromise) {
          return Promise.resolve(getFieldsValue(namePathList));
        }
        return Promise.reject([]);
      }).catch(results => {
        const errorList = results.filter(result => result && result.errors.length);
        return Promise.reject({
          values: getFieldsValue(namePathList),
          errorFields: errorList,
          outOfDate: lastValidatePromise.value !== summaryPromise
        });
      });
      // Do not throw in console
      returnPromise.catch(e => e);
      return returnPromise;
    };
    const validateField = function () {
      return validateFields(...arguments);
    };
    const handleSubmit = e => {
      e.preventDefault();
      e.stopPropagation();
      emit('submit', e);
      if (props.model) {
        const res = validateFields();
        res.then(values => {
          emit('finish', values);
        }).catch(errors => {
          handleFinishFailed(errors);
        });
      }
    };
    expose({
      resetFields,
      clearValidate,
      validateFields,
      getFieldsValue,
      validate,
      scrollToField
    });
    useProvideForm({
      model: computed(() => props.model),
      name: computed(() => props.name),
      labelAlign: computed(() => props.labelAlign),
      labelCol: computed(() => props.labelCol),
      labelWrap: computed(() => props.labelWrap),
      wrapperCol: computed(() => props.wrapperCol),
      vertical: computed(() => props.layout === 'vertical'),
      colon: mergedColon,
      requiredMark: mergedRequiredMark,
      validateTrigger: computed(() => props.validateTrigger),
      rules: computed(() => props.rules),
      addField,
      removeField,
      onValidate: (name, status, errors) => {
        emit('validate', name, status, errors);
      },
      validateMessages
    });
    watch(() => props.rules, () => {
      if (props.validateOnRuleChange) {
        validateFields();
      }
    });
    return () => {
      var _a;
      return wrapSSR(_createVNode("form", _objectSpread(_objectSpread({}, attrs), {}, {
        "onSubmit": handleSubmit,
        "class": [formClassName.value, attrs.class]
      }), [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]));
    };
  }
});
export default Form;