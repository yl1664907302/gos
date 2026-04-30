"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateRules = validateRules;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _asyncValidator = _interopRequireDefault(require("async-validator"));
var _vue = require("vue");
var _warning = require("../../vc-util/warning");
var _valueUtil = require("./valueUtil");
var _messages = require("./messages");
var _propsUtil = require("../../_util/props-util");
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
// Remove incorrect original ts define
const AsyncValidator = _asyncValidator.default;
/**
 * Replace with template.
 *   `I'm ${name}` + { name: 'bamboo' } = I'm bamboo
 */
function replaceMessage(template, kv) {
  return template.replace(/\$\{\w+\}/g, str => {
    const key = str.slice(2, -1);
    return kv[key];
  });
}
function validateRule(name, value, rule, options, messageVariables) {
  return __awaiter(this, void 0, void 0, function* () {
    const cloneRule = (0, _extends2.default)({}, rule);
    // Bug of `async-validator`
    delete cloneRule.ruleIndex;
    delete cloneRule.trigger;
    // We should special handle array validate
    let subRuleField = null;
    if (cloneRule && cloneRule.type === 'array' && cloneRule.defaultField) {
      subRuleField = cloneRule.defaultField;
      delete cloneRule.defaultField;
    }
    const validator = new AsyncValidator({
      [name]: [cloneRule]
    });
    const messages = (0, _valueUtil.setValues)({}, _messages.defaultValidateMessages, options.validateMessages);
    validator.messages(messages);
    let result = [];
    try {
      yield Promise.resolve(validator.validate({
        [name]: value
      }, (0, _extends2.default)({}, options)));
    } catch (errObj) {
      if (errObj.errors) {
        result = errObj.errors.map((_ref, index) => {
          let {
            message
          } = _ref;
          return (
            // Wrap VueNode with `key`
            (0, _propsUtil.isValidElement)(message) ? (0, _vue.cloneVNode)(message, {
              key: `error_${index}`
            }) : message
          );
        });
      } else {
        console.error(errObj);
        result = [messages.default()];
      }
    }
    if (!result.length && subRuleField) {
      const subResults = yield Promise.all(value.map((subValue, i) => validateRule(`${name}.${i}`, subValue, subRuleField, options, messageVariables)));
      return subResults.reduce((prev, errors) => [...prev, ...errors], []);
    }
    // Replace message with variables
    const kv = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, rule), {
      name,
      enum: (rule.enum || []).join(', ')
    }), messageVariables);
    const fillVariableResult = result.map(error => {
      if (typeof error === 'string') {
        return replaceMessage(error, kv);
      }
      return error;
    });
    return fillVariableResult;
  });
}
/**
 * We use `async-validator` to validate the value.
 * But only check one value in a time to avoid namePath validate issue.
 */
function validateRules(namePath, value, rules, options, validateFirst, messageVariables) {
  const name = namePath.join('.');
  // Fill rule with context
  const filledRules = rules.map((currentRule, ruleIndex) => {
    const originValidatorFunc = currentRule.validator;
    const cloneRule = (0, _extends2.default)((0, _extends2.default)({}, currentRule), {
      ruleIndex
    });
    // Replace validator if needed
    if (originValidatorFunc) {
      cloneRule.validator = (rule, val, callback) => {
        let hasPromise = false;
        // Wrap callback only accept when promise not provided
        const wrappedCallback = function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          // Wait a tick to make sure return type is a promise
          Promise.resolve().then(() => {
            (0, _warning.warning)(!hasPromise, 'Your validator function has already return a promise. `callback` will be ignored.');
            if (!hasPromise) {
              callback(...args);
            }
          });
        };
        // Get promise
        const promise = originValidatorFunc(rule, val, wrappedCallback);
        hasPromise = promise && typeof promise.then === 'function' && typeof promise.catch === 'function';
        /**
         * 1. Use promise as the first priority.
         * 2. If promise not exist, use callback with warning instead
         */
        (0, _warning.warning)(hasPromise, '`callback` is deprecated. Please return a promise instead.');
        if (hasPromise) {
          promise.then(() => {
            callback();
          }).catch(err => {
            callback(err || ' ');
          });
        }
      };
    }
    return cloneRule;
  }).sort((_ref2, _ref3) => {
    let {
      warningOnly: w1,
      ruleIndex: i1
    } = _ref2;
    let {
      warningOnly: w2,
      ruleIndex: i2
    } = _ref3;
    if (!!w1 === !!w2) {
      // Let keep origin order
      return i1 - i2;
    }
    if (w1) {
      return 1;
    }
    return -1;
  });
  // Do validate rules
  let summaryPromise;
  if (validateFirst === true) {
    // >>>>> Validate by serialization
    summaryPromise = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
      /* eslint-disable no-await-in-loop */
      for (let i = 0; i < filledRules.length; i += 1) {
        const rule = filledRules[i];
        const errors = yield validateRule(name, value, rule, options, messageVariables);
        if (errors.length) {
          reject([{
            errors,
            rule
          }]);
          return;
        }
      }
      /* eslint-enable */
      resolve([]);
    }));
  } else {
    // >>>>> Validate by parallel
    const rulePromises = filledRules.map(rule => validateRule(name, value, rule, options, messageVariables).then(errors => ({
      errors,
      rule
    })));
    summaryPromise = (validateFirst ? finishOnFirstFailed(rulePromises) : finishOnAllFailed(rulePromises)).then(errors => {
      // Always change to rejection for Field to catch
      return Promise.reject(errors);
    });
  }
  // Internal catch error to avoid console error log.
  summaryPromise.catch(e => e);
  return summaryPromise;
}
function finishOnAllFailed(rulePromises) {
  return __awaiter(this, void 0, void 0, function* () {
    return Promise.all(rulePromises).then(errorsList => {
      const errors = [].concat(...errorsList);
      return errors;
    });
  });
}
function finishOnFirstFailed(rulePromises) {
  return __awaiter(this, void 0, void 0, function* () {
    let count = 0;
    return new Promise(resolve => {
      rulePromises.forEach(promise => {
        promise.then(ruleError => {
          if (ruleError.errors.length) {
            resolve([ruleError]);
          }
          count += 1;
          if (count === rulePromises.length) {
            resolve([]);
          }
        });
      });
    });
  });
}