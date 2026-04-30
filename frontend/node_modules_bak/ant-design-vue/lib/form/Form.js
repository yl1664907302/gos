"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _warning = _interopRequireDefault(require("../_util/warning"));
var _FormItem = _interopRequireDefault(require("./FormItem"));
var _valueUtil = require("./utils/valueUtil");
var _messages = require("./utils/messages");
var _asyncUtil = require("./utils/asyncUtil");
var _typeUtil = require("./utils/typeUtil");
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
var _scrollIntoViewIfNeeded = _interopRequireDefault(require("scroll-into-view-if-needed"));
var _initDefaultProps = _interopRequireDefault(require("../_util/props-util/initDefaultProps"));
var _type = require("../_util/type");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _context = require("./context");
var _useForm = _interopRequireDefault(require("./useForm"));
var _context2 = require("../config-provider/context");
var _style = _interopRequireDefault(require("./style"));
var _SizeContext = require("../config-provider/SizeContext");
var _DisabledContext = require("../config-provider/DisabledContext");
const formProps = () => ({
  layout: _vueTypes.default.oneOf((0, _type.tuple)('horizontal', 'inline', 'vertical')),
  labelCol: (0, _type.objectType)(),
  wrapperCol: (0, _type.objectType)(),
  colon: (0, _type.booleanType)(),
  labelAlign: (0, _type.stringType)(),
  labelWrap: (0, _type.booleanType)(),
  prefixCls: String,
  requiredMark: (0, _type.someType)([String, Boolean]),
  /** @deprecated Will warning in future branch. Pls use `requiredMark` instead. */
  hideRequiredMark: (0, _type.booleanType)(),
  model: _vueTypes.default.object,
  rules: (0, _type.objectType)(),
  validateMessages: (0, _type.objectType)(),
  validateOnRuleChange: (0, _type.booleanType)(),
  // 提交失败自动滚动到第一个错误字段
  scrollToFirstError: (0, _type.anyType)(),
  onSubmit: (0, _type.functionType)(),
  name: String,
  validateTrigger: (0, _type.someType)([String, Array]),
  size: (0, _type.stringType)(),
  disabled: (0, _type.booleanType)(),
  onValuesChange: (0, _type.functionType)(),
  onFieldsChange: (0, _type.functionType)(),
  onFinish: (0, _type.functionType)(),
  onFinishFailed: (0, _type.functionType)(),
  onValidate: (0, _type.functionType)()
});
exports.formProps = formProps;
function isEqualName(name1, name2) {
  return (0, _isEqual.default)((0, _typeUtil.toArray)(name1), (0, _typeUtil.toArray)(name2));
}
const Form = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AForm',
  inheritAttrs: false,
  props: (0, _initDefaultProps.default)(formProps(), {
    layout: 'horizontal',
    hideRequiredMark: false,
    colon: true
  }),
  Item: _FormItem.default,
  useForm: _useForm.default,
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
    } = (0, _useConfigInject.default)('form', props);
    const requiredMark = (0, _vue.computed)(() => props.requiredMark === '' || props.requiredMark);
    const mergedRequiredMark = (0, _vue.computed)(() => {
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
    (0, _SizeContext.useProviderSize)(size);
    (0, _DisabledContext.useProviderDisabled)(disabled);
    const mergedColon = (0, _vue.computed)(() => {
      var _a, _b;
      return (_a = props.colon) !== null && _a !== void 0 ? _a : (_b = contextForm.value) === null || _b === void 0 ? void 0 : _b.colon;
    });
    const {
      validateMessages: globalValidateMessages
    } = (0, _context2.useInjectGlobalForm)();
    const validateMessages = (0, _vue.computed)(() => {
      return (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, _messages.defaultValidateMessages), globalValidateMessages.value), props.validateMessages);
    });
    // Style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const formClassName = (0, _vue.computed)(() => (0, _classNames.default)(prefixCls.value, {
      [`${prefixCls.value}-${props.layout}`]: true,
      [`${prefixCls.value}-hide-required-mark`]: mergedRequiredMark.value === false,
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      [`${prefixCls.value}-${size.value}`]: size.value
    }, hashId.value));
    const lastValidatePromise = (0, _vue.ref)();
    const fields = {};
    const addField = (eventKey, field) => {
      fields[eventKey] = field;
    };
    const removeField = eventKey => {
      delete fields[eventKey];
    };
    const getFieldsByNameList = nameList => {
      const provideNameList = !!nameList;
      const namePathList = provideNameList ? (0, _typeUtil.toArray)(nameList).map(_valueUtil.getNamePath) : [];
      if (!provideNameList) {
        return Object.values(fields);
      } else {
        return Object.values(fields).filter(field => namePathList.findIndex(namePath => isEqualName(namePath, field.fieldName.value)) > -1);
      }
    };
    const resetFields = name => {
      if (!props.model) {
        (0, _warning.default)(false, 'Form', 'model is required for resetFields to work.');
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
          (0, _scrollIntoViewIfNeeded.default)(node, (0, _extends2.default)({
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
        return (0, _valueUtil.cloneByNamePathList)(props.model, allNameList);
      } else {
        return (0, _valueUtil.cloneByNamePathList)(props.model, nameList);
      }
    };
    const validateFields = (nameList, options) => {
      (0, _warning.default)(!(nameList instanceof Function), 'Form', 'validateFields/validateField/validate not support callback, please use promise instead');
      if (!props.model) {
        (0, _warning.default)(false, 'Form', 'model is required for validateFields to work.');
        return Promise.reject('Form `model` is required for validateFields to work.');
      }
      const provideNameList = !!nameList;
      const namePathList = provideNameList ? (0, _typeUtil.toArray)(nameList).map(_valueUtil.getNamePath) : [];
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
        if (!provideNameList || (0, _valueUtil.containsNamePath)(namePathList, fieldNamePath)) {
          const promise = field.validateRules((0, _extends2.default)({
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
      const summaryPromise = (0, _asyncUtil.allPromiseFinish)(promiseList);
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
    (0, _context.useProvideForm)({
      model: (0, _vue.computed)(() => props.model),
      name: (0, _vue.computed)(() => props.name),
      labelAlign: (0, _vue.computed)(() => props.labelAlign),
      labelCol: (0, _vue.computed)(() => props.labelCol),
      labelWrap: (0, _vue.computed)(() => props.labelWrap),
      wrapperCol: (0, _vue.computed)(() => props.wrapperCol),
      vertical: (0, _vue.computed)(() => props.layout === 'vertical'),
      colon: mergedColon,
      requiredMark: mergedRequiredMark,
      validateTrigger: (0, _vue.computed)(() => props.validateTrigger),
      rules: (0, _vue.computed)(() => props.rules),
      addField,
      removeField,
      onValidate: (name, status, errors) => {
        emit('validate', name, status, errors);
      },
      validateMessages
    });
    (0, _vue.watch)(() => props.rules, () => {
      if (props.validateOnRuleChange) {
        validateFields();
      }
    });
    return () => {
      var _a;
      return wrapSSR((0, _vue.createVNode)("form", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "onSubmit": handleSubmit,
        "class": [formClassName.value, attrs.class]
      }), [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]));
    };
  }
});
var _default = exports.default = Form;