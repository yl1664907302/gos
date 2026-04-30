import _extends from "@babel/runtime/helpers/esm/extends";
import { reactive, watch, nextTick, unref, shallowRef, toRaw, ref } from 'vue';
import cloneDeep from 'lodash-es/cloneDeep';
import intersection from 'lodash-es/intersection';
import isEqual from 'lodash-es/isEqual';
import debounce from 'lodash-es/debounce';
import omit from 'lodash-es/omit';
import { validateRules } from './utils/validateUtil';
import { defaultValidateMessages } from './utils/messages';
import { allPromiseFinish } from './utils/asyncUtil';
function isRequired(rules) {
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
  return isRequired;
}
function toArray(value) {
  if (value === undefined || value === null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}
function getPropByPath(obj, path, strict) {
  let tempObj = obj;
  path = path.replace(/\[(\w+)\]/g, '.$1');
  path = path.replace(/^\./, '');
  const keyArr = path.split('.');
  let i = 0;
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break;
    const key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      if (strict) {
        throw new Error('please transfer a valid name path to validate!');
      }
      break;
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : null,
    isValid: tempObj && keyArr[i] in tempObj
  };
}
function useForm(modelRef) {
  let rulesRef = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ref({});
  let options = arguments.length > 2 ? arguments[2] : undefined;
  const initialModel = cloneDeep(unref(modelRef));
  const validateInfos = reactive({});
  const rulesKeys = shallowRef([]);
  const resetFields = newValues => {
    _extends(unref(modelRef), _extends(_extends({}, cloneDeep(initialModel)), newValues));
    nextTick(() => {
      Object.keys(validateInfos).forEach(key => {
        validateInfos[key] = {
          autoLink: false,
          required: isRequired(unref(rulesRef)[key])
        };
      });
    });
  };
  const filterRules = function () {
    let rules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let trigger = arguments.length > 1 ? arguments[1] : undefined;
    if (!trigger.length) {
      return rules;
    } else {
      return rules.filter(rule => {
        const triggerList = toArray(rule.trigger || 'change');
        return intersection(triggerList, trigger).length;
      });
    }
  };
  let lastValidatePromise = null;
  const validateFields = function (names) {
    let option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let strict = arguments.length > 2 ? arguments[2] : undefined;
    // Collect result in promise list
    const promiseList = [];
    const values = {};
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const prop = getPropByPath(unref(modelRef), name, strict);
      if (!prop.isValid) continue;
      values[name] = prop.v;
      const rules = filterRules(unref(rulesRef)[name], toArray(option && option.trigger));
      if (rules.length) {
        promiseList.push(validateField(name, prop.v, rules, option || {}).then(() => ({
          name,
          errors: [],
          warnings: []
        })).catch(ruleErrors => {
          const mergedErrors = [];
          const mergedWarnings = [];
          ruleErrors.forEach(_ref => {
            let {
              rule: {
                warningOnly
              },
              errors
            } = _ref;
            if (warningOnly) {
              mergedWarnings.push(...errors);
            } else {
              mergedErrors.push(...errors);
            }
          });
          if (mergedErrors.length) {
            return Promise.reject({
              name,
              errors: mergedErrors,
              warnings: mergedWarnings
            });
          }
          return {
            name,
            errors: mergedErrors,
            warnings: mergedWarnings
          };
        }));
      }
    }
    const summaryPromise = allPromiseFinish(promiseList);
    lastValidatePromise = summaryPromise;
    const returnPromise = summaryPromise.then(() => {
      if (lastValidatePromise === summaryPromise) {
        return Promise.resolve(values);
      }
      return Promise.reject([]);
    }).catch(results => {
      const errorList = results.filter(result => result && result.errors.length);
      return errorList.length ? Promise.reject({
        values,
        errorFields: errorList,
        outOfDate: lastValidatePromise !== summaryPromise
      }) : Promise.resolve(values);
    });
    // Do not throw in console
    returnPromise.catch(e => e);
    return returnPromise;
  };
  const validateField = function (name, value, rules) {
    let option = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    const promise = validateRules([name], value, rules, _extends({
      validateMessages: defaultValidateMessages
    }, option), !!option.validateFirst);
    if (!validateInfos[name]) {
      return promise.catch(e => e);
    }
    validateInfos[name].validateStatus = 'validating';
    promise.catch(e => e).then(function () {
      let results = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var _a;
      if (validateInfos[name].validateStatus === 'validating') {
        const res = results.filter(result => result && result.errors.length);
        validateInfos[name].validateStatus = res.length ? 'error' : 'success';
        validateInfos[name].help = res.length ? res.map(r => r.errors) : null;
        (_a = options === null || options === void 0 ? void 0 : options.onValidate) === null || _a === void 0 ? void 0 : _a.call(options, name, !res.length, res.length ? toRaw(validateInfos[name].help[0]) : null);
      }
    });
    return promise;
  };
  const validate = (names, option) => {
    let keys = [];
    let strict = true;
    if (!names) {
      strict = false;
      keys = rulesKeys.value;
    } else if (Array.isArray(names)) {
      keys = names;
    } else {
      keys = [names];
    }
    const promises = validateFields(keys, option || {}, strict);
    // Do not throw in console
    promises.catch(e => e);
    return promises;
  };
  const clearValidate = names => {
    let keys = [];
    if (!names) {
      keys = rulesKeys.value;
    } else if (Array.isArray(names)) {
      keys = names;
    } else {
      keys = [names];
    }
    keys.forEach(key => {
      validateInfos[key] && _extends(validateInfos[key], {
        validateStatus: '',
        help: null
      });
    });
  };
  const mergeValidateInfo = items => {
    const info = {
      autoLink: false
    };
    const help = [];
    const infos = Array.isArray(items) ? items : [items];
    for (let i = 0; i < infos.length; i++) {
      const arg = infos[i];
      if ((arg === null || arg === void 0 ? void 0 : arg.validateStatus) === 'error') {
        info.validateStatus = 'error';
        arg.help && help.push(arg.help);
      }
      info.required = info.required || (arg === null || arg === void 0 ? void 0 : arg.required);
    }
    info.help = help;
    return info;
  };
  let oldModel = initialModel;
  let isFirstTime = true;
  const modelFn = model => {
    const names = [];
    rulesKeys.value.forEach(key => {
      const prop = getPropByPath(model, key, false);
      const oldProp = getPropByPath(oldModel, key, false);
      const isFirstValidation = isFirstTime && (options === null || options === void 0 ? void 0 : options.immediate) && prop.isValid;
      if (isFirstValidation || !isEqual(prop.v, oldProp.v)) {
        names.push(key);
      }
    });
    validate(names, {
      trigger: 'change'
    });
    isFirstTime = false;
    oldModel = cloneDeep(toRaw(model));
  };
  const debounceOptions = options === null || options === void 0 ? void 0 : options.debounce;
  let first = true;
  watch(rulesRef, () => {
    rulesKeys.value = rulesRef ? Object.keys(unref(rulesRef)) : [];
    if (!first && options && options.validateOnRuleChange) {
      validate();
    }
    first = false;
  }, {
    deep: true,
    immediate: true
  });
  watch(rulesKeys, () => {
    const newValidateInfos = {};
    rulesKeys.value.forEach(key => {
      newValidateInfos[key] = _extends({}, validateInfos[key], {
        autoLink: false,
        required: isRequired(unref(rulesRef)[key])
      });
      delete validateInfos[key];
    });
    for (const key in validateInfos) {
      if (Object.prototype.hasOwnProperty.call(validateInfos, key)) {
        delete validateInfos[key];
      }
    }
    _extends(validateInfos, newValidateInfos);
  }, {
    immediate: true
  });
  watch(modelRef, debounceOptions && debounceOptions.wait ? debounce(modelFn, debounceOptions.wait, omit(debounceOptions, ['wait'])) : modelFn, {
    immediate: options && !!options.immediate,
    deep: true
  });
  return {
    modelRef,
    rulesRef,
    initialModel,
    validateInfos,
    resetFields,
    validate,
    validateField,
    mergeValidateInfo,
    clearValidate
  };
}
export default useForm;