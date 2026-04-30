"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formItemProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _LoadingOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/LoadingOutlined"));
var _CloseCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseCircleFilled"));
var _CheckCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CheckCircleFilled"));
var _ExclamationCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/ExclamationCircleFilled"));
var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _Row = _interopRequireDefault(require("../grid/Row"));
var _propsUtil = require("../_util/props-util");
var _validateUtil = require("./utils/validateUtil");
var _valueUtil = require("./utils/valueUtil");
var _typeUtil = require("./utils/typeUtil");
var _warning = require("../vc-util/warning");
var _find = _interopRequireDefault(require("lodash/find"));
var _type = require("../_util/type");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _context = require("./context");
var _FormItemLabel = _interopRequireDefault(require("./FormItemLabel"));
var _FormItemInput = _interopRequireDefault(require("./FormItemInput"));
var _FormItemContext = require("./FormItemContext");
var _useDebounce = _interopRequireDefault(require("./utils/useDebounce"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _style = _interopRequireDefault(require("./style"));
const ValidateStatuses = (0, _type.tuple)('success', 'warning', 'error', 'validating', '');
const iconMap = {
  success: _CheckCircleFilled.default,
  warning: _ExclamationCircleFilled.default,
  error: _CloseCircleFilled.default,
  validating: _LoadingOutlined.default
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
const formItemProps = () => ({
  htmlFor: String,
  prefixCls: String,
  label: _vueTypes.default.any,
  help: _vueTypes.default.any,
  extra: _vueTypes.default.any,
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
  validateStatus: _vueTypes.default.oneOf((0, _type.tuple)('', 'success', 'warning', 'error', 'validating')),
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
exports.formItemProps = formItemProps;
let indexGuid = 0;
// default form item id prefix.
const defaultItemNamePrefixCls = 'form_item';
var _default = exports.default = (0, _vue.defineComponent)({
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
    (0, _warning.warning)(props.prop === undefined, `\`prop\` is deprecated. Please use \`name\` instead.`);
    const eventKey = `form-item-${++indexGuid}`;
    const {
      prefixCls
    } = (0, _useConfigInject.default)('form', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const itemRef = (0, _vue.shallowRef)();
    const formContext = (0, _context.useInjectForm)();
    const fieldName = (0, _vue.computed)(() => props.name || props.prop);
    const errors = (0, _vue.shallowRef)([]);
    const validateDisabled = (0, _vue.shallowRef)(false);
    const inputRef = (0, _vue.shallowRef)();
    const namePath = (0, _vue.computed)(() => {
      const val = fieldName.value;
      return (0, _valueUtil.getNamePath)(val);
    });
    const fieldId = (0, _vue.computed)(() => {
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
    const fieldValue = (0, _vue.computed)(() => getNewFieldValue());
    const initialValue = (0, _vue.shallowRef)((0, _cloneDeep.default)(fieldValue.value));
    const mergedValidateTrigger = (0, _vue.computed)(() => {
      let validateTrigger = props.validateTrigger !== undefined ? props.validateTrigger : formContext.validateTrigger.value;
      validateTrigger = validateTrigger === undefined ? 'change' : validateTrigger;
      return (0, _typeUtil.toArray)(validateTrigger);
    });
    const rulesRef = (0, _vue.computed)(() => {
      let formRules = formContext.rules.value;
      const selfRules = props.rules;
      const requiredRule = props.required !== undefined ? {
        required: !!props.required,
        trigger: mergedValidateTrigger.value
      } : [];
      const prop = getPropByPath(formRules, namePath.value);
      formRules = formRules ? prop.o[prop.k] || prop.v : [];
      const rules = [].concat(selfRules || formRules || []);
      if ((0, _find.default)(rules, rule => rule.required)) {
        return rules;
      } else {
        return rules.concat(requiredRule);
      }
    });
    const isRequired = (0, _vue.computed)(() => {
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
    const validateState = (0, _vue.shallowRef)();
    (0, _vue.watchEffect)(() => {
      validateState.value = props.validateStatus;
    });
    const messageVariables = (0, _vue.computed)(() => {
      let variables = {};
      if (typeof props.label === 'string') {
        variables.label = props.label;
      } else if (props.name) {
        variables.label = String(props.name);
      }
      if (props.messageVariables) {
        variables = (0, _extends2.default)((0, _extends2.default)({}, variables), props.messageVariables);
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
          const triggerList = (0, _typeUtil.toArray)(trigger || mergedValidateTrigger.value);
          return triggerList.includes(triggerName);
        });
      }
      if (!filteredRules.length) {
        return Promise.resolve();
      }
      const promise = (0, _validateUtil.validateRules)(namePath.value, fieldValue.value, filteredRules, (0, _extends2.default)({
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
          formContext.onValidate(fieldName.value, !errors.value.length, errors.value.length ? (0, _vue.toRaw)(errors.value[0]) : null);
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
      (0, _vue.nextTick)(() => {
        validateDisabled.value = false;
      });
    };
    const htmlFor = (0, _vue.computed)(() => {
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
    (0, _FormItemContext.useProvideFormItemContext)({
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
    }, (0, _vue.computed)(() => {
      return !!(props.autoLink && formContext.model.value && fieldName.value);
    }));
    let registered = false;
    (0, _vue.watch)(fieldName, val => {
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
    (0, _vue.onBeforeUnmount)(() => {
      formContext.removeField(eventKey);
    });
    const debounceErrors = (0, _useDebounce.default)(errors);
    const mergedValidateStatus = (0, _vue.computed)(() => {
      if (props.validateStatus !== undefined) {
        return props.validateStatus;
      } else if (debounceErrors.value.length) {
        return 'error';
      }
      return validateState.value;
    });
    const itemClassName = (0, _vue.computed)(() => ({
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
    const formItemInputContext = (0, _vue.reactive)({});
    _FormItemContext.FormItemInputContext.useProvide(formItemInputContext);
    (0, _vue.watchEffect)(() => {
      let feedbackIcon;
      if (props.hasFeedback) {
        const IconNode = mergedValidateStatus.value && iconMap[mergedValidateStatus.value];
        feedbackIcon = IconNode ? (0, _vue.createVNode)("span", {
          "class": (0, _classNames.default)(`${prefixCls.value}-item-feedback-icon`, `${prefixCls.value}-item-feedback-icon-${mergedValidateStatus.value}`)
        }, [(0, _vue.createVNode)(IconNode, null, null)]) : null;
      }
      (0, _extends2.default)(formItemInputContext, {
        status: mergedValidateStatus.value,
        hasFeedback: props.hasFeedback,
        feedbackIcon,
        isFormItemInput: true
      });
    });
    const marginBottom = (0, _vue.shallowRef)(null);
    const showMarginOffset = (0, _vue.shallowRef)(false);
    const updateMarginBottom = () => {
      if (itemRef.value) {
        const itemStyle = getComputedStyle(itemRef.value);
        marginBottom.value = parseInt(itemStyle.marginBottom, 10);
      }
    };
    (0, _vue.onMounted)(() => {
      (0, _vue.watch)(showMarginOffset, () => {
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
      const help = (_b = props.help) !== null && _b !== void 0 ? _b : slots.help ? (0, _propsUtil.filterEmpty)(slots.help()) : null;
      const withHelp = !!(help !== undefined && help !== null && Array.isArray(help) && help.length || debounceErrors.value.length);
      showMarginOffset.value = withHelp;
      return wrapSSR((0, _vue.createVNode)("div", {
        "class": [itemClassName.value, withHelp ? `${prefixCls.value}-item-with-help` : '', attrs.class],
        "ref": itemRef
      }, [(0, _vue.createVNode)(_Row.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": `${prefixCls.value}-item-row`,
        "key": "row"
      }), {
        default: () => {
          var _a, _b;
          return (0, _vue.createVNode)(_vue.Fragment, null, [(0, _vue.createVNode)(_FormItemLabel.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
            "htmlFor": htmlFor.value,
            "required": isRequired.value,
            "requiredMark": formContext.requiredMark.value,
            "prefixCls": prefixCls.value,
            "onClick": onLabelClick,
            "label": props.label
          }), {
            label: slots.label,
            tooltip: slots.tooltip
          }), (0, _vue.createVNode)(_FormItemInput.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
            "errors": help !== undefined && help !== null ? (0, _typeUtil.toArray)(help) : debounceErrors.value,
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
      }), !!marginBottom.value && (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-margin-offset`,
        "style": {
          marginBottom: `-${marginBottom.value}px`
        }
      }, null)]));
    };
  }
});