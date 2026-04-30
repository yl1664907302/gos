"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProvideFormItemPrefix = exports.useProvideForm = exports.useInjectFormItemPrefix = exports.useInjectForm = exports.FormItemPrefixContextKey = exports.FormContextKey = void 0;
var _vue = require("vue");
var _messages = require("./utils/messages");
const FormContextKey = exports.FormContextKey = Symbol('formContextKey');
const useProvideForm = state => {
  (0, _vue.provide)(FormContextKey, state);
};
exports.useProvideForm = useProvideForm;
const useInjectForm = () => {
  return (0, _vue.inject)(FormContextKey, {
    name: (0, _vue.computed)(() => undefined),
    labelAlign: (0, _vue.computed)(() => 'right'),
    vertical: (0, _vue.computed)(() => false),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addField: (_eventKey, _field) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeField: _eventKey => {},
    model: (0, _vue.computed)(() => undefined),
    rules: (0, _vue.computed)(() => undefined),
    colon: (0, _vue.computed)(() => undefined),
    labelWrap: (0, _vue.computed)(() => undefined),
    labelCol: (0, _vue.computed)(() => undefined),
    requiredMark: (0, _vue.computed)(() => false),
    validateTrigger: (0, _vue.computed)(() => undefined),
    onValidate: () => {},
    validateMessages: (0, _vue.computed)(() => _messages.defaultValidateMessages)
  });
};
exports.useInjectForm = useInjectForm;
const FormItemPrefixContextKey = exports.FormItemPrefixContextKey = Symbol('formItemPrefixContextKey');
const useProvideFormItemPrefix = state => {
  (0, _vue.provide)(FormItemPrefixContextKey, state);
};
exports.useProvideFormItemPrefix = useProvideFormItemPrefix;
const useInjectFormItemPrefix = () => {
  return (0, _vue.inject)(FormItemPrefixContextKey, {
    prefixCls: (0, _vue.computed)(() => '')
  });
};
exports.useInjectFormItemPrefix = useInjectFormItemPrefix;