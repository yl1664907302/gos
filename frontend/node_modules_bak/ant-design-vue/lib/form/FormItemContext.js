"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProvideFormItemContext = exports.useInjectFormItemContext = exports.default = exports.NoFormStatus = exports.FormItemInputContext = void 0;
var _vue = require("vue");
var _devWarning = _interopRequireDefault(require("../vc-util/devWarning"));
var _createContext = _interopRequireDefault(require("../_util/createContext"));
const ContextKey = Symbol('ContextProps');
const InternalContextKey = Symbol('InternalContextProps');
const useProvideFormItemContext = function (props) {
  let useValidation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _vue.computed)(() => true);
  const formItemFields = (0, _vue.ref)(new Map());
  const addFormItemField = (key, type) => {
    formItemFields.value.set(key, type);
    formItemFields.value = new Map(formItemFields.value);
  };
  const removeFormItemField = key => {
    formItemFields.value.delete(key);
    formItemFields.value = new Map(formItemFields.value);
  };
  const instance = (0, _vue.getCurrentInstance)();
  (0, _vue.watch)([useValidation, formItemFields], () => {
    if (process.env.NODE_ENV !== 'production') {
      if (useValidation.value && formItemFields.value.size > 1) {
        (0, _devWarning.default)(false, 'Form.Item', `FormItem can only collect one field item, you haved set ${[...formItemFields.value.values()].map(v => `\`${v.name}\``).join(', ')} ${formItemFields.value.size} field items.
        You can set not need to be collected fields into \`a-form-item-rest\``);
        let cur = instance;
        while (cur.parent) {
          console.warn('at', cur.type);
          cur = cur.parent;
        }
      }
    }
  });
  (0, _vue.provide)(ContextKey, props);
  (0, _vue.provide)(InternalContextKey, {
    addFormItemField,
    removeFormItemField
  });
};
exports.useProvideFormItemContext = useProvideFormItemContext;
const defaultContext = {
  id: (0, _vue.computed)(() => undefined),
  onFieldBlur: () => {},
  onFieldChange: () => {},
  clearValidate: () => {}
};
const defaultInternalContext = {
  addFormItemField: () => {},
  removeFormItemField: () => {}
};
const useInjectFormItemContext = () => {
  const internalContext = (0, _vue.inject)(InternalContextKey, defaultInternalContext);
  const formItemFieldKey = Symbol('FormItemFieldKey');
  const instance = (0, _vue.getCurrentInstance)();
  internalContext.addFormItemField(formItemFieldKey, instance.type);
  (0, _vue.onBeforeUnmount)(() => {
    internalContext.removeFormItemField(formItemFieldKey);
  });
  // We should prevent the passing of context for children
  (0, _vue.provide)(InternalContextKey, defaultInternalContext);
  (0, _vue.provide)(ContextKey, defaultContext);
  return (0, _vue.inject)(ContextKey, defaultContext);
};
exports.useInjectFormItemContext = useInjectFormItemContext;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AFormItemRest',
  setup(_, _ref) {
    let {
      slots
    } = _ref;
    (0, _vue.provide)(InternalContextKey, defaultInternalContext);
    (0, _vue.provide)(ContextKey, defaultContext);
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
const FormItemInputContext = exports.FormItemInputContext = (0, _createContext.default)({});
const NoFormStatus = exports.NoFormStatus = (0, _vue.defineComponent)({
  name: 'NoFormStatus',
  setup(_, _ref2) {
    let {
      slots
    } = _ref2;
    FormItemInputContext.useProvide({});
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});